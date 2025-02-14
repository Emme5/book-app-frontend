import React, { useEffect, useState } from 'react'
import InputField from '../addBook/InputField'
import SelectField from '../addBook/SelectField'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/Loading';
import { useFetchBookByIdQuery, useUpdateBookMutation } from '../../../redux/features/books/booksApi';
import Swal from 'sweetalert2';
import { uploadImageToCloudinary } from '../../../utils/cloudinaryUpload';

const UpdateBook = () => {
  const { id } = useParams();
  const { data: bookData, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
  const [updateBook] = useUpdateBookMutation();
  const { register, handleSubmit, setValue, } = useForm();
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (bookData) {
      setValue('title', bookData.title);
      setValue('description', bookData.description);
      setValue('category', bookData?.category);
      setValue('trending', bookData.trending);
      setValue('oldPrice', bookData.oldPrice);
      setValue('newPrice', bookData.newPrice);

      if (bookData.coverImages && bookData.coverImages.length > 0) {
        setExistingImages(bookData.coverImages);
    } else if (bookData.coverImage) {
        setExistingImages([bookData.coverImage]);
    }
}
}, [bookData]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 5) {
      Swal.fire({
        title: "จำกัดรูปภาพ",
        text: "คุณสามารถอัพโหลดรูปได้สูงสุด 5 รูป",
        icon: "warning"
      });
      return;
    }

    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      Swal.fire({
        title: "ไฟล์ไม่ถูกต้อง",
        text: "กรุณาเลือกไฟล์รูปภาพเท่านั้น",
        icon: "warning"
      });
      return;
    }

    setNewImages(prev => [...prev, ...validFiles]);
};

const handleRemoveImage = (index, isExisting = false) => {
  if (isExisting) {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  } else {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  }
};

const onSubmit = async (data) => {
  try {
      // ตรวจสอบข้อมูลก่อนส่ง
      const validData = {
          title: data.title,
          description: data.description,
          category: data.category,
          trending: data.trending || false,
          oldPrice: data.oldPrice,
          newPrice: data.newPrice
      };

      const formData = new FormData();
      Object.keys(validData).forEach(key => {
          formData.append(key, validData[key]);
      });

   // จัดการรูปภาพ
   if (newImages.length > 0) {
    const uploadPromises = newImages.map(uploadImageToCloudinary);
    const cloudinaryUrls = await Promise.all(uploadPromises);

    formData.append('coverImage', cloudinaryUrls[0]);
    cloudinaryUrls.slice(1).forEach(url => {
        formData.append('coverImages', url);
    });
} else if (existingImages.length > 0) {
    existingImages.forEach((image, index) => {
        formData.append(index === 0 ? 'coverImage' : 'coverImages', image);
    });
}

// Debug: Log formData
for (let pair of formData.entries()) {
  console.log(pair[0] + ': ' + pair[1]);
}
        
const response = await updateBook({
  id,
  data: formData  // เปลี่ยนจาก formData เป็น data
}).unwrap();

Swal.fire({
  title: "อัพเดทสำเร็จ",
  text: "อัพเดทข้อมูลหนังสือเรียบร้อยแล้ว!",
  icon: "success"
});
} catch (error) {
console.error('Full Error:', error);
Swal.fire({
  title: "เกิดข้อผิดพลาด",
  text: error.data?.message || JSON.stringify(error),
  icon: "error"
});
}
};

  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching book data</div>;

  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">แก้ไขข้อมูลหนังสือ</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="ชื่อหนังสือ"
          name="title"
          placeholder="กรอกชื่อหนังสือ"
          register={register}
        />

        <InputField
          label="รายละเอียด"
          name="description"
          placeholder="กรอกรายละเอียดหนังสือ"
          type="textarea"
          register={register}
        />

        <SelectField
          label="หมวดหมู่"
          name="category"
          options={[
            { value: '', label: 'เลือกหมวดหมู่' },
            { value: 'ธุรกิจ', label: 'ธุรกิจ' },
            { value: 'จิตวิทยา', label: 'จิตวิทยา' },
            { value: 'สยองขวัญ', label: 'สยองขวัญ' },
            { value: 'ภาษา', label: 'ภาษา' },
            { value: 'การ์ตูน', label: 'การ์ตูน' },
            { value: 'คอมพิวเตอร์', label: 'คอมพิวเตอร์' },
            { value: 'สุขภาพ', label: 'สุขภาพ' },
            { value: 'มังงะ', label: 'มังงะ' },
            { value: 'ดนตรี', label: 'ดนตรี' },
            { value: 'ท่องเที่ยว', label: 'ท่องเที่ยว' },
            { value: 'ประวัติศาสตร์', label: 'ประวัติศาสตร์' }
          ]}
          register={register}
        />

        <div className="mb-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('trending')}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">กำลังมาแรง</span>
          </label>
        </div>

        <InputField
          label="ราคาเดิม"
          name="oldPrice"
          type="number"
          placeholder="ราคาเดิม"
          register={register}
        />

        <InputField
          label="ราคาใหม่"
          name="newPrice"
          type="number"
          placeholder="ราคาใหม่"
          register={register}
        />

<div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            รูปภาพหนังสือ (สูงสุด 5 รูป)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              multiple
              className="w-full" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {existingImages.map((image, index) => (
              <div key={`existing-${index}`} className="relative group">
                <div className="aspect-w-3 aspect-h-4 overflow-hidden rounded-lg">
                      <img 
                        src={image} // ใช้ URL จาก Cloudinary
                        alt={`Existing ${index + 1}`}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, true)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
            
            {newImages.map((file, index) => (
              <div key={`new-${index}`} className="relative group">
                <div className="aspect-w-3 aspect-h-4 overflow-hidden rounded-lg">
                  <img 
                    src={URL.createObjectURL(file)}
                    alt={`New ${index + 1}`}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, false)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 
                     transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBook

import React, { useEffect, useState } from 'react'
import InputField from '../addBook/InputField'
import SelectField from '../addBook/SelectField'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/Loading';
import { useFetchBookByIdQuery, useUpdateBookMutation } from '../../../redux/features/books/booksApi';
import Swal from 'sweetalert2';
import { getImgUrl } from '../../../utils/getImgUrl';

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
          const formData = new FormData();

          // เพิ่มข้อมูลพื้นฐาน
          Object.keys(data).forEach(key => {
            if (key === 'trending') {
                formData.append(key, data[key] || false);
            } else {
                formData.append(key, data[key]);
            }
        });

          if (newImages.length > 0) {
            // ถ้ามีรูปใหม่
            formData.append('coverImage', newImages[0]);
            newImages.slice(1).forEach(file => {
                formData.append('coverImages', file);
            });
        } else if (existingImages.length > 0) {
            // ถ้ามีแค่รูปเดิม
            existingImages.forEach((image, index) => {
                if (index === 0) {
                    formData.append('existingImages', image);
                } else {
                    formData.append('existingImages', image);
                }
            });
        }
          // ส่งข้อมูลไปอัพเดต
          await updateBook({
            id,
            formData
          }).unwrap();
          
          Swal.fire({
              title: "อัพเดทสำเร็จ",
              text: "อัพเดทข้อมูลหนังสือเรียบร้อยแล้ว!",
              icon: "success"
          });
          
          await refetch();
      } catch (error) {
          console.error('Error:', error);
          Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: error.data?.message || "ไม่สามารถอัพเดทหนังสือได้ กรุณาลองใหม่อีกครั้ง",
              icon: "error"
          });
      }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching book data</div>;

  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}
        />

        <SelectField
          label="Category"
          name="category"
          options={[
            { value: '', label: 'Choose A Category' },
            { value: 'business', label: 'Business' },
            { value: 'technology', label: 'Technology' },
            { value: 'fiction', label: 'Fiction' },
            { value: 'horror', label: 'Horror' },
            { value: 'adventure', label: 'Adventure' },
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
            <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
          </label>
        </div>

        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          placeholder="Old Price"
          register={register}
        />

        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          placeholder="New Price"
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
                    src={getImgUrl(image)}
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

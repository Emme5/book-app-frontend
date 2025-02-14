import React, { useState } from 'react'
import InputField from './InputField'
import SelectField from './SelectField'
import { useForm } from 'react-hook-form';
import { useAddBookMutation } from '../../../redux/features/books/booksApi';
import { uploadImageToCloudinary } from '../../../utils/cloudinaryUpload';
import Swal from 'sweetalert2';

const AddBook = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [addBook, {isLoading, isError}] = useAddBookMutation();
    const [imageFiles, setImageFiles] = useState([]);
    const [imageFileNames, setImageFileNames] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    

    const onSubmit = async (data) => {
        try {
            if (!imageFiles.length) {
                Swal.fire({
                    title: "กรุณาเลือกรูปภาพ",
                    text: "ต้องมีรูปภาพอย่างน้อย 1 รูป",
                    icon: "warning"
                });
                return;
            }
    
            const formData = new FormData();
    
            // เพิ่มข้อมูลหนังสือ
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('category', data.category);
            formData.append('oldPrice', data.oldPrice);
            formData.append('newPrice', data.newPrice);
            formData.append('trending', data.trending ? 'true' : 'false');
    
            // เพิ่มรูปภาพ
            formData.append('coverImage', imageFiles[0]);
            imageFiles.slice(1).forEach((file, index) => {
                formData.append('coverImages', file);
            });
    
            const response = await addBook(formData).unwrap();
    
            Swal.fire({
                title: "สำเร็จ",
                text: "เพิ่มหนังสือเรียบร้อยแล้ว",
                icon: "success"
            });
    
            reset();
            setImageFiles([]);
            setImageFileNames([]);
            setImageUrls([]);
            
        } catch (error) {
            console.error('Full Error Object:', JSON.stringify(error, null, 2));
            
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: error.data?.message || error.message || "ไม่สามารถเพิ่มหนังสือได้ กรุณาลองใหม่อีกครั้ง",
                icon: "error"
            });
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (files.length + imageFiles.length > 5) {
            Swal.fire({
                title: "จำกัดรูปภาพ",
                text: "คุณสามารถอัพโหลดรูปได้สูงสุด 5 รูป",
                icon: "warning"
            });
            return;
        }
      
        const invalidFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= maxSize;
            return !isValidType || !isValidSize;
        });

      if (invalidFiles.length > 0) {
        Swal.fire({
            title: "ไฟล์ไม่ถูกต้อง",
            text: "กรุณาเลือกไฟล์รูปภาพขนาดไม่เกิน 5MB",
            icon: "warning"
        });
        return;
    }
        
      setImageFiles(prev => [...prev, ...files]);
    setImageFileNames(prev => [...prev, ...files.map(file => file.name)]);
    };

    return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">เพิ่มหนังสือใหม่</h2>

      <form onSubmit={handleSubmit(onSubmit)} className=''>
            {/* Form fields... */}
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

        {/* Trending Checkbox */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register('trending')}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">กำลังมาแรง</span>
          </label>
        </div>

        {/* Old Price */}
        <InputField
          label="ราคาเดิม"
          name="oldPrice"
          type="number"
          placeholder="ราคาเดิม"
          register={register}
        />

        {/* New Price */}
        <InputField
          label="ราคาใหม่"
          name="newPrice"
          type="number"
          placeholder="ราคาใหม่"
          register={register}
        />

        {/* Cover Image Upload */}
        <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        รูปภาพหนังสือ (สูงสุด 5 รูป)
                    </label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        multiple
                        required
                        className="mb-2 w-full" 
                    />
                    {imageFileNames.length > 0 && (
                        <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">รูปที่เลือก:</p>
                            <div className="flex flex-wrap gap-2">
                                {imageFileNames.map((name, index) => (
                                    <div key={index} className="flex items-center bg-gray-100 rounded-md p-2">
                                        <span className="text-sm text-gray-600">{name}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageFiles(prev => prev.filter((_, i) => i !== index));
                                                setImageFileNames(prev => prev.filter((_, i) => i !== index));
                                            }}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                    {/* แสดงรูปภาพที่อัปโหลด */}
        {imageUrls.length > 0 && (
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">รูปภาพที่อัปโหลด:</h3>
                <div className="flex flex-wrap gap-4">
                    {imageUrls.map((url, index) => (
                        <img 
                            key={index} 
                            src={url} 
                            alt={`Book cover ${index + 1}`} 
                            className="w-32 h-32 object-cover rounded-lg"
                        />
                    ))}
                </div>
            </div>
        )}

                <button 
                    type="submit" 
                    className="w-full py-2 bg-green-500 text-white font-bold rounded-md"
                >
                    {isLoading ? <span>กำลังเพิ่ม...</span> : <span>เพิ่มหนังสือ</span>}
                </button>
            </form>
        </div>
    );
}

export default AddBook;

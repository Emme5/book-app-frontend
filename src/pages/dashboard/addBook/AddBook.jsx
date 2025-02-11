import React, { useState } from 'react'
import InputField from './InputField'
import SelectField from './SelectField'
import { useForm } from 'react-hook-form';
import { useAddBookMutation } from '../../../redux/features/books/booksApi';
import Swal from 'sweetalert2';

const AddBook = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [addBook, {isLoading, isError}] = useAddBookMutation()
    const [imageFiles, setImageFiles] = useState([]);
    const [imageFileNames, setImageFileNames] = useState([]);

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

        // ข้อมูลพื้นฐาน
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('oldPrice', data.oldPrice);
        formData.append('newPrice', data.newPrice);
        formData.append('trending', data.trending ? 'true' : 'false');

        // เพิ่มรูปภาพ
        const mainImage = imageFiles[0];
        const additionalImages = imageFiles.slice(1);

        formData.append('coverImage', mainImage);
        additionalImages.forEach(image => {
            formData.append('coverImages', image);
        });

        // Debug: ดูข้อมูลที่จะส่ง
        for (let [key, value] of formData.entries()) {
        }

        const response = await addBook(formData).unwrap();

        Swal.fire({
            title: "สำเร็จ",
            text: "เพิ่มหนังสือเรียบร้อยแล้ว",
            icon: "success"
        });

        reset();
        setImageFiles([]);
        setImageFileNames([]);
    } catch (error) {
        console.error('Error details:', error.response); // เพิ่ม log เพื่อ debug
        Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถเพิ่มหนังสือได้ กรุณาลองใหม่อีกครั้ง",
            icon: "error"
        });
    }
};

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 5 * 1024 * 1024; // 5MB
      
      const validSize = files.every(file => file.size <= maxSize);
      if (!validSize) {
          Swal.fire({
              title: "ไฟล์มีขนาดใหญ่เกินไป",
              text: "กรุณาอัพโหลดไฟล์ขนาดไม่เกิน 5MB",
              icon: "warning"
          });
          return;
      }
        
      setImageFiles(prev => [...prev, ...validFiles]);
      setImageFileNames(prev => [...prev, ...validFiles.map(file => file.name)]);
    };

    return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>

      <form onSubmit={handleSubmit(onSubmit)} className=''>
            {/* Form fields... */}
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

        {/* Trending Checkbox */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register('trending')}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
          </label>
        </div>

        {/* Old Price */}
        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          placeholder="Old Price"
          register={register}
        />

        {/* New Price */}
        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          placeholder="New Price"
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
                <button 
                    type="submit" 
                    className="w-full py-2 bg-green-500 text-white font-bold rounded-md"
                >
                    {isLoading ? <span>Adding...</span> : <span>Add Book</span>}
                </button>
            </form>
        </div>
    );
}

export default AddBook;

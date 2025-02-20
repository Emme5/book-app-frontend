import React, { useEffect } from 'react'
import InputField from '../addBook/InputField'
import SelectField from '../addBook/SelectField'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/Loading';
import { useFetchBookByIdQuery, useUpdateBookMutation } from '../../../redux/features/books/booksApi';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const UpdateBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: bookData, isLoading, isError } = useFetchBookByIdQuery(id);
  const [updateBook] = useUpdateBookMutation();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (bookData) {
      setValue('title', bookData.title);
      setValue('author', bookData.author);
      setValue('description', bookData.description);
      setValue('category', bookData?.category);
      setValue('trending', bookData.trending);
      setValue('recommended', bookData.recommended); // เพิ่ม recommended
      setValue('oldPrice', bookData.oldPrice);
      setValue('newPrice', bookData.newPrice);
    }
  }, [bookData, setValue]);

  const onSubmit = async (data) => {
    try {
      const updateData = {
          title: data.title,
          author: data.author,
          description: data.description,
          category: data.category,
          trending: Boolean(data.trending),
          recommended: Boolean(data.recommended),
          oldPrice: Number(data.oldPrice),
          newPrice: Number(data.newPrice),
      };

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await updateBook({
          id, 
          data: updateData
      }).unwrap();

        Swal.fire({
            title: "อัพเดทสำเร็จ",
            text: "อัพเดทข้อมูลหนังสือเรียบร้อยแล้ว!",
            icon: "success"
        }).then(() => {
            navigate('/dashboard/manage-books'); // เพิ่ม navigation หลัง Swal
        });
        
    } catch (error) {
        console.error('Update Error Full:', error);
        console.error('Error Details:', JSON.stringify(error, null, 2));

        Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: error.data?.message || "ไม่สามารถอัพเดทข้อมูลได้",
            icon: "error"
        });
    }
};

  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching book data</div>;

  const allImages = bookData.coverImages && bookData.coverImages.length > 0 
    ? bookData.coverImages 
    : (bookData.coverImage ? [bookData.coverImage] : []);


  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">แก้ไขข้อมูลหนังสือ</h2>

      {/* แสดงรูปหนังสือ */}
      {allImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {allImages.map((image, index) => (
            <div key={index} className="aspect-w-3 aspect-h-4 overflow-hidden rounded-lg">
              <img 
                src={image} 
                alt={`Book Cover ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="ชื่อหนังสือ"
          name="title"
          placeholder="กรอกชื่อหนังสือ"
          register={register}
        />

        <InputField
          label="ชื่อผู้แต่ง/สำนักพิมพ์"
          name="author"
          placeholder="กรอกชื่อผู้แต่งหรือสำนักพิมพ์"
          register={register}
        />

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            รายละเอียด
          </label>
          <textarea
            {...register('description')}
            placeholder="กรอกรายละเอียดหนังสือ"
            className="w-full p-2 border rounded-md resize-y min-h-[100px]"
          />
        </div>

        <SelectField
          label="หมวดหมู่"
          name="category"
          options={[
            { value: '', label: 'เลือกหมวดหมู่' },
            { value: 'ธุรกิจ', label: 'ธุรกิจ' },
            { value: 'จิตวิทยา', label: 'จิตวิทยา' },
            { value: 'โปรแกรม', label: 'โปรแกรม' },
            { value: 'ภาษา', label: 'ภาษา' },
            { value: 'การ์ตูน', label: 'การ์ตูน' },
            { value: 'คอมพิวเตอร์', label: 'คอมพิวเตอร์' },
            { value: 'สุขภาพ', label: 'สุขภาพ' },
            { value: 'หนังสืออิเล็กทรอนิกส์', label: 'หนังสืออิเล็กทรอนิกส์' },
            { value: 'ดนตรี', label: 'ดนตรี' },
            { value: 'ท่องเที่ยว', label: 'ท่องเที่ยว' },
            { value: 'ความรัก', label: 'ความรัก' }
          ]}
          register={register}
        />

        {/* ปรับส่วน Checkbox ให้มีทั้ง trending และ recommended */}
        <div className="mb-4 space-y-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('trending')}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">
              กำลังมาแรง (แสดงในหน้า TopSeller)
            </span>
          </label>

          <div className="block">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('recommended')}
                className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-semibold text-gray-700">
                แนะนำ (แสดงในหน้า Recommended)
              </span>
            </label>
          </div>
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
"use client"

import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RiEdit2Line } from 'react-icons/ri';

export default function UpdateDataForm({ student, loadData }: { student: Student, loadData: () => void }) {
    const { register, handleSubmit, reset } = useForm<Student>();
    const [openEditModal, setOpenEditModal] = useState(false);


    const handleUpdate = async (data: Student) => {
      const { error } = await supabase.from("students").update(data).eq("id", student.id);
  
      if (!error) {
        toast.success("Student updated successfully");
      }

      reset();
      setOpenEditModal(false);
      loadData();
    };

  return (
 
    <>
    <div className='circle-button bg-blue-500'
      onClick={() => setOpenEditModal(true)}>
      <RiEdit2Line/>
    </div>
    <div 
    className={`${openEditModal ? 'flex' : 'hidden'} fixed inset-0 bg-black/40 items-center justify-center z-50`}>
      <div className="bg-white w-96 p-6 shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Update Data</h2>
      <form className='flex flex-col gap-2' onSubmit={handleSubmit(handleUpdate)}>
        <input type="text" placeholder='Your Full Name' defaultValue={student.name} {...register("name", { required: true })} />
        <input type="email" placeholder='Your Email' defaultValue={student.email} {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })} />
        <input type="text" placeholder='LinkedIn url' defaultValue={student.linkedin} {...register("linkedin")} />
        <input type="text" placeholder='Github url' defaultValue={student.github} {...register("github")} />
        <input type="text" placeholder='Portfolio url' defaultValue={student.portfolio} {...register("portfolio")} />
        <div className='flex gap-2'>
        <button className='bg-blue-500' type="submit">Update</button>
        <button type='button' className='bg-orange-600' onClick={() => setOpenEditModal(false)}>Cancel</button>
        </div>
    </form>
    </div>
    </div>
    </>

  )
}

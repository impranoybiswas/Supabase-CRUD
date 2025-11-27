"use client"

import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function InsertDataForm({loadData}: {loadData: () => void}) {
    const { register, handleSubmit, reset } = useForm<Student>();

    const handleAddData = async (data: Student) => {

        const { error } = await supabase.from("students").insert(data);

        if (error?.message === `duplicate key value violates unique constraint "students_email_key"`) {
          toast.error("Email already exists");
          return;
        }

        toast.success("Student added successfully");
        loadData();
        reset();

      };


  return (
 
    <form className='flex flex-col lg:flex-row gap-2' onSubmit={handleSubmit(handleAddData)}>
        <input type="text" placeholder='Your Full Name' {...register("name", { required: true })} />
        <input type="email" placeholder='Your Email' {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })} />
        <input type="text" placeholder='LinkedIn url' {...register("linkedin")} />
        <input type="text" placeholder='Github url' {...register("github")} />
        <input type="text" placeholder='Portfolio url' {...register("portfolio")} />
        <button className='bg-green-500' type="submit">ADD DATA</button>
    </form>

  )
}

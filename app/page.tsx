"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import InsertDataForm from "@/app/components/InsertDataForm";
import DataTable from "@/app/components/DataTable";
import { FaArrowDownShortWide, FaArrowDownWideShort } from "react-icons/fa6";
import { IoReloadSharp } from "react-icons/io5";

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [asc, setAsc] = useState(false);
  const [search, setSearch] = useState("");

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadData = useCallback(async () => {
    let query = supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: asc });

    if (search.trim() !== "") {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (!error && data && isMounted.current) {
      setStudents(data);
    }
  }, [asc, search]);

  useEffect(() => {
    setTimeout(() => {
      loadData();
    }, 0);
  }, [loadData]);

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (!error) {
      toast.success("Student deleted");
      loadData();
    }
  };

  return (
    <main className="w-11/12 mx-auto py-10 space-y-3">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center">Team Phoenix</h1>
      <InsertDataForm loadData={loadData} />
      <div className="flex justify-between gap-2">
        <input
          type="text"
          placeholder="Search here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span
          onClick={() => setAsc(!asc)}
          className="bg-gray-200 text-gray-700 w-fit py-2 px-3 text-sm rounded flex items-center gap-2 cursor-pointer"
        >
          {asc ? <FaArrowDownShortWide /> : <FaArrowDownWideShort />}
          Sorting
        </span>
        <span
        className="bg-gray-200 text-gray-700 w-fit py-2 px-3 text-sm rounded flex items-center gap-2 cursor-pointer"
        onClick={loadData}
        >
        <IoReloadSharp />
        </span>
      </div>
      <DataTable
        students={students}
        loadData={loadData}
        handleDelete={handleDelete}
      />
    </main>
  );
}

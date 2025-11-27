"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import InsertDataForm from "@/app/components/InsertDataForm";
import DataTable from "@/app/components/DataTable";

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadData = useCallback(async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && isMounted.current) {
      setStudents(data);
    }
  }, []);

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
      <DataTable students={students} loadData={loadData} handleDelete={handleDelete} />
    </main>
  );
}

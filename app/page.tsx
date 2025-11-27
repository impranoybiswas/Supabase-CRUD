"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";

interface Student {
  id: number;
  name: string;
  email: string;
  class: string;
}

interface FormState {
  name: string;
  email: string;
  class: string;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    class: "",
  });

  const [editing, setEditing] = useState<Student | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      .order("id", { ascending: false });

    if (!error && data && isMounted.current) {
      setStudents(data);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      loadData();
    }, 0);
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("students").insert(form);

    if (!error) {
      toast.success("Student added successfully");
      setForm({ name: "", email: "", class: "" });
      loadData();
    }
  };

  const deleteStudent = async (id: number) => {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (!error) {
      toast.success("Student deleted");
      loadData();
    }
  };

  const openEditModal = (student: Student) => {
    setEditing(student);
    setModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editing) return;

    const { error } = await supabase
      .from("students")
      .update({
        name: editing.name,
        email: editing.email,
        class: editing.class,
      })
      .eq("id", editing.id);

    if (!error) {
      toast.success("Student updated successfully");
      setModalOpen(false);
      setEditing(null);
      loadData();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Toaster />

      <h1 className="text-3xl font-bold mb-6 text-center">
        Supabase CRUD Application
      </h1>

      <form
        className="space-y-3 mb-10 bg-white p-5 shadow rounded"
        onSubmit={handleSubmit}
      >
        <input
          className="border p-2 w-full rounded"
          placeholder="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Class"
          required
          value={form.class}
          onChange={(e) => setForm({ ...form, class: e.target.value })}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded w-full"
        >
          Add Student
        </button>
      </form>

      <table className="w-full border rounded overflow-hidden shadow">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3 text-left">Name</th>
            <th className="text-left">Email</th>
            <th className="text-left">Class</th>
            <th className="text-right pr-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b hover:bg-gray-50 transition">
              <td className="p-3">{s.name}</td>
              <td>{s.email}</td>
              <td>{s.class}</td>
              <td className="flex justify-end gap-4 pr-3 py-2">
                <RiEdit2Line
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() => openEditModal(s)}
                />
                <RiDeleteBin6Line
                  size={20}
                  className="text-red-600 cursor-pointer"
                  onClick={() => deleteStudent(s.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- Edit Modal ---------- */}
      {modalOpen && editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 shadow rounded">
            <h2 className="text-xl font-semibold mb-4">Update Student</h2>

            <form className="space-y-3" onSubmit={handleUpdate}>
              <input
                className="border p-2 w-full rounded"
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />

              <input
                className="border p-2 w-full rounded"
                value={editing.email}
                onChange={(e) =>
                  setEditing({ ...editing, email: e.target.value })
                }
              />

              <input
                className="border p-2 w-full rounded"
                value={editing.class}
                onChange={(e) =>
                  setEditing({ ...editing, class: e.target.value })
                }
              />

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

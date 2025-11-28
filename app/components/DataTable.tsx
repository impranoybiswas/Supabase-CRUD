import Link from "next/link";
import { FaGithub, FaLinkedin, FaUser } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import UpdateDataForm from "./UpdateDataForm";

export default function DataTable({
  students,
  loadData,
  handleDelete,
}: {
  students: Student[];
  loadData: () => void;
  handleDelete: (id: number) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border rounded-md overflow-hidden shadow">
        <thead>
          <tr className="border border-slate-300 bg-slate-100 shadow">
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Linkedin</th>
            <th>Github</th>
            <th>Portfulio</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, i) => (
            <tr
              key={i}
              className="border-b border-gray-300 hover:bg-gray-50 transition"
            >
              <td>{i + 1}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <Link href={s.linkedin} target="_blank">
                  {s.linkedin ? <FaLinkedin /> : "N/A"}
                </Link>
              </td>
              <td>
                <Link href={s.github} target="_blank">
                  {s.github ? <FaGithub /> : "N/A"}
                </Link>
              </td>
              <td>
                <Link href={s.portfolio} target="_blank">
                  {s.portfolio ? <FaUser /> : "N/A"}
                </Link>
              </td>
              <td className="flex items-center justify-center gap-4 pr-3 py-2">
                <UpdateDataForm loadData={loadData} student={s} />
                <div onClick={() => handleDelete(s.id as number)} className='circle-button bg-red-500'>
                <RiDeleteBin6Line/>
                </div>
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

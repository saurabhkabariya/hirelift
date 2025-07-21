import React from "react";

export default function CompanyRow({ company, onEdit, onDelete }) {
  return (
    <tr className="border-b hover:bg-blue-50 transition">
      <td className="p-2 font-semibold">{company.companyName}</td>
      <td className="p-2">{company.hiringRoles?.join(", ")}</td>
      <td className="p-2">{company.jobMode}</td>
      <td className="p-2 capitalize">{company.status}</td>
      <td className="p-2 flex gap-2">
        <button
          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
          onClick={() => onEdit(company)}
        >Edit</button>
        <button
          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          onClick={() => onDelete(company._id)}
        >Delete</button>
      </td>
    </tr>
  );
} 
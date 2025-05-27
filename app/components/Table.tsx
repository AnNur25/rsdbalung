import type { ReactNode } from "react";

interface TableProps {
  headers: string[];
  children?: ReactNode[]; // Accept an array of ReactNode as slides
}

export default function Table({
  headers,
  children = [],
}: TableProps): ReactNode {
  const nCols = headers.length;
  return (
    <table className="w-full table-auto divide-y divide-gray-500">
      <thead className="divide-y divide-gray-300">
        <tr className="bg-sky-700 text-white">
          {headers.map((header, index) => (
            <th
              key={index}
              className="px-4 py-2 first:rounded-tl-lg last:rounded-tr-lg"
              // className={`w-min ${index === 0 && "rounded-tl-lg"} ${index === headers.length - 1 && "rounded-tr-lg"} px-4 py-2 ring-1 ring-black`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-gray-300">
        {children.length > 0 ? (
          <>
            {children}
            <td
              colSpan={nCols}
              className="rounded-b-lg bg-blue-200 px-4 py-2 text-center"
            ></td>
          </>
        ) : (
          <tr className="rounded-b-lg">
            <td colSpan={nCols} className="px-4 py-2 text-center">
              Tidak ada data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

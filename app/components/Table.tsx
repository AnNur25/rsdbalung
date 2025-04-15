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
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-sky-700 text-white">
          {headers.map((header, index) => (
            <th key={index} className="w-min border border-gray-300 px-4 py-2">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {children.length > 0 ? (
          children
        ) : (
          <tr>
            <td
              colSpan={nCols}
              className="border border-gray-300 px-4 py-2 text-center"
            >
              Tidak ada data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

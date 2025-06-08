import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { tanggal: "1 Februari 2025", pengunjung: 50 },
  { tanggal: "2 Februari 2025", pengunjung: 60 },
  { tanggal: "3 Februari 2025", pengunjung: 40 },
  { tanggal: "4 Februari 2025", pengunjung: 40 },
  { tanggal: "5 Februari 2025", pengunjung: 80 },
  { tanggal: "6 Februari 2025", pengunjung: 70 },
  { tanggal: "7 Februari 2025", pengunjung: 90 },
  { tanggal: "8 Februari 2025", pengunjung: 100 },
  { tanggal: "9 Februari 2025", pengunjung: 120 },
  { tanggal: "10 Februari 2025", pengunjung: 110 },
  { tanggal: "11 Februari 2025", pengunjung: 130 },
  { tanggal: "12 Februari 2025", pengunjung: 2 },
  { tanggal: "13 Februari 2025", pengunjung: 150 },
  { tanggal: "14 Februari 2025", pengunjung: 160 },
  { tanggal: "15 Februari 2025", pengunjung: 170 },
  { tanggal: "16 Februari 2025", pengunjung: 180 },
  { tanggal: "17 Februari 2025", pengunjung: 190 },
  { tanggal: "18 Februari 2025", pengunjung: 200 },
  { tanggal: "19 Februari 2025", pengunjung: 210 },
  { tanggal: "20 Februari 2025", pengunjung: 220 },
  { tanggal: "21 Februari 2025", pengunjung: 1 },
  { tanggal: "22 Februari 2025", pengunjung: 240 },
  { tanggal: "23 Februari 2025", pengunjung: 250 },
  { tanggal: "24 Februari 2025", pengunjung: 260 },
  { tanggal: "25 Februari 2025", pengunjung: 270 },
  { tanggal: "26 Februari 2025", pengunjung: 10 },
  { tanggal: "27 Februari 2025", pengunjung: 290 },
  { tanggal: "28 Februari 2025", pengunjung: 300 },
];
interface ChartProps {
  visitors?: { tanggal: string; pengunjung: number }[];
  range?: string;
}
import { useLoaderData, useNavigate } from "react-router";

function generateData(range: "day" | "week" | "month") {
  const data = [];
  const labels = {
    day: 12,
    week: 4,
    month: 12,
  };
  const count = labels[range] || 12;

  for (let i = 1; i <= count; i++) {
    data.push({
      tanggal: `${i} ${range === "month" ? "Bulan" : "Februari"} 2025`,
      pengunjung: Math.floor(Math.random() * 300 + 50),
    });
  }

  return data;
}

// export async function loader() {
//   const range = "day";
//   const visitors = generateData(range as "day" | "week" | "month");

//   return { visitors, range };
// }

export default function Charts({ range = "day" }: ChartProps) {
  // const { visitors, range } = (useLoaderData() as {
  //   visitors: { tanggal: string; pengunjung: number }[];
  //   range: string;
  // })
  // || { visitors: {}, range: "day" };
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    navigate(`?range=${e.target.value}`);
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        <label className="mr-2">Filter:</label>
        <select
          value={range}
          onChange={handleChange}
          className="rounded border px-2 py-1"
        >
          <option value="day">Hari</option>
          <option value="week">Minggu</option>
          <option value="month">Bulan</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="tanggal" />
          <YAxis />
          <Tooltip />
          <Line
            connectNulls
            type="linear"
            dataKey="pengunjung"
            stroke="#2563eb"
            dot={{ r: 4 }}
            strokeDasharray="5 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const monthMap = {
  Januari: "01",
  Februari: "02",
  Maret: "03",
  April: "04",
  Mei: "05",
  Juni: "06",
  Juli: "07",
  Agustus: "08",
  September: "09",
  Oktober: "10",
  November: "11",
  Desember: "12",
};

type MonthName = keyof typeof monthMap;

export function convertToDate(str: string) {
  const [day, monthName, year] = str.split(" ");
  const month = monthMap[monthName as MonthName];
  return `${year}-${month}-${day.padStart(2, "0")}`;
}
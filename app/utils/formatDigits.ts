export default function formatDigits(value: string): string {
  const raw = value.replace(/\D/g, "");
  const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return formatted;
  //   return `${formatted},00`;
}

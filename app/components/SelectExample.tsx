import { Select } from "@headlessui/react";

export default function SelectExample() {
  return (
    <Select
      name="status"
      aria-label="Project status"
      className="my-2 rounded-md border border-gray-300 bg-white"
    >
      <option value="active">Aku</option>
      <option value="active">Kamu</option>
      <option value="active">Kita</option>
      <option value="active">Kami</option>
      <option value="active">Mereka</option>
    </Select>
  );
}

import Table from "~/components/Table";

export default function AdminComplaints() {
  const headers = ["No", "Nama", "Aduan", "Tanggal", "Status", "Aksi"];

  return (
    <>
      <section className="overflow-x-auto">
        <Table headers={headers}></Table>
      </section>
    </>
  );
}

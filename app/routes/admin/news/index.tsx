import Table from "~/components/Table";

export default function AdminNews() {
  const headers = ["No", "Judul Berita", "Tanggal Publish", "Aksi"];
  return (
    <>
      <section className="overflow-x-auto">
        <Table headers={headers}></Table>
      </section>
    </>
  );
}

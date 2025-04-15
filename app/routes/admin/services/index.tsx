import Table from "~/components/Table";

export default function AdminServices() {
  const headers = ["No", "Layanan", "Aksi"];
  return (
    <>
      <section className="overflow-x-auto">
        <Table headers={headers}></Table>
      </section>
    </>
  );
}

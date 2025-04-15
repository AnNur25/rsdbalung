import Table from "~/components/Table";

export default function AdminSchedule() {
    const headers = [
        "No",
        "Dokter",
        "Poli",
        "Layanan",
        "Hari",
        "Jam",
        "Aksi",
    ];
    return (
        <>
            <section className="overflow-x-auto">
                <Table headers={headers}></Table>
            </section>
        </>
    );
}
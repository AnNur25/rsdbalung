import PageBanner from "~/components/PageBanner";
import TeamCard from "~/components/TeamCard";

export default function DeveloperPage() {
  const developers = [
    {
      name: "Defi Nugraheni",
      role: "PM + Tester",
      image: "/defi.png",
    },
    {
      name: "M. Ardhi Efendi",
      role: "System Analyst",
      image: "/ardhi.png",
    },
    {
      name: "Robet Turrahman",
      role: "UI & UX Designer",
      image: "/robet.png",
    },
    {
      name: "Ivan Try Wicaksono",
      role: "Front End",
      image: "/ivan.png",
      right: "right-24",
    },
    {
      name: "A. Farid Zainudin",
      role: "Back End",
      image: "/farid.png",
    },
  ];
  return (
    <>
      <PageBanner title="Developer" />
      <section className="mt-8 flex w-full flex-col items-center justify-center">
        <h2 className="text-4xl font-extrabold text-gray-800">
          TEAM <span className="text-blue-600">AN-NUR</span>
        </h2>
        <div className="mt-12 flex max-lg:flex-col">
          {developers.map(
            (d, index) => index < 2 && <TeamCard team={d} key={index} />,
          )}
        </div>
        <div className="flex max-lg:flex-col">
          {developers.map(
            (d, index) => index >= 2 && <TeamCard team={d} key={index} />,
          )}
        </div>
      </section>
    </>
  );
}

interface TeamCardProps {
  team: {
    name: string;
    role: string;
    image: string;
    right?: string;
  };
}
export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="relative m-10 aspect-[3/4] w-60 bg-dark-blue-900 p-4 pb-12">
      <div className="relative flex aspect-square w-full items-center justify-center bg-yellow-400">
        <img
          src={`/images/team/${team.image}`}
          alt={team.name}
          className="absolute bottom-0 aspect-[3/4] w-full object-cover object-top"
        />
      </div>
      <div
        className={`absolute ${team.right ? team.right : "right-20"} justify-center" bottom-8 rih flex origin-center translate-x-1/2 -rotate-10 transform flex-col items-center`}
      >
        <p className="w-max rounded-full bg-dark-blue-900 px-6 py-3.5 text-center text-xl font-extrabold text-white">
          {team.name}
        </p>
        <p className="w-max min-w-[90%] rounded-full bg-yellow-400 px-8 py-3 text-center text-base font-extrabold text-dark-blue-950">
          {team.role}
        </p>
      </div>
    </div>
  );
}

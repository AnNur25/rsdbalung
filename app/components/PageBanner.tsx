import { index } from "@react-router/dev/routes";
import type { ReactNode } from "react";

interface PageBannerProps {
  title: string;
}
export default function PageBanner({ title }: PageBannerProps) {
  return (
    // <div
    //   className="text-white shadow-lg"
    //   style={{
    //     backgroundImage: `url(/images/bg-heading.png)`,
    //     backgroundSize: "full"
    //   }}
    // >
    <div className="relative flex flex-col items-start justify-center ps-5 max-md:aspect-[412/80] min-md:aspect-[2172/250] min-md:ps-10">
      <img
        src="/images/bg-heading.png"
        className="absolute inset-0 -z-10 aspect-[2172/250] w-full max-md:hidden"
        alt=""
      />
      <img
        src="/images/bg-heading-mobile.png"
        className="absolute inset-0 -z-10 aspect-[412/80] w-full min-md:hidden"
        alt=""
      />
      <div className="flex flex-col gap-1 min-md:gap-2">
        <h1 className="text-xl font-extrabold uppercase min-md:text-3xl">
          {title.split(" ").map((word, index) => {
            const color = index % 2 === 0 ? "dark-blue-950" : "dark-blue-900";
            return (
              <span key={index} className={`text-${color}`}>
                {word}{" "}
              </span>
            );
          })}
        </h1>

        <div className="flex w-full items-center gap-2">
          <div className="h-1 grow rounded bg-dark-blue-900 min-md:h-2"></div>
          <div className="h-2 w-2 rounded-full bg-dark-blue-950 min-md:h-3.5 min-md:w-3.5"></div>
          <div className="h-2 w-2 rounded-full bg-dark-blue-950 min-md:h-3.5 min-md:w-3.5"></div>
          <div className="h-2 w-2 rounded-full bg-dark-blue-950 min-md:h-3.5 min-md:w-3.5"></div>
        </div>
      </div>
    </div>
    // </div>
  );
}

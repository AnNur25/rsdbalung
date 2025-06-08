import { index } from "@react-router/dev/routes";
import type { ReactNode } from "react";

interface PageBannerProps {
  title: string;
}
export default function PageBanner({ title }: PageBannerProps) {
  return (
    <div
      className="bg-cover bg-center py-10 text-white shadow-lg lg:h-96"
      style={{
        backgroundImage: `url(/images/bg-heading.png)`,
      }}
    >
      <div className="flex h-full flex-col items-start justify-center gap-4 p-8">
        {/* {children} */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold lg:text-5xl">
            {title.split(" ").map((word, index) => {
              const color = index % 2 === 0 ? "dark-blue-950" : "dark-blue-900";
              return (
                <span key={index} className={`text-${color}`}>
                  {word}{" "}
                </span>
              );
            })}
          </h1>
          <div className="flex w-full items-center gap-4">
            <div className="h-2 grow bg-dark-blue-950"></div>
            <div className="h-4 w-4 rounded-full bg-dark-blue-950"></div>
            <div className="h-4 w-4 rounded-full bg-dark-blue-950"></div>
            <div className="h-4 w-4 rounded-full bg-dark-blue-950"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

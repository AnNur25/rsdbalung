import React from "react";
import { DivideIcon as LucideIcon } from "lucide-react";

interface MottoCardProps {
  title: string;
  description?: string;
  Icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  isMain?: boolean;
}

const MottoCard: React.FC<MottoCardProps> = ({
  title,
  description,
  Icon,
  bgColor,
  borderColor,
  isMain = false,
}) => {
  return (
    <div
      className={`flex w-full flex-col items-center rounded-lg border-2 p-4 ${borderColor} ${
        isMain ? "col-span-full w-full" : "max-w-sm"
      }`}
    >
      {!isMain && (
        <div
          className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full ${bgColor}`}
        >
          <Icon className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
      )}
      <h3
        className={`text-center text-2xl font-bold text-persian-blue-950 ${isMain ? "text-3xl" : ""}`}
      >
        {title}
      </h3>
      {!isMain && description && (
        <p className="mt-2 text-center text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
};

export default MottoCard;

import { Switch } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react/jsx-runtime";

export interface MessageCardModel {
  id?: string;
  name: string;
  message: string;
  date: string;
}

interface MessageCardProps extends MessageCardModel {
  phoneNumber?: string;
  replies?: MessageCardModel[];
  isAdmin?: boolean;
}
export default function MessageCard({
  id = "xxx",
  date,
  message,
  name,
  phoneNumber = "xxx",
  replies = [],
  isAdmin = true,
}: MessageCardProps) {
  return (
    <div className="m-4 flex rounded-sm shadow-lg ring-1 ring-gray-200">
      <div className="w-2 rounded-s-sm bg-blue-700"></div>
      <div className="w-full px-5 py-3">
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-500">
            {name} - {date}
          </p>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button className="ms-auto me-2 flex items-center rounded bg-red-600 p-2 text-white">
                <TrashIcon className="h-4 w-4" />
              </button>
              <Switch onChange={() => {}}>
                {({ checked }) => (
                  <button
                    className={`group inline-flex h-6 w-11 items-center rounded-full ${checked ? "bg-blue-600" : "bg-gray-200"}`}
                  >
                    <span
                      className={`size-4 rounded-full bg-white transition ${checked ? "translate-x-6" : "translate-x-1"} `}
                    />
                  </button>
                )}
              </Switch>
            </div>
          )}
        </div>
        <p className="py-1 text-justify font-semibold">{message}</p>
        {replies?.length > 0 && (
          <>
            <hr className="my-4" />
            {replies.map((r, index) => (
              <div className="mt-2" key={index}>
                <p className="font-bold text-gray-500">
                  {r.name} - {r.date}
                </p>
                <p className="py-1 text-justify font-semibold">{r.message}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

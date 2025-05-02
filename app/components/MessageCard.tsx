import { Switch } from "@headlessui/react";
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Fragment, useState } from "react";
import whatsAppIcon from "~/assets/whatsapp.svg";

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
  isVisible?: boolean;
  deleteOnClick?: (id: string) => void;
  switchOnClick?: (id: string) => void;
  sendOnClick?: (id: string, message: string) => void;
}
export default function MessageCard({
  id = "",
  date,
  message,
  name,
  phoneNumber = "",
  replies = [],
  isAdmin = false,
  isVisible = false,
  deleteOnClick,
  switchOnClick,
  sendOnClick,
}: MessageCardProps) {
  
  const [reply, setReply] = useState("");

  const handleSend = () => {
    if (!reply.trim()) return; 
    if (sendOnClick) sendOnClick(id, reply);
    setReply("");
  };
  return (
    <div className="m-4 flex rounded-sm shadow-lg ring-1 ring-gray-200">
      <div className="w-2 rounded-s-sm bg-blue-700"></div>
      <div className="w-full px-5 py-3">
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-500">
            {name} - {date}
          </p>
          {isAdmin && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => deleteOnClick && deleteOnClick(id)}
                className="ms-2 flex items-center rounded bg-red-600 p-2 text-white"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
              <Switch checked={isVisible} onChange={() => {}} as={Fragment}>
                {({ checked }) => (
                  <button
                    onClick={() => switchOnClick && switchOnClick(id)}
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

            {/* Admin */}
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
        {isAdmin && (
          <div className="mt-2 flex items-center gap-2">
            <input
              placeholder="Balas"
              type="text"
              name="message"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="w-full rounded border border-gray-400 px-2 py-1.5"
            />

            <button
              onClick={handleSend}
              className="h-fit w-fit rounded bg-blue-600 p-2 text-white"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
            <a
              target="__blank"
              href={`https://api.whatsapp.com/send/?phone=${phoneNumber}`}
            >
              <img src={whatsAppIcon} className="h-8 w-8" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

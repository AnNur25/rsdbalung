import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

interface ConfirmDialogProps {
  //   title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  isOpen: boolean;
  onClose: () => void;
  cancelOnClick: () => void;
  confirmOnClick: () => void;
  cancelBtnStyle?: string;
  confirmBtnStyle?: string;
}
export default function ConfirmDialog({
  //   title,
  description,
  cancelLabel,
  confirmLabel,
  isOpen,
  onClose,
  cancelOnClick,
  confirmOnClick,
  cancelBtnStyle = "bg-gray-200 hover:bg-gray-300",
  confirmBtnStyle = "bg-red-500 hover:bg-red-600",
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-gray-600/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="flex w-full max-w-[22rem] flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
          <QuestionMarkCircleIcon className="h-17 w-17 text-gray-400" />
          {/* <DialogTitle className="text-lg font-bold text-gray-900">
            {title}
          </DialogTitle> */}
          <Description className="mt-2 text-center text-sm text-gray-600">
            {description}
          </Description>
          <div className="mt-4 flex gap-2">
            <button
              onClick={cancelOnClick}
              className={`rounded-md ${cancelBtnStyle} px-4 py-2 text-sm font-medium text-gray-700`}
            >
              {cancelLabel}
            </button>
            <button
              onClick={confirmOnClick}
              className={`${confirmBtnStyle} rounded-md px-4 py-2 text-sm font-medium text-white`}
            >
              {confirmLabel}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

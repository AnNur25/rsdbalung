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
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-gray-600/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full flex flex-col items-center justify-center max-w-[22rem] rounded-lg bg-white p-6 shadow-lg">
          <QuestionMarkCircleIcon className="h-17 w-17 text-gray-400" />
          {/* <DialogTitle className="text-lg font-bold text-gray-900">
            {title}
          </DialogTitle> */}
          <Description className="mt-2 text-sm text-center text-gray-600">
            {description}
          </Description>
          <div className="mt-4 flex gap-2">
            <button
              onClick={cancelOnClick}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              {cancelLabel}
            </button>
            <button
              onClick={confirmOnClick}
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              {confirmLabel}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

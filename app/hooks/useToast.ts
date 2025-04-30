// hooks/useToast.ts
import { useEffect, useState } from "react";
import { useActionData, useLoaderData, useNavigate } from "react-router";
import { toast } from "react-hot-toast";

type ToastHookOptions = {
  successRedirectPath?: string;
  successDelayMs?: number;
  loadingMessage?: string;
};

export function getDataForToast({
  success,
  message,
}: {
  message: string;
  success: boolean;
}) {
  if (success) return { success: message };
  else return { error: message };
}

function useToastFromData<T extends { error?: string; success?: string }>(
  data: T | undefined,
  options?: ToastHookOptions,
  loadingId?: string | null,
) {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set state to true after hydration
  }, []);

  useEffect(() => {
    if (data && isClient) {
      if (loadingId) {
        // dismiss loading toast
        toast.dismiss(loadingId);
      }

      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        toast.success(data.success);

        if (options?.successRedirectPath) {
          const delay = options.successDelayMs ?? 1000;
          setTimeout(() => {
            navigate(options.successRedirectPath!);
          }, delay);
        }
      }
    }
  }, [data, navigate, options, loadingId]);
}

export function useToastFromLoader<
  T extends { error?: string; success?: string },
>() {
  const loaderData = useLoaderData() as T;
  useToastFromData(loaderData);
}

export function useToastFromAction<
  T extends { error?: string; success?: string },
>(options?: ToastHookOptions) {
  const actionData = useActionData() as T;

  // show loading toast immediately, only in client-side
  const loadingId = options?.loadingMessage
    ? toast.loading(options.loadingMessage)
    : null;

  useToastFromData(actionData, options, loadingId);
}

export function useToast<T extends { error?: string; success?: string }>(
  data?: T,
  options?: ToastHookOptions,
) {
  // show loading toast immediately, only in client-side
  const loadingId = options?.loadingMessage
    ? toast.loading(options.loadingMessage)
    : null;

  useToastFromData(data, options, loadingId);
}

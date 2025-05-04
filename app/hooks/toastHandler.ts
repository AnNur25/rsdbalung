import { useEffect } from "react";
import toast from "react-hot-toast";
import { useActionData, useLoaderData } from "react-router";

export function ActionToast() {
  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.message) {
      if (actionData.success) {
        toast.success(actionData.message);
      } else {
        toast.error(actionData.message);
      }
    }
  }, [actionData]);

  return null;
}

export function LoaderToast() {
  const loaderData = useLoaderData();

  useEffect(() => {
    if (loaderData?.message) {
      if (loaderData.success) {
        toast.success(loaderData.message);
      } else {
        toast.error(loaderData.message);
      }
    }
  }, [loaderData]);

  return null;
}



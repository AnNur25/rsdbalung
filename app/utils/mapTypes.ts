import type { MessageCardModel } from "~/components/MessageCard";
import type { AdminResponse } from "~/models/Complaint";

export function mapAdminResponseToCard(res: AdminResponse): MessageCardModel {
  return {
    id: res.id,
    name: "Admin",
    message: res.message,
    date: res.dibuat_pada,
  };
}

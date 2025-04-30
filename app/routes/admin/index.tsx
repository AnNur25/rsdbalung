import { redirect } from "react-router";
import { toast } from "react-hot-toast";
export async function loader() {
  toast.success("Successfully toasted!");
  return redirect("/admin/home");
}

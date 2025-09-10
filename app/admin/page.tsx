import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard/dashboard";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  return <Dashboard />;
}

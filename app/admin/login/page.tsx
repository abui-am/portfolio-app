import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/app/admin/admin-login-form";
import { isAdminSession } from "@/lib/admin/auth";

export default async function AdminLoginPage() {
  if (await isAdminSession()) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-[#e6e6e6] bg-white p-6 shadow-sm">
        <h1 className="text-[18px] font-semibold text-[#333]">Admin login</h1>
        <p className="mt-1 text-[13px] text-[#7a7a7a]">Moderate portfolio comments</p>
        <AdminLoginForm />
      </div>
    </main>
  );
}

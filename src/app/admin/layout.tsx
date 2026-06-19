import { AdminAuthGate } from "@/components/admin/admin-auth-gate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <AdminAuthGate>{children}</AdminAuthGate>
    </div>
  );
}

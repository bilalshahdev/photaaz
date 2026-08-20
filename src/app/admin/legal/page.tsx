import { AdminPageHeader } from "@/components/admin/admin-ui";
import { prisma } from "@/lib/db/prisma";

export default async function AdminLegalRequestsPage() {
  const requests = await prisma.legalRequest.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return <main className="px-4 py-6 sm:px-6 lg:px-8"><AdminPageHeader eyebrow="Compliance" title="Legal requests." body="Verified privacy requests, copyright notices, and counter-notices are routed here for controlled handling." />
    <div className="mt-6 overflow-x-auto border border-slate-200 bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-slate-950 text-white"><tr><th className="p-3">Received</th><th className="p-3">Type</th><th className="p-3">Status</th><th className="p-3">Requester</th><th className="p-3">Details</th></tr></thead><tbody>
      {requests.map((request) => <tr key={request.id} className="border-t border-slate-200 align-top"><td className="whitespace-nowrap p-3">{request.createdAt.toLocaleString("en")}</td><td className="p-3 font-semibold">{request.type}</td><td className="p-3">{request.status}</td><td className="p-3"><div>{request.name}</div><a className="text-teal-700 underline" href={`mailto:${request.email}`}>{request.email}</a></td><td className="max-w-xl whitespace-pre-wrap p-3">{request.details}</td></tr>)}
      {!requests.length ? <tr><td className="p-6 text-slate-500" colSpan={5}>No legal requests recorded.</td></tr> : null}
    </tbody></table></div>
  </main>;
}

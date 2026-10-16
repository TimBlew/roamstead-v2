import type { ReactNode } from "react";
import Link from "next/link";

import { redirect } from "next/navigation";
import { adminAuthenticated } from "@/lib/admin-auth";

export async function AdminWorkspace({ active, title, subtitle, children }: { active: "edit" | "analytics"; title: string; subtitle: string; children: ReactNode }) {
  if (!await adminAuthenticated()) redirect("/admin");
  return (
    <main id="admin-root" className="min-h-screen bg-[#F4EFEC] px-3 py-4 text-[#1F3125] sm:px-6 md:py-7">
      <div className="mx-auto w-full max-w-[1060px]">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="font-body text-[12px] font-semibold uppercase tracking-[.13em] text-[#4A6E57]">Roamstead Collective · Private</p>
            <h1 className="mt-1 font-heading text-[27px] leading-tight font-medium sm:text-[34px] tracking-[-.035em] md:text-[42px]">{title}</h1>
            <p className="mt-1 font-body text-[12px] sm:text-[14px] text-[#6D6057]">{subtitle}</p>
            <a href="/" target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-medium text-[#4A6E57] underline underline-offset-4">View your site <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6M20 4 10 14"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/></svg></a>
          </div>
          <form method="post" action="/admin/logout"><button type="submit" className="rounded-[8px] border border-[#D8CCC4] bg-[#FFFCFB] px-2 py-1.5 sm:px-4 sm:py-2.5 font-body text-[13px]">Sign out</button></form>
        </div>
        <nav aria-label="Admin sections" className="mb-3 grid grid-cols-2 gap-2">
          <Link href="/admin/edit" aria-current={active==="edit"?"page":undefined} className={`rounded-[10px] border px-2 py-2 text-center font-body text-[15px] font-semibold transition-colors ${active==="edit"?"border-[#1F3125] bg-[#1F3125] text-white":"border-[#D8CCC4] bg-[#FFFCFB] text-[#6D6057] hover:text-[#1F3125]"}`}>Edit your site</Link>
          <Link href="/admin/analytics" aria-current={active==="analytics"?"page":undefined} className={`rounded-[10px] border px-4 py-2.5 text-center font-body text-[15px] font-semibold transition-colors ${active==="analytics"?"border-[#1F3125] bg-[#1F3125] text-white":"border-[#D8CCC4] bg-[#FFFCFB] text-[#6D6057] hover:text-[#1F3125]"}`}>Analytics</Link>
        </nav>
        {children}
        <p className="mt-3 text-center font-body text-[12px] text-[#6D6057]">Private Roamstead management · Bookings, rates and guest records remain in Hostaway.</p>
      </div>
    </main>
  );
}

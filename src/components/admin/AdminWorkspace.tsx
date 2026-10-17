import type { ReactNode } from "react";
import Link from "next/link";

import { redirect } from "next/navigation";
import { adminAuthenticated } from "@/lib/admin-auth";

export async function AdminWorkspace({ active, title, subtitle, children }: { active: "edit" | "analytics" | "early-access"; title: string; subtitle: string; children: ReactNode }) {
  if (!await adminAuthenticated()) redirect("/admin");
  return (
    <main id="admin-root" className="min-h-screen bg-[#F4EFEC] px-2 py-4 sm:px-6 text-[#1F3125] sm:px-6 md:py-7">
      <div className="mx-auto w-full max-w-[1060px]">
        <div className="relative mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="w-[164px] sm:w-[195px]" aria-label="Roamstead Workspace">
              <img src="/roamstead-logo.svg" alt="Roamstead" className="block h-auto w-full" />
              <p className="ml-[18%] -mt-0.5 flex w-[82%] justify-between font-body text-[8px] font-semibold uppercase leading-none text-[#4A6E57] sm:text-[10px]" aria-label="Workspace">{"WORKSPACE".split("").map((letter,index)=><span key={index}>{letter}</span>)}</p>
            </div>
            <h1 className="mt-3 font-heading text-[27px] font-medium leading-[1.12] tracking-[-.035em] sm:text-[34px] md:text-[42px]">{title}</h1>
            {subtitle && <p className="mt-1 max-w-[48ch] font-body text-[12px] leading-[1.5] text-[#6D6057] sm:text-[14px]">{subtitle}</p>}
            <a href="/" target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-medium text-[#4A6E57] underline underline-offset-4">View your site <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6M20 4 10 14"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/></svg></a>
          </div>
          <form method="post" action="/admin/logout"><button type="submit" className="inline-flex h-[30px] shrink-0 items-center justify-center whitespace-nowrap rounded-[8px] border border-[#D8CCC4] bg-[#FFFCFB] px-2.5 font-body text-[11px] leading-none sm:h-[36px] sm:px-3 sm:text-[13px]">Sign out</button></form>
        </div>
        <nav aria-label="Admin sections" className="mb-3 grid grid-cols-3 gap-1.5 sm:gap-2">
          <Link href="/admin/edit" aria-current={active==="edit"?"page":undefined} className={`flex h-[42px] items-center justify-center rounded-[10px] border px-2 text-center font-body text-[13px] font-semibold leading-none transition-colors sm:h-[46px] sm:text-[15px] ${active==="edit"?"border-[#1F3125] bg-[#1F3125] text-white":"border-[#D8CCC4] bg-[#FFFCFB] text-[#6D6057] hover:text-[#1F3125]"}`}>Edit your site</Link>
          <Link href="/admin/analytics" aria-current={active==="analytics"?"page":undefined} className={`flex h-[42px] items-center justify-center rounded-[10px] border px-2 text-center font-body text-[13px] font-semibold leading-none transition-colors sm:h-[46px] sm:text-[15px] ${active==="analytics"?"border-[#1F3125] bg-[#1F3125] text-white":"border-[#D8CCC4] bg-[#FFFCFB] text-[#6D6057] hover:text-[#1F3125]"}`}>Analytics</Link>
          <Link href="/admin/early-access" aria-current={active==="early-access"?"page":undefined} className={`flex h-[42px] items-center justify-center rounded-[10px] border px-1.5 text-center font-body text-[12px] font-semibold leading-none transition-colors sm:h-[46px] sm:text-[15px] ${active==="early-access"?"border-[#1F3125] bg-[#1F3125] text-white":"border-[#D8CCC4] bg-[#FFFCFB] text-[#6D6057] hover:text-[#1F3125]"}`}>Early access</Link>
        </nav>
        {children}
        
      </div>
    </main>
  );
}

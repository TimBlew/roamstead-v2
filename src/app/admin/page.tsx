import { redirect } from "next/navigation";
import CopyEditor from "@/components/admin/CopyEditor";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import type { Metadata } from "next";
import { adminAuthenticated, adminConfigured } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Roamstead | Private management", robots: { index: false, follow: false } };

const reports = [
  { title: "Website traffic", description: "Visitors, page views, top properties, traffic sources, and devices.", url: "https://vercel.com/tim-blewitts-projects/roamstead-v2/analytics", action: "Open traffic report" },
  { title: "Booking interest", description: "Track availability_dates_selected and hostaway_checkout_click events. Checkout clicks are not confirmed reservations.", url: "https://vercel.com/tim-blewitts-projects/roamstead-v2/analytics", action: "View booking events" },
  { title: "Google search", description: "Google search queries, impressions, indexed pages, and your search visibility.", url: "https://search.google.com/search-console", action: "Open Search Console" },
  { title: "Site health", description: "Inspect production deployment errors and availability or signup API logs.", url: "https://vercel.com/tim-blewitts-projects/roamstead-v2/logs", action: "Open production logs" },
  { title: "Guest interest", description: "Review email signups and audience records in Resend. Confirm stored contacts independently of email notifications.", url: "https://resend.com/audiences", action: "Open audience" },
  { title: "Reservations", description: "Manage live reservations, rates, availability, and guest information in Hostaway.", url: "https://dashboard.hostaway.com", action: "Open Hostaway" },
];
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const allowed = await adminAuthenticated();
  if (allowed) redirect("/admin/edit");
  const configured = adminConfigured();
  const error = (await searchParams).error;
  return (
    <div id="admin-root" className="min-h-[100dvh] bg-[#F4EFEC] px-4 py-6 text-[#1F3125] sm:px-6 sm:py-12 md:px-10 md:py-16 lg:flex lg:items-center lg:justify-center">
      <div className="mx-auto w-full max-w-[1050px] lg:max-w-[500px]">
        <div className={`mb-5 md:mb-8 lg:mb-2 lg:text-center ${configured ? "hidden" : ""}`}>
          <p className="mb-2 font-body text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[12px] sm:tracking-[0.16em] text-[#4A6E57]">Roamstead Collective · Your workspace</p>
          <h1 className="font-heading text-[30px] leading-[1.12] tracking-[-0.025em] sm:text-[36px] md:text-[40px]">{allowed ? "Your site, at a glance." : "Welcome back."}</h1>
          <p className="mt-2 max-w-[630px] font-body text-[13px] leading-[1.5] sm:mt-3 sm:text-[15px] lg:!mt-1 lg:mx-auto text-[#6D6057]">{allowed ? "A single starting point for site performance, guest interest, search visibility and property operations." : "Sign in to manage your Roamstead website."}</p>
        </div>
        {!configured ? (
          <div className="max-w-[600px] rounded-[12px] border border-[#D8CCC4] bg-white p-7">
            <h2 className="font-heading text-[24px]">Your workspace is being prepared</h2>
            <p className="mt-3 font-body text-[14px] leading-relaxed text-[#6D6057]">Your management access is being set up. Please reach out to Castlehead if you need a hand.</p>
          </div>
        ) : !allowed ? (
          <form method="post" action="/admin/login" className="mx-auto w-full max-w-[420px] rounded-[14px] border border-[#D8CCC4] bg-[#FFFCFB] px-5 pb-6 pt-7 shadow-sm sm:p-6 lg:mx-auto lg:max-w-[456px] lg:rounded-[16px] lg:border-[#DDD2C9] lg:px-10 lg:pb-7 lg:pt-7 lg:shadow-[0_14px_45px_rgba(31,49,37,0.075)]">
            <div className="flex flex-col items-center text-center">
              <div className="relative -translate-x-[5px] w-[202px] sm:w-[218px] lg:-translate-x-[7px] lg:w-[226px]">
                <img src="/roamstead-logo.svg" alt="Roamstead" className="block h-auto w-full" />
                <p className="ml-[18%] mt-0.5 flex w-[82%] justify-between font-body text-[10px] sm:text-[11px] lg:text-[12px] font-semibold uppercase leading-none text-[#4A6E57]" aria-label="Workspace">{"WORKSPACE".split("").map((letter,index)=><span key={index}>{letter}</span>)}</p>
              </div>
              <h1 className="mt-5 font-heading text-[29px] sm:text-[32px] lg:mt-4 lg:text-[34px] font-medium leading-[1.12] tracking-[-0.035em] text-[#1F3125]">Welcome back.</h1>
              <p className="mt-1 mb-5 max-w-[280px] font-body text-[12px] sm:max-w-none sm:text-[13px] lg:mb-3 leading-[1.4] text-[#6D6057]">Sign in to manage your Roamstead website.</p>
            </div>
            <label htmlFor="admin-password" className="block font-body text-[13px] font-medium">Password</label>
            <input id="admin-password" name="password" type="password" required autoComplete="current-password" className="mt-1.5 h-[44px] w-full rounded-[8px] border border-[#D8CCC4] bg-white px-4 font-body text-[16px] focus:outline-[#4A6E57]" />
            {error && <p role="alert" className="mt-3 font-body text-[13px] text-red-700">That password didn’t work. Please try again.</p>}
            <button type="submit" className="mt-3 inline-flex h-[44px] w-full lg:mt-2.5 lg:h-[42px] items-center justify-center rounded-[8px] bg-[#4A6E57] font-body text-[14px] leading-none font-medium text-white hover:bg-[#1F3125]">Sign in</button>
          </form>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-3 rounded-[10px] border border-[#D8CCC4] bg-[#FFFCFB] p-4">
              <p className="font-body text-[13px] text-[#6D6057]">Your private Roamstead workspace. Booking records remain securely in Hostaway.</p>
              <form method="post" action="/admin/logout"><button className="rounded-[8px] border border-[#D8CCC4] px-4 py-2 font-body text-[13px] hover:bg-[#F4EFEC]" type="submit">Sign out</button></form>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {reports.map(report => (
                <section key={report.title} className="flex min-h-[206px] flex-col rounded-[12px] border border-[#D8CCC4] bg-[#FFFCFB] p-6">
                  <h2 className="font-heading text-[23px] leading-tight">{report.title}</h2>
                  <p className="mt-2 flex-1 font-body text-[14px] leading-[1.6] text-[#6D6057]">{report.description}</p>
                  <a href={report.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex w-fit items-center gap-2 rounded-[8px] bg-[#4A6E57] px-4 py-3 font-body text-[13px] font-medium text-white hover:bg-[#1F3125]">{report.action} <span aria-hidden>↗</span></a>
                </section>
              ))}
            </div>
            <AnalyticsPanel />
            <CopyEditor />
            <p className="mt-7 font-body text-[12px] leading-relaxed text-[#6D6057]">Your website, guest interest, and property tools in one place. Reservations and availability stay in Hostaway.</p>
          </>
        )}
      </div>
    </div>
  );
}

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
    <div id="admin-root" className="min-h-[100dvh] bg-[#F4EFEC] px-4 py-8 text-[#1F3125] sm:px-6 sm:py-12 md:px-10 md:py-16 lg:flex lg:items-center lg:justify-center">
      <div className="mx-auto w-full max-w-[1050px] lg:max-w-[520px]">
        <div className="mb-5 md:mb-8 lg:mb-5 lg:text-center">
          <p className="mb-2 font-body text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[12px] sm:tracking-[0.16em] text-[#4A6E57]">Roamstead Collective · Your workspace</p>
          <h1 className="font-heading text-[30px] leading-[1.12] tracking-[-0.025em] sm:text-[36px] md:text-[40px]">{allowed ? "Your site, at a glance." : "Welcome back."}</h1>
          <p className="mt-2 max-w-[630px] font-body text-[13px] leading-[1.5] sm:mt-3 sm:text-[15px] lg:mt-3 lg:mx-auto text-[#6D6057]">{allowed ? "A single starting point for site performance, guest interest, search visibility and property operations." : "Sign in to manage your Roamstead website."}</p>
        </div>
        {!configured ? (
          <div className="max-w-[600px] rounded-[12px] border border-[#D8CCC4] bg-white p-7">
            <h2 className="font-heading text-[24px]">Your workspace is being prepared</h2>
            <p className="mt-3 font-body text-[14px] leading-relaxed text-[#6D6057]">Your management access is being set up. Please reach out to Castlehead if you need a hand.</p>
          </div>
        ) : !allowed ? (
          <form method="post" action="/admin/login" className="w-full max-w-[460px] rounded-[12px] border border-[#D8CCC4] bg-[#FFFCFB] p-4 shadow-sm sm:p-6 lg:mx-auto lg:max-w-[420px] lg:px-8 lg:py-7">
            <label htmlFor="admin-password" className="block font-body text-[13px] font-medium">Password</label>
            <input id="admin-password" name="password" type="password" required autoComplete="current-password" className="mt-2 h-[43px] w-full rounded-[8px] border border-[#D8CCC4] bg-white px-4 font-body text-[16px] focus:outline-[#4A6E57]" />
            {error && <p role="alert" className="mt-3 font-body text-[13px] text-red-700">That password didn’t work. Please try again.</p>}
            <button type="submit" className="mt-4 inline-flex h-[42px] w-full items-center justify-center rounded-[8px] bg-[#4A6E57] font-body text-[14px] leading-none font-medium text-white hover:bg-[#1F3125]">Sign in</button>
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

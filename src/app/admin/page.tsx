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
  const configured = adminConfigured();
  const error = (await searchParams).error;
  return (
    <div className="min-h-[75vh] bg-[#F4EFEC] px-5 py-12 text-[#1F3125] md:px-10 md:py-16">
      <div className="mx-auto max-w-[1050px]">
        <div className="mb-8">
          <p className="mb-2 font-body text-[12px] font-medium uppercase tracking-[0.16em] text-[#4A6E57]">Roamstead Collective · Private</p>
          <h1 className="font-heading text-[34px] leading-tight md:text-[46px]">{allowed ? "Your site, at a glance." : "Management access."}</h1>
          <p className="mt-3 max-w-[630px] font-body text-[15px] leading-relaxed text-[#6D6057]">{allowed ? "A single starting point for site performance, guest interest, search visibility and property operations." : "Sign in to open the private operations hub."}</p>
        </div>
        {!configured ? (
          <div className="max-w-[600px] rounded-[12px] border border-[#D8CCC4] bg-white p-7">
            <h2 className="font-heading text-[24px]">Admin setup required</h2>
            <p className="mt-3 font-body text-[14px] leading-relaxed text-[#6D6057]">Castlehead must first configure the private admin password and session secret in Vercel Production environment variables. No administrative reports are available until access is configured.</p>
          </div>
        ) : !allowed ? (
          <form method="post" action="/admin/login" className="max-w-[460px] rounded-[12px] border border-[#D8CCC4] bg-[#FFFCFB] p-6 shadow-sm">
            <label htmlFor="admin-password" className="block font-body text-[14px] font-medium">Password</label>
            <input id="admin-password" name="password" type="password" required autoComplete="current-password" className="mt-2 h-[48px] w-full rounded-[8px] border border-[#D8CCC4] bg-white px-4 font-body text-[16px] focus:outline-[#4A6E57]" />
            {error && <p role="alert" className="mt-3 font-body text-[13px] text-red-700">Unable to sign in. Check the password and try again.</p>}
            <button type="submit" className="mt-5 h-[48px] w-full rounded-[8px] bg-[#4A6E57] font-body text-[15px] font-medium text-white hover:bg-[#1F3125]">Open management</button>
          </form>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-3 rounded-[10px] border border-[#D8CCC4] bg-[#FFFCFB] p-4">
              <p className="font-body text-[13px] text-[#6D6057]">Reports open in their connected services. Live booking data stays in Hostaway.</p>
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
            <p className="mt-7 font-body text-[12px] leading-relaxed text-[#6D6057]">This first-stage management hub does not edit published pages or expose private guest details. Content editing and embedded reporting require their own scoped integrations and access permissions.</p>
          </>
        )}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import { AdminWorkspace } from "@/components/admin/AdminWorkspace";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Analytics | Roamstead",robots:{index:false,follow:false}};
export default async function AnalyticsPage(){return <AdminWorkspace active="analytics" title="How your site is doing" subtitle="Site traffic, guest interest, and bookings started."><AnalyticsPanel /></AdminWorkspace>}

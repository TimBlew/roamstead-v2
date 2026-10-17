import type { Metadata } from "next";
import EarlyAccessDirectory from "@/components/admin/EarlyAccessDirectory";
import { AdminWorkspace } from "@/components/admin/AdminWorkspace";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Early access | Roamstead",robots:{index:false,follow:false}};
export default async function EarlyAccessPage(){
  return <AdminWorkspace active="early-access" title="Early access" subtitle=""><EarlyAccessDirectory/></AdminWorkspace>;
}

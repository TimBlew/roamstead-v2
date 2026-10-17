import type { Metadata } from "next";
import CopyEditor from "@/components/admin/CopyEditor";
import { AdminWorkspace } from "@/components/admin/AdminWorkspace";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Edit your site | Roamstead",robots:{index:false,follow:false}};
export default async function EditPage(){return <AdminWorkspace active="edit" title="Edit your site" subtitle=""><CopyEditor /></AdminWorkspace>}

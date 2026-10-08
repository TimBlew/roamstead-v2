import { redirect } from "next/navigation";

// The About experience is paused while the main and property pages are finalized.
// Previous page content remains available in Git history for future restoration.
export default function AboutPage() {
  redirect("/");
}

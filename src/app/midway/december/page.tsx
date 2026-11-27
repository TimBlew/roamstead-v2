import { SeasonalPage } from "@/components/seasonal/SeasonalPage";
import { seasonalPages } from "@/data/seasonal-pages";
import { seasonalMetadata } from "@/lib/seasonal-metadata";

const page = seasonalPages.midway;
export const metadata = seasonalMetadata(page);

export default function Page() {
  return <SeasonalPage page={page} />;
}

import { PlacePage } from "@/components/places/PlacePage";
import { getPlace, placeMetadata } from "@/data/places";
import { jsonLdString, midwayCollectionJsonLd } from "@/lib/structured-data";

const place = getPlace("midway");

export const metadata = placeMetadata(place);

export default function MidwayPage() {
  const structuredData = midwayCollectionJsonLd(place);

  return (
    <>
      {structuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      ) : null}
      <PlacePage place={place} />
    </>
  );
}

import { PlacePage } from "@/components/places/PlacePage";
import { getPlace, placeMetadata } from "@/data/places";
import { jsonLdString, parkCityCollectionJsonLd } from "@/lib/structured-data";

const place = getPlace("park-city");

export const metadata = placeMetadata(place);

export default function ParkCityPage() {
  const structuredData = parkCityCollectionJsonLd(place);

  return (
    <>
      {structuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      ) : null}
      <PlacePage place={place} />
    </>
  );
}

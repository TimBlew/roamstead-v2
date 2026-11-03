import { PlacePage } from "@/components/places/PlacePage";
import { getPlace, placeMetadata } from "@/data/places";

const place = getPlace("midway");

export const metadata = placeMetadata(place);

export default function MidwayPage() {
  return <PlacePage place={place} />;
}

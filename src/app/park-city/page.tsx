import { PlacePage } from "@/components/places/PlacePage";
import { getPlace, placeMetadata } from "@/data/places";

const place = getPlace("park-city");

export const metadata = placeMetadata(place);

export default function ParkCityPage() {
  return <PlacePage place={place} />;
}

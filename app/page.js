/**
 * الصفحة الرئيسية للموقع
 * هذه الصفحة تعرض الصفحة الرئيسية التي تحتوي على معلومات عامة عن المنصة وخدماتها
 *
 * Home Page
 * This page displays the main homepage with general information about the platform and its services
 */

import { Button } from "@/components/ui/button";
// import ListingMapView from "./_components/ListingMapView";
import HomePage from "./_components/HomePage";
export default function Home() {
  return (
    <div className="">
      {/* <ListingMapView type="Donate" /> */}
      <HomePage />
    </div>
  );
}

/**
 * صفحة التبرعات
 * هذه الصفحة تعرض قائمة بجميع التبرعات والفوائض المتاحة على الخريطة
 * يمكن للمستخدمين البحث والتصفية حسب نوع التبرع والموقع
 *
 * Donations Page
 * This page displays a list of all available donations and surplus items on a map
 * Users can search and filter by donation type and location
 */

import ListingMapView from "../Listing-Map-view/page";

function ForRent() {
  return (
    <div className=" p-10">
      <ListingMapView type="Donate" />
    </div>
  );
}

export default ForRent;

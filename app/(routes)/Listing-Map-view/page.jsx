/**
 * صفحة عرض الإعلانات على الخريطة
 * هذه الصفحة تعرض جميع الإعلانات المتاحة على خريطة تفاعلية
 * يمكن التصفية حسب نوع الحساب (مطعم، صيدلية، مصنع) والبحث حسب الموقع
 *
 * Map Listing View Page
 * This page displays all available listings on an interactive map
 * Can filter by account type (restaurant, pharmacy, factory) and search by location
 */

"use client";
import { supabase } from "@/utils/supabase/client";
import Listing from "./_components/Listing";
import { useEffect, useState } from "react";
import MapSection from "./_components/MapSection";
import { Store, Building2, Factory } from "lucide-react";

function ListingMapView({ type }) {
  const [listings, setListings] = useState([]);
  const [searchAddress, setSearchAddress] = useState();
  const [surplusTypeCount, setSurplusTypeCount] = useState();
  const [conditionCount, setConditionCount] = useState();
  const [amountCount, setAmountCount] = useState(0);
  const [coordinates, setCoordinates] = useState();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    getLatestListing();
  }, []);

  useEffect(() => {
    getLatestListing();
  }, [selectedCategory]);

  const getLatestListing = async () => {
    let query = supabase
      .from("listing")
      .select(`
        *,
        listingImages(url, listing_id),
        owner:users!listing_user_id_fkey(
          id,
          name,
          business_name,
          account_type,
          avatar_path,
          business_image_path
        )
      `)
      .eq("active", true)
      .eq("type", type);

    // Filter by category if not "all"
    if (selectedCategory !== "all") {
      query = query.eq("users.account_type", selectedCategory);
    }

    query = query.order("id", { ascending: false });

    const { data, error } = await query;

    if (data) {
      // Client-side filter by account_type if needed
      let filteredData = data;
      if (selectedCategory !== "all") {
        filteredData = data.filter(item => item.owner?.account_type === selectedCategory);
      }
      setListings(filteredData);
      console.log(filteredData);
    }
    if (error) {
      console.log(error);
    }
  };

  const handelSearchClick = async () => {
    if (
      !searchAddress ||
      !searchAddress.value ||
      !searchAddress.value.structured_formatting
    ) {
      console.log("No search term provided");
      return;
    }

    const searchTrem = searchAddress?.value?.structured_formatting?.main_text;
    console.log("Searching for:", searchTrem);

    let query = supabase
      .from("listing")
      .select(`
        *,
        listingImages(url, listing_id),
        owner:users!listing_user_id_fkey(
          id,
          name,
          business_name,
          account_type,
          avatar_path,
          business_image_path
        )
      `)
      .eq("active", true)
      .eq("type", type)
      .gte("surplusType", surplusTypeCount || 0)
      .gte("condition", conditionCount || 0)
      .gte("amount", amountCount || 0)
      .like("address", "%" + searchTrem + "%")
      .order("id", { ascending: false});

    if (surplusTypeCount) {
      query = query.gte("surplusType", surplusTypeCount);
    }

    const { data, error } = await query;

    if (data) {
      // Client-side filter by account_type if category is selected
      let filteredData = data;
      if (selectedCategory !== "all") {
        filteredData = data.filter(item => item.owner?.account_type === selectedCategory);
      }
      setListings(filteredData);
      console.log("Search results:", filteredData);
    }
    if (error) {
      console.log("Error fetching search results:", error);
    }
  };

  const categories = [
    { id: "all", label: "All", icon: Store },
    { id: "restaurant", label: "Restaurant", icon: Store },
    { id: "pharmacy", label: "Pharmacy", icon: Building2 },
    { id: "factory", label: "Factory", icon: Factory },
  ];

  return (
    <div className="p-10 space-y-6">
      {/* Category Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Filter by Business Type</h2>
          <span className="text-sm text-gray-500">{listings.length} items</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="">
          <Listing
            listings={listings}
            handelSearchClick={handelSearchClick}
            searchAddress={(v) => setSearchAddress(v)}
            setAmountCount={setAmountCount}
            setConditionCount={setConditionCount}
            setSurplusTypeCount={setSurplusTypeCount}
            setCoordinates={setCoordinates}
            onHoverItem={setHoveredItem}
          />
        </div>
        <div className="h-[80vh] sticky top-10">
          <MapSection
            coordinates={coordinates}
            listings={listings}
            hoveredItem={hoveredItem}
          />
        </div>
      </div>
    </div>
  );
}

export default ListingMapView;

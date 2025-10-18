"use client";

import {
  MapPin,
  Package,
  Search,
  Store,
  User,
  Heart,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Filter,
  Grid3x3,
  LayoutList,
  Star,
  Zap,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { StatusBadge, UrgencyBadge, CategoryBadge } from "@/components/ui/status-badge";
import { getBusinessTypeConfig } from "@/lib/constants/order-types";
import { useState, useEffect } from "react";
import FilterSection from "./FilterSection";
import Link from "next/link";

// Dynamically import GoogleSearch to prevent hydration errors
const GoogleSearch = dynamic(() => import("./GoogleSearch"), { ssr: false });

function Listing({
  listings = [],
  handelSearchClick,
  searchAddress,
  setAmountCount,
  setConditionCount,
  setSurplusTypeCount,
  setCoordinates,
  onHoverItem,
}) {
  const [address, setAddress] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Client-side code running...");
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Modern Hero Section with Stats */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-1">Discover & Share</h1>
                  <p className="text-white/80 text-lg">Find amazing items in your community</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden md:flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-2xl font-bold">{listings.length}</span>
                </div>
                <p className="text-xs text-white/70">Available Items</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-2xl font-bold">24/7</span>
                </div>
                <p className="text-xs text-white/70">Active</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <GoogleSearch
                  selectedAddress={(p) => {
                    searchAddress(p);
                    setAddress(p);
                  }}
                  setCoordinates={setCoordinates}
                />
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 text-white px-8 shadow-lg"
                size="lg"
                onClick={handelSearchClick}
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-200 gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters && <span className="ml-1 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">!</span>}
          </Button>

          {address && (
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                <span className="text-primary font-bold">{listings?.length || 0}</span> in {address?.label}
              </span>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-white/50"
            }`}
            title="Grid View"
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-white/50"
            }`}
            title="List View"
          >
            <LayoutList className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-in slide-in-from-top">
          <FilterSection
            setAmountCount={setAmountCount}
            setConditionCount={setConditionCount}
            setSurplusTypeCount={setSurplusTypeCount}
          />
        </div>
      )}

      {/* Listings Grid/List */}
      <div className={viewMode === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 gap-6"
        : "flex flex-col gap-4"
      }>
        {listings.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your filters or search in a different area</p>
          </div>
        ) : (
          listings.map((item, index) => (
              viewMode === "grid" ? (
                // Grid View - Card Style
                <Link
                  href={item.id ? `/view-details/${item.id}` : "#"}
                  key={index}
                  className="group"
                  onMouseEnter={() => onHoverItem?.(item)}
                  onMouseLeave={() => onHoverItem?.(null)}
                >
                  <article className="bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden transition-all duration-500 hover:-translate-y-2">
                    {/* Image with Overlay */}
                    <div className="relative overflow-hidden h-64">
                      <Image
                        src={item.listingImages?.[0]?.url || "/fallback.jpg"}
                        width={800}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt="listing"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                        <div className="flex gap-2">
                          {item.category && <CategoryBadge category={item.category} />}
                          {item.urgency_level && <UrgencyBadge urgency={item.urgency_level} />}
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg">
                          <Heart className="h-5 w-5 text-gray-700" />
                        </div>
                      </div>

                      {/* Bottom Price & Status */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-xl">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-primary">{item.price}</span>
                            <span className="text-sm text-gray-600 font-medium">EGP</span>
                          </div>
                        </div>
                        <StatusBadge status={item.status || 'available'} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Business Owner */}
                      {item.owner && (
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = `/business/${item.owner.id}`;
                          }}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-2xl hover:from-primary/5 transition-all group/owner border border-gray-100 cursor-pointer"
                        >
                          <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-200">
                            {item.owner.account_type === 'individual' ? (
                              <User className="h-5 w-5 text-gray-600" />
                            ) : (
                              <Store className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {item.owner.account_type === 'individual'
                                ? item.owner.name
                                : item.owner.business_name}
                            </p>
                            {item.owner.account_type !== 'individual' && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getBusinessTypeConfig(item.owner.account_type).color}`}>
                                {getBusinessTypeConfig(item.owner.account_type).icon}
                              </span>
                            )}
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover/owner:text-primary group-hover/owner:translate-x-1 transition-all" />
                        </div>
                      )}

                      {/* Title & Location */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary flex-shrink-0" />
                          <h3 className="font-bold text-xl text-gray-900 line-clamp-1">
                            {item.surplusType || "Item"}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <p className="text-sm line-clamp-1">{item.adderss || "Location not specified"}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                          <div className="flex items-center gap-2 text-primary mb-1">
                            <Zap className="h-4 w-4" />
                            <span className="text-xs font-semibold">Quantity</span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{item.amount || 0}</p>
                          <p className="text-xs text-gray-600">items available</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center gap-2 text-blue-700 mb-1">
                            <Star className="h-4 w-4" />
                            <span className="text-xs font-semibold">Condition</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{item.condition || "N/A"}</p>
                          <p className="text-xs text-gray-600">quality</p>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="pt-2">
                        <div className="flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary font-semibold py-3 px-4 rounded-xl transition-all group-hover:gap-3">
                          <span>View Details</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ) : (
                // List View - Horizontal Card
                <Link
                  href={item.id ? `/view-details/${item.id}` : "#"}
                  key={index}
                  className="group"
                  onMouseEnter={() => onHoverItem?.(item)}
                  onMouseLeave={() => onHoverItem?.(null)}
                >
                  <article className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="relative w-full sm:w-64 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                        <Image
                          src={item.listingImages?.[0]?.url || "/fallback.jpg"}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt="listing"
                        />
                        <div className="absolute top-3 right-3">
                          <StatusBadge status={item.status || 'available'} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="h-5 w-5 text-primary" />
                                <h3 className="font-bold text-2xl text-gray-900 line-clamp-1">
                                  {item.surplusType || "Item"}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <p className="text-sm">{item.adderss || "Location not specified"}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-primary">{item.price}</div>
                              <div className="text-sm text-gray-600">EGP</div>
                            </div>
                          </div>

                          {/* Owner */}
                          {item.owner && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <div className="bg-white p-2 rounded-lg">
                                {item.owner.account_type === 'individual' ? (
                                  <User className="h-4 w-4 text-gray-600" />
                                ) : (
                                  <Store className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {item.owner.account_type === 'individual'
                                  ? item.owner.name
                                  : item.owner.business_name}
                              </span>
                            </div>
                          )}

                          {/* Badges */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {item.category && <CategoryBadge category={item.category} />}
                            {item.urgency_level && <UrgencyBadge urgency={item.urgency_level} />}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="flex gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Zap className="h-4 w-4 text-primary" />
                              <span className="font-semibold">{item.amount || 0} items</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold">{item.condition || "N/A"}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                            <span>View Details</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            ))
        )}
      </div>
    </div>
  );
}

export default Listing;

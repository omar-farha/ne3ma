"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { MapPin, Package, X, Eye, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function MarkerCard({ item, closeCard }) {
  return (
    <div className="relative">
      {/* Close Button */}
      <button
        onClick={() => closeCard()}
        className="absolute -top-2 -right-2 z-20 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-xl transition-all hover:scale-110"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Card Content */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-[280px] border-2 border-gray-200">
        {/* Image Section */}
        <div className="relative h-[160px] overflow-hidden">
          <Image
            src={item.listingImages?.[0]?.url || "/fallback.jpg"}
            width={800}
            height={150}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            alt="listing"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          {/* Price Badge */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">{item.price}</span>
              <span className="text-xs text-gray-600 font-medium">EGP</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <StatusBadge status={item.status || 'available'} />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Item Type */}
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary flex-shrink-0" />
            <h3 className="font-bold text-base text-gray-900 line-clamp-1">
              {item.surplusType || "Item"}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p className="text-sm line-clamp-2">{item.adderss || "Location not specified"}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
            <div className="bg-primary/5 rounded-lg p-2 text-center">
              <p className="text-xs text-primary font-medium mb-0.5">Amount</p>
              <p className="text-sm font-bold text-gray-900">{item.amount || 0}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <p className="text-xs text-blue-700 font-medium mb-0.5">Condition</p>
              <p className="text-sm font-bold text-gray-900 truncate">{item.condition || "N/A"}</p>
            </div>
          </div>

          {/* CTA Button */}
          <Link href={"/view-details/" + item.id} className="block">
            <Button size="sm" className="w-full group">
              <Eye className="h-4 w-4 mr-2" />
              <span>View Details</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MarkerCard;

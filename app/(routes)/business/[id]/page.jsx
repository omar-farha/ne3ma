"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { OrderService } from "@/lib/services/order-service";
import { getBusinessTypeConfig, formatPrice, LISTING_TYPES } from "@/lib/constants/order-types";
import { StatusBadge, CategoryBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Package, Star, ShoppingCart } from "lucide-react";

export default function BusinessProfilePage() {
  const params = useParams();
  const [business, setBusinessAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (params.id) {
      loadBusiness();
    }
  }, [params.id]);

  const loadBusiness = async () => {
    setLoading(true);
    const result = await OrderService.getBusinessWithProducts(params.id);

    if (result.error) {
      console.error("Error fetching business:", result.error);
    }

    if (result.data) {
      setBusinessAccount(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-64 bg-gray-200"></div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg h-80 shadow"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Business not found</h2>
          <p className="text-gray-500 mt-2">The business you're looking for doesn't exist</p>
          <Link href="/shop">
            <Button className="mt-4">Browse Businesses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const businessName = business.account_type === 'individual'
    ? business.name
    : business.business_name;

  const imagePath = business.account_type === 'individual'
    ? business.avatar_path
    : business.business_image_path;

  const imageUrl = imagePath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${
        business.account_type === 'individual' ? 'user-avatars' : 'business-images'
      }/${imagePath}`
    : '/default-avatar.svg';

  const config = getBusinessTypeConfig(business.account_type);
  const products = business.listings || [];

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const ProductCard = ({ product }) => (
    <Link href={`/view-details/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary cursor-pointer h-full">
        {/* Product Image */}
        <div className="relative h-48">
          <Image
            src={product.listingImages?.[0]?.url || '/fallback.jpg'}
            alt={product.surplusType || 'Product'}
            fill
            className="object-cover"
          />
          {product.listing_type === LISTING_TYPES.DONATION && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
              🎁 FREE
            </div>
          )}
          {!product.is_available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded font-bold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
            {product.surplusType || 'Product'}
          </h3>

          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.amount && (
              <span className="text-sm text-gray-500">
                {product.amount} available
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {product.status && <StatusBadge status={product.status} />}
            {product.category && <CategoryBadge category={product.category} />}
          </div>

          {product.condition && (
            <p className="text-xs text-gray-500 mb-3">
              Condition: {product.condition}
            </p>
          )}

          <Button className="w-full" size="sm" disabled={!product.is_available}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.listing_type === LISTING_TYPES.DONATION ? 'Request' : 'Order Now'}
          </Button>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Business Logo */}
            <Image
              src={imageUrl}
              alt={businessName}
              width={150}
              height={150}
              className="rounded-full border-4 border-white shadow-xl object-cover w-32 h-32 md:w-40 md:h-40"
            />

            {/* Business Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{businessName}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} bg-white`}>
                  {config.icon} {config.label}
                </span>
              </div>


              <div className="flex flex-wrap gap-4 text-sm opacity-90">
                {business.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {business.address}
                  </div>
                )}
                {business.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {business.phone}
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {business.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Products' : category}
              </Button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products available
            </h3>
            <p className="text-gray-500">
              This business hasn't added any products yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { OrderService } from "@/lib/services/order-service";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  formatPrice,
  DELIVERY_METHODS,
  ORDER_STATUS,
} from "@/lib/constants/order-types";
import {
  Package,
  Phone,
  Mail,
  MapPin,
  Truck,
  Store,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  User,
  Building2,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id && userProfile?.id && !authLoading) {
      loadOrder();
    }
  }, [params.id, userProfile?.id, authLoading]);

  const loadOrder = async () => {
    setLoading(true);
    const result = await OrderService.getOrderDetails(params.id);

    if (result.data) {
      setOrder(result.data);
    } else {
      toast.error("Order not found");
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (newStatus) => {
    const result = await OrderService.updateOrderStatus(order.id, newStatus);

    if (result.error) {
      toast.error("Failed to update order status");
    } else {
      toast.success(`Order ${newStatus}`);
      loadOrder();
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    const result = await OrderService.cancelOrder(order.id);

    if (result.error) {
      toast.error("Failed to cancel order");
    } else {
      toast.success("Order cancelled successfully");
      loadOrder();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            The order you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const deliveryIcon =
    order.delivery_method === DELIVERY_METHODS.PICKUP ? Store : Truck;
  const DeliveryIcon = deliveryIcon;

  const isBusinessOwner = userProfile?.id === order.business_id;
  const isCustomer = userProfile?.id === order.customer_id;

  const businessName =
    order.business?.account_type === "individual"
      ? order.business?.name
      : order.business?.business_name;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Order #{order.order_number}
                </h1>
                <p className="text-sm opacity-90">
                  Placed{" "}
                  {formatDistanceToNow(new Date(order.created_at), {
                    addSuffix: true,
                  })}
                </p>
                <p className="text-xs opacity-75">
                  {format(new Date(order.created_at), "PPpp")}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {item.product_image_url && (
                      <Image
                        src={item.product_image_url}
                        alt={item.product_name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.product_name}
                      </h3>
                      {item.product_description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {item.product_description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Quantity: {item.quantity}</span>
                        <span>•</span>
                        <span>{formatPrice(item.price_per_unit)} each</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DeliveryIcon className="h-5 w-5" />
                {order.delivery_method === DELIVERY_METHODS.PICKUP
                  ? "Pickup Information"
                  : "Delivery Information"}
              </h2>

              {order.delivery_method === DELIVERY_METHODS.DELIVERY && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">
                        Delivery Address
                      </p>
                      <p className="text-blue-700">{order.delivery_address}</p>
                    </div>
                  </div>
                </div>
              )}

              {order.special_instructions && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-medium text-yellow-900 mb-2">
                    Special Instructions
                  </p>
                  <p className="text-gray-700">{order.special_instructions}</p>
                </div>
              )}
            </div>

            {/* Order Status History */}
            {order.order_status_history && order.order_status_history.length > 0 && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Status History
                </h2>
                <div className="space-y-3">
                  {order.order_status_history
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((history, index) => (
                      <div
                        key={history.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <StatusBadge status={history.status} />
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(history.created_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          {history.notes && (
                            <p className="text-sm text-gray-600">{history.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Business/Customer Info */}
            {isCustomer && order.business && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Business Details
                </h2>
                <Link
                  href={`/business/${order.business.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors mb-4"
                >
                  {order.business.account_type === "individual" ? (
                    <User className="h-8 w-8 text-gray-600" />
                  ) : (
                    <Building2 className="h-8 w-8 text-primary" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{businessName}</p>
                    <p className="text-xs text-gray-500">View profile →</p>
                  </div>
                </Link>
                <div className="space-y-2 text-sm">
                  {order.business.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4" />
                      <a
                        href={`tel:${order.business.phone}`}
                        className="hover:text-primary"
                      >
                        {order.business.phone}
                      </a>
                    </div>
                  )}
                  {order.business.email && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${order.business.email}`}
                        className="hover:text-primary"
                      >
                        {order.business.email}
                      </a>
                    </div>
                  )}
                  {order.business.address && (
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>{order.business.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isBusinessOwner && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Customer Details
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="hover:text-primary"
                    >
                      {order.customer_phone}
                    </a>
                  </div>
                  {order.customer_email && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${order.customer_email}`}
                        className="hover:text-primary"
                      >
                        {order.customer_email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-2">
                {isBusinessOwner && order.status === ORDER_STATUS.PENDING && (
                  <>
                    <Button
                      className="w-full"
                      onClick={() => handleUpdateStatus(ORDER_STATUS.CONFIRMED)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Order
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleUpdateStatus(ORDER_STATUS.CANCELLED)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Order
                    </Button>
                  </>
                )}

                {isBusinessOwner && order.status === ORDER_STATUS.CONFIRMED && (
                  <Button
                    className="w-full"
                    onClick={() => handleUpdateStatus(ORDER_STATUS.COMPLETED)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}

                {isCustomer && order.status === ORDER_STATUS.PENDING && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleCancelOrder}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

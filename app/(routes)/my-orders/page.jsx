/**
 * صفحة طلباتي (للعملاء)
 * هذه الصفحة تعرض جميع الطلبات التي قام بها المستخدم
 * يمكن للعملاء تتبع حالة طلباتهم وإلغاء الطلبات المعلقة
 *
 * My Orders Page (for Customers)
 * This page displays all orders placed by the user
 * Customers can track order status and cancel pending orders
 */

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { OrderService } from "@/lib/services/order-service";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatPrice, DELIVERY_METHODS, ORDER_STATUS } from "@/lib/constants/order-types";
import {
  Package,
  Phone,
  Mail,
  MapPin,
  Truck,
  Store,
  Eye,
  Loader,
  XCircle,
  Building2,
  User,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function MyOrdersPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (userProfile?.id && !authLoading) {
      loadOrders();
    }
  }, [userProfile?.id, authLoading, filter]);

  const loadOrders = async () => {
    setLoading(true);
    const result = await OrderService.getCustomerOrders(userProfile.id);

    if (result.data) {
      let filteredOrders = result.data;
      if (filter !== "all") {
        filteredOrders = result.data.filter((order) => order.status === filter);
      }
      setOrders(filteredOrders);
    }
    setLoading(false);
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    const result = await OrderService.cancelOrder(orderId);

    if (result.error) {
      toast.error("Failed to cancel order");
    } else {
      toast.success("Order cancelled successfully");
      loadOrders();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  const OrderCard = ({ order }) => {
    const deliveryIcon =
      order.delivery_method === DELIVERY_METHODS.PICKUP ? Store : Truck;
    const DeliveryIcon = deliveryIcon;

    const businessName =
      order.business?.account_type === "individual"
        ? order.business?.name
        : order.business?.business_name;

    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">#{order.order_number}</h3>
              <p className="text-sm opacity-90">
                {formatDistanceToNow(new Date(order.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Business Info */}
        {order.business && (
          <div className="p-4 bg-gray-50 border-b">
            <Link
              href={`/business/${order.business.id}`}
              className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              {order.business.account_type === "individual" ? (
                <User className="h-5 w-5 text-gray-600" />
              ) : (
                <Building2 className="h-5 w-5 text-primary" />
              )}
              <div>
                <p className="font-semibold text-gray-900">{businessName}</p>
                <p className="text-xs text-gray-500">View business profile →</p>
              </div>
            </Link>
          </div>
        )}

        {/* Order Items */}
        <div className="p-4 border-b">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Items
          </h4>
          <div className="space-y-2">
            {order.order_items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.product_name}
                  </p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-primary">
                  {formatPrice(item.subtotal)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-xl text-primary">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="p-4 border-b">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <DeliveryIcon className="h-4 w-4" />
            {order.delivery_method === DELIVERY_METHODS.PICKUP
              ? "Pickup"
              : "Delivery"}
          </h4>
          {order.delivery_method === DELIVERY_METHODS.DELIVERY && (
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{order.delivery_address}</span>
            </div>
          )}
          {order.special_instructions && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
              <p className="font-medium text-blue-800">Your Instructions:</p>
              <p className="text-gray-700">{order.special_instructions}</p>
            </div>
          )}
        </div>

        {/* Contact & Actions */}
        <div className="p-4 bg-gray-50">
          {order.business && (
            <div className="mb-3 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <a
                  href={`tel:${order.business.phone}`}
                  className="hover:text-primary"
                >
                  {order.business.phone}
                </a>
              </div>
              {order.business.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <a
                    href={`mailto:${order.business.email}`}
                    className="hover:text-primary"
                  >
                    {order.business.email}
                  </a>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Link href={`/orders/${order.id}`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
            {order.status === ORDER_STATUS.PENDING && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleCancelOrder(order.id)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track your orders and view order history
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {[
            { value: "all", label: "All Orders" },
            { value: ORDER_STATUS.PENDING, label: "Pending" },
            { value: ORDER_STATUS.CONFIRMED, label: "Confirmed" },
            { value: ORDER_STATUS.COMPLETED, label: "Completed" },
            { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={filter === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tab.value)}
            >
              {tab.label}
              {tab.value === "all" && (
                <span className="ml-2 bg-white text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                  {orders.length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Orders Grid */}
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === "all"
                ? "You haven't placed any orders yet"
                : `No ${filter} orders at the moment`}
            </p>
            <Link href="/donate">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OrderService } from "@/lib/services/order-service";
import { DELIVERY_METHODS, DELIVERY_METHOD_CONFIG } from "@/lib/constants/order-types";
import { Phone, Mail, MapPin, User, MessageSquare, ShoppingCart, Truck, Store } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function OrderForm({ listing }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    delivery_method: DELIVERY_METHODS.PICKUP,
    delivery_address: "",
    special_instructions: "",
    quantity: 1
  });

  useEffect(() => {
    // Get current user from Supabase
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch user details from users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', user.id)
          .single();

        if (userData) {
          setCurrentUser(userData);
          setFormData(prev => ({
            ...prev,
            customer_name: userData.name || "",
            customer_email: userData.email || ""
          }));
        }
      }
    };
    getCurrentUser();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeliveryMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      delivery_method: method,
      // Clear delivery address if switching to pickup
      delivery_address: method === DELIVERY_METHODS.PICKUP ? "" : prev.delivery_address
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.customer_name || !formData.customer_phone) {
        throw new Error("Please fill in your name and phone number");
      }

      if (formData.delivery_method === DELIVERY_METHODS.DELIVERY && !formData.delivery_address) {
        throw new Error("Please provide a delivery address");
      }

      // Get business owner ID from listing
      const businessId = listing.users?.id || listing.user_id;
      if (!businessId) {
        throw new Error("Business information not found");
      }

      // Calculate total
      const pricePerUnit = parseFloat(listing.price) || 0;
      const quantity = parseInt(formData.quantity) || 1;
      const subtotal = pricePerUnit * quantity;

      // Create order
      const orderData = {
        customer_id: currentUser?.id || null,
        business_id: businessId,
        delivery_method: formData.delivery_method,
        delivery_address: formData.delivery_address || null,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email,
        special_instructions: formData.special_instructions || null,
        total_amount: subtotal,
        items: [{
          product_id: listing.id,
          product_name: listing.surplusType,
          product_description: listing.description,
          product_image_url: listing.listingImages?.[0]?.url || null,
          quantity: quantity,
          price_per_unit: pricePerUnit,
          subtotal: subtotal
        }]
      };

      const result = await OrderService.createOrder(orderData);

      if (result.error) {
        throw result.error;
      }

      // Success! Redirect to success page or show confirmation
      alert(`Order placed successfully! The business owner will contact you at ${formData.customer_phone}.`);

      // Reset form
      setFormData({
        customer_name: currentUser?.name || "",
        customer_phone: "",
        customer_email: currentUser?.email || "",
        delivery_method: DELIVERY_METHODS.PICKUP,
        delivery_address: "",
        special_instructions: "",
        quantity: 1
      });

    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const businessName = listing.users?.account_type === 'individual'
    ? listing.users?.name
    : listing.users?.business_name;

  const totalPrice = (parseFloat(listing.price) || 0) * (parseInt(formData.quantity) || 1);
  const isFree = totalPrice === 0;

  return (
    <div className="bg-white rounded-lg border-2 border-primary p-6 shadow-lg">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <ShoppingCart className="h-6 w-6 text-primary" />
        {isFree ? 'Request this Item' : 'Place Order'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Delivery Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDeliveryMethodChange(DELIVERY_METHODS.PICKUP)}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.delivery_method === DELIVERY_METHODS.PICKUP
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Store className="h-6 w-6 mx-auto mb-2" />
              <div className="text-center">
                <div className="font-semibold">Pickup</div>
                <div className="text-xs text-gray-500">Collect from business</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDeliveryMethodChange(DELIVERY_METHODS.DELIVERY)}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.delivery_method === DELIVERY_METHODS.DELIVERY
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Truck className="h-6 w-6 mx-auto mb-2" />
              <div className="text-center">
                <div className="font-semibold">Delivery</div>
                <div className="text-xs text-gray-500">Deliver to address</div>
              </div>
            </button>
          </div>
        </div>

        {/* Quantity */}
        {listing.amount && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (Available: {listing.amount})
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              max={listing.amount}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        )}

        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            Your Name
          </label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        {/* Customer Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline h-4 w-4 mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleInputChange}
            placeholder="+20 123 456 7890"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        {/* Customer Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline h-4 w-4 mr-1" />
            Email (Optional)
          </label>
          <input
            type="email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Delivery Address (only if delivery selected) */}
        {formData.delivery_method === DELIVERY_METHODS.DELIVERY && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Delivery Address
            </label>
            <textarea
              name="delivery_address"
              value={formData.delivery_address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your complete delivery address"
              required
            />
          </div>
        )}

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            Special Instructions (Optional)
          </label>
          <textarea
            name="special_instructions"
            value={formData.special_instructions}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Any special requests or notes for the business"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Total & Submit */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700 font-medium">Total:</span>
            <span className="text-2xl font-bold text-primary">
              {isFree ? 'FREE' : `${totalPrice.toFixed(2)} EGP`}
            </span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-lg"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isFree ? 'Request Now' : 'Place Order'}
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-3">
            {businessName} will contact you at your provided phone number to confirm the order.
          </p>
        </div>
      </form>
    </div>
  );
}

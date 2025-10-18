import { supabase } from "@/utils/supabase/client";
import { ORDER_STATUS } from "@/lib/constants/order-types";

export class OrderService {
  // Create a new order
  static async createOrder(orderData) {
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          customer_id: orderData.customer_id,
          business_id: orderData.business_id,
          delivery_method: orderData.delivery_method,
          delivery_address: orderData.delivery_address,
          delivery_coordinates: orderData.delivery_coordinates,
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          customer_email: orderData.customer_email,
          special_instructions: orderData.special_instructions,
          total_amount: orderData.total_amount,
          status: ORDER_STATUS.PENDING
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_description: item.product_description,
          product_image_url: item.product_image_url,
          quantity: item.quantity,
          price_per_unit: item.price_per_unit,
          subtotal: item.subtotal
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      return { data: order, error: null };
    } catch (error) {
      console.error("Error creating order:", error);
      return { data: null, error };
    }
  }

  // Get order by ID with all details
  static async getOrderById(orderId) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          customer:users!orders_customer_id_fkey(id, name, email, phone),
          business:users!orders_business_id_fkey(id, name, business_name, email, phone, account_type),
          order_items(
            *,
            product:listing(*)
          ),
          order_status_history(
            *,
            changed_by_user:users(id, name, business_name, account_type)
          )
        `)
        .eq("id", orderId)
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error fetching order:", error);
      return { data: null, error };
    }
  }

  // Get customer's orders
  static async getCustomerOrders(customerId) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          business:users!orders_business_id_fkey(id, name, business_name, account_type),
          order_items(
            *,
            product:listing(*)
          )
        `)
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      return { data, error };
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      return { data: null, error };
    }
  }

  // Get business's orders
  static async getBusinessOrders(businessId, status = null) {
    try {
      let query = supabase
        .from("orders")
        .select(`
          *,
          customer:users!orders_customer_id_fkey(id, name, email, phone),
          order_items(
            *,
            product:listing(*)
          )
        `)
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      console.error("Error fetching business orders:", error);
      return { data: null, error };
    }
  }

  // Update order status
  static async updateOrderStatus(orderId, newStatus, notes = null) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;

      // Optionally add manual status history note
      if (notes) {
        await supabase
          .from("order_status_history")
          .insert([{
            order_id: orderId,
            status: newStatus,
            notes
          }]);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error updating order status:", error);
      return { data: null, error };
    }
  }

  // Cancel order
  static async cancelOrder(orderId, reason = null) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({
          status: ORDER_STATUS.CANCELLED,
          order_notes: reason
        })
        .eq("id", orderId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error cancelling order:", error);
      return { data: null, error };
    }
  }

  // Get order statistics for business
  static async getBusinessOrderStats(businessId) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("status, total_amount")
        .eq("business_id", businessId);

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter(o => o.status === ORDER_STATUS.PENDING).length,
        confirmed: data.filter(o => o.status === ORDER_STATUS.CONFIRMED).length,
        preparing: data.filter(o => o.status === ORDER_STATUS.PREPARING).length,
        completed: data.filter(o => o.status === ORDER_STATUS.COMPLETED).length,
        cancelled: data.filter(o => o.status === ORDER_STATUS.CANCELLED).length,
        totalRevenue: data
          .filter(o => o.status === ORDER_STATUS.COMPLETED)
          .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0)
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error("Error fetching order stats:", error);
      return { data: null, error };
    }
  }

  // Get businesses by type with their recent products
  static async getBusinessesByType(businessType = null, limit = 10) {
    try {
      let query = supabase
        .from("users")
        .select(`
          id,
          name,
          business_name,
          email,
          phone,
          account_type,
          avatar_path,
          business_image_path,
          address,
          created_at,
          listings:listing!listing_user_id_fkey(
            id,
            adderss,
            price,
            surplusType,
            amount,
            condition,
            description,
            listing_type,
            category,
            status,
            is_available,
            created_at,
            listingImages(url, listing_id)
          )
        `)
        .neq("account_type", "individual")
        .order("created_at", { ascending: false });

      if (businessType) {
        query = query.eq("account_type", businessType);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Sort listings by date and limit to recent 4
      const businessesWithRecentProducts = data.map(business => ({
        ...business,
        listings: business.listings
          ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4) || []
      }));

      return { data: businessesWithRecentProducts, error: null };
    } catch (error) {
      console.error("Error fetching businesses:", error);
      return { data: null, error };
    }
  }

  // Get single business with all products
  static async getBusinessWithProducts(businessId) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(`
          id,
          name,
          business_name,
          email,
          phone,
          account_type,
          avatar_path,
          business_image_path,
          address,
          created_at,
          listings:listing!listing_user_id_fkey(
            id,
            adderss,
            price,
            surplusType,
            amount,
            condition,
            description,
            listing_type,
            category,
            status,
            urgency_level,
            is_available,
            created_at,
            listingImages(url, listing_id)
          )
        `)
        .eq("id", businessId)
        .single();

      if (error) throw error;

      // Sort listings by date
      if (data.listings) {
        data.listings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching business:", error);
      return { data: null, error };
    }
  }

  // Get all orders for a business
  static async getBusinessOrders(businessId) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(
            id,
            product_name,
            product_description,
            quantity,
            price_per_unit,
            subtotal
          )
        `)
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching business orders:", error);
      return { data: [], error };
    }
  }

  // Get all orders for a customer
  static async getCustomerOrders(customerId) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          business:users!orders_business_id_fkey(
            id,
            name,
            business_name,
            account_type,
            phone,
            email,
            address
          ),
          order_items(
            id,
            product_name,
            product_description,
            product_image_url,
            quantity,
            price_per_unit,
            subtotal
          )
        `)
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      return { data: [], error };
    }
  }

  // Get single order details
  static async getOrderDetails(orderId) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          business:users!orders_business_id_fkey(
            id,
            name,
            business_name,
            account_type,
            phone,
            email,
            address
          ),
          order_items(
            id,
            product_id,
            product_name,
            product_description,
            product_image_url,
            quantity,
            price_per_unit,
            subtotal
          ),
          order_status_history(
            id,
            status,
            notes,
            created_at
          )
        `)
        .eq("id", orderId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching order details:", error);
      return { data: null, error };
    }
  }

  // Update order status
  static async updateOrderStatus(orderId, newStatus, notes = null) {
    try {
      const updateData = {
        status: newStatus,
      };

      // Set timestamp based on status
      if (newStatus === ORDER_STATUS.CONFIRMED) {
        updateData.confirmed_at = new Date().toISOString();
      } else if (newStatus === ORDER_STATUS.COMPLETED) {
        updateData.completed_at = new Date().toISOString();
      } else if (newStatus === ORDER_STATUS.CANCELLED) {
        updateData.cancelled_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error updating order status:", error);
      return { data: null, error };
    }
  }

  // Cancel order
  static async cancelOrder(orderId, reason = null) {
    return this.updateOrderStatus(orderId, ORDER_STATUS.CANCELLED, reason);
  }
}
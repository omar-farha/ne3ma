// Order and listing type constants

export const LISTING_TYPES = {
  SALE: 'sale',           // For marketplace products
  DONATION: 'donation',   // For free donations
  REQUEST: 'request'      // For requesting items
};

export const DELIVERY_METHODS = {
  PICKUP: 'pickup',
  DELIVERY: 'delivery'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const BUSINESS_TYPES = {
  RESTAURANT: 'restaurant',
  FACTORY: 'factory',
  PHARMACY: 'pharmacy',
  INDIVIDUAL: 'individual'
};

// Listing type configuration
export const LISTING_TYPE_CONFIG = {
  [LISTING_TYPES.SALE]: {
    label: 'For Sale',
    color: 'bg-green-100 text-green-800',
    icon: '💰',
    description: 'Product available for purchase'
  },
  [LISTING_TYPES.DONATION]: {
    label: 'Donation',
    color: 'bg-blue-100 text-blue-800',
    icon: '🎁',
    description: 'Free item for donation'
  },
  [LISTING_TYPES.REQUEST]: {
    label: 'Request',
    color: 'bg-purple-100 text-purple-800',
    icon: '🙏',
    description: 'Requesting this item'
  }
};

// Delivery method configuration
export const DELIVERY_METHOD_CONFIG = {
  [DELIVERY_METHODS.PICKUP]: {
    label: 'Pickup',
    icon: '🏪',
    description: 'Pick up from business location'
  },
  [DELIVERY_METHODS.DELIVERY]: {
    label: 'Delivery',
    icon: '🚚',
    description: 'Deliver to your address'
  }
};

// Order status configuration
export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
    description: 'Waiting for confirmation'
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800',
    icon: '✓',
    description: 'Order confirmed by business'
  },
  [ORDER_STATUS.PREPARING]: {
    label: 'Preparing',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '👨‍🍳',
    description: 'Order is being prepared'
  },
  [ORDER_STATUS.READY]: {
    label: 'Ready',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
    description: 'Ready for pickup/delivery'
  },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: {
    label: 'Out for Delivery',
    color: 'bg-purple-100 text-purple-800',
    icon: '🚚',
    description: 'On the way to you'
  },
  [ORDER_STATUS.COMPLETED]: {
    label: 'Completed',
    color: 'bg-gray-100 text-gray-800',
    icon: '🎉',
    description: 'Order completed successfully'
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
    description: 'Order cancelled'
  }
};

// Business type configuration
export const BUSINESS_TYPE_CONFIG = {
  [BUSINESS_TYPES.RESTAURANT]: {
    label: 'Restaurant',
    pluralLabel: 'Restaurants',
    icon: '🍽️',
    color: 'bg-orange-100 text-orange-800',
    description: 'Food and beverages'
  },
  [BUSINESS_TYPES.FACTORY]: {
    label: 'Factory',
    pluralLabel: 'Factories',
    icon: '🏭',
    color: 'bg-blue-100 text-blue-800',
    description: 'Bulk food products and goods'
  },
  [BUSINESS_TYPES.PHARMACY]: {
    label: 'Pharmacy',
    pluralLabel: 'Pharmacies',
    icon: '💊',
    color: 'bg-green-100 text-green-800',
    description: 'Medical supplies and health products'
  },
  [BUSINESS_TYPES.INDIVIDUAL]: {
    label: 'Individual',
    pluralLabel: 'Individuals',
    icon: '👤',
    color: 'bg-gray-100 text-gray-800',
    description: 'Individual sellers'
  }
};

// Utility functions
export const getListingTypeConfig = (type) => {
  return LISTING_TYPE_CONFIG[type] || LISTING_TYPE_CONFIG[LISTING_TYPES.SALE];
};

export const getDeliveryMethodConfig = (method) => {
  return DELIVERY_METHOD_CONFIG[method] || DELIVERY_METHOD_CONFIG[DELIVERY_METHODS.PICKUP];
};

export const getOrderStatusConfig = (status) => {
  return ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG[ORDER_STATUS.PENDING];
};

export const getBusinessTypeConfig = (type) => {
  return BUSINESS_TYPE_CONFIG[type] || BUSINESS_TYPE_CONFIG[BUSINESS_TYPES.INDIVIDUAL];
};

export const getNextOrderStatuses = (currentStatus) => {
  const statusFlow = {
    [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.READY]: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.COMPLETED]: [],
    [ORDER_STATUS.CANCELLED]: []
  };

  return statusFlow[currentStatus] || [];
};

export const formatOrderNumber = (orderNumber) => {
  return orderNumber || 'N/A';
};

export const formatPrice = (price) => {
  if (!price || price === 0) return 'Free';
  return `${parseFloat(price).toFixed(2)} EGP`;
};

export const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => total + (item.subtotal || 0), 0);
};
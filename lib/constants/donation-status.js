// Donation status constants and utilities

export const DONATION_STATUS = {
  AVAILABLE: 'available',
  CLAIMED: 'claimed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
};

export const URGENCY_LEVELS = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const DONATION_CATEGORIES = {
  FOOD: 'food',
  CLOTHING: 'clothing',
  MEDICAL: 'medical',
  ELECTRONICS: 'electronics',
  FURNITURE: 'furniture',
  BOOKS: 'books',
  TOYS: 'toys',
  OTHER: 'other'
};

export const NOTIFICATION_TYPES = {
  STATUS_UPDATE: 'status_update',
  NEW_DONOR: 'new_donor',
  DELIVERY_SCHEDULED: 'delivery_scheduled',
  DELIVERY_COMPLETED: 'delivery_completed',
  REVIEW_RECEIVED: 'review_received'
};

// Status display configuration
export const STATUS_CONFIG = {
  [DONATION_STATUS.AVAILABLE]: {
    label: 'Available',
    color: 'bg-green-100 text-green-800',
    icon: '🟢',
    description: 'Available for donation'
  },
  [DONATION_STATUS.CLAIMED]: {
    label: 'Claimed',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🟡',
    description: 'Claimed by a donor'
  },
  [DONATION_STATUS.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800',
    icon: '🔵',
    description: 'Donation in progress'
  },
  [DONATION_STATUS.COMPLETED]: {
    label: 'Completed',
    color: 'bg-gray-100 text-gray-800',
    icon: '✅',
    description: 'Donation completed successfully'
  },
  [DONATION_STATUS.EXPIRED]: {
    label: 'Expired',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
    description: 'Donation expired'
  },
  [DONATION_STATUS.CANCELLED]: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
    description: 'Donation cancelled'
  }
};

// Urgency level configuration
export const URGENCY_CONFIG = {
  [URGENCY_LEVELS.LOW]: {
    label: 'Low Priority',
    color: 'bg-gray-100 text-gray-600',
    icon: '⭐',
    priority: 1
  },
  [URGENCY_LEVELS.MODERATE]: {
    label: 'Moderate',
    color: 'bg-blue-100 text-blue-600',
    icon: '⭐⭐',
    priority: 2
  },
  [URGENCY_LEVELS.HIGH]: {
    label: 'High Priority',
    color: 'bg-orange-100 text-orange-600',
    icon: '⭐⭐⭐',
    priority: 3
  },
  [URGENCY_LEVELS.URGENT]: {
    label: 'Urgent',
    color: 'bg-red-100 text-red-600',
    icon: '🚨',
    priority: 4
  }
};

// Category configuration
export const CATEGORY_CONFIG = {
  [DONATION_CATEGORIES.FOOD]: {
    label: 'Food & Beverages',
    icon: '🍎',
    color: 'bg-green-100 text-green-600'
  },
  [DONATION_CATEGORIES.CLOTHING]: {
    label: 'Clothing',
    icon: '👕',
    color: 'bg-blue-100 text-blue-600'
  },
  [DONATION_CATEGORIES.MEDICAL]: {
    label: 'Medical Supplies',
    icon: '💊',
    color: 'bg-red-100 text-red-600'
  },
  [DONATION_CATEGORIES.ELECTRONICS]: {
    label: 'Electronics',
    icon: '📱',
    color: 'bg-purple-100 text-purple-600'
  },
  [DONATION_CATEGORIES.FURNITURE]: {
    label: 'Furniture',
    icon: '🪑',
    color: 'bg-brown-100 text-brown-600'
  },
  [DONATION_CATEGORIES.BOOKS]: {
    label: 'Books & Education',
    icon: '📚',
    color: 'bg-indigo-100 text-indigo-600'
  },
  [DONATION_CATEGORIES.TOYS]: {
    label: 'Toys & Games',
    icon: '🧸',
    color: 'bg-pink-100 text-pink-600'
  },
  [DONATION_CATEGORIES.OTHER]: {
    label: 'Other',
    icon: '📦',
    color: 'bg-gray-100 text-gray-600'
  }
};

// Utility functions
export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG[DONATION_STATUS.AVAILABLE];
};

export const getUrgencyConfig = (urgency) => {
  return URGENCY_CONFIG[urgency] || URGENCY_CONFIG[URGENCY_LEVELS.MODERATE];
};

export const getCategoryConfig = (category) => {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG[DONATION_CATEGORIES.OTHER];
};

export const canUpdateStatus = (currentStatus, newStatus, userRole) => {
  const statusFlow = {
    [DONATION_STATUS.AVAILABLE]: [DONATION_STATUS.CLAIMED, DONATION_STATUS.EXPIRED, DONATION_STATUS.CANCELLED],
    [DONATION_STATUS.CLAIMED]: [DONATION_STATUS.IN_PROGRESS, DONATION_STATUS.CANCELLED, DONATION_STATUS.AVAILABLE],
    [DONATION_STATUS.IN_PROGRESS]: [DONATION_STATUS.COMPLETED, DONATION_STATUS.CANCELLED],
    [DONATION_STATUS.COMPLETED]: [], // Terminal state
    [DONATION_STATUS.EXPIRED]: [DONATION_STATUS.AVAILABLE], // Can be reactivated
    [DONATION_STATUS.CANCELLED]: [DONATION_STATUS.AVAILABLE] // Can be reactivated
  };

  return statusFlow[currentStatus]?.includes(newStatus) || false;
};

export const getNextPossibleStatuses = (currentStatus) => {
  const statusFlow = {
    [DONATION_STATUS.AVAILABLE]: [DONATION_STATUS.CLAIMED, DONATION_STATUS.EXPIRED, DONATION_STATUS.CANCELLED],
    [DONATION_STATUS.CLAIMED]: [DONATION_STATUS.IN_PROGRESS, DONATION_STATUS.CANCELLED, DONATION_STATUS.AVAILABLE],
    [DONATION_STATUS.IN_PROGRESS]: [DONATION_STATUS.COMPLETED, DONATION_STATUS.CANCELLED],
    [DONATION_STATUS.COMPLETED]: [],
    [DONATION_STATUS.EXPIRED]: [DONATION_STATUS.AVAILABLE],
    [DONATION_STATUS.CANCELLED]: [DONATION_STATUS.AVAILABLE]
  };

  return statusFlow[currentStatus] || [];
};

export const formatTimeAgo = (date) => {
  if (!date) return '';

  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return new Date(date).toLocaleDateString();
};
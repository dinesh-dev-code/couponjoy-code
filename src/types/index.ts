
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    categories: string[];
    stores: string[];
    notifications: {
      email: boolean;
      push: boolean;
      expiry: boolean;
      newDeals: boolean;
    };
  };
  savedCoupons: string[];
  pointsBalance: number;
  referralCode: string;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: {
    type: 'percentage' | 'fixed' | 'bogo';
    value: number;
  };
  store: {
    id: string;
    name: string;
    logo: string;
  };
  categories: string[];
  expiryDate: Date;
  terms?: string;
  isVerified: boolean;
  successRate: number;
  url?: string;
  usedCount: number;
  isPopular: boolean;
  isNew: boolean;
  isExpiringSoon: boolean;
  cashbackInfo?: {
    available: boolean;
    value: number;
    type: 'percentage' | 'fixed';
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  categories: string[];
  couponCount: number;
  isPopular: boolean;
  website: string;
}

export interface Notification {
  id: string;
  type: 'expiry' | 'new' | 'priceAlert' | 'system';
  title: string;
  message: string;
  couponId?: string;
  storeId?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface CashbackTransaction {
  id: string;
  userId: string;
  couponId: string;
  storeId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  transactionDate: Date;
  payoutDate?: Date;
}

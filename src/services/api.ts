
import { Coupon, User, Store, Category, Notification, CashbackTransaction } from '@/types';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// API helper function
const fetchAPI = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) =>
    fetchAPI<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  socialLogin: (provider: string, token: string) =>
    fetchAPI<{ user: User; token: string }>('/auth/social-login', {
      method: 'POST',
      body: JSON.stringify({ provider, token }),
    }),

  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),

  me: () => fetchAPI<User>('/auth/me'),
};

// Coupons API
export const couponsAPI = {
  getAll: (filters?: { 
    category?: string; 
    store?: string; 
    search?: string;
    isPopular?: boolean;
    isNew?: boolean;
    isExpiringSoon?: boolean;
  }) => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    
    return fetchAPI<{ coupons: Coupon[]; total: number }>(
      `/coupons?${params.toString()}`
    );
  },

  getById: (id: string) => fetchAPI<Coupon>(`/coupons/${id}`),

  getByStore: (storeId: string) =>
    fetchAPI<{ coupons: Coupon[]; store: Store }>(`/coupons/store/${storeId}`),

  getByCategory: (categoryId: string) =>
    fetchAPI<{ coupons: Coupon[]; category: Category }>(
      `/coupons/category/${categoryId}`
    ),

  getRecommended: () =>
    fetchAPI<{ coupons: Coupon[] }>('/coupons/recommended'),

  getPopular: () => fetchAPI<{ coupons: Coupon[] }>('/coupons/popular'),

  getExpiringSoon: () =>
    fetchAPI<{ coupons: Coupon[] }>('/coupons/expiring-soon'),
    
  searchCoupons: (query: string) =>
    fetchAPI<{ coupons: Coupon[]; total: number }>(`/coupons/search?q=${query}`),
    
  verifyCoupon: (id: string) =>
    fetchAPI<{ isValid: boolean }>(`/coupons/${id}/verify`, { method: 'POST' }),
    
  trackCouponUse: (id: string) =>
    fetchAPI<void>(`/coupons/${id}/use`, { method: 'POST' }),
};

// User API
export const userAPI = {
  getProfile: () => fetchAPI<User>('/user/profile'),

  updateProfile: (data: Partial<User>) =>
    fetchAPI<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getSavedCoupons: () =>
    fetchAPI<{ coupons: Coupon[] }>('/user/saved-coupons'),

  saveCoupon: (couponId: string) =>
    fetchAPI<void>(`/user/saved-coupons/${couponId}`, { method: 'POST' }),

  removeSavedCoupon: (couponId: string) =>
    fetchAPI<void>(`/user/saved-coupons/${couponId}`, { method: 'DELETE' }),

  getNotifications: () =>
    fetchAPI<{ notifications: Notification[] }>('/user/notifications'),

  markNotificationAsRead: (notificationId: string) =>
    fetchAPI<void>(`/user/notifications/${notificationId}/read`, {
      method: 'PUT',
    }),

  getCashbackTransactions: () =>
    fetchAPI<{ transactions: CashbackTransaction[] }>('/user/cashback'),
};

// Stores API
export const storesAPI = {
  getAll: () => fetchAPI<{ stores: Store[] }>('/stores'),
  getById: (id: string) => fetchAPI<Store>(`/stores/${id}`),
  getPopular: () => fetchAPI<{ stores: Store[] }>('/stores/popular'),
};

// Categories API
export const categoriesAPI = {
  getAll: () => fetchAPI<{ categories: Category[] }>('/categories'),
  getById: (id: string) => fetchAPI<Category>(`/categories/${id}`),
};

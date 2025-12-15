import { Product, Category, Order, SiteConfig, User } from '../types';

// In production/Vite proxy, relative path is handled correctly.
// No need for DIRECT_URL which causes issues in deployment.
const API_BASE = '/api';

const fetchJson = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    
    // Check Content-Type to avoid JSON.parse syntax errors on HTML responses (404/500)
    const contentType = res.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!res.ok) {
      if (isJson) {
        const errorData = await res.json();
        throw new Error(errorData.error || `API Error: ${res.statusText}`);
      }
      const textError = await res.text();
      throw new Error(`Server Error (${res.status}): ${textError.substring(0, 50)}...`);
    }

    if (isJson) {
      return res.json();
    }
    
    throw new Error("Invalid response format: Expected JSON");
  } catch (error: any) {
    console.error(`API Call Failed [${endpoint}]:`, error);
    throw error;
  }
};

export const api = {
  products: {
    list: () => fetchJson('/products'),
    create: (data: Product) => fetchJson('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: Product) => fetchJson(`/products/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/products/${id}`, { method: 'DELETE' }),
    like: (id: string, increment: boolean) => fetchJson(`/products/${id}/like`, { method: 'POST', body: JSON.stringify({ increment }) }),
  },
  categories: {
    list: () => fetchJson('/categories'),
    create: (data: Category) => fetchJson('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: Category) => fetchJson(`/categories/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/categories/${id}`, { method: 'DELETE' }),
  },
  orders: {
    list: () => fetchJson('/orders'),
    create: (data: any) => fetchJson('/orders', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => fetchJson(`/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  },
  config: {
    get: () => fetchJson('/config'),
    save: (data: SiteConfig) => fetchJson('/config', { method: 'POST', body: JSON.stringify(data) }),
  },
  auth: {
    login: (creds: any) => fetchJson('/auth/login', { method: 'POST', body: JSON.stringify(creds) }),
  },
  users: {
    list: () => fetchJson('/users'),
    create: (data: Partial<User> & { password: string }) => fetchJson('/users', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/users/${id}`, { method: 'DELETE' }),
    updatePassword: (id: string, password: string) => fetchJson(`/users/${id}/password`, { method: 'PUT', body: JSON.stringify({ password }) }),
  },
  logs: {
    track: (data?: { path: string }) => fetchJson('/logs/track', { method: 'POST', body: JSON.stringify(data) }),
    list: () => fetchJson('/logs'),
  },
  firewall: {
    list: () => fetchJson('/firewall'),
    block: (ip: string) => fetchJson('/firewall/block', { method: 'POST', body: JSON.stringify({ ip }) }),
    unblock: (ip: string) => fetchJson('/firewall/unblock', { method: 'POST', body: JSON.stringify({ ip }) }),
  }
};
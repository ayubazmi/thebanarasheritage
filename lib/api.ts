import { Product, Category, Order, SiteConfig, User } from '../types';

const PROXY_URL = '/api';
const DIRECT_URL = 'http://localhost:5000/api';

const fetchJson = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const res = await fetch(`${PROXY_URL}${endpoint}`, { ...options, headers });
    const contentType = res.headers.get("content-type");
    if (res.status === 404 && contentType && contentType.includes("text/html")) throw new Error("Proxy failed");
    if (res.status === 403) throw new Error("Access Denied: Your IP is blocked.");
    if (!res.ok) {
      const errorText = await res.text();
      // Try to parse JSON error first
      try {
        const jsonError = JSON.parse(errorText);
        throw new Error(jsonError.error || res.statusText);
      } catch (e) {
        throw new Error(errorText || res.statusText);
      }
    }
    return res.json();
  } catch (error: any) {
    if (error.message === "Proxy failed" || error.message.includes("404")) {
      console.warn("Proxy failed, attempting direct connection...");
      const directRes = await fetch(`${DIRECT_URL}${endpoint}`, { ...options, headers });
      if (!directRes.ok) {
        const errText = await directRes.text();
        throw new Error(errText);
      }
      return directRes.json();
    }
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
    track: () => fetchJson('/logs/track', { method: 'POST' }),
    list: () => fetchJson('/logs'),
  },
  firewall: {
    list: () => fetchJson('/firewall'),
    block: (ip: string) => fetchJson('/firewall/block', { method: 'POST', body: JSON.stringify({ ip }) }),
    unblock: (ip: string) => fetchJson('/firewall/unblock', { method: 'POST', body: JSON.stringify({ ip }) }),
  }
};
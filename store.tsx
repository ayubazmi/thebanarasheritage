import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, CartItem, Category, SiteConfig, User, AccessLog } from './types';
import { api } from './lib/api';

interface StoreContextType {
  // Data
  products: Product[];
  categories: Category[];
  orders: Order[];
  config: SiteConfig;
  users: User[]; 
  logs: AccessLog[]; // New
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  updateConfig: (config: SiteConfig) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  
  // User Management
  addUser: (data: Partial<User> & { password: string }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  changeUserPassword: (id: string, pass: string) => Promise<void>;

  // Logs
  fetchLogs: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string, size: string, color: string) => void;
  updateCartQuantity: (itemId: string, size: string, color: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  placeOrder: (customerDetails: any) => Promise<void>;

  // Wishlist
  wishlist: string[]; 
  toggleWishlist: (productId: string) => void;

  // Auth
  user: User | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [config, setConfig] = useState<SiteConfig>({} as SiteConfig);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('lumiere_user');
    try { return savedUser ? JSON.parse(savedUser) : null; } catch (e) { return null; }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('lumiere_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  useEffect(() => {
    localStorage.setItem('lumiere_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [prods, cats, ords, conf] = await Promise.all([
        api.products.list(),
        api.categories.list(),
        api.orders.list(),
        api.config.get()
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setConfig(conf);
    } catch (error: any) {
      console.error("❌ Backend Connection Failed:", error);
      setError(error.message || "Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      api.users.list().then(setUsers).catch(console.error);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, []);

  // --- Actions ---
  const addProduct = async (product: Product) => {
    const saved = await api.products.create(product);
    setProducts(prev => [saved, ...prev]);
  };

  const updateProduct = async (updated: Product) => {
    const saved = await api.products.update(updated);
    setProducts(prev => prev.map(p => p.id === saved.id ? saved : p));
  };

  const deleteProduct = async (id: string) => {
    await api.products.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = async (cat: Category) => {
    const saved = await api.categories.create(cat);
    setCategories(prev => [...prev, saved]);
  };

  const updateCategory = async (cat: Category) => {
    const saved = await api.categories.update(cat);
    setCategories(prev => prev.map(c => c.id === saved.id ? saved : c));
  };

  const deleteCategory = async (id: string) => {
    await api.categories.delete(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateConfig = async (newConfig: SiteConfig) => {
    const saved = await api.config.save(newConfig);
    setConfig(saved);
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const saved = await api.orders.updateStatus(id, status);
    setOrders(prev => prev.map(o => o.id === saved.id ? saved : o));
  };

  const addUser = async (data: any) => {
    const newUser = await api.users.create(data);
    setUsers(prev => [...prev, newUser]);
  };
  
  const deleteUser = async (id: string) => {
    await api.users.delete(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };
  
  const changeUserPassword = async (id: string, pass: string) => {
    await api.users.updatePassword(id, pass);
  };

  const fetchLogs = async () => {
    // Basic implementation since api wrapper doesn't have logs yet, mocking fetch
    const res = await fetch('http://localhost:5000/api/logs'); 
    const data = await res.json();
    setLogs(data);
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor);
      if (existing) return prev.map(i => i === existing ? { ...i, quantity: i.quantity + item.quantity } : i);
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.selectedSize === size && i.selectedColor === color)));
  };

  const updateCartQuantity = (id: string, size: string, color: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id && i.selectedSize === size && i.selectedColor === color) return { ...i, quantity: Math.max(1, i.quantity + delta) };
      return i;
    }));
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + ((item.discountPrice || item.price) * item.quantity), 0);

  const placeOrder = async (details: any) => {
    const orderData: any = {
      customerName: details.name,
      email: details.email,
      shippingAddress: details,
      items: cart,
      total: cartTotal,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    const saved = await api.orders.create(orderData);
    setOrders(prev => [saved, ...prev]);
    clearCart();
  };

  const toggleWishlist = async (productId: string) => {
    const isLiked = wishlist.includes(productId);
    setWishlist(prev => isLiked ? prev.filter(id => id !== productId) : [...prev, productId]);
    try {
        const updatedProduct = await api.products.like(productId, !isLiked);
        setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
    } catch (err) {
        console.error("Failed to sync like status", err);
    }
  };

  const login = async (u: string, p: string) => {
    const userData = await api.auth.login({ username: u, password: p });
    setUser(userData);
    localStorage.setItem('lumiere_user', JSON.stringify(userData));
  };

  const logout = () => { 
    setUser(null); 
    localStorage.removeItem('lumiere_user');
  };

  return (
    <StoreContext.Provider value={{
      products, categories, orders, config, users, logs, isLoading, error,
      addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, deleteCategory,
      updateConfig, updateOrderStatus,
      addUser, deleteUser, changeUserPassword,
      fetchLogs,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, placeOrder,
      wishlist, toggleWishlist,
      user, login, logout
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
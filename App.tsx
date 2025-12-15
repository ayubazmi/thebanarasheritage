import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider, useStore } from './store';
import { PublicLayout, AdminLayout } from './layouts';
import { 
  HomePage, ShopPage, ProductDetailPage, CartPage, CheckoutPage, AboutPage, ContactPage 
} from './pages/public';
import { AdminLogin, AdminDashboard, AdminProducts, AdminOrders, AdminSettings, AdminCategories, AdminUsers } from './pages/admin';
import { Button } from './components/ui';
import { AlertTriangle } from 'lucide-react';

// Wrapper to handle global loading state and layout
const MainContent: React.FC = () => {
  const { isLoading, error } = useStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900 mb-4"></div>
        <p className="text-brand-900 font-serif">Loading LUMIÈRE...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-50 p-6 text-center">
        <div className="bg-rose-100 p-4 rounded-full text-rose-600 mb-6">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-brand-900 mb-2">Connection Failed</h1>
        <p className="text-brand-800/70 mb-8 max-w-md leading-relaxed">
          We couldn't connect to the backend server. Please ensure the backend is running and your database connection is valid.
        </p>
        
        <div className="bg-white border border-rose-200 p-4 rounded-md text-xs text-left font-mono text-rose-700 mb-8 max-w-lg w-full overflow-auto shadow-sm">
          Error: {error}
        </div>
        
        <Button onClick={() => window.location.reload()} size="lg">
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="admin/login" element={<AdminLogin />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
};

export default App;
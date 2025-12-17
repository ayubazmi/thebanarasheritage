import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider, useStore } from './store';
import { PublicLayout, AdminLayout } from './layouts';
import { 
  HomePage, ShopPage, ProductDetailPage, CartPage, CheckoutPage, AboutPage, ContactPage, DynamicPage 
} from './pages/public';
import { AdminLogin, AdminDashboard, AdminProducts, AdminOrders, AdminSettings, AdminCategories, AdminUsers, AdminLogs, AdminDeveloperSettings, AdminPages } from './pages/admin';
import { Button } from './components/ui';
import { AlertTriangle } from 'lucide-react';
import { SiteConfig } from './types';

// Helper to convert hex to rgb (simple implementation for Tailwind opacity support if needed, but here we just use hex)
// For robust tailwind opacity support with variables, one usually sends 123 123 123.
// However, direct hex replacement works for solid colors.
const applyTheme = (config: SiteConfig) => {
  if (!config.theme) return;

  const root = document.documentElement;
  
  // Colors
  root.style.setProperty('--color-primary', config.theme.primaryColor); // 900
  root.style.setProperty('--color-primary-800', adjustBrightness(config.theme.primaryColor, 20)); // Simulated 800

  root.style.setProperty('--color-secondary', config.theme.secondaryColor); // 200
  root.style.setProperty('--color-secondary-300', adjustBrightness(config.theme.secondaryColor, -10)); // 300
  root.style.setProperty('--color-secondary-100', adjustBrightness(config.theme.secondaryColor, 20)); // 100

  root.style.setProperty('--color-bg', config.theme.backgroundColor); // 50
  
  // Fonts
  root.style.setProperty('--font-sans', config.theme.fontFamilySans);
  root.style.setProperty('--font-serif', config.theme.fontFamilySerif);

  // Border Radius
  root.style.setProperty('--border-radius', config.theme.borderRadius);
};

// Simple brightness adjuster for hex colors
function adjustBrightness(col: string, amt: number) {
  let usePound = false;
  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }
  let num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

// Wrapper to handle global loading state and layout
const MainContent: React.FC = () => {
  const { isLoading, error, config } = useStore();

  // Dynamic Browser Title & Theme
  useEffect(() => {
    if (config) {
      if (config.siteName) document.title = `${config.siteName} | Modern Fashion`;
      applyTheme(config);
    }
  }, [config]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900 mb-4"></div>
        <p className="text-brand-900 font-serif">Loading...</p>
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
          <Route path="pages/:slug" element={<DynamicPage />} />
          <Route path="admin/login" element={<AdminLogin />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="developer" element={<AdminDeveloperSettings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="logs" element={<AdminLogs />} />
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
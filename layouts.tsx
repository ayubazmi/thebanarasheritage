import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Search, LayoutDashboard, Package, ShoppingCart, LogOut, Settings, List, Users, PenTool, Facebook, Instagram, Twitter } from 'lucide-react';
import { useStore } from './store';
import { api } from './lib/api';

// --- Public Navbar ---
export const Navbar: React.FC = () => {
  const { cart, config } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const layout = config.navbarLayout || 'center'; 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10); // Faster trigger
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const Logo = () => (
    <Link to="/" className="z-50 shrink-0">
      {config.logo ? (
        <img src={config.logo} alt="LUMIÈRE" className="h-8 object-contain" />
      ) : (
        <span className="text-xl font-serif tracking-[0.2em] font-bold text-brand-900">LUMIÈRE</span>
      )}
    </Link>
  );

  const Links = () => (
    <div className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-widest text-brand-900">
      <Link to="/" className="hover:opacity-60 transition-opacity">HOME</Link>
      <Link to="/shop" className="hover:opacity-60 transition-opacity">SHOP</Link>
      <Link to="/about" className="hover:opacity-60 transition-opacity">STORY</Link>
      <Link to="/contact" className="hover:opacity-60 transition-opacity">CONTACT</Link>
    </div>
  );

  const Icons = () => (
    <div className="flex items-center space-x-6 text-brand-900 z-50 shrink-0">
      <Link to="/shop" className="hidden md:block hover:opacity-60 transition-opacity"><Search size={18} strokeWidth={1.5} /></Link>
      <Link to="/admin" className="hover:opacity-60 transition-opacity"><User size={18} strokeWidth={1.5} /></Link>
      <div className="relative cursor-pointer hover:opacity-60 transition-opacity" onClick={() => navigate('/cart')}>
        <ShoppingBag size={18} strokeWidth={1.5} />
        {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full">{cart.length}</span>}
      </div>
      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={20} /> : <Menu size={20} />}</button>
    </div>
  );

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-200 border-b ${scrolled || isOpen || location.pathname !== '/' ? 'bg-white border-brand-200 py-3' : 'bg-transparent border-transparent py-5'}`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center relative h-10">
             {layout === 'left' && (
               <>
                 <div className="flex items-center gap-12">
                   <Logo />
                   <Links />
                 </div>
                 <Icons />
               </>
             )}
             {layout === 'center' && (
               <>
                 <Logo />
                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Links />
                 </div>
                 <Icons />
               </>
             )}
             {layout === 'right' && (
                <>
                  <Logo />
                  <div className="flex items-center gap-8">
                    <Links />
                    <Icons />
                  </div>
                </>
             )}
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center space-y-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <Link to="/" className="text-2xl font-serif hover:text-gray-600">Home</Link>
        <Link to="/shop" className="text-2xl font-serif hover:text-gray-600">Shop</Link>
        <Link to="/about" className="text-2xl font-serif hover:text-gray-600">About</Link>
        <Link to="/contact" className="text-2xl font-serif hover:text-gray-600">Contact</Link>
      </div>
    </>
  );
};

// --- Footer ---
export const Footer: React.FC = () => {
  const { config } = useStore();
  
  // Footer Styles
  const bg = config.footerColors?.background || '#ffffff';
  const text = config.footerColors?.text || '#111827';
  const border = config.footerColors?.border || '#e5e7eb';

  return (
    <footer style={{ backgroundColor: bg, color: text, borderTop: `1px solid ${border}` }} className="pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            {config.footerLogo ? (
                <img src={config.footerLogo} className="h-8 object-contain mb-4" alt="Logo" />
            ) : (
                <h3 className="text-xl font-serif font-bold tracking-wider">LUMIÈRE</h3>
            )}
            <p className="text-sm leading-relaxed max-w-xs opacity-70">
              {config.footerDescription || 'Timeless elegance for the modern muse.'}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Explore</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="/shop?cat=new" className="hover:opacity-100 transition">New Arrivals</Link></li>
              <li><Link to="/shop?cat=kurtis" className="hover:opacity-100 transition">Kurtis</Link></li>
              <li><Link to="/shop?cat=dresses" className="hover:opacity-100 transition">Dresses</Link></li>
              <li><Link to="/shop?cat=sale" className="hover:opacity-100 transition">Sale</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Service</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="/contact" className="hover:opacity-100">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:opacity-100">Shipping</Link></li>
              <li><Link to="/returns" className="hover:opacity-100">Returns</Link></li>
              <li><Link to="/faq" className="hover:opacity-100">FAQ</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Newsletter</h4>
             <div className="flex border-b pb-2" style={{ borderColor: border }}>
               <input type="email" placeholder="Email Address" className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400" />
               <button className="text-xs font-bold uppercase hover:opacity-60">Join</button>
             </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest opacity-60">
          <p>{config.footerCopyright || '© 2024 Lumière Fashion.'}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             {config.socialInstagram && <a href={config.socialInstagram} className="hover:opacity-100">Instagram</a>}
             {config.socialFacebook && <a href={config.socialFacebook} className="hover:opacity-100">Facebook</a>}
             {config.socialWhatsapp && <a href={config.socialWhatsapp} className="hover:opacity-100">WhatsApp</a>}
          </div>
        </div>
      </div>
    </footer>
  );
};

export const PublicLayout: React.FC = () => {
  // Visitor Tracking Logic
  const hasTracked = useRef(false);

  useEffect(() => {
    // Check if we have already tracked this session in memory to avoid spamming the backend on every route change
    // For a real production app, you might want to track every page view, but for "Visitor Log" once per session is usually enough.
    if (!hasTracked.current && !sessionStorage.getItem('lumiere_visit_tracked')) {
      api.logs.track().catch(err => console.error("Tracking failed", err));
      sessionStorage.setItem('lumiere_visit_tracked', 'true');
      hasTracked.current = true;
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-brand-50">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// --- Admin Layout ---
export const AdminLayout: React.FC = () => {
  const { logout, user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/admin/login');
  }, [user, navigate]);

  if (!user) return null;

  const hasPerm = (perm: string) => user.role === 'admin' || user.permissions.includes(perm);

  const NavItem = ({ to, icon: Icon, label, perm }: { to: string, icon: any, label: string, perm?: string }) => {
    const active = useLocation().pathname === to;
    if (perm && !hasPerm(perm)) return null;
    return (
      <Link to={to} className={`flex items-center space-x-3 px-3 py-2 rounded-sm transition-colors text-sm ${active ? 'bg-gray-100 text-black font-medium' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}>
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-white">
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
           <Link to="/" className="text-lg font-serif font-bold tracking-widest">LUMIÈRE</Link>
           <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Admin Dashboard</div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavItem to="/admin" icon={LayoutDashboard} label="Overview" />
          <NavItem to="/admin/products" icon={Package} label="Products" perm="products" />
          <NavItem to="/admin/orders" icon={ShoppingCart} label="Orders" perm="orders" />
          <NavItem to="/admin/categories" icon={List} label="Categories" perm="categories" />
          <NavItem to="/admin/settings" icon={Settings} label="Content & Settings" perm="settings" />
          <NavItem to="/admin/users" icon={Users} label="Users" perm="users" />
          <NavItem to="/admin/developer" icon={PenTool} label="Builder & Logs" perm="settings" />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center space-x-3 px-3 py-2 w-full text-gray-500 hover:text-rose-600 transition text-sm">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50/50 p-8">
        <div className="max-w-6xl mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
};
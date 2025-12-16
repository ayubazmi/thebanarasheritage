import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Search, LayoutDashboard, Package, ShoppingCart, LogOut, Settings, List, Users, FileText, Code2, Star, Sparkles } from 'lucide-react';
import { useStore } from './store';

// --- Announcement Bar ---
const AnnouncementBar: React.FC = () => {
  const { config } = useStore();
  if (!config.announcementEnabled || !config.announcementText) return null;

  const bgColor = config.announcementBgColor || '#2C251F';
  const textColor = config.announcementTextColor || '#FFFFFF';

  return (
    <div 
      className="text-xs md:text-sm py-2.5 px-4 text-center tracking-wide relative z-[60] overflow-hidden group"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Shimmer Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-center gap-2">
        <Sparkles size={14} className="animate-pulse" style={{ color: textColor }} />
        {config.announcementLink ? (
          <Link to={config.announcementLink} className="hover:opacity-80 transition-opacity font-medium flex items-center gap-2">
            {config.announcementText}
            <span className="hidden md:inline-block border-b leading-none" style={{ borderColor: `${textColor}80` }}>Shop Now</span>
          </Link>
        ) : (
          <span className="font-medium">{config.announcementText}</span>
        )}
        <Sparkles size={14} className="animate-pulse" style={{ color: textColor }} />
      </div>
    </div>
  );
};

// --- Public Navbar ---
export const Navbar: React.FC = () => {
  const { cart, config } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 top-0 ${config.announcementEnabled ? 'mt-[36px] md:mt-[40px]' : ''} ${scrolled || isOpen ? 'bg-white/95 backdrop-blur-sm shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="z-50">
            {config.logo ? (
              <img src={config.logo} alt={config.siteName || "LUMIÈRE"} className="h-10 object-contain" />
            ) : (
              <span className="text-2xl font-serif tracking-widest font-bold text-brand-900">{config.siteName || "LUMIÈRE"}</span>
            )}
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide text-brand-900">
            <Link to="/" className="hover:text-brand-800/70 transition">HOME</Link>
            <Link to="/shop" className="hover:text-brand-800/70 transition">SHOP</Link>
            <Link to="/about" className="hover:text-brand-800/70 transition">ABOUT</Link>
            <Link to="/contact" className="hover:text-brand-800/70 transition">CONTACT</Link>
          </div>
          <div className="flex items-center space-x-5 text-brand-900 z-50">
            <Link to="/shop" className="hidden md:block hover:text-brand-800/70"><Search size={20} /></Link>
            <Link to="/admin" className="hover:text-brand-800/70"><User size={20} /></Link>
            <div className="relative cursor-pointer hover:text-brand-800/70" onClick={() => navigate('/cart')}>
              <ShoppingBag size={20} />
              {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-brand-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{cart.length}</span>}
            </div>
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </nav>
      <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center space-y-8 text-xl font-serif ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <Link to="/shop" className="hover:text-brand-600">Shop</Link>
        <Link to="/about" className="hover:text-brand-600">About</Link>
        <Link to="/contact" className="hover:text-brand-600">Contact</Link>
      </div>
    </>
  );
};

// --- Footer ---
export const Footer: React.FC = () => {
  const { config } = useStore();
  
  const bgColor = config.footerBgColor || '#2C251F';
  const textColor = config.footerTextColor || '#D5CDC0';

  return (
    <footer className="pt-16 pb-8 transition-colors duration-300" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-6" style={{ color: textColor }}>{config.siteName || "LUMIÈRE"}</h3>
            <p className="leading-relaxed text-sm opacity-80">
              {config.aboutContent ? config.aboutContent.substring(0, 150) + '...' : 'Redefining contemporary fashion with timeless elegance.'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-6 tracking-wide uppercase" style={{ color: textColor }}>{config.footerShopTitle || 'SHOP'}</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li><Link to={config.footerLink1Url || '/shop?cat=new'} className="hover:opacity-100 hover:underline transition">{config.footerLink1Label || 'New Arrivals'}</Link></li>
              <li><Link to={config.footerLink2Url || '/shop?cat=kurtis'} className="hover:opacity-100 hover:underline transition">{config.footerLink2Label || 'Kurtis'}</Link></li>
              <li><Link to={config.footerLink3Url || '/shop?cat=dresses'} className="hover:opacity-100 hover:underline transition">{config.footerLink3Label || 'Dresses'}</Link></li>
              <li><Link to={config.footerLink4Url || '/shop?cat=sale'} className="hover:opacity-100 hover:underline transition">{config.footerLink4Label || 'Sale'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 tracking-wide" style={{ color: textColor }}>CONTACT</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li>{config.contactAddress || '123 Fashion Ave, NY'}</li>
              <li>{config.contactPhone || '+1 (555) 123-4567'}</li>
              <li>{config.contactEmail || 'support@lumiere.com'}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 tracking-wide uppercase" style={{ color: textColor }}>{config.footerNewsletterTitle || 'STAY IN TOUCH'}</h4>
            <div className="flex space-x-2 mb-4">
              <input 
                type="email" 
                placeholder={config.footerNewsletterPlaceholder || 'Your email'} 
                className="bg-white/10 border border-white/20 px-4 py-2 text-sm w-full focus:outline-none focus:border-white/50" 
                style={{ color: 'inherit' }}
              />
              <button 
                className="px-4 py-2 text-sm font-medium hover:opacity-90 transition bg-white text-brand-900"
              >
                {config.footerNewsletterButtonText || 'JOIN'}
              </button>
            </div>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-60" style={{ borderColor: `${textColor}30` }}>
          <p>© 2024 {config.siteName || "Lumière Fashion"}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:opacity-100">Privacy Policy</Link>
            <Link to="/terms" className="hover:opacity-100">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const PublicLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <AnnouncementBar />
    <Navbar />
    <main className="flex-grow pt-20 md:pt-24 pb-12">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// --- Admin Layout ---
export const AdminLayout: React.FC = () => {
  const { logout, user, config } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/admin/login');
  }, [user, navigate]);

  if (!user) return null;

  // RBAC Helper
  const hasPerm = (perm: string) => user.role === 'admin' || user.permissions.includes(perm);

  const NavItem = ({ to, icon: Icon, label, perm }: { to: string, icon: any, label: string, perm?: string }) => {
    const active = useLocation().pathname === to;
    if (perm && !hasPerm(perm)) return null;
    return (
      <Link to={to} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-brand-900 text-white' : 'text-brand-900 hover:bg-brand-100'}`}>
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-brand-50">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-8">
           <Link to="/" className="text-xl font-serif font-bold text-brand-900 tracking-wider">{config.siteName || "LUMIÈRE"}</Link>
           <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Admin Panel</div>
           <div className="text-xs text-brand-800 font-bold mt-2">Hi, {user.username}</div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/admin/products" icon={Package} label="Products" perm="products" />
          <NavItem to="/admin/orders" icon={ShoppingCart} label="Orders" perm="orders" />
          <NavItem to="/admin/categories" icon={List} label="Categories" perm="categories" />
          <NavItem to="/admin/users" icon={Users} label="User Management" perm="users" />
          <NavItem to="/admin/logs" icon={FileText} label="Visitor Logs" perm="users" />
          <NavItem to="/admin/settings" icon={Settings} label="Content & Settings" perm="settings" />
          <NavItem to="/admin/developer" icon={Code2} label="Developer Settings" perm="settings" />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center space-x-3 px-4 py-3 w-full text-rose-600 hover:bg-rose-50 rounded-lg transition">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};
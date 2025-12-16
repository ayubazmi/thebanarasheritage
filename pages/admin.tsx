import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, SectionHeader } from '../components/ui';
import { Product, Category, User, SiteConfig, HeroSlide, SliderImage } from '../types';
import { 
  Plus, Trash, Edit, Package, ShoppingCart, DollarSign, TrendingUp, 
  Upload, Image as ImageIcon, X, Settings, List, Layout, User as UserIcon, Lock, Megaphone, Video, Hexagon, Type, ShieldCheck, Share2, Heart,
  FileText, Footprints, Palette, Code2, ArrowUp, ArrowDown, Move, RotateCcw, Bell, MonitorPlay, Images, Layers, Eye, EyeOff
} from 'lucide-react';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000';
const DEFAULT_PROMO_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';

// --- Login ---
export const AdminLogin: React.FC = () => {
  const { login, user } = useStore();
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if(user) {
     navigate('/admin');
     return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(creds.user, creds.pass);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-serif font-bold text-center mb-6">Admin Portal</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input label="Username" value={creds.user} onChange={e => setCreds({...creds, user: e.target.value})} />
          <Input type="password" label="Password" value={creds.pass} onChange={e => setCreds({...creds, pass: e.target.value})} />
          {error && <p className="text-rose-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" isLoading={isLoading}>Login</Button>
        </form>
        <p className="text-xs text-center text-gray-400 mt-4">Demo: admin / admin</p>
      </div>
    </div>
  );
};

// --- Dashboard Overview ---
export const AdminDashboard: React.FC = () => {
  const { products, orders } = useStore();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded shadow-sm flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color} text-white`}><Icon size={24} /></div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-brand-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`$${totalRevenue}`} icon={DollarSign} color="bg-emerald-500" />
        <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} color="bg-blue-500" />
        <StatCard title="Products" value={products.length} icon={Package} color="bg-indigo-500" />
      </div>

      <div className="bg-white rounded shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="bg-white border-b">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">${order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center py-4 text-gray-500">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
};

// --- Logs Component ---
export const AdminLogs: React.FC = () => {
  const { logs, fetchLogs } = useStore();
  
  // Fetch logs on mount
  useEffect(() => { fetchLogs(); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold">Visitor Logs</h1>
        <Button onClick={fetchLogs}><FileText size={16} className="mr-2" /> Refresh Logs</Button>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase">
               <tr>
                 <th className="px-6 py-4">Time</th>
                 <th className="px-6 py-4">Client</th>
                 <th className="px-6 py-4">Host / Subnet</th>
                 <th className="px-6 py-4">Device Details</th>
               </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                   <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                     {new Date(log.timestamp).toLocaleString()}
                   </td>
                   <td className="px-6 py-4 font-mono font-medium text-brand-900">
                     <div>{log.ip}</div>
                     <div className="text-xs text-gray-400">Port: {log.port || 'N/A'}</div>
                   </td>
                   <td className="px-6 py-4 font-mono text-xs text-gray-600">
                     {log.hostname || 'N/A'}
                   </td>
                   <td className="px-6 py-4 text-gray-500 truncate max-w-xs text-xs" title={log.userAgent}>
                     {log.userAgent}
                   </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">No logs found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Settings Manager (Content & Basic Settings) ---
export const AdminSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState(config);
  
  useEffect(() => {
    if (config && Object.keys(config).length > 0) {
      setLocalConfig(prev => ({...config, ...prev})); 
      setLocalConfig(config);
    }
  }, [config]);

  const handleSave = () => {
    updateConfig(localConfig);
    alert('Settings saved successfully!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalConfig(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalConfig(prev => ({ ...prev, heroImage: reader.result as string, heroVideo: undefined })); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Video too large! Max 10MB for direct upload. Use a URL for larger videos.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalConfig(prev => ({ ...prev, heroVideo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePromoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalConfig(prev => ({ ...prev, promoImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold">Content & Settings</h1>
      </div>
      
      <div className="space-y-8">
        
        {/* Brand Identity */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center"><Hexagon className="mr-2" size={20}/> Brand Identity</h3>
          <div className="flex flex-col gap-6">
            <Input label="Website Name" value={localConfig.siteName || ''} placeholder="LUMIÈRE" onChange={e => setLocalConfig({...localConfig, siteName: e.target.value})} />
            
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-gray-100 border rounded flex items-center justify-center overflow-hidden relative group">
                 {localConfig.logo ? (
                   <>
                     <img src={localConfig.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                     <button 
                       onClick={() => setLocalConfig({...localConfig, logo: ''})}
                       className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                       title="Delete Logo"
                     >
                       <Trash size={16} />
                     </button>
                   </>
                 ) : (
                   <span className="text-xs text-gray-400">No Logo</span>
                 )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Upload Website Logo</label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100 w-fit">
                  <Upload size={16}/> Choose Logo
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Configuration (Moved to Top for Visibility) */}
        <div className="bg-white p-8 rounded shadow-sm border-l-4 border-blue-500">
          <h3 className="font-bold text-lg mb-4 flex items-center text-blue-800"><Footprints className="mr-2" size={20}/> Footer Configuration (Shop & Contact)</h3>
          
          <div className="space-y-6">
            {/* Shop Links */}
            <div>
                <Input label="Footer Shop Section Title" value={localConfig.footerShopTitle || 'SHOP'} placeholder="SHOP" onChange={e => setLocalConfig({...localConfig, footerShopTitle: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded">
                    <p className="col-span-2 text-xs font-bold text-gray-500 uppercase">Footer Links (Title & URL)</p>
                    <Input label="Link 1 Text" value={localConfig.footerLink1Label || ''} placeholder="New Arrivals" onChange={e => setLocalConfig({...localConfig, footerLink1Label: e.target.value})} />
                    <Input label="Link 1 URL" value={localConfig.footerLink1Url || ''} placeholder="/shop?cat=new" onChange={e => setLocalConfig({...localConfig, footerLink1Url: e.target.value})} />
                    
                    <Input label="Link 2 Text" value={localConfig.footerLink2Label || ''} placeholder="Kurtis" onChange={e => setLocalConfig({...localConfig, footerLink2Label: e.target.value})} />
                    <Input label="Link 2 URL" value={localConfig.footerLink2Url || ''} placeholder="/shop?cat=kurtis" onChange={e => setLocalConfig({...localConfig, footerLink2Url: e.target.value})} />

                    <Input label="Link 3 Text" value={localConfig.footerLink3Label || ''} placeholder="Dresses" onChange={e => setLocalConfig({...localConfig, footerLink3Label: e.target.value})} />
                    <Input label="Link 3 URL" value={localConfig.footerLink3Url || ''} placeholder="/shop?cat=dresses" onChange={e => setLocalConfig({...localConfig, footerLink3Url: e.target.value})} />

                    <Input label="Link 4 Text" value={localConfig.footerLink4Label || ''} placeholder="Sale" onChange={e => setLocalConfig({...localConfig, footerLink4Label: e.target.value})} />
                    <Input label="Link 4 URL" value={localConfig.footerLink4Url || ''} placeholder="/shop?cat=sale" onChange={e => setLocalConfig({...localConfig, footerLink4Url: e.target.value})} />
                </div>
            </div>

            {/* Newsletter */}
            <div className="pt-4 border-t">
                <h4 className="font-bold text-sm mb-2 text-gray-600 uppercase">Newsletter Section (Stay in Touch)</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    <Input label="Section Title" value={localConfig.footerNewsletterTitle || ''} placeholder="STAY IN TOUCH" onChange={e => setLocalConfig({...localConfig, footerNewsletterTitle: e.target.value})} />
                    <Input label="Input Placeholder" value={localConfig.footerNewsletterPlaceholder || ''} placeholder="Your email" onChange={e => setLocalConfig({...localConfig, footerNewsletterPlaceholder: e.target.value})} />
                    <Input label="Button Text" value={localConfig.footerNewsletterButtonText || ''} placeholder="JOIN" onChange={e => setLocalConfig({...localConfig, footerNewsletterButtonText: e.target.value})} />
                </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center"><Layout className="mr-2" size={20}/> Homepage Hero Banner (Static Mode Config)</h3>
          <p className="text-sm text-gray-500 mb-4 italic">Note: Use "Developer Settings" to enable Carousel Mode.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Input label="Hero Tagline (Top Text)" value={localConfig.heroTagline || ''} onChange={e => setLocalConfig({...localConfig, heroTagline: e.target.value})} placeholder="e.g. New Collection" />
              <Input label="Hero Title (Main)" value={localConfig.heroTitle} onChange={e => setLocalConfig({...localConfig, heroTitle: e.target.value})} />
              <Input label="Hero Subtitle" value={localConfig.heroSubtitle} onChange={e => setLocalConfig({...localConfig, heroSubtitle: e.target.value})} />
              
              <div className="border-t pt-4 mt-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Background Media</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Image Upload</label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100 w-fit">
                      <Upload size={16}/> Choose Image
                      <input type="file" className="hidden" accept="image/*" onChange={handleHeroUpload} />
                    </label>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">OR USE VIDEO</span></div>
                  </div>

                  <Input 
                    label="Video URL (YouTube/MP4 Link)" 
                    placeholder="https://..." 
                    value={localConfig.heroVideo && !localConfig.heroVideo.startsWith('data:') ? localConfig.heroVideo : ''} 
                    onChange={e => setLocalConfig({...localConfig, heroVideo: e.target.value})} 
                  />
                  
                   <div>
                    <label className="block text-sm font-medium mb-1">Video Upload (Max 10MB)</label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100 w-fit">
                      <Video size={16}/> Upload Short Video
                      <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="aspect-video bg-gray-100 rounded overflow-hidden relative border group">
               {localConfig.heroVideo ? (
                 <>
                   <video src={localConfig.heroVideo} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                   <button 
                     onClick={() => setLocalConfig({...localConfig, heroVideo: ''})}
                     className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                     title="Remove Video"
                   >
                     <Trash size={32} />
                   </button>
                 </>
               ) : (
                 <>
                   <img 
                     src={localConfig.heroImage || DEFAULT_HERO_IMAGE} 
                     className="w-full h-full object-cover" 
                     alt="Hero Preview" 
                   />
                   {localConfig.heroImage && (
                     <button 
                       onClick={() => setLocalConfig({...localConfig, heroImage: ''})}
                       className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                       title="Delete Image (Revert to Default)"
                     >
                       <Trash size={32} />
                     </button>
                   )}
                 </>
               )}
               <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs text-center pointer-events-none">Preview</div>
            </div>
          </div>
        </div>

        {/* Section Titles */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center"><Type className="mr-2" size={20}/> Homepage Section Titles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Category Section Title" value={localConfig.categoryTitle || ''} placeholder="Shop by Category" onChange={e => setLocalConfig({...localConfig, categoryTitle: e.target.value})} />
            <Input label="Featured Section Title" value={localConfig.featuredTitle || ''} placeholder="New Arrivals" onChange={e => setLocalConfig({...localConfig, featuredTitle: e.target.value})} />
            <Input label="Featured Section Subtitle" className="md:col-span-2" value={localConfig.featuredSubtitle || ''} placeholder="Fresh styles just added to our collection." onChange={e => setLocalConfig({...localConfig, featuredSubtitle: e.target.value})} />
          </div>
        </div>

        {/* Sale / Promo Section */}
        <div className="bg-white p-8 rounded shadow-sm border-l-4 border-brand-900">
          <h3 className="font-bold text-lg mb-4 flex items-center"><Megaphone className="mr-2" size={20}/> Sale Section (Explore Sale Banner)</h3>
          <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded">This controls the promotional banner in the middle of the homepage.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Input label="Banner Title" value={localConfig.promoTitle || ''} placeholder="Summer Sale is Live" onChange={e => setLocalConfig({...localConfig, promoTitle: e.target.value})} />
              <div className="col-span-1">
                <label className="block text-sm font-medium mb-1">Banner Description</label>
                <textarea className="w-full border p-2 text-sm h-24" value={localConfig.promoText || ''} placeholder="Get up to 50% off on selected dresses and kurtis. Limited time offer." onChange={e => setLocalConfig({...localConfig, promoText: e.target.value})}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Button Label" value={localConfig.promoButtonText || ''} placeholder="Explore Sale" onChange={e => setLocalConfig({...localConfig, promoButtonText: e.target.value})} />
                 <Input label="Button Link" value={localConfig.promoButtonLink || ''} placeholder="/shop" onChange={e => setLocalConfig({...localConfig, promoButtonLink: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Banner Image</label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100 w-fit">
                  <Upload size={16}/> Upload Image
                  <input type="file" className="hidden" accept="image/*" onChange={handlePromoUpload} />
                </label>
              </div>
            </div>
            <div className="aspect-video bg-gray-100 rounded overflow-hidden relative border group">
               <img 
                 src={localConfig.promoImage || DEFAULT_PROMO_IMAGE} 
                 className="w-full h-full object-cover" 
                 alt="Promo Preview" 
               />
               {localConfig.promoImage && (
                 <button 
                   onClick={() => setLocalConfig({...localConfig, promoImage: ''})}
                   className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                   title="Delete Image (Revert to Default)"
                 >
                   <Trash size={32} />
                 </button>
               )}
               <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs text-center pointer-events-none">Preview</div>
            </div>
          </div>
        </div>

        {/* Trust Badges Section (New) */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center"><ShieldCheck className="mr-2" size={20}/> Homepage Trust Badges</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 bg-gray-50 rounded">
              <p className="font-bold text-sm text-gray-500 uppercase">Badge 1</p>
              <Input label="Title" value={localConfig.trustBadge1Title || ''} placeholder="Premium Quality" onChange={e => setLocalConfig({...localConfig, trustBadge1Title: e.target.value})} />
              <Input label="Text" value={localConfig.trustBadge1Text || ''} placeholder="Hand-picked fabrics..." onChange={e => setLocalConfig({...localConfig, trustBadge1Text: e.target.value})} />
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded">
              <p className="font-bold text-sm text-gray-500 uppercase">Badge 2</p>
              <Input label="Title" value={localConfig.trustBadge2Title || ''} placeholder="Secure Payment" onChange={e => setLocalConfig({...localConfig, trustBadge2Title: e.target.value})} />
              <Input label="Text" value={localConfig.trustBadge2Text || ''} placeholder="100% secure checkout..." onChange={e => setLocalConfig({...localConfig, trustBadge2Text: e.target.value})} />
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded">
              <p className="font-bold text-sm text-gray-500 uppercase">Badge 3</p>
              <Input label="Title" value={localConfig.trustBadge3Title || ''} placeholder="Fast Delivery" onChange={e => setLocalConfig({...localConfig, trustBadge3Title: e.target.value})} />
              <Input label="Text" value={localConfig.trustBadge3Text || ''} placeholder="Shipping within 3-5 days" onChange={e => setLocalConfig({...localConfig, trustBadge3Text: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4">Website Content (About Us)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="About Us Title" value={localConfig.aboutTitle || ''} onChange={e => setLocalConfig({...localConfig, aboutTitle: e.target.value})} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">About Us Content</label>
              <textarea className="w-full border p-2 h-32" value={localConfig.aboutContent || ''} onChange={e => setLocalConfig({...localConfig, aboutContent: e.target.value})}></textarea>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4">Contact Information & Socials</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Contact Email" value={localConfig.contactEmail || ''} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} />
            <Input label="Contact Phone" value={localConfig.contactPhone || ''} onChange={e => setLocalConfig({...localConfig, contactPhone: e.target.value})} />
            <Input label="Address" className="md:col-span-2" value={localConfig.contactAddress || ''} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} />
            
            <div className="md:col-span-2 grid md:grid-cols-3 gap-4 pt-4 border-t mt-4">
               <div className="flex items-center gap-2 font-bold text-sm text-gray-500 mb-2 col-span-3"><Share2 size={16}/> Social Media Links</div>
               <Input label="Instagram URL" value={localConfig.socialInstagram || ''} placeholder="https://instagram.com/..." onChange={e => setLocalConfig({...localConfig, socialInstagram: e.target.value})} />
               <Input label="Facebook URL" value={localConfig.socialFacebook || ''} placeholder="https://facebook.com/..." onChange={e => setLocalConfig({...localConfig, socialFacebook: e.target.value})} />
               <Input label="WhatsApp URL" value={localConfig.socialWhatsapp || ''} placeholder="https://wa.me/..." onChange={e => setLocalConfig({...localConfig, socialWhatsapp: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t sticky bottom-0 bg-brand-50 p-4 shadow-inner flex justify-end">
           <Button onClick={handleSave} size="lg">Save All Changes</Button>
        </div>
      </div>
    </div>
  );
};

// --- Developer Settings (Enhanced) ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState(config);
  
  // Hero Slide State
  const [newSlide, setNewSlide] = useState<Partial<HeroSlide>>({ title: '', subtitle: '', buttonText: 'SHOP NOW', buttonLink: '/shop' });
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);

  // Gallery Image State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  
  // Sync logic
  useEffect(() => {
    if (config && Object.keys(config).length > 0) {
      setLocalConfig({
        ...config,
        theme: {
          primaryColor: '#2C251F',
          secondaryColor: '#D5CDC0',
          backgroundColor: '#F9F8F6',
          fontFamilySans: 'Inter',
          fontFamilySerif: 'Cormorant Garamond',
          borderRadius: '0px',
          ...config.theme
        },
        homepageSections: config.homepageSections || ['hero', 'categories', 'featured', 'promo', 'trust', 'slider'],
        hiddenSections: config.hiddenSections || [],
        heroMode: config.heroMode || 'static',
        heroSlides: config.heroSlides || [],
        sliderImages: config.sliderImages || []
      });
    }
  }, [config]);

  const handleSave = () => {
    updateConfig(localConfig);
    alert('Developer settings updated successfully!');
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all developer settings to default?")) {
      setLocalConfig(prev => ({
        ...prev,
        theme: {
          primaryColor: '#2C251F',
          secondaryColor: '#D5CDC0',
          backgroundColor: '#F9F8F6',
          fontFamilySans: 'Inter',
          fontFamilySerif: 'Cormorant Garamond',
          borderRadius: '0px'
        },
        homepageSections: ['hero', 'categories', 'featured', 'promo', 'trust', 'slider'],
        hiddenSections: [],
        heroMode: 'static'
      }));
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...(localConfig.homepageSections || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newSections.length) {
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      setLocalConfig({ ...localConfig, homepageSections: newSections });
    }
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const currentHidden = localConfig.hiddenSections || [];
    let newHidden;
    if (currentHidden.includes(sectionId)) {
        newHidden = currentHidden.filter(id => id !== sectionId);
    } else {
        newHidden = [...currentHidden, sectionId];
    }
    setLocalConfig({ ...localConfig, hiddenSections: newHidden });
  };

  // --- Slide Logic ---
  const openSlideModal = (idx?: number) => {
    setEditingSlideIndex(idx ?? null);
    setNewSlide(idx !== undefined ? { ...localConfig.heroSlides![idx] } : { title: '', subtitle: '', buttonText: 'SHOP', buttonLink: '/shop', image: '' });
    setIsSlideModalOpen(true);
  };
  
  const saveSlide = () => {
    const slides = [...(localConfig.heroSlides || [])];
    const data = { ...newSlide, id: newSlide.id || Date.now().toString() } as HeroSlide;
    if (editingSlideIndex !== null) slides[editingSlideIndex] = data; else slides.push(data);
    setLocalConfig({ ...localConfig, heroSlides: slides });
    setIsSlideModalOpen(false);
  };
  
  const deleteSlide = (idx: number) => {
    const slides = [...(localConfig.heroSlides || [])];
    slides.splice(idx, 1);
    setLocalConfig({ ...localConfig, heroSlides: slides });
  };
  
  const handleSlideUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onload = () => setNewSlide(p => ({...p, image: r.result as string})); r.readAsDataURL(f); }
  };

  // --- Gallery Logic ---
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: SliderImage[] = [];
      let processedCount = 0;

      // Convert all files to base64
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            id: Date.now().toString() + Math.random().toString(), // Unique ID
            url: reader.result as string
          });
          processedCount++;
          
          // Once all files are processed, update state
          if (processedCount === files.length) {
            setLocalConfig(prev => ({
              ...prev,
              sliderImages: [...(prev.sliderImages || []), ...newImages]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
      
      // Clear input so same files can be selected again if needed
      e.target.value = '';
    }
  };

  const removeGalleryImage = (id: string) => {
      setLocalConfig(p => ({ ...p, sliderImages: p.sliderImages?.filter(i => i.id !== id) }));
  };

  const fonts = [
    { name: 'Inter (Modern Sans)', value: 'Inter' },
    { name: 'Lato (Friendly Sans)', value: 'Lato' },
    { name: 'Montserrat (Geometric Sans)', value: 'Montserrat' },
    { name: 'Open Sans (Neutral Sans)', value: 'Open Sans' },
    { name: 'Cormorant Garamond (Elegant Serif)', value: 'Cormorant Garamond' },
    { name: 'Playfair Display (Display Serif)', value: 'Playfair Display' },
  ];

  const sectionNames: Record<string, string> = {
    hero: 'Hero Banner',
    categories: 'Categories Grid',
    featured: 'Featured Products',
    promo: 'Promotional Banner',
    trust: 'Trust Badges',
    slider: 'Image Gallery / Slider'
  };

  if (!localConfig.theme) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold">Developer Settings</h1>
        <p className="text-gray-500">Advanced customization for theme, layout, and specialized sections.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Color Palette */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Palette className="mr-2" size={20}/> Color Palette</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color (Text & Dark BG)</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={localConfig.theme.primaryColor} 
                  onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, primaryColor: e.target.value}})}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input 
                  value={localConfig.theme.primaryColor} 
                  onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, primaryColor: e.target.value}})} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Secondary / Accent Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={localConfig.theme.secondaryColor} 
                  onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, secondaryColor: e.target.value}})}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input 
                  value={localConfig.theme.secondaryColor} 
                  onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, secondaryColor: e.target.value}})} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Page Background Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={localConfig.theme.backgroundColor} 
                  onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, backgroundColor: e.target.value}})}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input 
                  value={localConfig.theme.backgroundColor} 
                  onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, backgroundColor: e.target.value}})} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Style */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Type className="mr-2" size={20}/> Typography & Style</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Heading Font (Serif)</label>
              <select 
                className="w-full border p-2 rounded"
                value={localConfig.theme.fontFamilySerif}
                onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, fontFamilySerif: e.target.value}})}
              >
                {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Body Font (Sans)</label>
              <select 
                className="w-full border p-2 rounded"
                value={localConfig.theme.fontFamilySans}
                onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, fontFamilySans: e.target.value}})}
              >
                {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Border Radius Style</label>
              <div className="grid grid-cols-4 gap-2">
                {['0px', '4px', '8px', '99px'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setLocalConfig({...localConfig, theme: {...localConfig.theme!, borderRadius: r}})}
                    className={`border p-2 text-center text-xs ${localConfig.theme?.borderRadius === r ? 'bg-gray-900 text-white' : 'bg-white hover:bg-gray-50'}`}
                    style={{ borderRadius: r }}
                  >
                    {r === '0px' ? 'Square' : r === '99px' ? 'Round' : r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2">
            <h3 className="font-bold text-lg mb-4 flex items-center"><Bell className="mr-2" size={20}/> Announcement Bar</h3>
            <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={localConfig.announcementEnabled || false} onChange={e => setLocalConfig({...localConfig, announcementEnabled: e.target.checked})} className="w-5 h-5 accent-brand-900" />
                    <span className="font-medium">Enable Announcement Bar</span>
                </label>
            </div>
            {localConfig.announcementEnabled && (
                <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up">
                    <Input label="Message" value={localConfig.announcementText || ''} onChange={e => setLocalConfig({...localConfig, announcementText: e.target.value})} placeholder="Free Shipping on all orders!" />
                    <Input label="Link (Optional)" value={localConfig.announcementLink || ''} onChange={e => setLocalConfig({...localConfig, announcementLink: e.target.value})} placeholder="/shop" />
                </div>
            )}
        </div>

        {/* Hero Config */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2">
            <h3 className="font-bold text-lg mb-6 flex items-center"><MonitorPlay className="mr-2" size={20}/> Hero Section Config</h3>
            <div className="flex gap-4 mb-6">
                <button onClick={() => setLocalConfig({...localConfig, heroMode: 'static'})} className={`flex-1 p-3 border rounded text-center transition ${localConfig.heroMode === 'static' ? 'bg-brand-100 border-brand-900 font-bold' : 'hover:bg-gray-50'}`}>Static</button>
                <button onClick={() => setLocalConfig({...localConfig, heroMode: 'carousel'})} className={`flex-1 p-3 border rounded text-center transition ${localConfig.heroMode === 'carousel' ? 'bg-brand-100 border-brand-900 font-bold' : 'hover:bg-gray-50'}`}>Carousel</button>
            </div>
            {localConfig.heroMode === 'carousel' && (
                <div>
                    <div className="flex justify-between mb-2"><h4>Slides</h4><Button size="sm" onClick={() => openSlideModal()}><Plus size={14}/> Add Slide</Button></div>
                    <div className="space-y-2">
                        {localConfig.heroSlides?.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-2 border rounded bg-gray-50">
                                <div className="flex items-center gap-2"><img src={s.image} className="w-10 h-10 object-cover rounded"/><span>{s.title || 'Slide ' + (i+1)}</span></div>
                                <div><button onClick={() => openSlideModal(i)} className="p-1 mr-2 text-blue-600"><Edit size={16}/></button><button onClick={() => deleteSlide(i)} className="p-1 text-red-600"><Trash size={16}/></button></div>
                            </div>
                        ))}
                        {localConfig.heroSlides?.length === 0 && <p className="text-gray-400 text-sm">No slides added.</p>}
                    </div>
                </div>
            )}
        </div>

        {/* Standalone Gallery Config */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2">
            <h3 className="font-bold text-lg mb-6 flex items-center"><Images className="mr-2" size={20}/> Standalone Image Slider / Gallery</h3>
            <div className="mb-6">
                <Input label="Section Title" value={localConfig.sliderTitle || ''} placeholder="Lookbook" onChange={e => setLocalConfig({...localConfig, sliderTitle: e.target.value})} />
            </div>
            <p className="text-sm text-gray-500 mb-4">Upload multiple images to create an automatic scrolling gallery on your homepage.</p>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                {localConfig.sliderImages?.map((img) => (
                    <div key={img.id} className="relative aspect-[3/4] group bg-gray-100 rounded overflow-hidden shadow-sm border">
                        <img src={img.url} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeGalleryImage(img.id)} 
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                          title="Remove Image"
                        >
                          <X size={12}/>
                        </button>
                    </div>
                ))}
                
                <label className="aspect-[3/4] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-500 transition-colors rounded text-gray-400">
                    <Plus size={24}/>
                    <span className="text-xs mt-2 font-medium">Add Images</span>
                    {/* KEY CHANGE: Added 'multiple' attribute */}
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} />
                </label>
            </div>
            {localConfig.sliderImages?.length === 0 && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded">Tip: You can select multiple files at once when uploading.</p>
            )}
        </div>

        {/* Section Reordering */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Layers className="mr-2" size={20}/> Homepage Layout (Drag & Drop)</h3>
          <p className="text-sm text-gray-500 mb-4">Reorder the sections as they appear on the homepage. Toggle visibility with the eye icon.</p>
          
          <div className="space-y-2 max-w-lg">
            {localConfig.homepageSections?.map((sectionId, index) => {
              const isHidden = localConfig.hiddenSections?.includes(sectionId);
              return (
              <div key={sectionId} className={`flex items-center justify-between p-3 border rounded transition ${isHidden ? 'bg-gray-100 border-gray-200' : 'bg-gray-50 border-gray-200 hover:bg-white hover:shadow-sm'}`}>
                <span className={`font-medium capitalize ${isHidden ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{sectionNames[sectionId] || sectionId}</span>
                <div className="flex gap-2 items-center">
                  <button 
                    onClick={() => toggleSectionVisibility(sectionId)}
                    className={`p-1 rounded ${isHidden ? 'text-gray-400 hover:bg-gray-200' : 'text-gray-600 hover:bg-gray-200'}`}
                    title={isHidden ? "Unhide Section" : "Hide Section"}
                  >
                    {isHidden ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                  <div className="flex gap-1 border-l pl-2 border-gray-300">
                    <button 
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                    >
                        <ArrowUp size={16}/>
                    </button>
                    <button 
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === (localConfig.homepageSections?.length || 0) - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                    >
                        <ArrowDown size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>

      </div>

      <div className="mt-8 pt-4 border-t flex justify-end gap-4">
         <Button onClick={handleReset} variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700">
            <RotateCcw size={16} className="mr-2" /> Reset Defaults
         </Button>
         <Button onClick={handleSave} size="lg">Save Configuration</Button>
      </div>

      {/* Slide Modal */}
      {isSlideModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">Edit Slide</h3>
                    <button onClick={() => setIsSlideModalOpen(false)}><X size={20}/></button>
                  </div>
                  <div className="space-y-4">
                      <Input label="Title" value={newSlide.title} onChange={e => setNewSlide({...newSlide, title: e.target.value})} />
                      <Input label="Subtitle" value={newSlide.subtitle} onChange={e => setNewSlide({...newSlide, subtitle: e.target.value})} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Button Text" value={newSlide.buttonText} onChange={e => setNewSlide({...newSlide, buttonText: e.target.value})} />
                        <Input label="Button Link" value={newSlide.buttonLink} onChange={e => setNewSlide({...newSlide, buttonLink: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Image</label>
                        {newSlide.image && <img src={newSlide.image} className="w-full h-32 object-cover mb-2 rounded border" />}
                        <input type="file" onChange={handleSlideUpload} />
                      </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => setIsSlideModalOpen(false)}>Cancel</Button><Button onClick={saveSlide}>Save</Button></div>
              </div>
          </div>
      )}
    </div>
  );
};

export const AdminOrders: React.FC = () => {
    const { orders, updateOrderStatus } = useStore();
    return (
        <div>
            <h1 className="text-2xl font-serif font-bold mb-8">Manage Orders</h1>
            <div className="bg-white rounded shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{order.id}</td>
                                <td className="px-6 py-4">
                                    <div>{order.customerName}</div>
                                    <div className="text-xs text-gray-500">{order.email}</div>
                                </td>
                                <td className="px-6 py-4">{order.date}</td>
                                <td className="px-6 py-4">${order.total}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)} 
                                        className="border text-xs p-1 rounded bg-white"
                                    >
                                        <option>Pending</option>
                                        <option>Shipped</option>
                                        <option>Delivered</option>
                                        <option>Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && <div className="p-8 text-center text-gray-500">No orders found.</div>}
            </div>
        </div>
    );
};

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});

  const handleSave = async () => {
     if (!editingProduct.name || !editingProduct.price) return alert("Name and Price are required");
     
     const productData = {
        ...editingProduct,
        id: editingProduct.id || Date.now().toString(),
        images: editingProduct.images || [],
        sizes: editingProduct.sizes || [],
        colors: editingProduct.colors || [],
        stock: Number(editingProduct.stock) || 0,
        price: Number(editingProduct.price),
        discountPrice: editingProduct.discountPrice ? Number(editingProduct.discountPrice) : undefined,
        newArrival: editingProduct.newArrival || false,
        bestSeller: editingProduct.bestSeller || false,
     } as Product;

     if (editingProduct.id) {
        await updateProduct(productData);
     } else {
        await addProduct(productData);
     }
     setIsModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
        const reader = new FileReader();
        reader.onload = () => {
           setEditingProduct(prev => ({ ...prev, images: [...(prev.images || []), reader.result as string] }));
        };
        reader.readAsDataURL(file);
     }
  };

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif font-bold">Products</h1>
          <Button onClick={() => { setEditingProduct({}); setIsModalOpen(true); }}><Plus size={16} className="mr-2"/> Add Product</Button>
       </div>
       
       <div className="bg-white rounded shadow-sm overflow-hidden">
         <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
               {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                       <img src={p.images[0]} className="w-10 h-10 object-cover rounded bg-gray-100" />
                       <div>
                          <div className="font-medium">{p.name}</div>
                          {p.newArrival && <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded mr-1">NEW</span>}
                          {p.bestSeller && <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">HOT</span>}
                       </div>
                    </td>
                    <td className="px-6 py-4">{p.category}</td>
                    <td className="px-6 py-4">${p.price}</td>
                    <td className="px-6 py-4">{p.stock}</td>
                    <td className="px-6 py-4 flex gap-2">
                       <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                       <button onClick={() => { if(confirm('Delete?')) deleteProduct(p.id); }} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash size={16}/></button>
                    </td>
                  </tr>
               ))}
            </tbody>
         </table>
       </div>

       {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="font-bold text-xl mb-4">{editingProduct.id ? 'Edit' : 'Add'} Product</h3>
                <div className="grid grid-cols-2 gap-4">
                   <Input label="Name" value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                   <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select className="w-full border p-2 rounded" value={editingProduct.category || ''} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                         <option value="">Select Category</option>
                         {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                   </div>
                   <Input label="Price" type="number" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                   <Input label="Discount Price" type="number" value={editingProduct.discountPrice || ''} onChange={e => setEditingProduct({...editingProduct, discountPrice: Number(e.target.value)})} />
                   <Input label="Stock" type="number" value={editingProduct.stock || ''} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
                   
                   <div className="col-span-2 space-y-2">
                      <label className="flex items-center gap-2">
                         <input type="checkbox" checked={editingProduct.newArrival || false} onChange={e => setEditingProduct({...editingProduct, newArrival: e.target.checked})} />
                         New Arrival
                      </label>
                      <label className="flex items-center gap-2">
                         <input type="checkbox" checked={editingProduct.bestSeller || false} onChange={e => setEditingProduct({...editingProduct, bestSeller: e.target.checked})} />
                         Best Seller
                      </label>
                   </div>

                   <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea className="w-full border p-2" value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}></textarea>
                   </div>

                   <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Images</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                         {editingProduct.images?.map((img, i) => (
                            <img key={i} src={img} className="w-16 h-16 object-cover border" />
                         ))}
                      </div>
                      <input type="file" onChange={handleImageUpload} />
                   </div>

                   {/* Sizes and Colors as comma separated strings for simplicity */}
                   <Input label="Sizes (comma separated)" value={editingProduct.sizes?.join(',') || ''} onChange={e => setEditingProduct({...editingProduct, sizes: e.target.value.split(',').map(s => s.trim())})} />
                   <Input label="Colors (comma separated)" value={editingProduct.colors?.join(',') || ''} onChange={e => setEditingProduct({...editingProduct, colors: e.target.value.split(',').map(s => s.trim())})} />
                </div>
                <div className="mt-6 flex justify-end gap-2">
                   <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                   <Button onClick={handleSave}>Save Product</Button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});

  const handleSave = async () => {
     if (!editingCategory.name) return;
     const catData = {
        ...editingCategory,
        id: editingCategory.id || editingCategory.name.toLowerCase().replace(/\s+/g, '-'),
        image: editingCategory.image || ''
     } as Category;
     
     if (editingCategory.id) await updateCategory(catData);
     else await addCategory(catData);
     setIsModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
        const reader = new FileReader();
        reader.onload = () => setEditingCategory(prev => ({ ...prev, image: reader.result as string }));
        reader.readAsDataURL(file);
     }
  };

  return (
     <div>
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-serif font-bold">Categories</h1>
           <Button onClick={() => { setEditingCategory({}); setIsModalOpen(true); }}><Plus size={16} className="mr-2"/> Add Category</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {categories.map(c => (
              <div key={c.id} className="bg-white p-4 rounded shadow-sm relative group">
                 <img src={c.image} className="w-full h-32 object-cover rounded mb-2 bg-gray-100" />
                 <h3 className="font-bold text-center">{c.name}</h3>
                 <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center gap-2 rounded transition">
                    <button onClick={() => { setEditingCategory(c); setIsModalOpen(true); }} className="text-white p-2 hover:bg-white/20 rounded"><Edit size={20}/></button>
                    <button onClick={() => { if(confirm("Delete?")) deleteCategory(c.id); }} className="text-red-400 p-2 hover:bg-white/20 rounded"><Trash size={20}/></button>
                 </div>
              </div>
           ))}
        </div>

        {isModalOpen && (
           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded p-6 w-full max-w-md">
                 <h3 className="font-bold text-xl mb-4">{editingCategory.id ? 'Edit' : 'Add'} Category</h3>
                 <Input label="Name" value={editingCategory.name || ''} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} className="mb-4" />
                 <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Image</label>
                    {editingCategory.image && <img src={editingCategory.image} className="w-full h-32 object-cover mb-2 rounded" />}
                    <input type="file" onChange={handleImageUpload} />
                 </div>
                 <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                 </div>
              </div>
           </div>
        )}
     </div>
  );
};

export const AdminUsers: React.FC = () => {
   const { users, addUser, deleteUser, changeUserPassword } = useStore();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });

   const handleAdd = async () => {
      if(!newUser.username || !newUser.password) return alert("Username and Password required");
      await addUser({
         ...newUser,
         permissions: ['products', 'orders'] // Default permissions for staff
      });
      setIsModalOpen(false);
      setNewUser({ username: '', password: '', role: 'staff' });
   };

   return (
      <div>
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-serif font-bold">User Management</h1>
            <Button onClick={() => setIsModalOpen(true)}><Plus size={16} className="mr-2"/> Add User</Button>
         </div>
         
         <div className="bg-white rounded shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-700 uppercase">
                  <tr>
                     <th className="px-6 py-4">Username</th>
                     <th className="px-6 py-4">Role</th>
                     <th className="px-6 py-4">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {users.map(u => (
                     <tr key={u.id}>
                        <td className="px-6 py-4 font-medium">{u.username}</td>
                        <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs uppercase">{u.role}</span></td>
                        <td className="px-6 py-4 flex gap-4">
                           {u.role !== 'admin' && (
                              <button onClick={() => { if(confirm("Delete user?")) deleteUser(u.id); }} className="text-red-600 hover:underline">Delete</button>
                           )}
                           <button onClick={() => {
                              const newPass = prompt("Enter new password:");
                              if(newPass) changeUserPassword(u.id, newPass);
                           }} className="text-blue-600 hover:underline">Reset Password</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded p-6 w-full max-w-md">
                  <h3 className="font-bold text-xl mb-4">Add User</h3>
                  <div className="space-y-4">
                     <Input label="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                     <Input label="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                     <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select className="w-full border p-2 rounded" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                           <option value="staff">Staff</option>
                           <option value="admin">Admin</option>
                        </select>
                     </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                     <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                     <Button onClick={handleAdd}>Create User</Button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
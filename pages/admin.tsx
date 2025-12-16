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
            <thead className="bg-gray-5 text-gray-700 uppercase">
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

        {/* Announcement Bar */}
        <div className="bg-white p-8 rounded shadow-sm border-l-4 border-yellow-500">
            <h3 className="font-bold text-lg mb-4 flex items-center text-yellow-800"><Bell className="mr-2" size={20}/> Announcement Bar Configuration</h3>
            <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={localConfig.announcementEnabled || false} onChange={e => setLocalConfig({...localConfig, announcementEnabled: e.target.checked})} className="w-5 h-5 accent-brand-900" />
                    <span className="font-medium">Enable Announcement Bar</span>
                </label>
            </div>
            {localConfig.announcementEnabled && (
                <div className="space-y-4 animate-fade-in-up">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input label="Message" value={localConfig.announcementText || ''} onChange={e => setLocalConfig({...localConfig, announcementText: e.target.value})} placeholder="Free Shipping on all orders!" />
                      <Input label="Link (Optional)" value={localConfig.announcementLink || ''} onChange={e => setLocalConfig({...localConfig, announcementLink: e.target.value})} placeholder="/shop" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Background Color</label>
                        <div className="flex gap-2">
                           <input type="color" className="h-9 w-9 border rounded" value={localConfig.announcementBgColor || '#2C251F'} onChange={e => setLocalConfig({...localConfig, announcementBgColor: e.target.value})} />
                           <Input value={localConfig.announcementBgColor || '#2C251F'} onChange={e => setLocalConfig({...localConfig, announcementBgColor: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Text Color</label>
                        <div className="flex gap-2">
                           <input type="color" className="h-9 w-9 border rounded" value={localConfig.announcementTextColor || '#FFFFFF'} onChange={e => setLocalConfig({...localConfig, announcementTextColor: e.target.value})} />
                           <Input value={localConfig.announcementTextColor || '#FFFFFF'} onChange={e => setLocalConfig({...localConfig, announcementTextColor: e.target.value})} />
                        </div>
                      </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer Configuration */}
        <div className="bg-white p-8 rounded shadow-sm border-l-4 border-blue-500">
          <h3 className="font-bold text-lg mb-4 flex items-center text-blue-800"><Footprints className="mr-2" size={20}/> Footer Configuration (Shop & Contact)</h3>
          
          <div className="space-y-6">
            {/* Colors */}
            <div className="grid md:grid-cols-2 gap-4 border-b pb-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Footer Background Color</label>
                  <div className="flex gap-2">
                     <input type="color" className="h-9 w-9 border rounded" value={localConfig.footerBgColor || '#2C251F'} onChange={e => setLocalConfig({...localConfig, footerBgColor: e.target.value})} />
                     <Input value={localConfig.footerBgColor || '#2C251F'} onChange={e => setLocalConfig({...localConfig, footerBgColor: e.target.value})} />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Footer Text Color</label>
                  <div className="flex gap-2">
                     <input type="color" className="h-9 w-9 border rounded" value={localConfig.footerTextColor || '#D5CDC0'} onChange={e => setLocalConfig({...localConfig, footerTextColor: e.target.value})} />
                     <Input value={localConfig.footerTextColor || '#D5CDC0'} onChange={e => setLocalConfig({...localConfig, footerTextColor: e.target.value})} />
                  </div>
               </div>
            </div>

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

// --- Admin Products ---
export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Name and Price are required");
    
    const productData = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock || 0),
      images: form.images || [],
      sizes: form.sizes || [],
      colors: form.colors || [],
    } as Product;

    if (form.id) {
      await updateProduct(productData);
    } else {
      await addProduct(productData);
    }
    setIsEditing(false);
    setForm({});
  };

  const handleEdit = (p: Product) => {
    setForm(p);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) await deleteProduct(id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm(prev => ({...prev, images: [reader.result as string, ...(prev.images || [])]}));
        };
        reader.readAsDataURL(file);
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl bg-white p-8 rounded shadow-sm">
        <h2 className="text-xl font-bold mb-6">{form.id ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
             <Input label="Price" type="number" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})} required />
             <Input label="Discount Price (Optional)" type="number" value={form.discountPrice || ''} onChange={e => setForm({...form, discountPrice: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select className="w-full border p-2 rounded" value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Stock" type="number" value={form.stock || 0} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
          <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea className="w-full border p-2 h-24" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})}></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
             <div className="flex flex-wrap gap-2 mb-2">
               {form.images?.map((img, i) => (
                 <div key={i} className="w-20 h-20 relative">
                   <img src={img} className="w-full h-full object-cover rounded border" />
                   <button type="button" onClick={() => setForm(prev => ({...prev, images: prev.images?.filter((_, idx) => idx !== i)}))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={12}/></button>
                 </div>
               ))}
             </div>
             <input type="file" onChange={handleImageUpload} accept="image/*" />
          </div>

          {/* Sizes and Colors as comma separated for simplicity */}
          <Input label="Sizes (comma separated)" value={form.sizes?.join(', ') || ''} onChange={e => setForm({...form, sizes: e.target.value.split(',').map(s => s.trim())})} />
          <Input label="Colors (comma separated)" value={form.colors?.join(', ') || ''} onChange={e => setForm({...form, colors: e.target.value.split(',').map(s => s.trim())})} />

          <div className="flex gap-4">
             <label className="flex items-center gap-2"><input type="checkbox" checked={form.newArrival || false} onChange={e => setForm({...form, newArrival: e.target.checked})} /> New Arrival</label>
             <label className="flex items-center gap-2"><input type="checkbox" checked={form.bestSeller || false} onChange={e => setForm({...form, bestSeller: e.target.checked})} /> Best Seller</label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit">Save Product</Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-serif">Products</h1>
        <Button onClick={() => { setForm({}); setIsEditing(true); }}><Plus size={16} className="mr-2"/> Add Product</Button>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 uppercase text-gray-700">
             <tr>
               <th className="px-6 py-3">Image</th>
               <th className="px-6 py-3">Name</th>
               <th className="px-6 py-3">Category</th>
               <th className="px-6 py-3">Price</th>
               <th className="px-6 py-3">Stock</th>
               <th className="px-6 py-3">Actions</th>
             </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4"><img src={p.images[0]} className="w-10 h-10 object-cover rounded" /></td>
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4">{p.category}</td>
                <td className="px-6 py-4">${p.price}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800"><Trash size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Admin Orders ---
export const AdminOrders: React.FC = () => {
    const { orders, updateOrderStatus } = useStore();

    return (
        <div>
            <h1 className="text-2xl font-bold font-serif mb-6">Orders</h1>
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-lg">Order #{order.id}</h3>
                                <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()} by {order.customerName}</p>
                                <p className="text-xs text-gray-400">{order.email}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <span className="font-bold text-lg">${order.total}</span>
                                <select 
                                    className="border rounded px-2 py-1 text-sm bg-gray-50" 
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded text-sm">
                            <p className="font-bold mb-2">Items:</p>
                            <ul className="space-y-2">
                                {order.items.map((item, idx) => (
                                    <li key={idx} className="flex justify-between">
                                        <span>{item.quantity}x {item.name} ({item.selectedSize}, {item.selectedColor})</span>
                                        <span>${(item.discountPrice || item.price) * item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4 text-xs text-gray-500">
                             Shipping To: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.zip}
                        </div>
                    </div>
                ))}
                {orders.length === 0 && <p>No orders found.</p>}
            </div>
        </div>
    );
};

// --- Admin Categories ---
export const AdminCategories: React.FC = () => {
    const { categories, addCategory, deleteCategory } = useStore();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!name) return;
        await addCategory({ id: name.toLowerCase().replace(/\s+/g, '-'), name, image: image || 'https://via.placeholder.com/400' });
        setName(''); setImage('');
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h1 className="text-2xl font-bold font-serif mb-6">Categories</h1>
                <div className="grid grid-cols-2 gap-4">
                    {categories.map(c => (
                        <div key={c.id} className="relative group aspect-square bg-gray-100 rounded overflow-hidden">
                            <img src={c.image} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">{c.name}</span>
                            </div>
                            <button onClick={() => deleteCategory(c.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"><Trash size={16}/></button>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className="bg-white p-6 rounded shadow-sm sticky top-6">
                    <h3 className="font-bold mb-4">Add Category</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
                        <div>
                             <label className="block text-sm font-medium mb-1">Image</label>
                             <input type="file" onChange={handleImage} accept="image/*" className="text-sm" />
                             {image && <img src={image} className="mt-2 w-full h-32 object-cover rounded" />}
                        </div>
                        <Button type="submit" className="w-full">Add Category</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Admin Users ---
export const AdminUsers: React.FC = () => {
    const { users, addUser, deleteUser, changeUserPassword } = useStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });
    
    // ... basic crud ...
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        await addUser(newUser as any);
        setIsAdding(false); setNewUser({ username: '', password: '', role: 'staff' });
    }

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-serif">Users</h1>
                <Button onClick={() => setIsAdding(!isAdding)}>{isAdding ? 'Cancel' : 'Add User'}</Button>
             </div>

             {isAdding && (
                 <div className="bg-white p-6 mb-6 rounded shadow-sm max-w-md">
                     <form onSubmit={handleAdd} className="space-y-4">
                         <Input label="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} required />
                         <Input label="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                         <div>
                             <label className="block text-sm font-medium mb-1">Role</label>
                             <select className="w-full border p-2 rounded" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                 <option value="staff">Staff</option>
                                 <option value="admin">Admin</option>
                             </select>
                         </div>
                         <Button type="submit">Create User</Button>
                     </form>
                 </div>
             )}

             <div className="bg-white rounded shadow-sm overflow-hidden">
                 <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 uppercase text-gray-700">
                         <tr>
                             <th className="px-6 py-3">Username</th>
                             <th className="px-6 py-3">Role</th>
                             <th className="px-6 py-3">Actions</th>
                         </tr>
                     </thead>
                     <tbody>
                         {users.map(u => (
                             <tr key={u.id} className="border-b">
                                 <td className="px-6 py-4">{u.username}</td>
                                 <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{u.role}</span></td>
                                 <td className="px-6 py-4">
                                     <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700"><Trash size={16}/></button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
        </div>
    );
};

// --- Admin Developer Settings ---
export const AdminDeveloperSettings: React.FC = () => {
    const { config, updateConfig } = useStore();
    const [local, setLocal] = useState(config);
    
    useEffect(() => { setLocal(config); }, [config]);

    const handleSave = () => {
        updateConfig(local);
        alert('Saved!');
    };

    return (
        <div className="max-w-4xl pb-20">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-serif">Developer Settings</h1>
                <Button onClick={handleSave}>Save Changes</Button>
             </div>
             
             <div className="space-y-6">
                 {/* Theme */}
                 <div className="bg-white p-6 rounded shadow-sm">
                     <h3 className="font-bold mb-4 flex items-center gap-2"><Palette size={20}/> Theme Configuration</h3>
                     <div className="grid md:grid-cols-3 gap-4">
                         <div>
                             <label className="block text-sm font-medium mb-1">Primary Color (900)</label>
                             <div className="flex gap-2">
                                <input type="color" className="w-8 h-8 rounded border" value={local.theme?.primaryColor || '#000000'} onChange={e => setLocal({...local, theme: {...local.theme!, primaryColor: e.target.value}})} />
                                <Input value={local.theme?.primaryColor || ''} onChange={e => setLocal({...local, theme: {...local.theme!, primaryColor: e.target.value}})} />
                             </div>
                         </div>
                         <div>
                             <label className="block text-sm font-medium mb-1">Secondary Color (200)</label>
                             <div className="flex gap-2">
                                <input type="color" className="w-8 h-8 rounded border" value={local.theme?.secondaryColor || '#e5e7eb'} onChange={e => setLocal({...local, theme: {...local.theme!, secondaryColor: e.target.value}})} />
                                <Input value={local.theme?.secondaryColor || ''} onChange={e => setLocal({...local, theme: {...local.theme!, secondaryColor: e.target.value}})} />
                             </div>
                         </div>
                         <div>
                             <label className="block text-sm font-medium mb-1">Background Color (50)</label>
                             <div className="flex gap-2">
                                <input type="color" className="w-8 h-8 rounded border" value={local.theme?.backgroundColor || '#f9fafb'} onChange={e => setLocal({...local, theme: {...local.theme!, backgroundColor: e.target.value}})} />
                                <Input value={local.theme?.backgroundColor || ''} onChange={e => setLocal({...local, theme: {...local.theme!, backgroundColor: e.target.value}})} />
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* Sections */}
                 <div className="bg-white p-6 rounded shadow-sm">
                     <h3 className="font-bold mb-4 flex items-center gap-2"><Layers size={20}/> Homepage Sections</h3>
                     <div className="space-y-2">
                        {['hero', 'categories', 'featured', 'slider', 'promo', 'trust'].map(sec => (
                            <div key={sec} className="flex items-center justify-between p-3 border rounded bg-gray-50">
                                <span className="uppercase font-medium text-sm">{sec}</span>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={!local.hiddenSections?.includes(sec)} 
                                        onChange={(e) => {
                                            const hidden = local.hiddenSections || [];
                                            if (e.target.checked) {
                                                setLocal({...local, hiddenSections: hidden.filter(h => h !== sec)});
                                            } else {
                                                setLocal({...local, hiddenSections: [...hidden, sec]});
                                            }
                                        }}
                                    />
                                    Visible
                                </label>
                            </div>
                        ))}
                     </div>
                 </div>

                 {/* Hero Mode */}
                 <div className="bg-white p-6 rounded shadow-sm">
                     <h3 className="font-bold mb-4 flex items-center gap-2"><MonitorPlay size={20}/> Hero Mode</h3>
                     <select 
                        className="w-full border p-2 rounded mb-4" 
                        value={local.heroMode || 'static'} 
                        onChange={e => setLocal({...local, heroMode: e.target.value as any})}
                     >
                         <option value="static">Static Image/Video</option>
                         <option value="carousel">Carousel Slideshow</option>
                     </select>
                     
                     {local.heroMode === 'carousel' && (
                         <div className="space-y-4">
                             <p className="text-sm text-gray-500">Add slides for the carousel.</p>
                             {local.heroSlides?.map((slide, idx) => (
                                 <div key={idx} className="border p-4 rounded relative">
                                     <button onClick={() => setLocal(prev => ({...prev, heroSlides: prev.heroSlides?.filter((_, i) => i !== idx)}))} className="absolute top-2 right-2 text-red-500"><X size={16}/></button>
                                     <div className="grid grid-cols-2 gap-4">
                                         <Input label="Title" value={slide.title} onChange={e => {
                                             const slides = [...(local.heroSlides || [])];
                                             slides[idx].title = e.target.value;
                                             setLocal({...local, heroSlides: slides});
                                         }} />
                                         <Input label="Image URL" value={slide.image} onChange={e => {
                                             const slides = [...(local.heroSlides || [])];
                                             slides[idx].image = e.target.value;
                                             setLocal({...local, heroSlides: slides});
                                         }} />
                                     </div>
                                 </div>
                             ))}
                             <Button onClick={() => setLocal(prev => ({...prev, heroSlides: [...(prev.heroSlides || []), { id: Date.now().toString(), title: 'New Slide', subtitle: 'Subtitle', image: 'https://via.placeholder.com/1920x1080', buttonText: 'Shop', buttonLink: '/shop' }] }))}>Add Slide</Button>
                         </div>
                     )}
                 </div>
                 
                 {/* Image Slider */}
                 <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Images size={20}/> Lookbook Slider</h3>
                    <Input label="Slider Section Title" value={local.sliderTitle || ''} onChange={e => setLocal({...local, sliderTitle: e.target.value})} className="mb-4" />
                    <div className="flex overflow-x-auto gap-4 py-2">
                        {local.sliderImages?.map((img, idx) => (
                            <div key={idx} className="w-32 h-40 flex-shrink-0 relative group">
                                <img src={img.url} className="w-full h-full object-cover rounded" />
                                <button onClick={() => setLocal(prev => ({...prev, sliderImages: prev.sliderImages?.filter((_, i) => i !== idx)}))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12}/></button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                         <label className="btn btn-sm cursor-pointer bg-gray-100 px-4 py-2 rounded text-sm hover:bg-gray-200 inline-block">
                             Add Image URL (Simple)
                             <input type="button" className="hidden" onClick={() => {
                                 const url = prompt("Enter Image URL");
                                 if(url) setLocal(prev => ({...prev, sliderImages: [...(prev.sliderImages || []), { id: Date.now().toString(), url }]}));
                             }} />
                         </label>
                    </div>
                 </div>
             </div>
        </div>
    );
}

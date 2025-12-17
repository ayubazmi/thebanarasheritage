import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, SectionHeader } from '../components/ui';
import { Product, Category, User, SiteConfig } from '../types';
import { 
  Plus, Trash, Edit, Package, ShoppingCart, DollarSign, TrendingUp, 
  Upload, Image as ImageIcon, X, Settings, List, Layout, User as UserIcon, Lock, Megaphone, Video, Hexagon, Type, ShieldCheck, Share2, Heart,
  FileText, Footprints, Palette, Code2, ArrowUp, ArrowDown, Move, RotateCcw
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
          <h3 className="font-bold text-lg mb-4 flex items-center"><Layout className="mr-2" size={20}/> Homepage Hero Banner</h3>
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

// --- Developer Settings (New Feature) ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState(config);
  
  // Sync logic
  useEffect(() => {
    if (config && Object.keys(config).length > 0) {
      setLocalConfig({
        ...config,
        // Ensure defaults exist if config is incomplete from DB
        theme: {
          primaryColor: '#2C251F',
          secondaryColor: '#D5CDC0',
          backgroundColor: '#F9F8F6',
          fontFamilySans: 'Inter',
          fontFamilySerif: 'Cormorant Garamond',
          borderRadius: '0px',
          ...config.theme
        },
        homepageSections: config.homepageSections || ['hero', 'categories', 'featured', 'promo', 'trust']
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
        homepageSections: ['hero', 'categories', 'featured', 'promo', 'trust']
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
    trust: 'Trust Badges'
  };

  if (!localConfig.theme) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold">Developer Settings</h1>
        <p className="text-gray-500">Advanced customization for theme and layout.</p>
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

        {/* Announcement Bar Settings (Reordered) */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-yellow-400">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Megaphone className="mr-2" size={20}/> Announcement Bar</h3>
          
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
               <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded border hover:bg-gray-100 transition-colors">
                 <input 
                   type="checkbox" 
                   className="w-5 h-5 accent-brand-900 rounded"
                   checked={localConfig.announcementEnabled || false} 
                   onChange={e => setLocalConfig({
                     ...localConfig, 
                     announcementEnabled: e.target.checked,
                     announcementBlink: e.target.checked
                   })}
                 />
                 <span className="font-medium text-sm">Announcement Bar</span>
               </label>
            </div>

            {localConfig.announcementEnabled && (
              <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up p-4 bg-gray-50 rounded">
                <Input 
                  label="Announcement Text" 
                  value={localConfig.announcementText || ''} 
                  placeholder="e.g., Free Shipping on Orders Over $50!" 
                  onChange={e => setLocalConfig({...localConfig, announcementText: e.target.value})} 
                />
                <Input 
                  label="Link URL (Optional)" 
                  value={localConfig.announcementLink || ''} 
                  placeholder="/shop" 
                  onChange={e => setLocalConfig({...localConfig, announcementLink: e.target.value})} 
                />
                
                <div>
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={localConfig.announcementBgColor || '#000000'} 
                      onChange={e => setLocalConfig({...localConfig, announcementBgColor: e.target.value})}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                    <Input 
                      value={localConfig.announcementBgColor || '#000000'} 
                      onChange={e => setLocalConfig({...localConfig, announcementBgColor: e.target.value})} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={localConfig.announcementTextColor || '#FFFFFF'} 
                      onChange={e => setLocalConfig({...localConfig, announcementTextColor: e.target.value})}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                    <Input 
                      value={localConfig.announcementTextColor || '#FFFFFF'} 
                      onChange={e => setLocalConfig({...localConfig, announcementTextColor: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Styling (New) */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-gray-800">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Footprints className="mr-2" size={20}/> Footer Styling</h3>
          
          <div className="grid md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded">
            <div>
              <label className="block text-sm font-medium mb-1">Footer Background Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={localConfig.footerBgColor || '#2C251F'} 
                  onChange={e => setLocalConfig({...localConfig, footerBgColor: e.target.value})}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input 
                  value={localConfig.footerBgColor || '#2C251F'} 
                  onChange={e => setLocalConfig({...localConfig, footerBgColor: e.target.value})} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Footer Text Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={localConfig.footerTextColor || '#F3F4F6'} 
                  onChange={e => setLocalConfig({...localConfig, footerTextColor: e.target.value})}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input 
                  value={localConfig.footerTextColor || '#F3F4F6'} 
                  onChange={e => setLocalConfig({...localConfig, footerTextColor: e.target.value})} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Reordering */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Move className="mr-2" size={20}/> Homepage Layout (Drag & Drop)</h3>
          <p className="text-sm text-gray-500 mb-4">Reorder the sections as they appear on the homepage.</p>
          
          <div className="space-y-2 max-w-lg">
            {localConfig.homepageSections?.map((sectionId, index) => (
              <div key={sectionId} className="flex items-center justify-between p-3 bg-gray-50 border rounded hover:bg-white hover:shadow-sm transition">
                <span className="font-medium capitalize">{sectionNames[sectionId] || sectionId}</span>
                <div className="flex gap-1">
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
            ))}
          </div>
        </div>

      </div>

      <div className="mt-8 pt-4 border-t flex justify-end gap-4">
         <Button onClick={handleReset} variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700">
            <RotateCcw size={16} className="mr-2" /> Reset Defaults
         </Button>
         <Button onClick={handleSave} size="lg">Save Configuration</Button>
      </div>
    </div>
  );
};


// --- User Management ---
export const AdminUsers: React.FC = () => {
  const { users, addUser, deleteUser, changeUserPassword } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<{
    username: string; 
    password: string; 
    role: 'admin' | 'staff'; 
    permissions: string[];
  }>({ username: '', password: '', role: 'staff', permissions: [] });
  
  const [passModalId, setPassModalId] = useState<string | null>(null);
  const [newPass, setNewPass] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addUser(newUser);
    setIsModalOpen(false);
    setNewUser({ username: '', password: '', role: 'staff', permissions: [] });
  };

  const handlePassUpdate = async () => {
    if(passModalId && newPass) {
      await changeUserPassword(passModalId, newPass);
      setPassModalId(null);
      setNewPass('');
      alert("Password updated");
    }
  };

  const togglePerm = (p: string) => {
    setNewUser(prev => ({
      ...prev,
      permissions: prev.permissions.includes(p) ? prev.permissions.filter(x => x !== p) : [...prev.permissions, p]
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold">User Management</h1>
        <Button onClick={() => setIsModalOpen(true)}><Plus size={16} className="mr-2" /> Add User</Button>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase">
             <tr>
               <th className="px-6 py-4">Username</th>
               <th className="px-6 py-4">Role</th>
               <th className="px-6 py-4">Permissions</th>
               <th className="px-6 py-4 text-right">Actions</th>
             </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b">
                <td className="px-6 py-4 font-medium flex items-center gap-2"><UserIcon size={16}/> {u.username}</td>
                <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded-full text-xs">{u.role}</span></td>
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {u.role === 'admin' ? 'All Access' : u.permissions.join(', ')}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setPassModalId(u.id)} className="text-blue-600 hover:text-blue-800 text-xs underline">Change Password</button>
                  {u.username !== 'admin' && (
                    <button onClick={() => deleteUser(u.id)} className="text-rose-600 hover:text-rose-800 text-xs underline">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="font-bold text-lg mb-4">Add New User</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input label="Username" required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
              <Input label="Password" type="password" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
              
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select 
                  className="w-full border p-2 text-sm" 
                  value={newUser.role} 
                  onChange={e => setNewUser({...newUser, role: e.target.value as 'admin' | 'staff'})}
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {newUser.role === 'staff' && (
                <div>
                   <label className="block text-sm font-medium mb-2">Permissions</label>
                   <div className="space-y-2">
                     {['products', 'orders', 'categories', 'settings', 'users'].map(p => (
                       <label key={p} className="flex items-center text-sm gap-2">
                         <input type="checkbox" checked={newUser.permissions.includes(p)} onChange={() => togglePerm(p)} />
                         <span className="capitalize">{p}</span>
                       </label>
                     ))}
                   </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passModalId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="font-bold text-lg mb-4">Reset Password</h3>
            <Input label="New Password" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="secondary" onClick={() => { setPassModalId(null); setNewPass(''); }}>Cancel</Button>
              <Button onClick={handlePassUpdate}>Update</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Categories Manager ---
export const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory, updateCategory } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', image: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, image: cat.image });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm({ name: '', image: '' });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catData: Category = {
      id: editingId || Date.now().toString(),
      name: form.name,
      image: form.image || 'https://via.placeholder.com/400x600?text=No+Image'
    };
    
    if (editingId) updateCategory(catData);
    else addCategory(catData);
    
    setIsFormOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold">Manage Categories</h1>
        <Button onClick={handleAddNew}><Plus size={16} className="mr-2" /> Add Category</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded shadow-sm overflow-hidden group relative">
            <div className="aspect-square relative">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                 <button onClick={() => handleEdit(cat)} className="bg-white p-2 rounded-full hover:bg-gray-200"><Edit size={16}/></button>
                 <button onClick={() => deleteCategory(cat.id)} className="bg-white p-2 rounded-full hover:bg-rose-100 text-rose-500"><Trash size={16}/></button>
              </div>
            </div>
            <div className="p-3 font-medium text-center border-t">{cat.name}</div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Category</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                    {form.image && <img src={form.image} className="w-full h-full object-cover" />}
                  </div>
                  <label className="cursor-pointer text-sm text-blue-600 hover:underline">
                    Upload Image
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Products Manager ---
export const AdminProducts: React.FC = () => {
  const { products, categories, deleteProduct, addProduct, updateProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Initialize with the first category ID if available, else empty
  const defaultCat = categories.length > 0 ? categories[0].name : '';

  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '', price: 0, discountPrice: undefined, category: defaultCat, description: '', images: [], sizes: ['S', 'M', 'L'], colors: [], stock: 10
  });

  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const openAddModal = () => {
    setEditingId(null);
    setNewProd({
      name: '', price: 0, discountPrice: undefined, category: categories.length > 0 ? categories[0].name : '', description: '', images: [], sizes: ['S', 'M', 'L'], colors: [], stock: 10
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setNewProd({ ...product });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProd(prev => ({ ...prev, images: [reader.result as string] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewProd(prev => ({ ...prev, images: [] }));
  };

  const addSize = (e: React.FormEvent) => {
    e.preventDefault();
    if(sizeInput && !newProd.sizes?.includes(sizeInput)) {
      setNewProd(prev => ({...prev, sizes: [...(prev.sizes || []), sizeInput]}));
      setSizeInput("");
    }
  };

  const removeSize = (s: string) => {
    setNewProd(prev => ({...prev, sizes: prev.sizes?.filter(x => x !== s)}));
  };

  const addColor = (e: React.FormEvent) => {
    e.preventDefault();
    if(colorInput && !newProd.colors?.includes(colorInput)) {
      setNewProd(prev => ({...prev, colors: [...(prev.colors || []), colorInput]}));
      setColorInput("");
    }
  };

  const removeColor = (c: string) => {
    setNewProd(prev => ({...prev, colors: prev.colors?.filter(x => x !== c)}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateProduct({ ...newProd, id: editingId } as Product);
    } else {
      const product: Product = {
        id: Date.now().toString(),
        name: newProd.name!,
        description: newProd.description || '',
        price: Number(newProd.price),
        discountPrice: newProd.discountPrice ? Number(newProd.discountPrice) : undefined,
        category: newProd.category || 'Uncategorized',
        images: newProd.images?.length ? newProd.images : ['https://via.placeholder.com/400x600'],
        sizes: newProd.sizes || ['S', 'M', 'L'],
        colors: newProd.colors || ['Black', 'White'],
        newArrival: true,
        bestSeller: false,
        stock: Number(newProd.stock)
      };
      addProduct(product);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold">Products</h1>
        <Button onClick={openAddModal}><Plus size={16} className="mr-2" /> Add Product</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded shadow-sm overflow-hidden flex flex-col group">
            <div className="h-48 bg-gray-100 relative overflow-hidden">
               <img src={p.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button onClick={() => openEditModal(p)} className="bg-white p-2 rounded-full hover:bg-gray-100 text-brand-900 transition"><Edit size={16}/></button>
                  <button onClick={() => deleteProduct(p.id)} className="bg-white p-2 rounded-full hover:bg-rose-50 text-rose-500 transition"><Trash size={16}/></button>
               </div>
               {p.discountPrice && (
                 <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">
                   SALE
                 </div>
               )}
            </div>
            <div className="p-4 flex-1">
              <h3 className="font-bold text-lg mb-1">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{p.category}</p>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                   <div>
                     <span className="font-bold text-brand-900">${p.discountPrice || p.price}</span>
                     {p.discountPrice && <span className="ml-2 text-xs text-gray-400 line-through">${p.price}</span>}
                   </div>
                   {/* Likes Counter for Admin */}
                   <div className="flex items-center text-xs text-rose-500 mt-1 font-medium">
                      <Heart size={12} className="mr-1 fill-current" /> {p.likes || 0} Likes
                   </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${p.stock < 5 ? 'bg-rose-100 text-rose-600' : 'bg-green-100 text-green-600'}`}>
                  {p.stock} in stock
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold font-serif">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-black" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <div className="flex items-start space-x-4">
                    <div className="w-32 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden relative">
                      {newProd.images?.[0] ? (
                        <>
                          <img src={newProd.images[0]} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={removeImage} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 text-white"><Trash size={20} /></button>
                        </>
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center p-4 text-center"><ImageIcon size={24} className="mb-2" /><span className="text-xs">No image</span></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer bg-white border border-gray-300 text-brand-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 inline-flex items-center transition">
                        <Upload size={16} className="mr-2" /> Upload Image
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                </div>

                <Input label="Product Name" required value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="md:col-span-2" />
                
                <Input label="Original Price ($)" type="number" required value={newProd.price} onChange={e => setNewProd({...newProd, price: +e.target.value})} />
                
                <div className="w-full">
                  <Input 
                    label="Discounted Price (Optional)" 
                    type="number" 
                    value={newProd.discountPrice || ''} 
                    onChange={e => setNewProd({...newProd, discountPrice: e.target.value ? +e.target.value : undefined})} 
                  />
                  {newProd.discountPrice && newProd.price && newProd.discountPrice < newProd.price && (
                    <p className="text-xs text-green-600 mt-1">
                      {Math.round(((newProd.price - newProd.discountPrice) / newProd.price) * 100)}% Off
                    </p>
                  )}
                </div>

                <Input label="Stock Quantity" type="number" required value={newProd.stock} onChange={e => setNewProd({...newProd, stock: +e.target.value})} />
                
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    className="w-full border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-800" 
                    value={newProd.category}
                    onChange={e => setNewProd({...newProd, category: e.target.value})}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                
                {/* Dynamic Size & Color Inputs */}
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Available Sizes</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      className="flex-1 border border-gray-200 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-800"
                      placeholder="e.g. XL, 38, Free Size"
                      value={sizeInput}
                      onChange={e => setSizeInput(e.target.value)}
                    />
                    <button onClick={addSize} className="bg-brand-100 text-brand-900 px-3 py-1 text-xs font-bold hover:bg-brand-200">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProd.sizes?.map(s => (
                      <span key={s} className="bg-gray-100 text-xs px-2 py-1 rounded flex items-center gap-1">
                        {s} <button type="button" onClick={() => removeSize(s)} className="text-gray-400 hover:text-red-500"><X size={12}/></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Available Colors</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      className="flex-1 border border-gray-200 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-800"
                      placeholder="e.g. Red, Navy Blue"
                      value={colorInput}
                      onChange={e => setColorInput(e.target.value)}
                    />
                    <button onClick={addColor} className="bg-brand-100 text-brand-900 px-3 py-1 text-xs font-bold hover:bg-brand-200">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProd.colors?.map(c => (
                      <span key={c} className="bg-gray-100 text-xs px-2 py-1 rounded flex items-center gap-1">
                        {c} <button type="button" onClick={() => removeColor(c)} className="text-gray-400 hover:text-red-500"><X size={12}/></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full">
                   <label className="block text-sm font-medium mb-1">Status</label>
                   <div className="flex gap-4 mt-2">
                     <label className="flex items-center text-sm cursor-pointer"><input type="checkbox" className="mr-2" checked={newProd.newArrival} onChange={e => setNewProd({...newProd, newArrival: e.target.checked})} />New Arrival</label>
                     <label className="flex items-center text-sm cursor-pointer"><input type="checkbox" className="mr-2" checked={newProd.bestSeller} onChange={e => setNewProd({...newProd, bestSeller: e.target.checked})} />Best Seller</label>
                   </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="w-full border border-gray-200 p-3 text-sm min-h-[100px]" value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})}></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">{editingId ? 'Update Product' : 'Create Product'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Orders Manager ---
export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">Manage Orders</h1>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase">
            <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Action</th></tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4"><div>{order.customerName}</div><div className="text-xs text-gray-500">{order.email}</div></td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">${order.total}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span></td>
                <td className="px-6 py-4"><select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as any)} className="border text-xs p-1 rounded bg-white"><option>Pending</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

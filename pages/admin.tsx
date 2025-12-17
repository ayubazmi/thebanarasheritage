
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { Product, Category, User, SiteConfig } from '../types';
import { 
  Plus, Trash, Edit, Package, ShoppingCart, DollarSign, TrendingUp, 
  Upload, Image as ImageIcon, X, Settings, List, Layout, User as UserIcon, Lock, Megaphone, Video, Hexagon, Type, ShieldCheck, Share2, Heart,
  FileText, Footprints, Palette, Code2, ArrowUp, ArrowDown, Move, RotateCcw, MonitorPlay, AlignLeft, AlignCenter, AlignRight
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

        {/* Hero Section */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center"><Layout className="mr-2" size={20}/> Homepage Hero Banner (Static Mode)</h3>
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
                       title="Delete Image"
                     >
                       <Trash size={32} />
                     </button>
                   )}
                 </>
               )}
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
          <h3 className="font-bold text-lg mb-4 flex items-center"><Megaphone className="mr-2" size={20}/> Sale Section</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Input label="Banner Title" value={localConfig.promoTitle || ''} placeholder="Summer Sale is Live" onChange={e => setLocalConfig({...localConfig, promoTitle: e.target.value})} />
              <div className="col-span-1">
                <label className="block text-sm font-medium mb-1">Banner Description</label>
                <textarea className="w-full border p-2 text-sm h-24" value={localConfig.promoText || ''} placeholder="Get up to 50% off..." onChange={e => setLocalConfig({...localConfig, promoText: e.target.value})}></textarea>
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
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center"><ShieldCheck className="mr-2" size={20}/> Trust Badges</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 bg-gray-50 rounded">
              <Input label="Badge 1 Title" value={localConfig.trustBadge1Title || ''} onChange={e => setLocalConfig({...localConfig, trustBadge1Title: e.target.value})} />
              <Input label="Badge 1 Text" value={localConfig.trustBadge1Text || ''} onChange={e => setLocalConfig({...localConfig, trustBadge1Text: e.target.value})} />
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded">
              <Input label="Badge 2 Title" value={localConfig.trustBadge2Title || ''} onChange={e => setLocalConfig({...localConfig, trustBadge2Title: e.target.value})} />
              <Input label="Badge 2 Text" value={localConfig.trustBadge2Text || ''} onChange={e => setLocalConfig({...localConfig, trustBadge2Text: e.target.value})} />
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded">
              <Input label="Badge 3 Title" value={localConfig.trustBadge3Title || ''} onChange={e => setLocalConfig({...localConfig, trustBadge3Title: e.target.value})} />
              <Input label="Badge 3 Text" value={localConfig.trustBadge3Text || ''} onChange={e => setLocalConfig({...localConfig, trustBadge3Text: e.target.value})} />
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
        homepageSections: config.homepageSections || ['hero', 'categories', 'featured', 'promo', 'trust'],
        heroImages: config.heroImages || [],
        heroMode: config.heroMode || 'static',
        // Migration: ensure slides array exists, converting legacy images if needed
        secondarySlideshows: (config.secondarySlideshows || []).map(s => ({
          ...s,
          slides: (s.slides && s.slides.length > 0) ? s.slides : (s.images || []).map(img => ({ image: img, title: '', subtitle: '' }))
        })),
        heroTextColor: config.heroTextColor || '#FFFFFF',
        heroTextAlign: config.heroTextAlign || 'center',
        heroFontSize: config.heroFontSize || 'md',
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
        homepageSections: ['hero', 'categories', 'featured', 'promo', 'trust'],
        heroImages: [],
        heroMode: 'static',
        heroTextColor: '#FFFFFF',
        heroTextAlign: 'center',
        heroFontSize: 'md',
        secondarySlideshows: []
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

  // --- Hero Slideshow Handlers ---
  const handleAddHeroSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalConfig(prev => ({ 
           ...prev, 
           heroImages: [...(prev.heroImages || []), reader.result as string] 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeHeroSlide = (index: number) => {
    setLocalConfig(prev => ({
       ...prev,
       heroImages: prev.heroImages?.filter((_, i) => i !== index)
    }));
  };

  // --- Secondary Slideshow Handlers (New) ---
  const addSecondarySlideshow = () => {
     const newId = `slideshow_${Date.now()}`;
     const newSlideshow = { 
       id: newId, 
       title: `New Slideshow`, 
       slides: [],
       images: [],
       textColor: '#2C251F', // Default dark
       textAlign: 'center' as const,
       fontSize: 'md' as const
     };
     
     setLocalConfig(prev => ({
        ...prev,
        secondarySlideshows: [...(prev.secondarySlideshows || []), newSlideshow],
        homepageSections: [...(prev.homepageSections || []), newId]
     }));
  };

  const removeSecondarySlideshow = (id: string) => {
    if(window.confirm("Delete this slideshow section?")) {
      setLocalConfig(prev => ({
          ...prev,
          secondarySlideshows: prev.secondarySlideshows?.filter(s => s.id !== id),
          homepageSections: prev.homepageSections?.filter(sid => sid !== id)
      }));
    }
  };

  const updateSlideshowTitle = (id: string, title: string) => {
    setLocalConfig(prev => ({
       ...prev,
       secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === id ? { ...s, title } : s)
    }));
  };

  const updateSlideshowStyle = (id: string, field: string, value: any) => {
    setLocalConfig(prev => ({
       ...prev,
       secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const addSlideToSlideshow = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
         setLocalConfig(prev => ({
            ...prev,
            secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === id ? { 
                ...s, 
                slides: [...s.slides, { image: reader.result as string, title: '', subtitle: '' }] 
            } : s)
         }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSlideFromSlideshow = (id: string, idx: number) => {
    setLocalConfig(prev => ({
       ...prev,
       secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === id ? { 
          ...s, 
          slides: s.slides.filter((_, i) => i !== idx) 
       } : s)
    }));
  };

  const updateSlideText = (id: string, idx: number, field: 'title' | 'subtitle', value: string) => {
    setLocalConfig(prev => ({
       ...prev,
       secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === id ? { 
          ...s, 
          slides: s.slides.map((slide, i) => i === idx ? { ...slide, [field]: value } : slide)
       } : s)
    }));
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

  // Helper to get display name for sections
  const getSectionName = (id: string) => {
     if(sectionNames[id]) return sectionNames[id];
     const slideshow = localConfig.secondarySlideshows?.find(s => s.id === id);
     if(slideshow) return `Slideshow: ${slideshow.title || 'Untitled'}`;
     return id; // Fallback
  };

  // Reusable Styling Controls Component
  const TextStylingControls = ({ 
    textColor, textAlign, fontSize, 
    onChangeColor, onChangeAlign, onChangeSize 
  }: any) => (
    <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded border border-gray-200">
       <div className="flex items-center gap-2">
         <input 
           type="color" 
           value={textColor || '#000000'} 
           onChange={(e) => onChangeColor(e.target.value)} 
           className="w-8 h-8 rounded cursor-pointer border-0 p-0"
         />
       </div>
       <div className="flex border rounded overflow-hidden">
         <button onClick={() => onChangeAlign('left')} className={`p-2 hover:bg-gray-100 ${textAlign === 'left' ? 'bg-gray-200' : 'bg-white'}`} title="Left"><AlignLeft size={16}/></button>
         <button onClick={() => onChangeAlign('center')} className={`p-2 hover:bg-gray-100 ${textAlign === 'center' ? 'bg-gray-200' : 'bg-white'}`} title="Center"><AlignCenter size={16}/></button>
         <button onClick={() => onChangeAlign('right')} className={`p-2 hover:bg-gray-100 ${textAlign === 'right' ? 'bg-gray-200' : 'bg-white'}`} title="Right"><AlignRight size={16}/></button>
       </div>
       <div className="flex border rounded overflow-hidden text-xs font-bold">
         <button onClick={() => onChangeSize('sm')} className={`px-3 py-2 hover:bg-gray-100 ${fontSize === 'sm' ? 'bg-gray-200' : 'bg-white'}`}>S</button>
         <button onClick={() => onChangeSize('md')} className={`px-3 py-2 hover:bg-gray-100 ${fontSize === 'md' ? 'bg-gray-200' : 'bg-white'}`}>M</button>
         <button onClick={() => onChangeSize('lg')} className={`px-3 py-2 hover:bg-gray-100 ${fontSize === 'lg' ? 'bg-gray-200' : 'bg-white'}`}>L</button>
       </div>
    </div>
  );

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
        
        {/* Hero Slideshow */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-purple-500">
           {/* ... Hero Content ... */}
           {/* For brevity, assume existing Hero logic is here */}
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center"><ImageIcon className="mr-2" size={20}/> Hero Section Mode</h3>
           </div>
           
           <div className="flex flex-col md:flex-row gap-4 mb-6">
              <label className={`flex-1 p-4 border rounded cursor-pointer transition-all ${localConfig.heroMode === 'static' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                      <input type="radio" name="heroMode" value="static" checked={localConfig.heroMode === 'static' || !localConfig.heroMode} onChange={() => setLocalConfig({...localConfig, heroMode: 'static'})} className="accent-purple-600" />
                      <span className="font-bold text-brand-900">Static Image / Video</span>
                  </div>
              </label>

              <label className={`flex-1 p-4 border rounded cursor-pointer transition-all ${localConfig.heroMode === 'slideshow' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                      <input type="radio" name="heroMode" value="slideshow" checked={localConfig.heroMode === 'slideshow'} onChange={() => setLocalConfig({...localConfig, heroMode: 'slideshow'})} className="accent-purple-600" />
                      <span className="font-bold text-brand-900">Slideshow Carousel</span>
                  </div>
              </label>
           </div>
           
           {localConfig.heroMode === 'slideshow' && (
            <div className="animate-fade-in-up space-y-6">
              <div className="bg-purple-50 p-4 rounded border border-purple-100">
                 <h4 className="font-bold text-sm text-purple-900 mb-3">Hero Text Styling</h4>
                 <TextStylingControls 
                    textColor={localConfig.heroTextColor}
                    textAlign={localConfig.heroTextAlign}
                    fontSize={localConfig.heroFontSize}
                    onChangeColor={(v: string) => setLocalConfig({...localConfig, heroTextColor: v})}
                    onChangeAlign={(v: any) => setLocalConfig({...localConfig, heroTextAlign: v})}
                    onChangeSize={(v: any) => setLocalConfig({...localConfig, heroFontSize: v})}
                 />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {localConfig.heroImages?.map((img, idx) => (
                  <div key={idx} className="relative group aspect-video bg-gray-100 rounded overflow-hidden border">
                    <img src={img} className="w-full h-full object-cover" alt={`Slide ${idx + 1}`} />
                    <button onClick={() => removeHeroSlide(idx)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={24} /></button>
                  </div>
                ))}
                <label className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-900 transition-colors aspect-video">
                   <Plus className="text-gray-400 mb-2" size={24}/>
                   <span className="text-sm text-gray-500 font-medium">Add Slide</span>
                   <input type="file" className="hidden" accept="image/*" onChange={handleAddHeroSlide} />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Additional Slideshows (New Feature Updated) */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-indigo-500">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center"><MonitorPlay className="mr-2" size={20}/> Additional Slideshow Sections</h3>
              <Button onClick={addSecondarySlideshow} size="sm"><Plus size={16} className="mr-1"/> Add New Slideshow</Button>
          </div>
          <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded">
             You can add multiple standalone slideshow carousels to the homepage. Each slide can have text overlaid.
          </p>
          
          <div className="space-y-8">
             {localConfig.secondarySlideshows?.map((slideshow, index) => (
               <div key={slideshow.id} className="border p-6 rounded relative bg-gray-50/50">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                     <div className="flex-1 w-full md:w-auto">
                        <Input 
                          label="Section Title (Optional)" 
                          value={slideshow.title || ''} 
                          onChange={(e) => updateSlideshowTitle(slideshow.id, e.target.value)} 
                          placeholder="e.g. Summer Highlights"
                        />
                     </div>
                     
                     <div className="flex-1 w-full md:w-auto">
                        <label className="block text-sm font-medium mb-1">Text Styling (Section & Overlay)</label>
                        <TextStylingControls 
                          textColor={slideshow.textColor}
                          textAlign={slideshow.textAlign}
                          fontSize={slideshow.fontSize}
                          onChangeColor={(v: string) => updateSlideshowStyle(slideshow.id, 'textColor', v)}
                          onChangeAlign={(v: any) => updateSlideshowStyle(slideshow.id, 'textAlign', v)}
                          onChangeSize={(v: any) => updateSlideshowStyle(slideshow.id, 'fontSize', v)}
                        />
                     </div>

                     <button onClick={() => removeSecondarySlideshow(slideshow.id)} className="text-rose-500 hover:text-rose-700 p-2"><Trash size={20}/></button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {slideshow.slides.map((slide, slideIdx) => (
                      <div key={slideIdx} className="relative group bg-white rounded border overflow-hidden p-2 flex gap-4">
                        <div className="w-1/3 aspect-square bg-gray-200 rounded overflow-hidden relative">
                           <img src={slide.image} className="w-full h-full object-cover" alt="" />
                           <button 
                              onClick={() => removeSlideFromSlideshow(slideshow.id, slideIdx)}
                              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash size={20} />
                            </button>
                        </div>
                        <div className="flex-1 space-y-2">
                           <p className="text-xs font-bold text-gray-500">Slide #{slideIdx + 1} Content</p>
                           <Input 
                             placeholder="Title Overlay" 
                             value={slide.title || ''} 
                             onChange={(e) => updateSlideText(slideshow.id, slideIdx, 'title', e.target.value)} 
                           />
                           <Input 
                             placeholder="Subtitle Overlay" 
                             value={slide.subtitle || ''} 
                             onChange={(e) => updateSlideText(slideshow.id, slideIdx, 'subtitle', e.target.value)} 
                           />
                        </div>
                      </div>
                    ))}
                    
                    <label className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-brand-900 transition-colors min-h-[150px]">
                       <Plus className="text-gray-400 mb-1" size={20}/>
                       <span className="text-xs text-gray-500 font-medium">Add Slide</span>
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => addSlideToSlideshow(slideshow.id, e)} />
                    </label>
                  </div>
               </div>
             ))}
             {(!localConfig.secondarySlideshows || localConfig.secondarySlideshows.length === 0) && (
               <p className="text-center text-gray-400 italic">No additional slideshows added yet.</p>
             )}
          </div>
        </div>

        {/* Section Reordering */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Move className="mr-2" size={20}/> Homepage Layout (Drag & Drop)</h3>
          <p className="text-sm text-gray-500 mb-4">Reorder the sections as they appear on the homepage.</p>
          
          <div className="space-y-2 max-w-lg">
            {localConfig.homepageSections?.map((sectionId, index) => (
              <div key={sectionId} className="flex items-center justify-between p-3 bg-gray-50 border rounded hover:bg-white hover:shadow-sm transition group">
                <span className="font-medium capitalize flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs mr-3 font-bold text-gray-600">{index + 1}</div>
                  {getSectionName(sectionId)}
                </span>
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

export const AdminUsers: React.FC = () => {
  const { users, addUser, deleteUser } = useStore();
  const [form, setForm] = useState({ username: '', password: '', role: 'staff' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) return;
    await addUser({ 
      username: form.username, 
      password: form.password, 
      role: form.role as any,
      permissions: form.role === 'admin' ? [] : ['products', 'orders'] 
    });
    setForm({ username: '', password: '', role: 'staff' });
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">User Management</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded shadow-sm h-fit">
          <h3 className="font-bold mb-4">Add User</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <Input label="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
            <Input label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <div>
               <label className="block text-sm font-medium mb-1">Role</label>
               <select className="w-full border p-2 rounded" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                 <option value="staff">Staff</option>
                 <option value="admin">Admin</option>
               </select>
            </div>
            <Button type="submit" className="w-full">Create User</Button>
          </form>
        </div>
        <div className="md:col-span-2 bg-white rounded shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Permissions</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-6 py-4 font-medium">{u.username}</td>
                  <td className="px-6 py-4"><Badge color={u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'}>{u.role}</Badge></td>
                  <td className="px-6 py-4 text-xs text-gray-500">{u.permissions?.join(', ') || 'All'}</td>
                  <td className="px-6 py-4">
                    {u.username !== 'admin' && (
                      <button onClick={() => deleteUser(u.id)} className="text-rose-500 hover:text-rose-700"><Trash size={18}/></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useStore();
  const [newCat, setNewCat] = useState({ name: '', image: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newCat.name) return;
    await addCategory({ id: Date.now().toString(), ...newCat });
    setNewCat({ name: '', image: '' });
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">Categories</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow-sm h-fit">
          <h3 className="font-bold mb-4">Add Category</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <Input label="Name" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} />
            <Input label="Image URL" value={newCat.image} onChange={e => setNewCat({...newCat, image: e.target.value})} />
            <Button type="submit">Add Category</Button>
          </form>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
           <h3 className="font-bold mb-4">Existing Categories</h3>
           <ul className="space-y-4">
             {categories.map(c => (
               <li key={c.id} className="flex items-center justify-between border-b pb-2">
                 <div className="flex items-center space-x-3">
                   <img src={c.image} className="w-10 h-10 object-cover rounded" alt="" />
                   <span>{c.name}</span>
                 </div>
                 <button onClick={() => deleteCategory(c.id)} className="text-rose-500 hover:text-rose-700"><Trash size={18} /></button>
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>
  );
};

export const AdminProducts: React.FC = () => {
  const { products, addProduct, deleteProduct, categories } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({
    name: '', price: 0, category: '', description: '', images: [], sizes: [], colors: [], stock: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.name || !form.price) return;
    
    await addProduct({
      id: Date.now().toString(),
      name: form.name!,
      description: form.description || '',
      price: Number(form.price),
      category: form.category || 'Kurtis',
      images: form.images?.length ? form.images : ['https://placehold.co/600x800'],
      sizes: form.sizes || [],
      colors: form.colors || [],
      newArrival: true,
      bestSeller: false,
      stock: Number(form.stock) || 0
    });
    setForm({ name: '', price: 0, category: '', description: '', images: [], sizes: [], colors: [], stock: 0 });
    setIsEditing(false);
    alert("Product added!");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold">Products</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Add Product'}</Button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded shadow-sm mb-8">
           <h3 className="font-bold mb-4">New Product</h3>
           <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
             <Input label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
             <Input label="Price" type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
             <div className="col-span-2">
               <label className="block text-sm font-medium mb-1">Category</label>
               <select className="w-full border p-2 rounded" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                 <option value="">Select...</option>
                 {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
               </select>
             </div>
             <Input label="Image URL (comma sep for multiple)" className="col-span-2" placeholder="http://..." onChange={e => setForm({...form, images: e.target.value?.split(',')})} />
             <Input label="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
             <Button type="submit" className="col-span-2">Save Product</Button>
           </form>
        </div>
      )}

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4"><img src={p.images[0]} className="w-12 h-16 object-cover" alt="" /></td>
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4">${p.price}</td>
                <td className="px-6 py-4">{p.category}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteProduct(p.id)} className="text-rose-500 hover:text-rose-700"><Trash size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">Orders</h1>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(o => (
              <tr key={o.id}>
                <td className="px-6 py-4 font-mono">{o.id.substring(0, 8)}...</td>
                <td className="px-6 py-4">{o.date}</td>
                <td className="px-6 py-4">
                  <div>{o.customerName}</div>
                  <div className="text-xs text-gray-400">{o.email}</div>
                </td>
                <td className="px-6 py-4">{o.items.length} items</td>
                <td className="px-6 py-4 font-bold">${o.total}</td>
                <td className="px-6 py-4">
                  <select 
                    value={o.status} 
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                    className="border-none bg-transparent font-medium focus:ring-0 cursor-pointer text-brand-900"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { Product, Category, User, SiteConfig, Page } from '../types';
import { 
  Plus, Trash, Edit, Package, ShoppingCart, DollarSign, TrendingUp, 
  Upload, Image as ImageIcon, X, Settings, List, Layout, User as UserIcon, Lock, Megaphone, Video, Hexagon, Type, ShieldCheck, Share2, Heart,
  FileText, Footprints, Palette, Code2, ArrowUp, ArrowDown, Move, RotateCcw, MonitorPlay, AlignLeft, AlignCenter, AlignRight, PanelTop, File
} from 'lucide-react';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000';
const DEFAULT_PROMO_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';

// Helper to read multiple files
const readFiles = (files: FileList): Promise<string[]> => {
  return Promise.all(Array.from(files).map(file => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })));
};

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

// --- Pages Manager ---
export const AdminPages: React.FC = () => {
  const { pages, addPage, updatePage, deletePage } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [pageForm, setPageForm] = useState<Partial<Page>>({
    title: '', 
    slug: '', 
    content: '', 
    showInNav: false, 
    showInFooter: false,
    textColor: '#2C251F',
    textAlign: 'left',
    fontSize: 'md'
  });

  const openAddModal = () => {
    setEditingId(null);
    setPageForm({ 
        title: '', 
        slug: '', 
        content: '', 
        showInNav: false, 
        showInFooter: false,
        textColor: '#2C251F',
        textAlign: 'left',
        fontSize: 'md'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (page: Page) => {
    setEditingId(page.id);
    setPageForm({ ...page });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Page = {
        id: editingId || Date.now().toString(),
        title: pageForm.title!,
        slug: pageForm.slug!,
        content: pageForm.content || '',
        showInNav: pageForm.showInNav || false,
        showInFooter: pageForm.showInFooter || false,
        textColor: pageForm.textColor || '#2C251F',
        textAlign: pageForm.textAlign || 'left',
        fontSize: pageForm.fontSize || 'md'
      };

      if (editingId) {
        await updatePage(payload);
      } else {
        await addPage(payload);
      }
      setIsModalOpen(false);
    } catch (e: any) {
      alert("Error saving page: " + e.message);
    }
  };

  const handleSlugGen = () => {
    if (pageForm.title) {
      setPageForm(prev => ({
        ...prev,
        slug: prev.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      }));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold">Custom Content Pages</h1>
        <Button onClick={openAddModal}><Plus size={16} className="mr-2" /> Create New Page</Button>
      </div>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">URL Slug</th>
              <th className="px-6 py-4">Visibility</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium flex items-center gap-2">
                  <File size={16} className="text-gray-400" />
                  {page.title}
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">/pages/{page.slug}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {page.showInNav && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Nav</span>}
                    {page.showInFooter && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Footer</span>}
                    {!page.showInNav && !page.showInFooter && <span className="text-gray-400 text-xs italic">Hidden</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEditModal(page)} className="text-blue-600 hover:text-blue-800 underline">Edit</button>
                  <button onClick={() => { if(window.confirm('Delete this page?')) deletePage(page.id) }} className="text-rose-600 hover:text-rose-800 underline">Delete</button>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No custom pages found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold font-serif">{editingId ? 'Edit Page' : 'Create New Page'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-black" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Page Title" required value={pageForm.title} onChange={e => setPageForm({...pageForm, title: e.target.value})} onBlur={handleSlugGen} />
                <Input label="URL Slug (e.g., store-list)" required value={pageForm.slug} onChange={e => setPageForm({...pageForm, slug: e.target.value})} />
                <div className="md:col-span-2 flex flex-col gap-4">
                  <label className="block text-sm font-medium">Page Visibility</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded hover:bg-gray-50">
                        <input type="checkbox" checked={pageForm.showInNav} onChange={e => setPageForm({...pageForm, showInNav: e.target.checked})} />
                        <span className="text-sm font-medium">Show in Header Navigation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded hover:bg-gray-50">
                        <input type="checkbox" checked={pageForm.showInFooter} onChange={e => setPageForm({...pageForm, showInFooter: e.target.checked})} />
                        <span className="text-sm font-medium">Show in Footer Links</span>
                    </label>
                  </div>
                </div>
                {/* Styling controls simplified */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded border">
                   <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2"><Palette size={16}/> Text Styling</h4>
                   <div className="flex flex-wrap items-center gap-6">
                      <div className="flex flex-col gap-1">
                         <span className="text-xs font-bold text-gray-500">Color</span>
                         <input type="color" value={pageForm.textColor || '#2C251F'} onChange={e => setPageForm({...pageForm, textColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-xs font-bold text-gray-500">Alignment</span>
                         <div className="flex border rounded overflow-hidden bg-white">
                            <button type="button" onClick={() => setPageForm({...pageForm, textAlign: 'left'})} className={`p-2 hover:bg-gray-100 ${pageForm.textAlign === 'left' ? 'bg-gray-200' : ''}`}><AlignLeft size={16}/></button>
                            <button type="button" onClick={() => setPageForm({...pageForm, textAlign: 'center'})} className={`p-2 hover:bg-gray-100 ${pageForm.textAlign === 'center' ? 'bg-gray-200' : ''}`}><AlignCenter size={16}/></button>
                            <button type="button" onClick={() => setPageForm({...pageForm, textAlign: 'right'})} className={`p-2 hover:bg-gray-100 ${pageForm.textAlign === 'right' ? 'bg-gray-200' : ''}`}><AlignRight size={16}/></button>
                         </div>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-xs font-bold text-gray-500">Size</span>
                         <div className="flex border rounded overflow-hidden bg-white text-xs font-bold">
                            <button type="button" onClick={() => setPageForm({...pageForm, fontSize: 'sm'})} className={`px-3 py-2 hover:bg-gray-100 ${pageForm.fontSize === 'sm' ? 'bg-gray-200' : ''}`}>Small</button>
                            <button type="button" onClick={() => setPageForm({...pageForm, fontSize: 'md'})} className={`px-3 py-2 hover:bg-gray-100 ${pageForm.fontSize === 'md' ? 'bg-gray-200' : ''}`}>Normal</button>
                            <button type="button" onClick={() => setPageForm({...pageForm, fontSize: 'lg'})} className={`px-3 py-2 hover:bg-gray-100 ${pageForm.fontSize === 'lg' ? 'bg-gray-200' : ''}`}>Large</button>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Page Content (HTML Allowed)</label>
                  <textarea className="w-full border border-gray-200 p-4 text-sm min-h-[400px] font-mono rounded" value={pageForm.content} onChange={e => setPageForm({...pageForm, content: e.target.value})} placeholder="<h1>Our Stores</h1><p>Store content goes here...</p>"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">{editingId ? 'Update Page' : 'Create Page'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Developer Settings ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState(config);
  
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
        homepageSections: config.homepageSections || ['hero', 'categories', 'featured', 'promo', 'trust'],
        heroImages: config.heroImages || [],
        heroMode: config.heroMode || 'static',
        secondarySlideshows: (config.secondarySlideshows || []).map(s => ({
          ...s,
          slides: (s.slides && s.slides.length > 0) 
            ? s.slides 
            : (s.images || []).map(img => ({ image: img, title: '', subtitle: '', textColor: '' })),
          direction: s.direction || 'horizontal'
        })),
        verticalCarousels: config.verticalCarousels || [],
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
        footerBgColor: '#2C251F',
        footerTextColor: '#F3F4F6',
        announcementEnabled: false,
        announcementBlink: false,
        announcementBgColor: '#000000',
        announcementTextColor: '#FFFFFF',
        heroImages: [],
        heroMode: 'static',
        heroTextColor: '#FFFFFF',
        heroTextAlign: 'center',
        heroFontSize: 'md',
        secondarySlideshows: [],
        verticalCarousels: []
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
  const handleAddHeroSlide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const base64s = await readFiles(files);
      setLocalConfig(prev => ({ 
         ...prev, 
         heroImages: [...(prev.heroImages || []), ...base64s] 
      }));
    }
  };

  const removeHeroSlide = (index: number) => {
    setLocalConfig(prev => ({
       ...prev,
       heroImages: prev.heroImages?.filter((_, i) => i !== index)
    }));
  };

  // --- Secondary Slideshow Handlers ---
  const addSecondarySlideshow = () => {
     const newId = `slideshow_${Date.now()}`;
     const newSlideshow = { 
       id: newId, 
       title: `New Slideshow`, 
       images: [],
       slides: [], 
       textColor: '#2C251F',
       textAlign: 'center' as const,
       fontSize: 'md' as const,
       direction: 'horizontal' as const
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

  const addSlideToSlideshow = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const base64s = await readFiles(files);
      const newSlides = base64s.map(img => ({ image: img, title: '', subtitle: '', textColor: '' }));
      setLocalConfig(prev => ({
         ...prev,
         secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === id ? { 
             ...s, 
             slides: [...(s.slides || []), ...newSlides] 
         } : s)
      }));
    }
  };

  const removeSlideFromSlideshow = (id: string, slideIndex: number) => {
    setLocalConfig(prev => ({
       ...prev,
       secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === id ? { ...s, slides: s.slides.filter((_, i) => i !== slideIndex) } : s)
    }));
  };

  const updateSlideField = (id: string, slideIndex: number, field: string, value: string) => {
    setLocalConfig(prev => ({
       ...prev,
       secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === id ? { 
          ...s, 
          slides: s.slides.map((slide, i) => i === slideIndex ? { ...slide, [field]: value } : slide)
       } : s)
    }));
  };

  // --- Vertical Carousel Handlers ---
  const addVerticalCarousel = () => {
     const newId = `vcarousel_${Date.now()}`;
     const newCarousel = { 
       id: newId, 
       title: `New Vertical Carousel`, 
       slides: []
     };
     setLocalConfig(prev => ({
        ...prev,
        verticalCarousels: [...(prev.verticalCarousels || []), newCarousel],
        homepageSections: [...(prev.homepageSections || []), newId]
     }));
  };

  const removeVerticalCarousel = (id: string) => {
    if(window.confirm("Delete this vertical carousel section?")) {
      setLocalConfig(prev => ({
          ...prev,
          verticalCarousels: prev.verticalCarousels?.filter(c => c.id !== id),
          homepageSections: prev.homepageSections?.filter(sid => sid !== id)
      }));
    }
  };

  const updateVerticalCarouselTitle = (id: string, title: string) => {
    setLocalConfig(prev => ({
       ...prev,
       verticalCarousels: prev.verticalCarousels?.map(c => c.id === id ? { ...c, title } : c)
    }));
  };

  const addSlideToVerticalCarousel = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const base64s = await readFiles(files);
      const newSlides = base64s.map(img => ({ image: img, title: '', subtitle: '', textColor: '' }));
      setLocalConfig(prev => ({
         ...prev,
         verticalCarousels: prev.verticalCarousels?.map(c => c.id === id ? { 
             ...c, 
             slides: [...(c.slides || []), ...newSlides] 
         } : c)
      }));
    }
  };

  const removeSlideFromVerticalCarousel = (id: string, slideIndex: number) => {
    setLocalConfig(prev => ({
       ...prev,
       verticalCarousels: prev.verticalCarousels?.map(c => c.id === id ? { ...c, slides: c.slides.filter((_, i) => i !== slideIndex) } : c)
    }));
  };

  const updateVerticalSlideField = (id: string, slideIndex: number, field: string, value: string) => {
    setLocalConfig(prev => ({
       ...prev,
       verticalCarousels: prev.verticalCarousels?.map(c => c.id === id ? { 
          ...c, 
          slides: c.slides.map((slide, i) => i === slideIndex ? { ...slide, [field]: value } : slide)
       } : c)
    }));
  };

  const sectionNames: Record<string, string> = {
    hero: 'Hero Banner',
    categories: 'Categories Grid',
    featured: 'Featured Products',
    promo: 'Promotional Banner',
    trust: 'Trust Badges'
  };

  const getSectionName = (id: string) => {
     if(sectionNames[id]) return sectionNames[id];
     const slideshow = localConfig.secondarySlideshows?.find(s => s.id === id);
     if(slideshow) return `Slideshow: ${slideshow.title || 'Untitled'}`;
     const vcarousel = localConfig.verticalCarousels?.find(v => v.id === id);
     if(vcarousel) return `Vertical Carousel: ${vcarousel.title || 'Untitled'}`;
     return id;
  };

  const TextStylingControls = ({ textColor, textAlign, fontSize, onChangeColor, onChangeAlign, onChangeSize }: any) => (
    <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded border border-gray-200">
       <div className="flex items-center gap-2">
         <input type="color" value={textColor || '#000000'} onChange={(e) => onChangeColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
       </div>
       <div className="flex border rounded overflow-hidden">
         <button onClick={() => onChangeAlign('left')} className={`p-2 hover:bg-gray-100 ${textAlign === 'left' ? 'bg-gray-200' : 'bg-white'}`}><AlignLeft size={16}/></button>
         <button onClick={() => onChangeAlign('center')} className={`p-2 hover:bg-gray-100 ${textAlign === 'center' ? 'bg-gray-200' : 'bg-white'}`}><AlignCenter size={16}/></button>
         <button onClick={() => onChangeAlign('right')} className={`p-2 hover:bg-gray-100 ${textAlign === 'right' ? 'bg-gray-200' : 'bg-white'}`}><AlignRight size={16}/></button>
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
        {/* Hero Slideshow */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-purple-500">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center"><ImageIcon className="mr-2" size={20}/> Hero Section Mode</h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
              <label className={`flex-1 p-4 border rounded cursor-pointer transition-all ${localConfig.heroMode === 'static' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                      <input type="radio" name="heroMode" value="static" checked={localConfig.heroMode === 'static' || !localConfig.heroMode} onChange={() => setLocalConfig({...localConfig, heroMode: 'static'})} className="accent-purple-600" />
                      <span className="font-bold text-brand-900">Static Image / Video</span>
                  </div>
                  <p className="text-xs text-gray-500 pl-6">Displays the single hero image or video configured in "Content & Settings".</p>
              </label>

              <label className={`flex-1 p-4 border rounded cursor-pointer transition-all ${localConfig.heroMode === 'slideshow' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                      <input type="radio" name="heroMode" value="slideshow" checked={localConfig.heroMode === 'slideshow'} onChange={() => setLocalConfig({...localConfig, heroMode: 'slideshow'})} className="accent-purple-600" />
                      <span className="font-bold text-brand-900">Slideshow Carousel</span>
                  </div>
                  <p className="text-xs text-gray-500 pl-6">Cycles through the multiple images uploaded below.</p>
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
                    <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs px-2 py-1 rounded-tl">{idx + 1}</div>
                  </div>
                ))}
                
                <label className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-900 transition-colors aspect-video p-2 text-center">
                   <Plus className="text-gray-400 mb-2" size={24}/>
                   <span className="text-sm text-gray-500 font-medium">Add Slides</span>
                   <span className="text-xs text-gray-400 mt-1">Rec: 1920x1080px</span>
                   <input type="file" multiple className="hidden" accept="image/*" onChange={handleAddHeroSlide} />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Additional Slideshows (Horizontal) */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-indigo-500">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center"><MonitorPlay className="mr-2" size={20}/> Additional Slideshow Sections (Horizontal)</h3>
              <Button onClick={addSecondarySlideshow} size="sm"><Plus size={16} className="mr-1"/> Add Horizontal Slideshow</Button>
          </div>
          <div className="space-y-8">
             {localConfig.secondarySlideshows?.map((slideshow, index) => (
               <div key={slideshow.id} className="border p-6 rounded relative bg-gray-50/50">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                     <div className="flex-1 w-full md:w-auto">
                        <Input label="Slideshow Title" value={slideshow.title || ''} onChange={(e) => updateSlideshowTitle(slideshow.id, e.target.value)} placeholder="e.g. Summer Highlights" />
                     </div>
                     <div className="flex-1 w-full md:w-auto">
                        <label className="block text-sm font-medium mb-1">Section Style</label>
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
                  
                  <div className="space-y-4">
                    {slideshow.slides?.map((slide, slideIdx) => (
                      <div key={slideIdx} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded border shadow-sm items-start">
                        <div className="w-full md:w-48 aspect-video bg-gray-200 rounded overflow-hidden relative flex-shrink-0">
                           <img src={slide.image} className="w-full h-full object-cover" alt="" />
                           <button onClick={() => removeSlideFromSlideshow(slideshow.id, slideIdx)} className="absolute top-2 right-2 bg-white text-rose-500 p-1 rounded-full shadow hover:bg-rose-50"><Trash size={16} /></button>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                           <div className="col-span-2"><Input placeholder="Title" value={slide.title || ''} onChange={(e) => updateSlideField(slideshow.id, slideIdx, 'title', e.target.value)} /></div>
                           <div className="col-span-2"><Input placeholder="Subtitle" value={slide.subtitle || ''} onChange={(e) => updateSlideField(slideshow.id, slideIdx, 'subtitle', e.target.value)} /></div>
                           <div>
                              <label className="text-xs font-bold text-gray-400 block mb-1">Text Color</label>
                              <div className="flex items-center gap-2">
                                <input type="color" value={slide.textColor || slideshow.textColor || '#000000'} onChange={(e) => updateSlideField(slideshow.id, slideIdx, 'textColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                                <span className="text-xs text-gray-500">{slide.textColor || 'Default'}</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                    
                    <label className="border-2 border-dashed border-gray-300 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-brand-900 transition-colors">
                       <Plus className="text-gray-400 mb-2" size={24}/>
                       <span className="text-sm text-gray-500 font-medium">Add New Slides</span>
                       <span className="text-xs text-gray-400 mt-1">Rec: 1920x800px or 16:9 ratio</span>
                       <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => addSlideToSlideshow(slideshow.id, e)} />
                    </label>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Vertical Carousels */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-orange-500">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center text-orange-900"><PanelTop className="mr-2" size={20}/> Vertical Image Carousels</h3>
              <Button onClick={addVerticalCarousel} size="sm" className="bg-orange-600 hover:bg-orange-700"><Plus size={16} className="mr-1"/> Add Vertical Carousel</Button>
          </div>
          
          <div className="space-y-8">
             {localConfig.verticalCarousels?.map((carousel, index) => (
               <div key={carousel.id} className="border p-6 rounded relative bg-orange-50/30">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                     <div className="flex-1 w-full md:w-auto">
                        <Input label="Carousel Title" value={carousel.title || ''} onChange={(e) => updateVerticalCarouselTitle(carousel.id, e.target.value)} placeholder="e.g. Winter Lookbook" />
                     </div>
                     <button onClick={() => removeVerticalCarousel(carousel.id)} className="text-rose-500 hover:text-rose-700 p-2"><Trash size={20}/></button>
                  </div>
                  
                  <div className="space-y-4">
                    {carousel.slides?.map((slide, slideIdx) => (
                      <div key={slideIdx} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded border shadow-sm items-start">
                        <div className="w-full md:w-32 aspect-[3/4] bg-gray-200 rounded overflow-hidden relative flex-shrink-0">
                           <img src={slide.image} className="w-full h-full object-cover" alt="" />
                           <button onClick={() => removeSlideFromVerticalCarousel(carousel.id, slideIdx)} className="absolute top-2 right-2 bg-white text-rose-500 p-1 rounded-full shadow hover:bg-rose-50"><Trash size={16} /></button>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                           <div className="col-span-2"><Input placeholder="Title (e.g. The Coat)" value={slide.title || ''} onChange={(e) => updateVerticalSlideField(carousel.id, slideIdx, 'title', e.target.value)} /></div>
                           <div className="col-span-2"><Input placeholder="Subtitle (e.g. Pure Wool)" value={slide.subtitle || ''} onChange={(e) => updateVerticalSlideField(carousel.id, slideIdx, 'subtitle', e.target.value)} /></div>
                           <div>
                              <label className="text-xs font-bold text-gray-400 block mb-1">Text Color</label>
                              <div className="flex items-center gap-2">
                                <input type="color" value={slide.textColor || '#FFFFFF'} onChange={(e) => updateVerticalSlideField(carousel.id, slideIdx, 'textColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                    
                    <label className="border-2 border-dashed border-orange-200 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-orange-500 transition-colors">
                       <Plus className="text-orange-400 mb-2" size={24}/>
                       <span className="text-sm text-orange-500 font-medium">Add Vertical Slide</span>
                       <span className="text-xs text-gray-400 mt-1 text-center">Rec: 1080x1920px or 9:16 ratio</span>
                       <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => addSlideToVerticalCarousel(carousel.id, e)} />
                    </label>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Section Reordering */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Move className="mr-2" size={20}/> Homepage Layout (Drag & Drop)</h3>
          <div className="space-y-2 max-w-lg">
            {localConfig.homepageSections?.map((sectionId, index) => (
              <div key={sectionId} className="flex items-center justify-between p-3 bg-gray-50 border rounded hover:bg-white hover:shadow-sm transition group">
                <span className="font-medium capitalize flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs mr-3 font-bold text-gray-600">{index + 1}</div>
                  {getSectionName(sectionId)}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowUp size={16}/></button>
                  <button onClick={() => moveSection(index, 'down')} disabled={index === (localConfig.homepageSections?.length || 0) - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowDown size={16}/></button>
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

// --- Products Manager ---
export const AdminProducts: React.FC = () => {
  const { products, categories, deleteProduct, addProduct, updateProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const base64s = await readFiles(files);
      setNewProd(prev => ({ ...prev, images: [...(prev.images || []), ...base64s] }));
    }
  };

  const removeImage = (index: number) => {
    setNewProd(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== index) }));
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
               {p.discountPrice && <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</div>}
            </div>
            <div className="p-4 flex-1">
              <h3 className="font-bold text-lg mb-1">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{p.category}</p>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                   <div><span className="font-bold text-brand-900">${p.discountPrice || p.price}</span>{p.discountPrice && <span className="ml-2 text-xs text-gray-400 line-through">${p.price}</span>}</div>
                   <div className="flex items-center text-xs text-rose-500 mt-1 font-medium"><Heart size={12} className="mr-1 fill-current" /> {p.likes || 0} Likes</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${p.stock < 5 ? 'bg-rose-100 text-rose-600' : 'bg-green-100 text-green-600'}`}>{p.stock} in stock</span>
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
                  <label className="block text-sm font-medium mb-2">Product Images</label>
                  <div className="flex flex-wrap gap-4 mb-3">
                    {newProd.images?.map((img, idx) => (
                      <div key={idx} className="w-24 h-32 bg-gray-100 border rounded flex flex-col items-center justify-center overflow-hidden relative group">
                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white transition-opacity"><Trash size={16} /></button>
                      </div>
                    ))}
                    <label className="w-24 h-32 cursor-pointer bg-white border-2 border-dashed border-gray-300 text-brand-900 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                      <Plus size={24} className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Add</span>
                      <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">Recommended: 800x1066px (3:4 Portrait)</p>
                </div>

                <Input label="Product Name" required value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="md:col-span-2" />
                <Input label="Original Price ($)" type="number" required value={newProd.price} onChange={e => setNewProd({...newProd, price: +e.target.value})} />
                
                <div className="w-full">
                  <Input label="Discounted Price (Optional)" type="number" value={newProd.discountPrice || ''} onChange={e => setNewProd({...newProd, discountPrice: e.target.value ? +e.target.value : undefined})} />
                  {newProd.discountPrice && newProd.price && newProd.discountPrice < newProd.price && <p className="text-xs text-green-600 mt-1">{Math.round(((newProd.price - newProd.discountPrice) / newProd.price) * 100)}% Off</p>}
                </div>

                <Input label="Stock Quantity" type="number" required value={newProd.stock} onChange={e => setNewProd({...newProd, stock: +e.target.value})} />
                
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select className="w-full border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-800" value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})}>
                    <option value="" disabled>Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Available Sizes</label>
                  <div className="flex gap-2 mb-2">
                    <input className="flex-1 border border-gray-200 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-800" placeholder="e.g. XL, 38, Free Size" value={sizeInput} onChange={e => setSizeInput(e.target.value)} />
                    <button onClick={addSize} className="bg-brand-100 text-brand-900 px-3 py-1 text-xs font-bold hover:bg-brand-200">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProd.sizes?.map(s => <span key={s} className="bg-gray-100 text-xs px-2 py-1 rounded flex items-center gap-1">{s} <button type="button" onClick={() => removeSize(s)} className="text-gray-400 hover:text-red-500"><X size={12}/></button></span>)}
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Available Colors</label>
                  <div className="flex gap-2 mb-2">
                    <input className="flex-1 border border-gray-200 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-800" placeholder="e.g. Red, Navy Blue" value={colorInput} onChange={e => setColorInput(e.target.value)} />
                    <button onClick={addColor} className="bg-brand-100 text-brand-900 px-3 py-1 text-xs font-bold hover:bg-brand-200">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProd.colors?.map(c => <span key={c} className="bg-gray-100 text-xs px-2 py-1 rounded flex items-center gap-1">{c} <button type="button" onClick={() => removeColor(c)} className="text-gray-400 hover:text-red-500"><X size={12}/></button></span>)}
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

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useStore();
  const [newCat, setNewCat] = useState({ name: '', image: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.name && newCat.image) {
      await addCategory({ id: Date.now().toString(), ...newCat });
      setNewCat({ name: '', image: '' });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">Categories</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="relative aspect-video bg-gray-100 rounded overflow-hidden group">
               <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <h3 className="text-white font-bold text-xl">{cat.name}</h3>
               </div>
               <button onClick={() => deleteCategory(cat.id)} className="absolute top-2 right-2 bg-white text-rose-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"><Trash size={16}/></button>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded shadow-sm h-fit">
          <h3 className="font-bold mb-4">Add Category</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <Input label="Name" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} />
            <Input label="Image URL" value={newCat.image} onChange={e => setNewCat({...newCat, image: e.target.value})} />
            <Button type="submit" className="w-full">Create Category</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const AdminSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [form, setForm] = useState<SiteConfig>({} as SiteConfig);

  useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  const handleSave = async () => {
    await updateConfig(form);
    alert("Settings saved!");
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-serif font-bold mb-8">Content & Settings</h1>
      <div className="bg-white p-8 rounded shadow-sm space-y-6">
        <h3 className="font-bold border-b pb-2">Brand Identity</h3>
        <div className="grid md:grid-cols-2 gap-4">
           <Input label="Site Name" value={form.siteName || ''} onChange={e => setForm({...form, siteName: e.target.value})} />
           <Input label="Logo URL" value={form.logo || ''} onChange={e => setForm({...form, logo: e.target.value})} />
        </div>

        <h3 className="font-bold border-b pb-2 pt-4">Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
           <Input label="Contact Email" value={form.contactEmail || ''} onChange={e => setForm({...form, contactEmail: e.target.value})} />
           <Input label="Phone Number" value={form.contactPhone || ''} onChange={e => setForm({...form, contactPhone: e.target.value})} />
           <Input label="Address" className="md:col-span-2" value={form.contactAddress || ''} onChange={e => setForm({...form, contactAddress: e.target.value})} />
        </div>
        
        <h3 className="font-bold border-b pb-2 pt-4">Social Media Links</h3>
        <div className="grid md:grid-cols-3 gap-4">
           <Input label="Instagram" value={form.socialInstagram || ''} onChange={e => setForm({...form, socialInstagram: e.target.value})} />
           <Input label="Facebook" value={form.socialFacebook || ''} onChange={e => setForm({...form, socialFacebook: e.target.value})} />
           <Input label="WhatsApp" value={form.socialWhatsapp || ''} onChange={e => setForm({...form, socialWhatsapp: e.target.value})} />
        </div>

        <h3 className="font-bold border-b pb-2 pt-4">About Page Content</h3>
        <div className="space-y-2">
           <label className="text-sm font-medium">Our Story</label>
           <textarea className="w-full border border-gray-200 p-3 text-sm h-32 rounded focus:outline-none focus:ring-1 focus:ring-brand-900" value={form.aboutContent || ''} onChange={e => setForm({...form, aboutContent: e.target.value})} />
        </div>

        <Button onClick={handleSave} size="lg">Save Changes</Button>
      </div>
    </div>
  );
};

export const AdminUsers: React.FC = () => {
  const { users, addUser, deleteUser } = useStore();
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if(newUser.username && newUser.password) {
       await addUser({ ...newUser, permissions: [] } as any);
       setNewUser({ username: '', password: '', role: 'staff' });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">User Management</h1>
      <div className="grid md:grid-cols-3 gap-8">
         <div className="md:col-span-2 bg-white rounded shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 uppercase">
                <tr><th className="px-6 py-4">Username</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Action</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="px-6 py-4 font-medium">{u.username}</td>
                    <td className="px-6 py-4"><span className="bg-brand-100 text-brand-900 px-2 py-1 rounded text-xs uppercase">{u.role}</span></td>
                    <td className="px-6 py-4">
                      {u.username !== 'admin' && (
                        <button onClick={() => deleteUser(u.id)} className="text-rose-500 hover:underline">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
         <div className="bg-white p-6 rounded shadow-sm h-fit">
            <h3 className="font-bold mb-4">Add User</h3>
            <form onSubmit={handleAdd} className="space-y-4">
               <Input label="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
               <Input type="password" label="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
               <div>
                 <label className="block text-sm font-medium mb-1">Role</label>
                 <select className="w-full border p-2 text-sm rounded" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                   <option value="staff">Staff</option>
                   <option value="admin">Admin</option>
                 </select>
               </div>
               <Button type="submit" className="w-full">Create User</Button>
            </form>
         </div>
      </div>
    </div>
  );
};
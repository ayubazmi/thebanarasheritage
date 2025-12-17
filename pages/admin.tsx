import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { Product, Category, User, SiteConfig, Page, ThemeConfig, Slide, VerticalCarouselSection, SlideshowSection } from '../types';
import { 
  Plus, Trash, Edit, Package, ShoppingCart, DollarSign, TrendingUp, 
  Upload, Image as ImageIcon, X, Settings, List, Layout, User as UserIcon, Lock, Megaphone, Video, Hexagon, Type, ShieldCheck, Share2, Heart,
  FileText, Footprints, Palette, Code2, ArrowUp, ArrowDown, Move, RotateCcw, MonitorPlay, AlignLeft, AlignCenter, AlignRight, PanelTop, File, Trash2, Save, AlertCircle, Check, Eye, LayoutDashboard
} from 'lucide-react';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000';
const DEFAULT_PROMO_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';

// Helper for image upload
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
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
  const { orders, products, users } = useStore();
  
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-brand-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-brand-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Sales" value={`$${totalSales.toLocaleString()}`} icon={ShoppingCart} color="bg-emerald-500" />
        <StatCard title="Total Orders" value={orders.length} icon={FileText} color="bg-blue-500" />
        <StatCard title="Pending Orders" value={pendingOrders} icon={AlertCircle} color="bg-amber-500" />
        <StatCard title="Total Products" value={products.length} icon={Package} color="bg-purple-500" />
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
                <Input 
                  label="Page Title" 
                  required 
                  value={pageForm.title} 
                  onChange={e => setPageForm({...pageForm, title: e.target.value})} 
                  onBlur={handleSlugGen}
                />
                <Input 
                  label="URL Slug (e.g., store-list)" 
                  required 
                  value={pageForm.slug} 
                  onChange={e => setPageForm({...pageForm, slug: e.target.value})} 
                />
                
                <div className="md:col-span-2 flex flex-col gap-4">
                  <label className="block text-sm font-medium">Page Visibility</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded hover:bg-gray-50">
                        <input 
                        type="checkbox" 
                        checked={pageForm.showInNav} 
                        onChange={e => setPageForm({...pageForm, showInNav: e.target.checked})} 
                        />
                        <span className="text-sm font-medium">Show in Header Navigation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded hover:bg-gray-50">
                        <input 
                        type="checkbox" 
                        checked={pageForm.showInFooter} 
                        onChange={e => setPageForm({...pageForm, showInFooter: e.target.checked})} 
                        />
                        <span className="text-sm font-medium">Show in Footer Links</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 bg-gray-50 p-4 rounded border">
                   <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2"><Palette size={16}/> Text Styling</h4>
                   <div className="flex flex-wrap items-center gap-6">
                      
                      {/* Color */}
                      <div className="flex flex-col gap-1">
                         <span className="text-xs font-bold text-gray-500">Color</span>
                         <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                value={pageForm.textColor || '#2C251F'}
                                onChange={e => setPageForm({...pageForm, textColor: e.target.value})}
                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                            />
                         </div>
                      </div>

                      {/* Alignment */}
                      <div className="flex flex-col gap-1">
                         <span className="text-xs font-bold text-gray-500">Alignment</span>
                         <div className="flex border rounded overflow-hidden bg-white">
                            <button type="button" onClick={() => setPageForm({...pageForm, textAlign: 'left'})} className={`p-2 hover:bg-gray-100 ${pageForm.textAlign === 'left' ? 'bg-gray-200' : ''}`} title="Left"><AlignLeft size={16}/></button>
                            <button type="button" onClick={() => setPageForm({...pageForm, textAlign: 'center'})} className={`p-2 hover:bg-gray-100 ${pageForm.textAlign === 'center' ? 'bg-gray-200' : ''}`} title="Center"><AlignCenter size={16}/></button>
                            <button type="button" onClick={() => setPageForm({...pageForm, textAlign: 'right'})} className={`p-2 hover:bg-gray-100 ${pageForm.textAlign === 'right' ? 'bg-gray-200' : ''}`} title="Right"><AlignRight size={16}/></button>
                         </div>
                      </div>

                      {/* Size */}
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
                  <p className="text-xs text-gray-500 mb-2">You can use basic HTML tags for formatting (e.g., &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;).</p>
                  <textarea 
                    className="w-full border border-gray-200 p-4 text-sm min-h-[400px] font-mono rounded" 
                    value={pageForm.content} 
                    onChange={e => setPageForm({...pageForm, content: e.target.value})}
                    placeholder="<h1>Our Stores</h1><p>Store content goes here...</p>"
                  ></textarea>
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

// --- Settings (Complex) ---
export const AdminSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState<SiteConfig>({ ...config });
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => { if (config) setLocalConfig(config); }, [config]);

  const handleSave = async () => {
    await updateConfig(localConfig);
    alert("Configuration Saved!");
  };

  const handleImageUpload = async (key: keyof SiteConfig, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setLocalConfig(prev => ({ ...prev, [key]: base64 }));
    }
  };

  // --- Vertical Carousel Logic ---
  const addVerticalCarousel = () => {
    const newCarousel: VerticalCarouselSection = { id: `vc_${Date.now()}`, title: 'New Collection', slides: [] };
    setLocalConfig(prev => ({ ...prev, verticalCarousels: [...(prev.verticalCarousels || []), newCarousel] }));
  };
  const removeVerticalCarousel = (id: string) => {
    setLocalConfig(prev => ({ ...prev, verticalCarousels: prev.verticalCarousels?.filter(vc => vc.id !== id) }));
  };
  const addSlideToVerticalCarousel = async (carouselId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      const newSlide: Slide = { image: base64, title: 'Slide Title', subtitle: 'Slide Subtitle', textColor: '#FFFFFF' };
      setLocalConfig(prev => ({
        ...prev,
        verticalCarousels: prev.verticalCarousels?.map(vc => 
          vc.id === carouselId ? { ...vc, slides: [...(vc.slides || []), newSlide] } : vc
        )
      }));
    }
  };
  const removeSlideFromVerticalCarousel = (carouselId: string, slideIdx: number) => {
      setLocalConfig(prev => ({
        ...prev,
        verticalCarousels: prev.verticalCarousels?.map(vc => 
          vc.id === carouselId ? { ...vc, slides: vc.slides.filter((_, idx) => idx !== slideIdx) } : vc
        )
      }));
  };
  const updateVerticalSlide = (carouselId: string, slideIdx: number, field: keyof Slide, value: string) => {
      setLocalConfig(prev => ({
        ...prev,
        verticalCarousels: prev.verticalCarousels?.map(vc => 
          vc.id === carouselId ? { ...vc, slides: vc.slides.map((s, idx) => idx === slideIdx ? { ...s, [field]: value } : s) } : vc
        )
      }));
  };

  const tabs = ['general', 'hero', 'verticals', 'promo', 'footer'];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-brand-50 pt-4 pb-4 z-10">
        <h1 className="text-2xl font-bold">Content & Settings</h1>
        <Button onClick={handleSave}><Save size={18} className="mr-2" /> Save Changes</Button>
      </div>

      <div className="flex space-x-1 mb-6 border-b overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 capitalize ${activeTab === t ? 'border-b-2 border-brand-900 font-bold' : 'text-gray-500'}`}>{t}</button>
        ))}
      </div>

      <div className="space-y-8">
        {/* General */}
        {activeTab === 'general' && (
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <h3 className="font-bold border-b pb-2">Brand Identity</h3>
            <Input label="Site Name" value={localConfig.siteName} onChange={e => setLocalConfig({...localConfig, siteName: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Logo</label>
                  <input type="file" onChange={e => handleImageUpload('logo', e)} className="text-sm" />
                  {localConfig.logo && <img src={localConfig.logo} className="mt-2 h-12 object-contain" />}
               </div>
               <Input label="Currency Symbol" value={localConfig.currency} onChange={e => setLocalConfig({...localConfig, currency: e.target.value})} />
            </div>
            
            <h3 className="font-bold border-b pb-2 pt-4">Announcement Bar</h3>
            <div className="flex items-center space-x-4 mb-2">
               <label className="flex items-center space-x-2"><input type="checkbox" checked={localConfig.announcementEnabled} onChange={e => setLocalConfig({...localConfig, announcementEnabled: e.target.checked})} /> <span>Enabled</span></label>
               <label className="flex items-center space-x-2"><input type="checkbox" checked={localConfig.announcementBlink} onChange={e => setLocalConfig({...localConfig, announcementBlink: e.target.checked})} /> <span>Blinking Effect</span></label>
            </div>
            <Input label="Text" value={localConfig.announcementText} onChange={e => setLocalConfig({...localConfig, announcementText: e.target.value})} />
            <div className="grid grid-cols-3 gap-4">
              <Input label="Link (Optional)" value={localConfig.announcementLink} onChange={e => setLocalConfig({...localConfig, announcementLink: e.target.value})} />
              <Input label="Background Color" type="color" value={localConfig.announcementBgColor} onChange={e => setLocalConfig({...localConfig, announcementBgColor: e.target.value})} className="h-10" />
              <Input label="Text Color" type="color" value={localConfig.announcementTextColor} onChange={e => setLocalConfig({...localConfig, announcementTextColor: e.target.value})} className="h-10" />
            </div>
          </div>
        )}

        {/* Hero */}
        {activeTab === 'hero' && (
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <h3 className="font-bold border-b pb-2">Hero Section</h3>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-4">
                  <Input label="Title" value={localConfig.heroTitle} onChange={e => setLocalConfig({...localConfig, heroTitle: e.target.value})} />
                  <Input label="Subtitle" value={localConfig.heroSubtitle} onChange={e => setLocalConfig({...localConfig, heroSubtitle: e.target.value})} />
                  <Input label="Tagline" value={localConfig.heroTagline} onChange={e => setLocalConfig({...localConfig, heroTagline: e.target.value})} />
               </div>
               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={localConfig.heroTextColor || '#FFFFFF'} onChange={e => setLocalConfig({...localConfig, heroTextColor: e.target.value})} />
                      <span className="text-xs">{localConfig.heroTextColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Text Alignment</label>
                    <select value={localConfig.heroTextAlign} onChange={e => setLocalConfig({...localConfig, heroTextAlign: e.target.value as any})} className="border p-2 rounded w-full">
                       <option value="left">Left</option>
                       <option value="center">Center</option>
                       <option value="right">Right</option>
                    </select>
                  </div>
               </div>
            </div>
            
            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-2">Hero Background Image</label>
              <input type="file" onChange={e => handleImageUpload('heroImage', e)} />
              {localConfig.heroImage && <img src={localConfig.heroImage} className="mt-2 h-40 object-cover rounded" />}
            </div>
          </div>
        )}

        {/* Vertical Carousels */}
        {activeTab === 'verticals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Vertical Carousels</h3>
              <Button onClick={addVerticalCarousel} size="sm"><Plus size={16} className="mr-1"/> Add New Section</Button>
            </div>
            
            {localConfig.verticalCarousels?.map((carousel, cIdx) => (
               <div key={carousel.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                     <div className="flex items-center gap-4 flex-1">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{carousel.id}</span>
                        <input 
                          type="text" 
                          placeholder="Section Title" 
                          className="font-bold text-lg border-none focus:ring-0 w-full" 
                          value={carousel.title} 
                          onChange={(e) => {
                             const updated = [...(localConfig.verticalCarousels || [])];
                             updated[cIdx].title = e.target.value;
                             setLocalConfig({ ...localConfig, verticalCarousels: updated });
                          }}
                        />
                     </div>
                     <button onClick={() => removeVerticalCarousel(carousel.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded"><Trash2 size={18}/></button>
                  </div>

                  {/* Slides Grid */}
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {carousel.slides.map((slide, sIdx) => (
                       <div key={sIdx} className="flex-shrink-0 w-48 bg-gray-50 rounded p-2 relative group">
                          <img src={slide.image} className="w-full h-64 object-cover rounded mb-2" />
                          <button 
                            onClick={() => removeSlideFromVerticalCarousel(carousel.id, sIdx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12}/>
                          </button>
                          <div className="space-y-1">
                             <input className="w-full text-xs border p-1 rounded" placeholder="Title" value={slide.title} onChange={e => updateVerticalSlide(carousel.id, sIdx, 'title', e.target.value)} />
                             <input className="w-full text-xs border p-1 rounded" placeholder="Subtitle" value={slide.subtitle} onChange={e => updateVerticalSlide(carousel.id, sIdx, 'subtitle', e.target.value)} />
                             <div className="flex items-center gap-1">
                                <input type="color" className="w-4 h-4" value={slide.textColor || '#FFFFFF'} onChange={e => updateVerticalSlide(carousel.id, sIdx, 'textColor', e.target.value)} />
                                <span className="text-[10px] text-gray-400">Color</span>
                             </div>
                          </div>
                       </div>
                    ))}
                    <label className="border-2 border-dashed border-orange-200 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-orange-500 transition-colors w-48 h-80 flex-shrink-0">
                       <Plus className="text-orange-400 mb-2" size={24}/>
                       <span className="text-sm text-orange-500 font-medium">Add Vertical Slide</span>
                       <span className="text-xs text-gray-400 mt-1 text-center">Rec: 508x702px<br/>Ratio: 254:351</span>
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => addSlideToVerticalCarousel(carousel.id, e)} />
                    </label>
                  </div>
               </div>
             ))}
             {(!localConfig.verticalCarousels || localConfig.verticalCarousels.length === 0) && (
               <p className="text-center text-gray-400 italic">No vertical carousels added yet.</p>
             )}
          </div>
        )}

        {/* Promo */}
        {activeTab === 'promo' && (
           <div className="bg-white p-6 rounded-lg shadow space-y-6">
              <h3 className="font-bold border-b pb-2">Promotional Banner</h3>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <Input label="Title" value={localConfig.promoTitle} onChange={e => setLocalConfig({...localConfig, promoTitle: e.target.value})} />
                    <Input label="Text" value={localConfig.promoText} onChange={e => setLocalConfig({...localConfig, promoText: e.target.value})} />
                    <Input label="Button Label" value={localConfig.promoButtonText} onChange={e => setLocalConfig({...localConfig, promoButtonText: e.target.value})} />
                    <Input label="Button Link" value={localConfig.promoButtonLink} onChange={e => setLocalConfig({...localConfig, promoButtonLink: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-2">Image</label>
                    <input type="file" onChange={e => handleImageUpload('promoImage', e)} />
                    {localConfig.promoImage && <img src={localConfig.promoImage} className="mt-2 h-48 w-full object-cover rounded" />}
                 </div>
              </div>
           </div>
        )}
        
        {/* Footer */}
        {activeTab === 'footer' && (
           <div className="bg-white p-6 rounded-lg shadow space-y-6">
             <h3 className="font-bold border-b pb-2">Footer & Contact</h3>
             <div className="grid grid-cols-2 gap-6">
               <Input label="Contact Email" value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} />
               <Input label="Contact Phone" value={localConfig.contactPhone} onChange={e => setLocalConfig({...localConfig, contactPhone: e.target.value})} />
               <Input label="Address" value={localConfig.contactAddress} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} className="col-span-2" />
             </div>
             <div className="grid grid-cols-2 gap-6 mt-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={localConfig.footerBgColor || '#2C251F'} onChange={e => setLocalConfig({...localConfig, footerBgColor: e.target.value})} />
                    <span className="text-sm">{localConfig.footerBgColor}</span>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={localConfig.footerTextColor || '#F3F4F6'} onChange={e => setLocalConfig({...localConfig, footerTextColor: e.target.value})} />
                    <span className="text-sm">{localConfig.footerTextColor}</span>
                  </div>
               </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

// --- Developer Settings (Theme) ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [theme, setTheme] = useState<ThemeConfig>({
    primaryColor: '#2C251F', secondaryColor: '#D5CDC0', backgroundColor: '#F9F8F6',
    fontFamilySans: 'Inter', fontFamilySerif: 'Cormorant Garamond', borderRadius: '0px'
  });

  useEffect(() => { if (config.theme) setTheme(config.theme); }, [config]);

  const save = async () => {
    await updateConfig({ ...config, theme });
    alert("Theme Updated!");
  };

  const ColorPicker = ({ label, val, set }: any) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex items-center space-x-2">
        <input type="color" value={val} onChange={e => set(e.target.value)} className="h-10 w-10 border rounded cursor-pointer" />
        <input type="text" value={val} onChange={e => set(e.target.value)} className="border p-2 rounded text-sm w-28" />
      </div>
    </div>
  );

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...(config.homepageSections || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newSections.length) {
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      updateConfig({ ...config, homepageSections: newSections });
    }
  };

  const getSectionName = (id: string) => {
     const sectionNames: Record<string, string> = {
        hero: 'Hero Banner',
        categories: 'Categories Grid',
        featured: 'Featured Products',
        promo: 'Promotional Banner',
        trust: 'Trust Badges'
     };
     
     if(sectionNames[id]) return sectionNames[id];
     
     const slideshow = config.secondarySlideshows?.find(s => s.id === id);
     if(slideshow) return `Slideshow: ${slideshow.title || 'Untitled'}`;

     const vcarousel = config.verticalCarousels?.find(v => v.id === id);
     if(vcarousel) return `Vertical Carousel: ${vcarousel.title || 'Untitled'}`;

     return id;
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-8">Developer / Theme Settings</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Theme & Styles */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow space-y-8">
             <div>
               <h3 className="font-bold border-b pb-2 mb-4">Color Palette</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <ColorPicker label="Primary (Brand 900)" val={theme.primaryColor} set={(v: string) => setTheme({...theme, primaryColor: v})} />
                 <ColorPicker label="Secondary (Brand 200)" val={theme.secondaryColor} set={(v: string) => setTheme({...theme, secondaryColor: v})} />
                 <ColorPicker label="Background (Brand 50)" val={theme.backgroundColor} set={(v: string) => setTheme({...theme, backgroundColor: v})} />
               </div>
             </div>
             
             <div>
               <h3 className="font-bold border-b pb-2 mb-4">Typography</h3>
               <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium mb-1">Sans Serif Font</label>
                    <select value={theme.fontFamilySans} onChange={e => setTheme({...theme, fontFamilySans: e.target.value})} className="border p-2 rounded w-full">
                       <option value="Inter">Inter</option>
                       <option value="Arial">Arial</option>
                       <option value="Helvetica">Helvetica</option>
                       <option value="system-ui">System UI</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Serif Font</label>
                    <select value={theme.fontFamilySerif} onChange={e => setTheme({...theme, fontFamilySerif: e.target.value})} className="border p-2 rounded w-full">
                       <option value="Cormorant Garamond">Cormorant Garamond</option>
                       <option value="Playfair Display">Playfair Display</option>
                       <option value="Merriweather">Merriweather</option>
                       <option value="Times New Roman">Times New Roman</option>
                    </select>
                 </div>
               </div>
             </div>

             <div>
               <h3 className="font-bold border-b pb-2 mb-4">UI Elements</h3>
               <div>
                  <label className="block text-sm font-medium mb-1">Border Radius</label>
                  <div className="flex space-x-4">
                     {['0px', '4px', '8px', '12px', '99px'].map(r => (
                       <button 
                        key={r} 
                        onClick={() => setTheme({...theme, borderRadius: r})}
                        className={`px-4 py-2 border ${theme.borderRadius === r ? 'bg-brand-900 text-white' : 'bg-gray-50'}`}
                        style={{ borderRadius: r }}
                       >
                         {r === '0px' ? 'Square' : r === '99px' ? 'Round' : r}
                       </button>
                     ))}
                  </div>
               </div>
             </div>

             <Button onClick={save} className="w-full">Update Theme</Button>
          </div>
        </div>

        {/* Right Column: Layout Reordering */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold border-b pb-2 mb-4 flex items-center"><Move className="mr-2" size={20}/> Homepage Layout Order</h3>
            <p className="text-sm text-gray-500 mb-4">Drag and drop functionality not implemented, use arrows to reorder sections.</p>
            
            <div className="space-y-2">
              {config.homepageSections?.map((sectionId, index) => (
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
                      disabled={index === (config.homepageSections?.length || 0) - 1}
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
                <p className="text-xs text-gray-400 mt-1">Rec: 600x800px (Portrait) or 600x600px (Square)</p>
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
                      <p className="text-xs text-gray-400 mt-2">Recommended: 800x1066px (3:4 Portrait)</p>
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { Product, Category, User, SiteConfig, Page } from '../types';
import {
  Plus, Trash, Edit, Package, ShoppingCart, DollarSign, TrendingUp,
  Upload, Image as ImageIcon, X, Settings, List, Layout, User as UserIcon, Lock, Megaphone, Video, Hexagon, Type, ShieldCheck, Share2, Heart,
  FileText, Footprints, Palette, Code2, ArrowUp, ArrowDown, Move, RotateCcw, MonitorPlay, AlignLeft, AlignCenter, AlignRight, PanelTop, File, Eye, EyeOff
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

  if (user) {
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
          <Input label="Username" value={creds.user} onChange={e => setCreds({ ...creds, user: e.target.value })} />
          <Input type="password" label="Password" value={creds.pass} onChange={e => setCreds({ ...creds, pass: e.target.value })} />
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
  const { products, orders, config } = useStore();
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
        <StatCard title="Total Revenue" value={`${config.currency || '$'}${totalRevenue}`} icon={DollarSign} color="bg-emerald-500" />
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
                  <td className="px-6 py-4">{config.currency || '$'}{order.total}</td>
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

// --- Pages Manager (New Feature) ---
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
                  <button onClick={() => { if (window.confirm('Delete this page?')) deletePage(page.id) }} className="text-rose-600 hover:text-rose-800 underline">Delete</button>
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
                  onChange={e => setPageForm({ ...pageForm, title: e.target.value })}
                  onBlur={handleSlugGen}
                />
                <Input
                  label="URL Slug (e.g., store-list)"
                  required
                  value={pageForm.slug}
                  onChange={e => setPageForm({ ...pageForm, slug: e.target.value })}
                />

                <div className="md:col-span-2 flex flex-col gap-4">
                  <label className="block text-sm font-medium">Page Visibility</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={pageForm.showInNav}
                        onChange={e => setPageForm({ ...pageForm, showInNav: e.target.checked })}
                      />
                      <span className="text-sm font-medium">Show in Header Navigation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={pageForm.showInFooter}
                        onChange={e => setPageForm({ ...pageForm, showInFooter: e.target.checked })}
                      />
                      <span className="text-sm font-medium">Show in Footer Links</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 bg-gray-50 p-4 rounded border">
                  <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2"><Palette size={16} /> Text Styling</h4>
                  <div className="flex flex-wrap items-center gap-6">

                    {/* Color */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-500">Color</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={pageForm.textColor || '#2C251F'}
                          onChange={e => setPageForm({ ...pageForm, textColor: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                        />
                      </div>
                    </div>

                    {/* Alignment */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-500">Alignment</span>
                      <div className="flex border rounded overflow-hidden bg-white">
                        <button type="button" onClick={() => setPageForm({ ...pageForm, textAlign: 'left' })} className={`p-2 hover:bg-gray-100 ${pageForm.textAlign === 'left' ? 'bg-gray-200' : ''}`} title="Left"><AlignLeft size={16} /></button>
                        <button type="button" onClick={() => setPageForm({ ...pageForm, textAlign: 'center' })} className={`p-2 hover:bg-gray-100 ${pageForm.textAlign === 'center' ? 'bg-gray-200' : ''}`} title="Center"><AlignCenter size={16} /></button>
                        <button type="button" onClick={() => setPageForm({ ...pageForm, textAlign: 'right' })} className={`p-2 hover:bg-gray-100 ${pageForm.textAlign === 'right' ? 'bg-gray-200' : ''}`} title="Right"><AlignRight size={16} /></button>
                      </div>
                    </div>

                    {/* Size */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-500">Size</span>
                      <div className="flex border rounded overflow-hidden bg-white text-xs font-bold">
                        <button type="button" onClick={() => setPageForm({ ...pageForm, fontSize: 'sm' })} className={`px-3 py-2 hover:bg-gray-100 ${pageForm.fontSize === 'sm' ? 'bg-gray-200' : ''}`}>Small</button>
                        <button type="button" onClick={() => setPageForm({ ...pageForm, fontSize: 'md' })} className={`px-3 py-2 hover:bg-gray-100 ${pageForm.fontSize === 'md' ? 'bg-gray-200' : ''}`}>Normal</button>
                        <button type="button" onClick={() => setPageForm({ ...pageForm, fontSize: 'lg' })} className={`px-3 py-2 hover:bg-gray-100 ${pageForm.fontSize === 'lg' ? 'bg-gray-200' : ''}`}>Large</button>
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
                    onChange={e => setPageForm({ ...pageForm, content: e.target.value })}
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

// --- Settings Manager (Content & Basic Settings) ---
export const AdminSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => {
    if (config && Object.keys(config).length > 0) {
      setLocalConfig(prev => ({ ...config, ...prev }));
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

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all content settings to defaults? This cannot be undone.")) {
      setLocalConfig(prev => ({
        ...prev,
        // Hero Defaults
        heroTagline: 'New Collection',
        heroTitle: undefined,
        heroSubtitle: undefined,
        heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000',
        heroVideo: '',

        // Section Titles Defaults
        categoryTitle: 'Shop by Category',
        featuredTitle: 'New Arrivals',
        featuredSubtitle: 'Fresh styles just added to our collection.',

        // Promo Defaults
        promoTitle: '',
        promoText: '',
        promoButtonText: '',
        promoButtonLink: '',
        promoImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000',

        // Trust Badges Defaults
        trustBadge1Title: '', trustBadge1Text: '',
        trustBadge2Title: '', trustBadge2Text: '',
        trustBadge3Title: '', trustBadge3Text: '',

        // Content Defaults
        aboutTitle: '',
        aboutContent: '',

        // Contact Defaults
        contactEmail: '',
        contactPhone: '',
        contactAddress: '',
        socialInstagram: '',
        socialFacebook: '',
        socialWhatsapp: '',

        // Footer Defaults
        footerShopTitle: 'SHOP',
        footerLink1Label: '', footerLink1Url: '',
        footerLink2Label: '', footerLink2Url: '',
        footerLink3Label: '', footerLink3Url: '',
        footerLink4Label: '', footerLink4Url: '',
        footerNewsletterTitle: '', footerNewsletterPlaceholder: '', footerNewsletterButtonText: ''
      }));
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
          <h3 className="font-bold text-lg mb-4 flex items-center"><Hexagon className="mr-2" size={20} /> Brand Identity</h3>
          <div className="flex flex-col gap-6">
            <Input label="Website Name" value={localConfig.siteName || ''} placeholder="LUMIÈRE" onChange={e => setLocalConfig({ ...localConfig, siteName: e.target.value })} />

            <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-gray-100 border rounded flex items-center justify-center overflow-hidden relative group">
                {localConfig.logo ? (
                  <>
                    <img src={localConfig.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                    <button
                      onClick={() => setLocalConfig({ ...localConfig, logo: '' })}
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
                  <Upload size={16} /> Choose Logo
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
                <p className="text-xs text-gray-400 mt-1">Recommended: Height 100px-200px (PNG or SVG)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Configuration (Moved to Top for Visibility) */}
        <div className="bg-white p-8 rounded shadow-sm border-l-4 border-blue-500">
          <h3 className="font-bold text-lg mb-4 flex items-center text-blue-800"><Footprints className="mr-2" size={20} /> Footer Configuration (Shop & Contact)</h3>

          <div className="space-y-6">
            {/* Shop Links */}
            <div>
              <Input label="Footer Shop Section Title" value={localConfig.footerShopTitle || 'SHOP'} placeholder="SHOP" onChange={e => setLocalConfig({ ...localConfig, footerShopTitle: e.target.value })} />

              <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded">
                <p className="col-span-2 text-xs font-bold text-gray-500 uppercase">Footer Links (Title & URL)</p>
                <Input label="Link 1 Text" value={localConfig.footerLink1Label || ''} placeholder="New Arrivals" onChange={e => setLocalConfig({ ...localConfig, footerLink1Label: e.target.value })} />
                <Input label="Link 1 URL" value={localConfig.footerLink1Url || ''} placeholder="/shop?cat=new" onChange={e => setLocalConfig({ ...localConfig, footerLink1Url: e.target.value })} />

                <Input label="Link 2 Text" value={localConfig.footerLink2Label || ''} placeholder="Kurtis" onChange={e => setLocalConfig({ ...localConfig, footerLink2Label: e.target.value })} />
                <Input label="Link 2 URL" value={localConfig.footerLink2Url || ''} placeholder="/shop?cat=kurtis" onChange={e => setLocalConfig({ ...localConfig, footerLink2Url: e.target.value })} />

                <Input label="Link 3 Text" value={localConfig.footerLink3Label || ''} placeholder="Dresses" onChange={e => setLocalConfig({ ...localConfig, footerLink3Label: e.target.value })} />
                <Input label="Link 3 URL" value={localConfig.footerLink3Url || ''} placeholder="/shop?cat=dresses" onChange={e => setLocalConfig({ ...localConfig, footerLink3Url: e.target.value })} />

                <Input label="Link 4 Text" value={localConfig.footerLink4Label || ''} placeholder="Sale" onChange={e => setLocalConfig({ ...localConfig, footerLink4Label: e.target.value })} />
                <Input label="Link 4 URL" value={localConfig.footerLink4Url || ''} placeholder="/shop?cat=sale" onChange={e => setLocalConfig({ ...localConfig, footerLink4Url: e.target.value })} />
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-4 border-t">
              <h4 className="font-bold text-sm mb-2 text-gray-600 uppercase">Newsletter Section (Stay in Touch)</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <Input label="Section Title" value={localConfig.footerNewsletterTitle || ''} placeholder="STAY IN TOUCH" onChange={e => setLocalConfig({ ...localConfig, footerNewsletterTitle: e.target.value })} />
                <Input label="Input Placeholder" value={localConfig.footerNewsletterPlaceholder || ''} placeholder="Your email" onChange={e => setLocalConfig({ ...localConfig, footerNewsletterPlaceholder: e.target.value })} />
                <Input label="Button Text" value={localConfig.footerNewsletterButtonText || ''} placeholder="JOIN" onChange={e => setLocalConfig({ ...localConfig, footerNewsletterButtonText: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center"><Layout className="mr-2" size={20} /> Homepage Hero Banner</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Input label="Hero Tagline (Top Text)" value={localConfig.heroTagline || ''} onChange={e => setLocalConfig({ ...localConfig, heroTagline: e.target.value })} placeholder="e.g. New Collection" />
              <Input label="Hero Title (Main)" value={localConfig.heroTitle} onChange={e => setLocalConfig({ ...localConfig, heroTitle: e.target.value })} />
              <Input label="Hero Subtitle" value={localConfig.heroSubtitle} onChange={e => setLocalConfig({ ...localConfig, heroSubtitle: e.target.value })} />

              <div className="border-t pt-4 mt-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Background Media</p>
                <p className="text-xs text-gray-400 mb-2">
                  (Used when 'Static Image / Video' mode is selected in Developer Settings)
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Image Upload</label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100 w-fit">
                      <Upload size={16} /> Choose Image
                      <input type="file" className="hidden" accept="image/*" onChange={handleHeroUpload} />
                    </label>
                    <p className="text-xs text-gray-400 mt-1">Recommended: 1920x1080px (16:9) or 1920x800px</p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">OR USE VIDEO</span></div>
                  </div>

                  <Input
                    label="Video URL (YouTube/MP4 Link)"
                    placeholder="https://..."
                    value={localConfig.heroVideo && !localConfig.heroVideo.startsWith('data:') ? localConfig.heroVideo : ''}
                    onChange={e => setLocalConfig({ ...localConfig, heroVideo: e.target.value })}
                  />

                  <div>
                    <label className="block text-sm font-medium mb-1">Video Upload (Max 10MB)</label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100 w-fit">
                      <Video size={16} /> Upload Short Video
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
                    onClick={() => setLocalConfig({ ...localConfig, heroVideo: '' })}
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
                      onClick={() => setLocalConfig({ ...localConfig, heroImage: '' })}
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
          <h3 className="font-bold text-lg mb-4 flex items-center"><Type className="mr-2" size={20} /> Homepage Section Titles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Category Section Title" value={localConfig.categoryTitle || ''} placeholder="Shop by Category" onChange={e => setLocalConfig({ ...localConfig, categoryTitle: e.target.value })} />
            <Input label="Featured Section Title" value={localConfig.featuredTitle || ''} placeholder="New Arrivals" onChange={e => setLocalConfig({ ...localConfig, featuredTitle: e.target.value })} />
            <Input label="Featured Section Subtitle" className="md:col-span-2" value={localConfig.featuredSubtitle || ''} placeholder="Fresh styles just added to our collection." onChange={e => setLocalConfig({ ...localConfig, featuredSubtitle: e.target.value })} />
          </div>
        </div>

        {/* Sale / Promo Section */}
        <div className="bg-white p-8 rounded shadow-sm border-l-4 border-brand-900">
          <h3 className="font-bold text-lg mb-4 flex items-center"><Megaphone className="mr-2" size={20} /> Sale Section (Explore Sale Banner)</h3>
          <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded">This controls the promotional banner in the middle of the homepage.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Input label="Banner Title" value={localConfig.promoTitle || ''} placeholder="Summer Sale is Live" onChange={e => setLocalConfig({ ...localConfig, promoTitle: e.target.value })} />
              <div className="col-span-1">
                <label className="block text-sm font-medium mb-1">Banner Description</label>
                <textarea className="w-full border p-2 text-sm h-24" value={localConfig.promoText || ''} placeholder="Get up to 50% off on selected dresses and kurtis. Limited time offer." onChange={e => setLocalConfig({ ...localConfig, promoText: e.target.value })}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Button Label" value={localConfig.promoButtonText || ''} placeholder="Explore Sale" onChange={e => setLocalConfig({ ...localConfig, promoButtonText: e.target.value })} />
                <Input label="Button Link" value={localConfig.promoButtonLink || ''} placeholder="/shop" onChange={e => setLocalConfig({ ...localConfig, promoButtonLink: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Banner Image</label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100 w-fit">
                  <Upload size={16} /> Upload Image
                  <input type="file" className="hidden" accept="image/*" onChange={handlePromoUpload} />
                </label>
                <p className="text-xs text-gray-400 mt-1">Recommended: 1000x800px (4:3) or 800x600px</p>
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
                  onClick={() => setLocalConfig({ ...localConfig, promoImage: '' })}
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
          <h3 className="font-bold text-lg mb-4 flex items-center"><ShieldCheck className="mr-2" size={20} /> Homepage Trust Badges</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 bg-gray-50 rounded">
              <p className="font-bold text-sm text-gray-500 uppercase">Badge 1</p>
              <Input label="Title" value={localConfig.trustBadge1Title || ''} placeholder="Premium Quality" onChange={e => setLocalConfig({ ...localConfig, trustBadge1Title: e.target.value })} />
              <Input label="Text" value={localConfig.trustBadge1Text || ''} placeholder="Hand-picked fabrics..." onChange={e => setLocalConfig({ ...localConfig, trustBadge1Text: e.target.value })} />
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded">
              <p className="font-bold text-sm text-gray-500 uppercase">Badge 2</p>
              <Input label="Title" value={localConfig.trustBadge2Title || ''} placeholder="Secure Payment" onChange={e => setLocalConfig({ ...localConfig, trustBadge2Title: e.target.value })} />
              <Input label="Text" value={localConfig.trustBadge2Text || ''} placeholder="100% secure checkout..." onChange={e => setLocalConfig({ ...localConfig, trustBadge2Text: e.target.value })} />
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded">
              <p className="font-bold text-sm text-gray-500 uppercase">Badge 3</p>
              <Input label="Title" value={localConfig.trustBadge3Title || ''} placeholder="Fast Delivery" onChange={e => setLocalConfig({ ...localConfig, trustBadge3Title: e.target.value })} />
              <Input label="Text" value={localConfig.trustBadge3Text || ''} placeholder="Shipping within 3-5 days" onChange={e => setLocalConfig({ ...localConfig, trustBadge3Text: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4">Website Content (About Us)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="About Us Title" value={localConfig.aboutTitle || ''} onChange={e => setLocalConfig({ ...localConfig, aboutTitle: e.target.value })} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">About Us Content</label>
              <textarea className="w-full border p-2 h-32" value={localConfig.aboutContent || ''} onChange={e => setLocalConfig({ ...localConfig, aboutContent: e.target.value })}></textarea>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4">Contact Information & Socials</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Contact Email" value={localConfig.contactEmail || ''} onChange={e => setLocalConfig({ ...localConfig, contactEmail: e.target.value })} />
            <Input label="Contact Phone" value={localConfig.contactPhone || ''} onChange={e => setLocalConfig({ ...localConfig, contactPhone: e.target.value })} />
            <Input label="Address" className="md:col-span-2" value={localConfig.contactAddress || ''} onChange={e => setLocalConfig({ ...localConfig, contactAddress: e.target.value })} />

            <div className="md:col-span-2 grid md:grid-cols-3 gap-4 pt-4 border-t mt-4">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-500 mb-2 col-span-3"><Share2 size={16} /> Social Media Links</div>
              <Input label="Instagram URL" value={localConfig.socialInstagram || ''} placeholder="https://instagram.com/..." onChange={e => setLocalConfig({ ...localConfig, socialInstagram: e.target.value })} />
              <Input label="Facebook URL" value={localConfig.socialFacebook || ''} placeholder="https://facebook.com/..." onChange={e => setLocalConfig({ ...localConfig, socialFacebook: e.target.value })} />
              <Input label="WhatsApp URL" value={localConfig.socialWhatsapp || ''} placeholder="https://wa.me/..." onChange={e => setLocalConfig({ ...localConfig, socialWhatsapp: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t sticky bottom-0 bg-brand-50 p-4 shadow-inner flex justify-end gap-4">
          <Button onClick={handleReset} variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700">
            <RotateCcw size={16} className="mr-2" /> Reset Defaults
          </Button>
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
        // Migration: Ensure 'slides' exists for secondary slideshows, fallback to 'images' for legacy
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
        // Reset Footer Styling
        footerBgColor: '#2C251F',
        footerTextColor: '#F3F4F6',
        // Reset Announcement Bar
        announcementEnabled: false,
        announcementBlink: false,
        announcementBgColor: '#000000',
        announcementTextColor: '#FFFFFF',
        // Reset Slideshow
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
  const handleAddHeroSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalConfig(prev => ({
            ...prev,
            heroImages: [...(prev.heroImages || []), reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
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
      slides: [], // Initialize empty slides array
      textColor: '#2C251F', // Default dark
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
    if (window.confirm("Delete this slideshow section?")) {
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

  // Handlers for individual slides within a slideshow
  const addSlideToSlideshow = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalConfig(prev => ({
            ...prev,
            secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === id ? {
              ...s,
              slides: [...(s.slides || []), { image: reader.result as string, title: '', subtitle: '', textColor: '' }]
            } : s)
          }));
        };
        reader.readAsDataURL(file);
      });
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

  // --- Vertical Carousel Handlers (NEW) ---
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
    if (window.confirm("Delete this vertical carousel section?")) {
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

  const addSlideToVerticalCarousel = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalConfig(prev => ({
            ...prev,
            verticalCarousels: prev.verticalCarousels?.map(c => c.id === id ? {
              ...c,
              slides: [...(c.slides || []), { image: reader.result as string, title: '', subtitle: '', textColor: '' }]
            } : c)
          }));
        };
        reader.readAsDataURL(file);
      });
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

  const fonts = [
    { name: 'Inter (Modern Sans)', value: 'Inter' },
    { name: 'Lato (Friendly Sans)', value: 'Lato' },
    { name: 'Montserrat (Geometric Sans)', value: 'Montserrat' },
    { name: 'Open Sans (Neutral Sans)', value: 'Open Sans' },
    { name: 'Cormorant Garamond (Elegant Serif)', value: 'Cormorant Garamond' },
    { name: 'Playfair Display (Display Serif)', value: 'Playfair Display' },
  ];

  const getSectionName = (id: string) => {
    if (id === 'hero') return 'Hero Section';
    if (id === 'categories') return 'Categories Grid';
    if (id === 'featured') return 'New Arrivals';
    if (id === 'promo') return 'Promo Banner';
    if (id === 'trust') return 'Trust Signals';

    // Check dynamic sections
    const slideshow = localConfig.secondarySlideshows?.find(s => s.id === id);
    if (slideshow) return `Slideshow: ${slideshow.title || 'Untitled'}`;

    const vertical = localConfig.verticalCarousels?.find(v => v.id === id);
    if (vertical) return `Vertical Carousel: ${vertical.title || 'Untitled'}`;

    return id;
  };

  const STANDARD_SECTIONS = ['hero', 'categories', 'featured', 'promo', 'trust'];
  const allSectionIds = [
    ...STANDARD_SECTIONS,
    ...(localConfig.secondarySlideshows?.map(s => s.id) || []),
    ...(localConfig.verticalCarousels?.map(v => v.id) || [])
  ];

  const activeSectionIds = localConfig.homepageSections || [];
  const hiddenSectionIds = allSectionIds.filter(id => !activeSectionIds.includes(id));

  const toggleSectionVisibility = (id: string, isHidden: boolean) => {
    let newSections = [...(localConfig.homepageSections || [])];

    if (isHidden) {
      // Unhide: Add to end
      newSections.push(id);
    } else {
      // Hide: Remove from list
      newSections = newSections.filter(sid => sid !== id);
    }
    setLocalConfig({ ...localConfig, homepageSections: newSections });
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalConfig({ ...localConfig, favicon: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
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
        <button onClick={() => onChangeAlign('left')} className={`p-2 hover:bg-gray-100 ${textAlign === 'left' ? 'bg-gray-200' : 'bg-white'}`} title="Left"><AlignLeft size={16} /></button>
        <button onClick={() => onChangeAlign('center')} className={`p-2 hover:bg-gray-100 ${textAlign === 'center' ? 'bg-gray-200' : 'bg-white'}`} title="Center"><AlignCenter size={16} /></button>
        <button onClick={() => onChangeAlign('right')} className={`p-2 hover:bg-gray-100 ${textAlign === 'right' ? 'bg-gray-200' : 'bg-white'}`} title="Right"><AlignRight size={16} /></button>
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

        {/* General Site Identity */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-brand-900">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Layout className="mr-2" size={20} /> Site Identity</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Site Title (Browser Tab Name)"
              value={localConfig.siteTitle || ''}
              placeholder="e.g. My Awesome Store"
              onChange={(e) => setLocalConfig({ ...localConfig, siteTitle: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Favicon</label>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden border">
                  {localConfig.favicon ? (
                    <img src={localConfig.favicon} className="w-full h-full object-cover" alt="Favicon" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                  )}
                </div>
                <label className="cursor-pointer bg-white border px-3 py-2 rounded text-sm hover:bg-gray-50 flex items-center gap-2">
                  <Upload size={14} /> Upload Icon
                  <input type="file" className="hidden" onChange={handleFaviconUpload} accept="image/*" />
                </label>
                <p className="text-xs text-gray-500">Rec: 32x32px or 16x16px (PNG/ICO)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Palette className="mr-2" size={20} /> Color Palette</h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color (Text & Dark BG)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localConfig.theme.primaryColor}
                  onChange={e => setLocalConfig({ ...localConfig, theme: { ...localConfig.theme!, primaryColor: e.target.value } })}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input
                  value={localConfig.theme.primaryColor}
                  onChange={e => setLocalConfig({ ...localConfig, theme: { ...localConfig.theme!, primaryColor: e.target.value } })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Secondary / Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localConfig.theme.secondaryColor}
                  onChange={e => setLocalConfig({ ...localConfig, theme: { ...localConfig.theme!, secondaryColor: e.target.value } })}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input
                  value={localConfig.theme.secondaryColor}
                  onChange={e => setLocalConfig({ ...localConfig, theme: { ...localConfig.theme!, secondaryColor: e.target.value } })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Page Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localConfig.theme.backgroundColor}
                  onChange={e => setLocalConfig({ ...localConfig, theme: { ...localConfig.theme!, backgroundColor: e.target.value } })}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input
                  value={localConfig.theme.backgroundColor}
                  onChange={e => setLocalConfig({ ...localConfig, theme: { ...localConfig.theme!, backgroundColor: e.target.value } })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Style */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Type className="mr-2" size={20} /> Typography & Style</h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Heading Font (Serif)</label>
              <select
                className="w-full border p-2 rounded"
                value={localConfig.theme.fontFamilySerif}
                onChange={e => setLocalConfig({ ...localConfig, theme: { ...localConfig.theme!, fontFamilySerif: e.target.value } })}
              >
                {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Body Font (Sans)</label>
              <select
                className="w-full border p-2 rounded"
                value={localConfig.theme.fontFamilySans}
                onChange={e => setLocalConfig({ ...localConfig, theme: { ...localConfig.theme!, fontFamilySans: e.target.value } })}
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
                    onClick={() => setLocalConfig({ ...localConfig, theme: { ...localConfig.theme!, borderRadius: r } })}
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

        {/* Announcement Bar Settings */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-yellow-400">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Megaphone className="mr-2" size={20} /> Announcement Bar</h3>

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
                  onChange={e => setLocalConfig({ ...localConfig, announcementText: e.target.value })}
                />
                <Input
                  label="Link URL (Optional)"
                  value={localConfig.announcementLink || ''}
                  placeholder="/shop"
                  onChange={e => setLocalConfig({ ...localConfig, announcementLink: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localConfig.announcementBgColor || '#000000'}
                      onChange={e => setLocalConfig({ ...localConfig, announcementBgColor: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                    <Input
                      value={localConfig.announcementBgColor || '#000000'}
                      onChange={e => setLocalConfig({ ...localConfig, announcementBgColor: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localConfig.announcementTextColor || '#FFFFFF'}
                      onChange={e => setLocalConfig({ ...localConfig, announcementTextColor: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                    <Input
                      value={localConfig.announcementTextColor || '#FFFFFF'}
                      onChange={e => setLocalConfig({ ...localConfig, announcementTextColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Styling */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-gray-800">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Footprints className="mr-2" size={20} /> Footer Styling</h3>

          <div className="grid md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded">
            <div>
              <label className="block text-sm font-medium mb-1">Footer Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localConfig.footerBgColor || '#2C251F'}
                  onChange={e => setLocalConfig({ ...localConfig, footerBgColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input
                  value={localConfig.footerBgColor || '#2C251F'}
                  onChange={e => setLocalConfig({ ...localConfig, footerBgColor: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Footer Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localConfig.footerTextColor || '#F3F4F6'}
                  onChange={e => setLocalConfig({ ...localConfig, footerTextColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input
                  value={localConfig.footerTextColor || '#F3F4F6'}
                  onChange={e => setLocalConfig({ ...localConfig, footerTextColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Slideshow */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-purple-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center"><ImageIcon className="mr-2" size={20} /> Hero Section Mode</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <label className={`flex-1 p-4 border rounded cursor-pointer transition-all ${localConfig.heroMode === 'static' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <input type="radio" name="heroMode" value="static" checked={localConfig.heroMode === 'static' || !localConfig.heroMode} onChange={() => setLocalConfig({ ...localConfig, heroMode: 'static' })} className="accent-purple-600" />
                <span className="font-bold text-brand-900">Static Image / Video</span>
              </div>
              <p className="text-xs text-gray-500 pl-6">Displays the single hero image or video configured in "Content & Settings".</p>
            </label>

            <label className={`flex-1 p-4 border rounded cursor-pointer transition-all ${localConfig.heroMode === 'slideshow' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <input type="radio" name="heroMode" value="slideshow" checked={localConfig.heroMode === 'slideshow'} onChange={() => setLocalConfig({ ...localConfig, heroMode: 'slideshow' })} className="accent-purple-600" />
                <span className="font-bold text-brand-900">Slideshow Carousel</span>
              </div>
              <p className="text-xs text-gray-500 pl-6">Cycles through the multiple images uploaded below.</p>
            </label>
          </div>

          {/* Hero Slideshow Configuration */}
          {localConfig.heroMode === 'slideshow' && (
            <div className="animate-fade-in-up space-y-6">

              <div className="bg-purple-50 p-4 rounded border border-purple-100">
                <h4 className="font-bold text-sm text-purple-900 mb-3">Hero Text Styling</h4>
                <TextStylingControls
                  textColor={localConfig.heroTextColor}
                  textAlign={localConfig.heroTextAlign}
                  fontSize={localConfig.heroFontSize}
                  onChangeColor={(v: string) => setLocalConfig({ ...localConfig, heroTextColor: v })}
                  onChangeAlign={(v: any) => setLocalConfig({ ...localConfig, heroTextAlign: v })}
                  onChangeSize={(v: any) => setLocalConfig({ ...localConfig, heroFontSize: v })}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {localConfig.heroImages?.map((img, idx) => (
                  <div key={idx} className="relative group aspect-video bg-gray-100 rounded overflow-hidden border">
                    <img src={img} className="w-full h-full object-cover" alt={`Slide ${idx + 1}`} />
                    <button
                      onClick={() => removeHeroSlide(idx)}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Slide"
                    >
                      <Trash size={24} />
                    </button>
                    <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs px-2 py-1 rounded-tl">
                      {idx + 1}
                    </div>
                  </div>
                ))}

                <label className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-900 transition-colors aspect-video p-2 text-center">
                  <Plus className="text-gray-400 mb-2" size={24} />
                  <span className="text-sm text-gray-500 font-medium">Add Slide</span>
                  <span className="text-xs text-gray-400 mt-1">Rec: 1920x1080px</span>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleAddHeroSlide} />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Additional Slideshows (Horizontal) */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-indigo-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center"><MonitorPlay className="mr-2" size={20} /> Additional Slideshow Sections (Horizontal)</h3>
            <Button onClick={addSecondarySlideshow} size="sm"><Plus size={16} className="mr-1" /> Add Horizontal Slideshow</Button>
          </div>
          <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded">
            Create standalone slideshows for specific collections or campaigns.
          </p>

          <div className="space-y-8">
            {localConfig.secondarySlideshows?.map((slideshow, index) => (
              <div key={slideshow.id} className="border p-6 rounded relative bg-gray-50/50">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex-1 w-full md:w-auto">
                    <Input
                      label="Slideshow Title"
                      value={slideshow.title || ''}
                      onChange={(e) => updateSlideshowTitle(slideshow.id, e.target.value)}
                      placeholder="e.g. Summer Highlights"
                    />
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

                  <button onClick={() => removeSecondarySlideshow(slideshow.id)} className="text-rose-500 hover:text-rose-700 p-2"><Trash size={20} /></button>
                </div>

                <div className="space-y-4">
                  {slideshow.slides?.map((slide, slideIdx) => (
                    <div key={slideIdx} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded border shadow-sm items-start">
                      <div className="w-full md:w-48 aspect-video bg-gray-200 rounded overflow-hidden relative flex-shrink-0">
                        <img src={slide.image} className="w-full h-full object-cover" alt="" />
                        <button
                          onClick={() => removeSlideFromSlideshow(slideshow.id, slideIdx)}
                          className="absolute top-2 right-2 bg-white text-rose-500 p-1 rounded-full shadow hover:bg-rose-50"
                          title="Delete Slide"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                        <div className="col-span-2">
                          <Input
                            placeholder="Title (e.g. Urban Vibes)"
                            value={slide.title || ''}
                            onChange={(e) => updateSlideField(slideshow.id, slideIdx, 'title', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder="Subtitle (e.g. Discover the city look)"
                            value={slide.subtitle || ''}
                            onChange={(e) => updateSlideField(slideshow.id, slideIdx, 'subtitle', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 block mb-1">Text Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={slide.textColor || slideshow.textColor || '#000000'}
                              onChange={(e) => updateSlideField(slideshow.id, slideIdx, 'textColor', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-xs text-gray-500">{slide.textColor || 'Default'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-gray-300 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-brand-900 transition-colors">
                    <Plus className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500 font-medium">Add New Slide</span>
                    <span className="text-xs text-gray-400 mt-1">Rec: 1920x800px or 16:9 ratio</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => addSlideToSlideshow(slideshow.id, e)} />
                  </label>
                </div>
              </div>
            ))}
            {(!localConfig.secondarySlideshows || localConfig.secondarySlideshows.length === 0) && (
              <p className="text-center text-gray-400 italic">No additional slideshows added yet.</p>
            )}
          </div>
        </div>

        {/* Vertical Carousels (New Feature) */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-orange-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center text-orange-900"><PanelTop className="mr-2" size={20} /> Vertical Image Carousels</h3>
            <Button onClick={addVerticalCarousel} size="sm" className="bg-orange-600 hover:bg-orange-700"><Plus size={16} className="mr-1" /> Add Vertical Carousel</Button>
          </div>
          <p className="text-sm text-gray-500 mb-6 bg-orange-50 p-3 rounded text-orange-900">
            Create specialized vertical scrolling carousels. Ideal for lookbooks or storytelling sequences.
          </p>

          <div className="space-y-8">
            {localConfig.verticalCarousels?.map((carousel, index) => (
              <div key={carousel.id} className="border p-6 rounded relative bg-orange-50/30">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex-1 w-full md:w-auto">
                    <Input
                      label="Carousel Title"
                      value={carousel.title || ''}
                      onChange={(e) => updateVerticalCarouselTitle(carousel.id, e.target.value)}
                      placeholder="e.g. Winter Lookbook"
                    />
                  </div>
                  <button onClick={() => removeVerticalCarousel(carousel.id)} className="text-rose-500 hover:text-rose-700 p-2"><Trash size={20} /></button>
                </div>

                <div className="space-y-4">
                  {carousel.slides?.map((slide, slideIdx) => (
                    <div key={slideIdx} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded border shadow-sm items-start">
                      <div className="w-full md:w-32 aspect-[3/4] bg-gray-200 rounded overflow-hidden relative flex-shrink-0">
                        <img src={slide.image} className="w-full h-full object-cover" alt="" />
                        <button
                          onClick={() => removeSlideFromVerticalCarousel(carousel.id, slideIdx)}
                          className="absolute top-2 right-2 bg-white text-rose-500 p-1 rounded-full shadow hover:bg-rose-50"
                          title="Delete Slide"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                        <div className="col-span-2">
                          <Input
                            placeholder="Title (e.g. The Coat)"
                            value={slide.title || ''}
                            onChange={(e) => updateVerticalSlideField(carousel.id, slideIdx, 'title', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder="Subtitle (e.g. Pure Wool)"
                            value={slide.subtitle || ''}
                            onChange={(e) => updateVerticalSlideField(carousel.id, slideIdx, 'subtitle', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 block mb-1">Text Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={slide.textColor || '#FFFFFF'}
                              onChange={(e) => updateVerticalSlideField(carousel.id, slideIdx, 'textColor', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-orange-200 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-orange-500 transition-colors">
                    <Plus className="text-orange-400 mb-2" size={24} />
                    <span className="text-sm text-orange-500 font-medium">Add Vertical Slide</span>
                    <span className="text-xs text-gray-400 mt-1 text-center">Rec: 600x800px (3:4)</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => addSlideToVerticalCarousel(carousel.id, e)} />
                  </label>
                </div>
              </div>
            ))}
            {(!localConfig.verticalCarousels || localConfig.verticalCarousels.length === 0) && (
              <p className="text-center text-gray-400 italic">No vertical carousels added yet.</p>
            )}
          </div>
        </div>

        {/* Section Reordering */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Move className="mr-2" size={20} /> Homepage Layout (Drag & Drop)</h3>
          <p className="text-sm text-gray-500 mb-4">Reorder the sections as they appear on the homepage.</p>

          <div className="space-y-4">
            {/* Active Sections */}
            <div>
              <h4 className="font-bold text-sm text-gray-700 mb-2">Active Sections</h4>
              <div className="space-y-2 max-w-lg">
                {activeSectionIds.map((sectionId, index) => (
                  <div key={sectionId} className="flex items-center justify-between p-3 bg-white border rounded shadow-sm hover:border-brand-900 transition group">
                    <span className="font-medium capitalize flex items-center">
                      <div className="w-6 h-6 flex items-center justify-center bg-brand-100 rounded-full text-xs mr-3 font-bold text-brand-900">{index + 1}</div>
                      {getSectionName(sectionId)}
                    </span>
                    <div className="flex gap-1 items-center">
                      <button
                        onClick={() => toggleSectionVisibility(sectionId, false)}
                        className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded transition-colors mr-2"
                        title="Hide Section"
                      >
                        <EyeOff size={16} />
                      </button>
                      <div className="w-px h-4 bg-gray-200 mx-1"></div>
                      <button
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 text-gray-600"
                        title="Move Up"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === activeSectionIds.length - 1}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 text-gray-600"
                        title="Move Down"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {activeSectionIds.length === 0 && (
                  <div className="text-sm text-gray-500 italic p-2 border border-dashed rounded text-center">No active sections. Homepage will be empty.</div>
                )}
              </div>
            </div>

            {/* Hidden Sections */}
            {hiddenSectionIds.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="font-bold text-sm text-gray-500 mb-2 flex items-center"><EyeOff size={14} className="mr-2" /> Hidden Sections</h4>
                <div className="space-y-2 max-w-lg">
                  {hiddenSectionIds.map((sectionId) => (
                    <div key={sectionId} className="flex items-center justify-between p-3 bg-gray-50 border border-dashed rounded opacity-70 hover:opacity-100 transition">
                      <span className="font-medium capitalize text-gray-500">
                        {getSectionName(sectionId)}
                      </span>
                      <button
                        onClick={() => toggleSectionVisibility(sectionId, true)}
                        className="p-1.5 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded transition-colors flex items-center gap-1 text-xs font-bold"
                        title="Show Section"
                      >
                        <Eye size={14} /> Show
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
    if (passModalId && newPass) {
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
                <td className="px-6 py-4 font-medium flex items-center gap-2"><UserIcon size={16} /> {u.username}</td>
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
              <Input label="Username" required value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
              <Input label="Password" type="password" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="w-full border p-2 text-sm"
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'staff' })}
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
                <button onClick={() => handleEdit(cat)} className="bg-white p-2 rounded-full hover:bg-gray-200"><Edit size={16} /></button>
                <button onClick={() => deleteCategory(cat.id)} className="bg-white p-2 rounded-full hover:bg-rose-100 text-rose-500"><Trash size={16} /></button>
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
              <Input label="Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
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
  const { products, categories, deleteProduct, addProduct, updateProduct, config } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Initialize with the first category ID if available, else empty
  const defaultCat = categories.length > 0 ? categories[0].name : '';

  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '', price: 0, discountPrice: undefined, category: defaultCat, description: '', images: [], videos: [], sizes: ['S', 'M', 'L'], colors: [], stock: 10
  });

  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const openAddModal = () => {
    setEditingId(null);
    setNewProd({
      name: '', price: 0, discountPrice: undefined, category: categories.length > 0 ? categories[0].name : '', description: '', images: [], videos: [], sizes: ['S', 'M', 'L'], colors: [], stock: 10
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setNewProd({ ...product });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewProd(prev => ({ ...prev, images: [...(prev.images || []), reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewProd(prev => ({ ...prev, videos: [...(prev.videos || []), reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setNewProd(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== index) }));
  };

  const removeVideo = (index: number) => {
    setNewProd(prev => ({ ...prev, videos: prev.videos?.filter((_, i) => i !== index) }));
  };

  const addSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (sizeInput && !newProd.sizes?.includes(sizeInput)) {
      setNewProd(prev => ({ ...prev, sizes: [...(prev.sizes || []), sizeInput] }));
      setSizeInput("");
    }
  };

  const removeSize = (s: string) => {
    setNewProd(prev => ({ ...prev, sizes: prev.sizes?.filter(x => x !== s) }));
  };

  const addColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (colorInput && !newProd.colors?.includes(colorInput)) {
      setNewProd(prev => ({ ...prev, colors: [...(prev.colors || []), colorInput] }));
      setColorInput("");
    }
  };

  const removeColor = (c: string) => {
    setNewProd(prev => ({ ...prev, colors: prev.colors?.filter(x => x !== c) }));
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
        videos: newProd.videos || [],
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
                <button onClick={() => openEditModal(p)} className="bg-white p-2 rounded-full hover:bg-gray-100 text-brand-900 transition"><Edit size={16} /></button>
                <button onClick={() => deleteProduct(p.id)} className="bg-white p-2 rounded-full hover:bg-rose-50 text-rose-500 transition"><Trash size={16} /></button>
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
                    <span className="font-bold text-brand-900">{config.currency || '$'}{p.discountPrice || p.price}</span>
                    {p.discountPrice && <span className="ml-2 text-xs text-gray-400 line-through">{config.currency || '$'}{p.price}</span>}
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
                  <label className="block text-sm font-medium mb-2">Product Media (Images & Videos)</label>

                  {/* Images Section */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Images</p>
                    <div className="flex flex-wrap gap-4">
                      {newProd.images?.map((img, idx) => (
                        <div key={idx} className="w-24 h-32 bg-gray-100 border rounded relative group overflow-hidden">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white text-rose-500 rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
                        </div>
                      ))}
                      <label className="w-24 h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400 hover:text-brand-900 transition">
                        <ImageIcon size={24} className="mb-1" />
                        <span className="text-[10px]">Add Image</span>
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>

                  {/* Videos Section */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Videos</p>
                    <div className="flex flex-wrap gap-4">
                      {newProd.videos?.map((vid, idx) => (
                        <div key={idx} className="w-24 h-32 bg-gray-900 border rounded relative group overflow-hidden">
                          <video src={vid} className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><Video size={20} className="text-white" /></div>
                          <button type="button" onClick={() => removeVideo(idx)} className="absolute top-1 right-1 bg-white text-rose-500 rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition pointer-events-auto"><X size={12} /></button>
                        </div>
                      ))}
                      <label className="w-24 h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400 hover:text-brand-900 transition">
                        <Video size={24} className="mb-1" />
                        <span className="text-[10px]">Add Video</span>
                        <input type="file" className="hidden" accept="video/*" multiple onChange={handleVideoUpload} />
                      </label>
                    </div>
                  </div>
                </div>

                <Input label="Product Name" required value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} className="md:col-span-2" />

                <Input label={`Original Price (${config.currency || '$'})`} type="number" required value={newProd.price} onChange={e => setNewProd({ ...newProd, price: +e.target.value })} />

                <div className="w-full">
                  <Input
                    label="Discounted Price (Optional)"
                    type="number"
                    value={newProd.discountPrice || ''}
                    onChange={e => setNewProd({ ...newProd, discountPrice: e.target.value ? +e.target.value : undefined })}
                  />
                  {newProd.discountPrice && newProd.price && newProd.discountPrice < newProd.price && (
                    <p className="text-xs text-green-600 mt-1">
                      {Math.round(((newProd.price - newProd.discountPrice) / newProd.price) * 100)}% Off
                    </p>
                  )}
                </div>

                <Input label="Stock Quantity" type="number" required value={newProd.stock} onChange={e => setNewProd({ ...newProd, stock: +e.target.value })} />

                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    className="w-full border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-800"
                    value={newProd.category}
                    onChange={e => setNewProd({ ...newProd, category: e.target.value })}
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
                        {s} <button type="button" onClick={() => removeSize(s)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
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
                        {c} <button type="button" onClick={() => removeColor(c)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center text-sm cursor-pointer"><input type="checkbox" className="mr-2" checked={newProd.newArrival} onChange={e => setNewProd({ ...newProd, newArrival: e.target.checked })} />New Arrival</label>
                    <label className="flex items-center text-sm cursor-pointer"><input type="checkbox" className="mr-2" checked={newProd.bestSeller} onChange={e => setNewProd({ ...newProd, bestSeller: e.target.checked })} />Best Seller</label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="w-full border border-gray-200 p-3 text-sm min-h-[100px]" value={newProd.description} onChange={e => setNewProd({ ...newProd, description: e.target.value })}></textarea>
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
  const { orders, updateOrderStatus, config } = useStore();
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
                <td className="px-6 py-4">{config.currency || '$'}{order.total}</td>
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
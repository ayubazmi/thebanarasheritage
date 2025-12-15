import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, SectionHeader } from '../components/ui';
import { Product, Category, User, LayoutSection } from '../types';
import { 
  Plus, Trash, Edit, Package, ShoppingCart, DollarSign, TrendingUp, 
  Upload, Image as ImageIcon, X, Settings, List, Layout, User as UserIcon, Lock, Megaphone, Video, Hexagon, Type, ShieldCheck, Share2, Heart, Palette, GripVertical, Eye, EyeOff, MoveUp, MoveDown, RotateCcw, AlignLeft, AlignCenter, AlignRight, FileText, Monitor, Globe, Footprints
} from 'lucide-react';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000';
const DEFAULT_PROMO_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';

const DEFAULT_LAYOUT_RESET: LayoutSection[] = [
  { id: '1', type: 'hero', isVisible: true, data: { title: 'Elegance in Every Stitch', subtitle: 'Discover our latest arrivals designed for the modern woman.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000', tagline: 'New Collection' } },
  { id: '2', type: 'categories', isVisible: true, data: { title: 'Shop by Category' } },
  { id: '3', type: 'featured', isVisible: true, data: { title: 'New Arrivals', subtitle: 'Fresh styles just added.' } },
  { id: '4', type: 'banner', isVisible: true, data: { title: 'Summer Sale', text: 'Up to 50% Off.', buttonText: 'Shop Now', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000' } },
  { id: '5', type: 'trust', isVisible: true, data: { badge1Title: 'Premium Quality', badge1Text: 'Hand-picked fabrics', badge2Title: 'Secure Payment', badge2Text: '100% secure', badge3Title: 'Fast Delivery', badge3Text: 'Ships in 3 days' } }
];

const DEFAULT_THEME_RESET = {
    background: '#FFFFFF',
    surface: '#F3F4F6',
    border: '#E5E7EB',
    primary: '#111827',
    secondary: '#4B5563'
};

const DEFAULT_FOOTER_COLORS = {
    background: '#FFFFFF',
    text: '#111827',
    border: '#E5E7EB'
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

// --- Developer Settings (New) ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig, logs } = useStore();
  const [activeTab, setActiveTab] = useState<'layout' | 'theme'>('layout');
  
  // Layout Builder State - Init from config
  const [layout, setLayout] = useState<LayoutSection[]>(config.homeLayout || DEFAULT_LAYOUT_RESET);
  const [selectedSection, setSelectedSection] = useState<LayoutSection | null>(null);

  // Theme State
  const [theme, setTheme] = useState(config.themeColors || DEFAULT_THEME_RESET);
  const [navbarLayout, setNavbarLayout] = useState<'left'|'center'|'right'>(config.navbarLayout || 'center');
  const [borderRadius, setBorderRadius] = useState<string>(config.borderRadius || '2px');
  
  // Footer Colors
  const [footerColors, setFooterColors] = useState(config.footerColors || DEFAULT_FOOTER_COLORS);

  // Ensure state is synced if config loads late (though usually handled by parent loader)
  useEffect(() => {
    if (config.homeLayout && config.homeLayout.length > 0) setLayout(config.homeLayout);
    if (config.themeColors) setTheme(config.themeColors);
    if (config.navbarLayout) setNavbarLayout(config.navbarLayout);
    if (config.borderRadius) setBorderRadius(config.borderRadius);
    if (config.footerColors) setFooterColors(config.footerColors);
  }, [config]);

  const handleSave = async () => {
    await updateConfig({
      ...config,
      homeLayout: layout,
      themeColors: theme,
      footerColors: footerColors,
      navbarLayout: navbarLayout,
      borderRadius: borderRadius
    });
    alert("Developer Settings Saved Successfully!");
  };

  const handleReset = () => {
    if (confirm("Reset layout and theme to defaults?")) {
        setLayout(DEFAULT_LAYOUT_RESET);
        setTheme(DEFAULT_THEME_RESET);
        setFooterColors(DEFAULT_FOOTER_COLORS);
        setNavbarLayout('center');
        setBorderRadius('0px');
        alert("Defaults restored. Click 'Save' to apply.");
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === layout.length - 1) return;

    const newLayout = [...layout];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newLayout[index];
    newLayout[index] = newLayout[targetIndex];
    newLayout[targetIndex] = temp;
    
    setLayout(newLayout);
  };

  const toggleVisibility = (index: number) => {
    const newLayout = [...layout];
    newLayout[index] = { ...newLayout[index], isVisible: !newLayout[index].isVisible };
    setLayout(newLayout);
  };

  const deleteSection = (index: number) => {
    if(confirm("Remove this section?")) {
      const newLayout = [...layout];
      newLayout.splice(index, 1);
      setLayout(newLayout);
      setSelectedSection(null);
    }
  };

  const addSection = (type: string) => {
    const newSection: LayoutSection = {
      id: Date.now().toString(),
      type: type as any,
      isVisible: true,
      data: {}
    };
    
    // Default Data
    const defaults: any = {
        hero: { title: 'New Hero', subtitle: 'Hero subtitle', tagline: 'Welcome', image: DEFAULT_HERO_IMAGE },
        categories: { title: 'Shop Categories' },
        featured: { title: 'Featured Products', subtitle: 'Handpicked for you' },
        banner: { title: 'New Promo', text: 'Discount details', buttonText: 'Shop', image: DEFAULT_PROMO_IMAGE },
        trust: { badge1Title: 'Quality', badge1Text: 'Desc', badge2Title: 'Secure', badge2Text: 'Desc', badge3Title: 'Fast', badge3Text: 'Desc' },
        text_image: { title: 'Our Story', content: 'Write your story here...', buttonText: 'Read More', image: DEFAULT_PROMO_IMAGE, imagePosition: 'right' },
        video: { title: 'Watch Our Story', description: 'See how we make our products.', videoUrl: '' },
        testimonials: { title: 'Customer Love', review1Text: 'Amazing quality!', review1Author: 'Jane D.', review2Text: 'Fast shipping.', review2Author: 'John S.' },
        spacer: { height: 50, showLine: true }
    };

    newSection.data = defaults[type] || {};
    setLayout([...layout, newSection]);
  };

  const updateSectionData = (key: string, value: any) => {
    if (!selectedSection) return;
    const updated = { ...selectedSection, data: { ...selectedSection.data, [key]: value } };
    setSelectedSection(updated);
    setLayout(layout.map(s => s.id === updated.id ? updated : s));
  };

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold">Developer Settings</h1>
        <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50">
                <RotateCcw size={16} className="mr-2"/> Reset Defaults
            </Button>
            <Button onClick={handleSave}>Save All Changes</Button>
        </div>
      </div>

      <div className="flex space-x-4 border-b mb-8">
        <button onClick={() => setActiveTab('layout')} className={`pb-2 px-4 ${activeTab === 'layout' ? 'border-b-2 border-brand-900 font-bold' : 'text-gray-500'}`}>Layout Builder</button>
        <button onClick={() => setActiveTab('theme')} className={`pb-2 px-4 ${activeTab === 'theme' ? 'border-b-2 border-brand-900 font-bold' : 'text-gray-500'}`}>Theme & Interface</button>
      </div>

      {/* ... Layout Tab Content ... */}
      {activeTab === 'layout' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section List */}
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded mb-4">
              <h3 className="font-bold text-sm text-gray-500 mb-2 uppercase">Homepage Sections</h3>
              <p className="text-xs text-gray-400">Drag & Drop functionality simulated with Up/Down controls.</p>
            </div>
            
            {layout.map((section, idx) => (
              <div 
                key={section.id} 
                className={`bg-white p-3 rounded shadow-sm border flex items-center justify-between cursor-pointer ${selectedSection?.id === section.id ? 'ring-2 ring-brand-900' : ''}`}
                onClick={() => setSelectedSection(section)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400"><GripVertical size={16}/></div>
                  <span className="font-medium text-sm capitalize">{section.type.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); toggleVisibility(idx); }} className="p-1 text-gray-400 hover:text-black">{section.isVisible ? <Eye size={14}/> : <EyeOff size={14}/>}</button>
                  <button onClick={(e) => { e.stopPropagation(); moveSection(idx, 'up'); }} className="p-1 text-gray-400 hover:text-black disabled:opacity-30" disabled={idx === 0}><MoveUp size={14}/></button>
                  <button onClick={(e) => { e.stopPropagation(); moveSection(idx, 'down'); }} className="p-1 text-gray-400 hover:text-black disabled:opacity-30" disabled={idx === layout.length - 1}><MoveDown size={14}/></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteSection(idx); }} className="p-1 text-rose-400 hover:text-rose-600"><Trash size={14}/></button>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t space-y-4">
              <div>
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Standard Sections</p>
                  <div className="grid grid-cols-2 gap-2">
                     <Button variant="outline" size="sm" onClick={() => addSection('hero')}>+ Hero</Button>
                     <Button variant="outline" size="sm" onClick={() => addSection('categories')}>+ Categories</Button>
                     <Button variant="outline" size="sm" onClick={() => addSection('featured')}>+ Products</Button>
                     <Button variant="outline" size="sm" onClick={() => addSection('banner')}>+ Banner</Button>
                     <Button variant="outline" size="sm" onClick={() => addSection('trust')}>+ Trust</Button>
                  </div>
              </div>
              
              <div>
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Rich Content Elements</p>
                  <div className="grid grid-cols-2 gap-2">
                     <Button variant="outline" size="sm" onClick={() => addSection('text_image')}>+ Text & Image</Button>
                     <Button variant="outline" size="sm" onClick={() => addSection('video')}>+ Video Player</Button>
                     <Button variant="outline" size="sm" onClick={() => addSection('testimonials')}>+ Testimonials</Button>
                  </div>
              </div>

              <div>
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Shapes & Spacers</p>
                  <div className="grid grid-cols-2 gap-2">
                     <Button variant="outline" size="sm" onClick={() => addSection('spacer')}>+ Spacer/Line</Button>
                  </div>
              </div>
            </div>
          </div>

          {/* Editor Panel */}
          <div className="lg:col-span-2 bg-white p-6 rounded shadow-sm h-fit">
            {selectedSection ? (
              <div className="space-y-6">
                 <h3 className="font-bold text-lg border-b pb-2 capitalize">Edit {selectedSection.type.replace('_', ' ')}</h3>
                 
                 {selectedSection.type === 'hero' && (
                   <>
                     <Input label="Title" value={selectedSection.data.title || ''} onChange={e => updateSectionData('title', e.target.value)} />
                     <Input label="Subtitle" value={selectedSection.data.subtitle || ''} onChange={e => updateSectionData('subtitle', e.target.value)} />
                     <Input label="Tagline" value={selectedSection.data.tagline || ''} onChange={e => updateSectionData('tagline', e.target.value)} />
                     <Input label="Image URL" value={selectedSection.data.image || ''} onChange={e => updateSectionData('image', e.target.value)} />
                   </>
                 )}

                 {selectedSection.type === 'text_image' && (
                   <>
                     <Input label="Heading" value={selectedSection.data.title || ''} onChange={e => updateSectionData('title', e.target.value)} />
                     <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <textarea className="w-full border p-2 text-sm h-32" value={selectedSection.data.content || ''} onChange={e => updateSectionData('content', e.target.value)} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <Input label="Button Text" value={selectedSection.data.buttonText || ''} onChange={e => updateSectionData('buttonText', e.target.value)} />
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Image Position</label>
                            <select className="border p-2 text-sm" value={selectedSection.data.imagePosition || 'right'} onChange={e => updateSectionData('imagePosition', e.target.value)}>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                     </div>
                     <Input label="Image URL" value={selectedSection.data.image || ''} onChange={e => updateSectionData('image', e.target.value)} />
                   </>
                 )}

                 {selectedSection.type === 'video' && (
                   <>
                     <Input label="Section Title" value={selectedSection.data.title || ''} onChange={e => updateSectionData('title', e.target.value)} />
                     <Input label="Description" value={selectedSection.data.description || ''} onChange={e => updateSectionData('description', e.target.value)} />
                     <Input label="Video URL (MP4 Link)" value={selectedSection.data.videoUrl || ''} onChange={e => updateSectionData('videoUrl', e.target.value)} placeholder="https://..." />
                   </>
                 )}

                 {selectedSection.type === 'spacer' && (
                   <div className="grid grid-cols-2 gap-6">
                     <Input label="Height (px)" type="number" value={selectedSection.data.height || 50} onChange={e => updateSectionData('height', e.target.value)} />
                     <div className="flex items-center pt-6">
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="mr-2" checked={selectedSection.data.showLine} onChange={e => updateSectionData('showLine', e.target.checked)} />
                            Show Divider Line
                        </label>
                     </div>
                   </div>
                 )}

                 {selectedSection.type === 'testimonials' && (
                   <div className="space-y-4">
                      <Input label="Section Title" value={selectedSection.data.title || ''} onChange={e => updateSectionData('title', e.target.value)} />
                      <div className="border-t pt-4">
                          <p className="font-bold text-xs mb-2">Review 1</p>
                          <Input label="Text" value={selectedSection.data.review1Text || ''} onChange={e => updateSectionData('review1Text', e.target.value)} className="mb-2" />
                          <Input label="Author" value={selectedSection.data.review1Author || ''} onChange={e => updateSectionData('review1Author', e.target.value)} />
                      </div>
                      <div className="border-t pt-4">
                          <p className="font-bold text-xs mb-2">Review 2</p>
                          <Input label="Text" value={selectedSection.data.review2Text || ''} onChange={e => updateSectionData('review2Text', e.target.value)} className="mb-2" />
                          <Input label="Author" value={selectedSection.data.review2Author || ''} onChange={e => updateSectionData('review2Author', e.target.value)} />
                      </div>
                   </div>
                 )}

                 {/* Existing editors for featured, categories, banner, trust */}
                 {selectedSection.type === 'featured' && (
                    <>
                      <Input label="Section Title" value={selectedSection.data.title || ''} onChange={e => updateSectionData('title', e.target.value)} />
                      <Input label="Subtitle" value={selectedSection.data.subtitle || ''} onChange={e => updateSectionData('subtitle', e.target.value)} />
                    </>
                 )}

                 {selectedSection.type === 'categories' && (
                    <Input label="Section Title" value={selectedSection.data.title || ''} onChange={e => updateSectionData('title', e.target.value)} />
                 )}

                 {selectedSection.type === 'banner' && (
                   <>
                     <Input label="Title" value={selectedSection.data.title || ''} onChange={e => updateSectionData('title', e.target.value)} />
                     <div className="col-span-1">
                        <label className="block text-sm font-medium mb-1">Text</label>
                        <textarea className="w-full border p-2 text-sm" value={selectedSection.data.text || ''} onChange={e => updateSectionData('text', e.target.value)} />
                     </div>
                     <Input label="Button Text" value={selectedSection.data.buttonText || ''} onChange={e => updateSectionData('buttonText', e.target.value)} />
                     <Input label="Image URL" value={selectedSection.data.image || ''} onChange={e => updateSectionData('image', e.target.value)} />
                   </>
                 )}
                 
                 {selectedSection.type === 'trust' && (
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Badge 1 Title" value={selectedSection.data.badge1Title || ''} onChange={e => updateSectionData('badge1Title', e.target.value)} />
                      <Input label="Badge 1 Text" value={selectedSection.data.badge1Text || ''} onChange={e => updateSectionData('badge1Text', e.target.value)} />
                      <Input label="Badge 2 Title" value={selectedSection.data.badge2Title || ''} onChange={e => updateSectionData('badge2Title', e.target.value)} />
                      <Input label="Badge 2 Text" value={selectedSection.data.badge2Text || ''} onChange={e => updateSectionData('badge2Text', e.target.value)} />
                      <Input label="Badge 3 Title" value={selectedSection.data.badge3Title || ''} onChange={e => updateSectionData('badge3Title', e.target.value)} />
                      <Input label="Badge 3 Text" value={selectedSection.data.badge3Text || ''} onChange={e => updateSectionData('badge3Text', e.target.value)} />
                    </div>
                 )}

              </div>
            ) : (
              <div className="text-center text-gray-400 py-20">Select a section to edit properties</div>
            )}
          </div>
        </div>
      )}

      {/* ... Theme Tab Content ... */}
      {activeTab === 'theme' && (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex items-center"><Layout className="mr-2"/> Interface Layout</h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-3">Navbar Layout / Toolbar Position</label>
                        <div className="grid grid-cols-3 gap-4">
                            <button 
                                onClick={() => setNavbarLayout('left')} 
                                className={`p-4 border rounded flex flex-col items-center gap-2 hover:bg-gray-50 ${navbarLayout === 'left' ? 'border-brand-900 bg-brand-50' : 'border-gray-200'}`}
                            >
                                <AlignLeft size={24}/>
                                <span className="text-xs">Left</span>
                            </button>
                            <button 
                                onClick={() => setNavbarLayout('center')} 
                                className={`p-4 border rounded flex flex-col items-center gap-2 hover:bg-gray-50 ${navbarLayout === 'center' ? 'border-brand-900 bg-brand-50' : 'border-gray-200'}`}
                            >
                                <AlignCenter size={24}/>
                                <span className="text-xs">Center</span>
                            </button>
                            <button 
                                onClick={() => setNavbarLayout('right')} 
                                className={`p-4 border rounded flex flex-col items-center gap-2 hover:bg-gray-50 ${navbarLayout === 'right' ? 'border-brand-900 bg-brand-50' : 'border-gray-200'}`}
                            >
                                <AlignRight size={24}/>
                                <span className="text-xs">Right</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">Global Corner Radius</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['0px', '4px', '8px', '16px'].map(r => (
                                <button 
                                    key={r}
                                    onClick={() => setBorderRadius(r)} 
                                    className={`p-2 border text-xs hover:bg-gray-50 ${borderRadius === r ? 'border-brand-900 bg-brand-50 font-bold' : 'border-gray-200'}`}
                                    style={{ borderRadius: r }}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex items-center"><Palette className="mr-2"/> Color Palette</h3>
                <div className="space-y-6">
                    {/* Main Theme Colors */}
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <label className="text-sm font-medium">Background (Lightest)</label>
                        <div className="flex gap-2">
                        <input type="color" value={theme.background} onChange={e => setTheme({...theme, background: e.target.value})} className="h-8 w-12 p-0 border-0" />
                        <Input value={theme.background} onChange={e => setTheme({...theme, background: e.target.value})} className="flex-1" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <label className="text-sm font-medium">Surface/Cards</label>
                        <div className="flex gap-2">
                        <input type="color" value={theme.surface} onChange={e => setTheme({...theme, surface: e.target.value})} className="h-8 w-12 p-0 border-0" />
                        <Input value={theme.surface} onChange={e => setTheme({...theme, surface: e.target.value})} className="flex-1" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <label className="text-sm font-medium">Border/Divider</label>
                        <div className="flex gap-2">
                        <input type="color" value={theme.border} onChange={e => setTheme({...theme, border: e.target.value})} className="h-8 w-12 p-0 border-0" />
                        <Input value={theme.border} onChange={e => setTheme({...theme, border: e.target.value})} className="flex-1" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <label className="text-sm font-medium">Primary Text/Actions</label>
                        <div className="flex gap-2">
                        <input type="color" value={theme.primary} onChange={e => setTheme({...theme, primary: e.target.value})} className="h-8 w-12 p-0 border-0" />
                        <Input value={theme.primary} onChange={e => setTheme({...theme, primary: e.target.value})} className="flex-1" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <label className="text-sm font-medium">Secondary/Accents</label>
                        <div className="flex gap-2">
                        <input type="color" value={theme.secondary} onChange={e => setTheme({...theme, secondary: e.target.value})} className="h-8 w-12 p-0 border-0" />
                        <Input value={theme.secondary} onChange={e => setTheme({...theme, secondary: e.target.value})} className="flex-1" />
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                    <h3 className="font-bold text-lg mb-4 flex items-center"><Footprints className="mr-2"/> Footer Styling</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label className="text-sm font-medium">Footer Background</label>
                            <div className="flex gap-2">
                            <input type="color" value={footerColors.background} onChange={e => setFooterColors({...footerColors, background: e.target.value})} className="h-8 w-12 p-0 border-0" />
                            <Input value={footerColors.background} onChange={e => setFooterColors({...footerColors, background: e.target.value})} className="flex-1" />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4 items-center">
                            <label className="text-sm font-medium">Footer Text</label>
                            <div className="flex gap-2">
                            <input type="color" value={footerColors.text} onChange={e => setFooterColors({...footerColors, text: e.target.value})} className="h-8 w-12 p-0 border-0" />
                            <Input value={footerColors.text} onChange={e => setFooterColors({...footerColors, text: e.target.value})} className="flex-1" />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4 items-center">
                            <label className="text-sm font-medium">Footer Border</label>
                            <div className="flex gap-2">
                            <input type="color" value={footerColors.border} onChange={e => setFooterColors({...footerColors, border: e.target.value})} className="h-8 w-12 p-0 border-0" />
                            <Input value={footerColors.border} onChange={e => setFooterColors({...footerColors, border: e.target.value})} className="flex-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// ... existing AdminProducts, AdminOrders, AdminCategories, AdminUsers, AdminSettings ...
export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', description: '', price: 0, category: '', stock: 0, images: [''], newArrival: false
  });

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: 0, category: categories[0]?.name || '', stock: 0, images: [''], newArrival: false });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct({ ...editingProduct, ...formData } as Product);
      } else {
        await addProduct(formData as Product);
      }
      setIsModalOpen(false);
    } catch (e) { alert("Error saving product"); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold">Products</h1>
        <Button onClick={() => openModal()}><Plus size={18} className="mr-2"/> Add Product</Button>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 uppercase text-xs text-gray-700">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img src={p.images[0]} className="w-10 h-10 object-cover rounded" alt="" />
                </td>
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4">{p.category}</td>
                <td className="px-6 py-4">${p.price}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => openModal(p)} className="text-blue-600 hover:text-blue-800"><Edit size={16}/></button>
                  <button onClick={() => deleteProduct(p.id)} className="text-rose-600 hover:text-rose-800"><Trash size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  className="w-full border p-2 rounded" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                <Input label="Stock" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
              </div>
              <Input label="Image URL" value={formData.images?.[0]} onChange={e => setFormData({...formData, images: [e.target.value]})} />
              <div>
                 <label className="block text-sm font-medium mb-1">Description</label>
                 <textarea className="w-full border p-2 rounded text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Product</Button>
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
      <h1 className="text-2xl font-serif font-bold mb-6">Orders</h1>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 uppercase text-xs text-gray-700">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs">{o.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{o.customerName}</div>
                  <div className="text-xs text-gray-500">{o.email}</div>
                </td>
                <td className="px-6 py-4">{o.date}</td>
                <td className="px-6 py-4 font-bold">${o.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    o.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    o.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <select 
                    className="border p-1 rounded text-xs" 
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
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

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateCategory({ ...editing, name, image });
      setEditing(null);
    } else {
      await addCategory({ id: '', name, image });
    }
    setName(''); setImage('');
  };

  const startEdit = (c: Category) => {
    setEditing(c);
    setName(c.name);
    setImage(c.image);
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-serif font-bold mb-6">Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(c => (
            <div key={c.id} className="bg-white p-4 rounded shadow-sm flex items-center gap-4">
              <img src={c.image} alt="" className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-bold">{c.name}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(c)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={16}/></button>
                <button onClick={() => deleteCategory(c.id)} className="p-2 text-gray-500 hover:text-rose-600"><Trash size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="bg-white p-6 rounded shadow-sm sticky top-6">
          <h2 className="font-bold mb-4">{editing ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
            <Input label="Image URL" value={image} onChange={e => setImage(e.target.value)} required />
            <div className="flex gap-2">
               {editing && <Button type="button" variant="secondary" onClick={() => { setEditing(null); setName(''); setImage(''); }}>Cancel</Button>}
               <Button type="submit" className="w-full">{editing ? 'Update' : 'Add'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const AdminUsers: React.FC = () => {
    const { users, addUser, deleteUser } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ username: '', password: '', role: 'staff' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addUser(form);
        setIsOpen(false);
        setForm({ username: '', password: '', role: 'staff' });
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-serif font-bold">User Management</h1>
                <Button onClick={() => setIsOpen(true)}><Plus size={18} className="mr-2"/> Add User</Button>
            </div>
            
            <div className="bg-white rounded shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Username</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold">{u.username}</td>
                                <td className="px-6 py-4"><span className="uppercase text-xs font-bold bg-gray-100 px-2 py-1 rounded">{u.role}</span></td>
                                <td className="px-6 py-4">
                                    {u.role !== 'admin' && (
                                        <button onClick={() => deleteUser(u.id)} className="text-rose-500 hover:text-rose-700 text-xs font-bold">REMOVE</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-sm">
                        <h3 className="font-bold text-lg mb-4">Add User</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                             <Input label="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
                             <Input label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                             <div>
                                 <label className="text-sm font-medium mb-1 block">Role</label>
                                 <select className="w-full border p-2 rounded" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                                     <option value="staff">Staff</option>
                                     <option value="admin">Admin</option>
                                 </select>
                             </div>
                             <div className="flex justify-end gap-2 pt-2">
                                 <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                                 <Button type="submit">Create</Button>
                             </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AdminSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [data, setData] = useState(config);

  useEffect(() => setData(config), [config]);

  const save = async () => {
     await updateConfig(data);
     alert("Content updated!");
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-2xl font-serif font-bold">Content & Settings</h1>
         <Button onClick={save}>Save Changes</Button>
      </div>

      <div className="space-y-8">
         <div className="bg-white p-6 rounded shadow-sm">
             <h3 className="font-bold mb-4 flex items-center gap-2"><Megaphone size={18}/> Contact Information</h3>
             <div className="grid md:grid-cols-2 gap-4">
                <Input label="Contact Email" value={data.contactEmail || ''} onChange={e => setData({...data, contactEmail: e.target.value})} />
                <Input label="Contact Phone" value={data.contactPhone || ''} onChange={e => setData({...data, contactPhone: e.target.value})} />
                <Input label="Address" value={data.contactAddress || ''} onChange={e => setData({...data, contactAddress: e.target.value})} className="md:col-span-2" />
             </div>
         </div>

         <div className="bg-white p-6 rounded shadow-sm">
             <h3 className="font-bold mb-4 flex items-center gap-2"><Share2 size={18}/> Social Media</h3>
             <div className="grid md:grid-cols-3 gap-4">
                <Input label="Instagram URL" value={data.socialInstagram || ''} onChange={e => setData({...data, socialInstagram: e.target.value})} />
                <Input label="Facebook URL" value={data.socialFacebook || ''} onChange={e => setData({...data, socialFacebook: e.target.value})} />
                <Input label="WhatsApp URL" value={data.socialWhatsapp || ''} onChange={e => setData({...data, socialWhatsapp: e.target.value})} />
             </div>
         </div>

         <div className="bg-white p-6 rounded shadow-sm">
             <h3 className="font-bold mb-4 flex items-center gap-2"><FileText size={18}/> About Page Content</h3>
             <Input label="Page Title" value={data.aboutTitle || ''} onChange={e => setData({...data, aboutTitle: e.target.value})} className="mb-4" />
             <div>
                <label className="text-sm font-medium mb-1 block">Main Content</label>
                <textarea 
                  className="w-full border p-3 text-sm h-40 rounded focus:outline-none focus:ring-1 focus:ring-brand-900" 
                  value={data.aboutContent || ''} 
                  onChange={e => setData({...data, aboutContent: e.target.value})} 
                />
             </div>
         </div>
         
         <div className="bg-white p-6 rounded shadow-sm">
             <h3 className="font-bold mb-4 flex items-center gap-2"><Layout size={18}/> Footer Content</h3>
             <div className="grid md:grid-cols-2 gap-4">
                 <Input label="Footer Logo URL" value={data.footerLogo || ''} onChange={e => setData({...data, footerLogo: e.target.value})} />
                 <Input label="Copyright Text" value={data.footerCopyright || ''} onChange={e => setData({...data, footerCopyright: e.target.value})} />
                 <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-1 block">Short Description</label>
                    <textarea 
                      className="w-full border p-2 text-sm rounded" 
                      value={data.footerDescription || ''} 
                      onChange={e => setData({...data, footerDescription: e.target.value})} 
                    />
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

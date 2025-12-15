import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, SectionHeader } from '../components/ui';
import { Product, Category, User, LayoutSection } from '../types';
import { 
  Plus, Trash, Edit, Package, ShoppingCart, DollarSign, TrendingUp, 
  Upload, Image as ImageIcon, X, Settings, List, Layout, User as UserIcon, Lock, Megaphone, Video, Hexagon, Type, ShieldCheck, Share2, Heart,
  Palette, GripVertical, Eye, EyeOff, MoveUp, MoveDown, RotateCcw, AlignLeft, AlignCenter, AlignRight, FileText, Monitor, Globe, Footprints
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

// --- Admin Login ---
export const AdminLogin: React.FC = () => {
  const { login, user } = useStore();
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => { if (user) navigate('/admin'); }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(creds.username, creds.password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-serif font-bold text-center mb-6 text-brand-900">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" value={creds.username} onChange={e => setCreds({...creds, username: e.target.value})} />
          <Input label="Password" type="password" value={creds.password} onChange={e => setCreds({...creds, password: e.target.value})} />
          {error && <p className="text-rose-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    </div>
  );
};

// --- Admin Dashboard ---
export const AdminDashboard: React.FC = () => {
  const { products, orders, users } = useStore();
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color} text-white`}><Icon size={24} /></div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Sales" value={`$${totalSales.toLocaleString()}`} icon={DollarSign} color="bg-emerald-500" />
        <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} color="bg-blue-500" />
        <StatCard title="Products" value={products.length} icon={Package} color="bg-amber-500" />
        <StatCard title="Users" value={users.length} icon={UserIcon} color="bg-indigo-500" />
      </div>
    </div>
  );
};

// --- Admin Products ---
export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState<Partial<Product>>({
    name: '', description: '', price: 0, category: '', images: [], sizes: [], colors: [], stock: 0
  });

  const handleEdit = (p: Product) => {
    setForm(p);
    setEditing(p);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setForm({ name: '', description: '', price: 0, category: categories[0]?.name || '', images: [], sizes: [], colors: [], stock: 0 });
    setEditing(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editing) await updateProduct({ ...editing, ...form } as Product);
    else await addProduct(form as Product);
    setIsModalOpen(false);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setForm(prev => ({ ...prev, images: [reader.result as string, ...(prev.images || [])] }));
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold">Products</h1>
        <Button onClick={handleAdd}><Plus size={20} className="mr-2"/> Add Product</Button>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id}>
                <td className="p-4 flex items-center gap-3">
                  <img src={p.images[0]} className="w-10 h-10 object-cover rounded" alt="" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">${p.price}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="p-1 text-gray-400 hover:text-brand-900"><Edit size={18}/></button>
                  <button onClick={() => deleteProduct(p.id)} className="p-1 text-gray-400 hover:text-rose-500"><Trash size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Product' : 'New Product'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="col-span-2" />
              <Input label="Price" type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
              <Input label="Discount Price" type="number" value={form.discountPrice || ''} onChange={e => setForm({...form, discountPrice: Number(e.target.value)})} />
              <div className="col-span-2">
                 <label className="block text-sm font-medium mb-1">Category</label>
                 <select className="w-full border p-2 rounded" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                 </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full border p-2 rounded h-20" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Images</label>
                  <div className="flex gap-2 mb-2">
                      {form.images?.map((img, i) => (
                          <img key={i} src={img} className="w-16 h-16 object-cover border rounded" />
                      ))}
                  </div>
                  <input type="file" onChange={handleImageUpload} />
              </div>
              <Input label="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
              <Input label="Sizes (comma sep)" value={form.sizes?.join(',')} onChange={e => setForm({...form, sizes: e.target.value.split(',')})} />
              <Input label="Colors (comma sep)" value={form.colors?.join(',')} onChange={e => setForm({...form, colors: e.target.value.split(',')})} />
              <div className="col-span-2 flex items-center gap-4">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.newArrival} onChange={e => setForm({...form, newArrival: e.target.checked})}/> New Arrival</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.bestSeller} onChange={e => setForm({...form, bestSeller: e.target.checked})}/> Best Seller</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Admin Categories ---
export const AdminCategories: React.FC = () => {
    const { categories, addCategory, deleteCategory } = useStore();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');

    const handleAdd = async () => {
        if(!name) return;
        await addCategory({ id: Date.now().toString(), name, image: image || 'https://via.placeholder.com/150' });
        setName(''); setImage('');
    };

    return (
        <div className="max-w-4xl">
             <h1 className="text-2xl font-serif font-bold mb-8">Categories</h1>
             <div className="bg-white p-6 rounded shadow-sm mb-8 flex gap-4 items-end">
                 <Input label="Category Name" value={name} onChange={e => setName(e.target.value)} />
                 <Input label="Image URL" value={image} onChange={e => setImage(e.target.value)} />
                 <Button onClick={handleAdd}>Add</Button>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {categories.map(c => (
                     <div key={c.id} className="relative group bg-white rounded shadow-sm overflow-hidden">
                         <img src={c.image} className="w-full h-32 object-cover" alt="" />
                         <div className="p-4 flex justify-between items-center">
                             <span className="font-medium">{c.name}</span>
                             <button onClick={() => deleteCategory(c.id)} className="text-rose-500"><Trash size={16}/></button>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    )
};

// --- Admin Orders ---
export const AdminOrders: React.FC = () => {
    const { orders, updateOrderStatus } = useStore();
    
    return (
        <div>
            <h1 className="text-2xl font-serif font-bold mb-8">Orders</h1>
            <div className="bg-white rounded shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map(o => (
                            <tr key={o.id}>
                                <td className="p-4 font-mono text-xs">{o.id.substring(0,8)}...</td>
                                <td className="p-4">
                                    <div className="font-medium">{o.customerName}</div>
                                    <div className="text-xs text-gray-500">{o.email}</div>
                                </td>
                                <td className="p-4">{o.items.length} items</td>
                                <td className="p-4 font-medium">${o.total}</td>
                                <td className="p-4">
                                    <select 
                                        value={o.status} 
                                        onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                                        className="border rounded px-2 py-1 text-xs"
                                    >
                                        <option>Pending</option>
                                        <option>Shipped</option>
                                        <option>Delivered</option>
                                        <option>Cancelled</option>
                                    </select>
                                </td>
                                <td className="p-4 text-gray-500">{o.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

// --- Admin Users ---
export const AdminUsers: React.FC = () => {
    const { users, addUser, deleteUser } = useStore();
    const [form, setForm] = useState({ username: '', password: '', role: 'staff' });

    const handleAdd = async () => {
        if (!form.username || !form.password) return;
        await addUser({ ...form, permissions: [] } as any);
        setForm({ username: '', password: '', role: 'staff' });
    };

    return (
        <div className="max-w-4xl">
             <h1 className="text-2xl font-serif font-bold mb-8">User Management</h1>
             
             <div className="bg-white p-6 rounded shadow-sm mb-8">
                 <h3 className="font-bold mb-4">Add New User</h3>
                 <div className="grid grid-cols-4 gap-4 items-end">
                     <Input label="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
                     <Input label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                     <div>
                         <label className="block text-sm font-medium mb-1">Role</label>
                         <select className="w-full border p-2 rounded" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                             <option value="staff">Staff</option>
                             <option value="admin">Admin</option>
                         </select>
                     </div>
                     <Button onClick={handleAdd}>Create User</Button>
                 </div>
             </div>

             <div className="bg-white rounded shadow-sm overflow-hidden">
                 <table className="w-full text-left text-sm">
                     <thead className="bg-gray-50 border-b">
                         <tr>
                             <th className="p-4">Username</th>
                             <th className="p-4">Role</th>
                             <th className="p-4">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y">
                         {users.map(u => (
                             <tr key={u.id}>
                                 <td className="p-4 font-medium">{u.username}</td>
                                 <td className="p-4 capitalize">{u.role}</td>
                                 <td className="p-4">
                                     <button onClick={() => deleteUser(u.id)} className="text-rose-500 hover:text-rose-700 flex items-center gap-1">
                                         <Trash size={14}/> Delete
                                     </button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
        </div>
    )
};

// --- Developer Settings (NEW FEATURE) ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig, logs, fetchLogs } = useStore();
  const [activeTab, setActiveTab] = useState<'layout' | 'theme' | 'logs'>('layout');
  
  // Layout Builder State - Init from config
  const [layout, setLayout] = useState<LayoutSection[]>(config.homeLayout || DEFAULT_LAYOUT_RESET);
  const [selectedSection, setSelectedSection] = useState<LayoutSection | null>(null);

  // Theme State
  const [theme, setTheme] = useState(config.themeColors || DEFAULT_THEME_RESET);
  const [navbarLayout, setNavbarLayout] = useState<'left'|'center'|'right'>(config.navbarLayout || 'center');
  const [borderRadius, setBorderRadius] = useState<string>(config.borderRadius || '2px');
  
  // Footer Colors
  const [footerColors, setFooterColors] = useState(config.footerColors || DEFAULT_FOOTER_COLORS);

  useEffect(() => {
    if (config.homeLayout && config.homeLayout.length > 0) setLayout(config.homeLayout);
    if (config.themeColors) setTheme(config.themeColors);
    if (config.navbarLayout) setNavbarLayout(config.navbarLayout);
    if (config.borderRadius) setBorderRadius(config.borderRadius);
    if (config.footerColors) setFooterColors(config.footerColors);
  }, [config]);

  // Refresh logs when tab is active
  useEffect(() => {
    if (activeTab === 'logs') {
        fetchLogs();
    }
  }, [activeTab]);

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
        <button onClick={() => setActiveTab('logs')} className={`pb-2 px-4 ${activeTab === 'logs' ? 'border-b-2 border-brand-900 font-bold' : 'text-gray-500'}`}>Visitor Logs</button>
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

      {/* ... Logs Tab Content ... */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded shadow-sm overflow-hidden">
             <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                 <div>
                     <h3 className="font-bold text-lg flex items-center gap-2"><FileText size={20}/> Access Logs</h3>
                     <p className="text-xs text-gray-500">Recent visitor activity and connection details</p>
                 </div>
                 <Button onClick={fetchLogs} variant="outline" size="sm">Refresh Logs</Button>
             </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                     <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                         <tr>
                             <th className="px-6 py-3">Time</th>
                             <th className="px-6 py-3">IP Address</th>
                             <th className="px-6 py-3">Device / OS</th>
                             <th className="px-6 py-3">Port / Connection</th>
                             <th className="px-6 py-3">User Agent Detail</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y">
                         {logs.map((log) => (
                             <tr key={log.id} className="hover:bg-gray-50">
                                 <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                     {new Date(log.timestamp).toLocaleString()}
                                 </td>
                                 <td className="px-6 py-4 font-mono text-xs">
                                     <div className="flex items-center gap-2">
                                        <Globe size={14} className="text-brand-900"/>
                                        {log.ip}
                                     </div>
                                 </td>
                                 <td className="px-6 py-4 font-medium">
                                     <div className="flex items-center gap-2">
                                        <Monitor size={14} className="text-gray-400"/>
                                        {log.device}
                                     </div>
                                 </td>
                                 <td className="px-6 py-4 font-mono text-xs text-brand-800 bg-brand-50">
                                     {log.openPorts}
                                 </td>
                                 <td className="px-6 py-4 text-xs text-gray-400 max-w-xs truncate" title={log.userAgent}>
                                     {log.userAgent}
                                 </td>
                             </tr>
                         ))}
                         {logs.length === 0 && (
                             <tr>
                                 <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No logs found yet.</td>
                             </tr>
                         )}
                     </tbody>
                 </table>
             </div>
        </div>
      )}
    </div>
  );
};

// --- Settings Manager (Unchanged) ---
export const AdminSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState(config);
  
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
        setLocalConfig(prev => ({ ...prev, heroImage: reader.result as string, heroVideo: undefined })); // Clear video if image set
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

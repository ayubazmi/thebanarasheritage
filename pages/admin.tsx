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

// --- Dashboard ---
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

// --- Products ---
export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const resetForm = () => {
    setFormData({ name: '', price: 0, category: categories[0]?.name || '', description: '', images: [], sizes: [], colors: [], stock: 0 });
    setEditingId(null);
  };

  const handleOpen = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({ ...product });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editingId) {
      await updateProduct(formData as Product);
    } else {
      await addProduct(formData as Product);
    }
    setIsModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), reader.result as string] }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold">Products</h1>
        <Button onClick={() => handleOpen()}><Plus size={16} className="mr-2"/> Add Product</Button>
      </div>
      
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Actions</th>
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
                  <button onClick={() => handleOpen(p)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                  <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-xl">{editingId ? 'Edit Product' : 'New Product'}</h3><button onClick={() => setIsModalOpen(false)}><X size={20}/></button></div>
              <div className="grid md:grid-cols-2 gap-4">
                 <Input label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 <div className="space-y-1"><label className="text-sm font-medium">Category</label><select className="w-full border p-2 text-sm rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                 <Input label="Price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                 <Input label="Discount Price" type="number" value={formData.discountPrice || ''} onChange={e => setFormData({...formData, discountPrice: Number(e.target.value)})} />
                 <Input label="Stock" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                 
                 <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">Images</label>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {formData.images?.map((img, i) => (
                        <div key={i} className="relative w-20 h-20"><img src={img} className="w-full h-full object-cover rounded"/><button onClick={() => setFormData({...formData, images: formData.images?.filter((_, idx) => idx !== i)})} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full"><X size={12}/></button></div>
                      ))}
                      <label className="w-20 h-20 border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-50"><Plus size={20}/><input type="file" className="hidden" onChange={handleImageUpload} /></label>
                    </div>
                 </div>

                 <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <textarea className="w-full border p-2 text-sm h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                 </div>

                 <div className="flex items-center gap-4 col-span-2">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={formData.newArrival || false} onChange={e => setFormData({...formData, newArrival: e.target.checked})}/> New Arrival</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={formData.bestSeller || false} onChange={e => setFormData({...formData, bestSeller: e.target.checked})}/> Best Seller</label>
                 </div>
              </div>
              <div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save Product</Button></div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Categories ---
export const AdminCategories: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Category>>({});

    const handleOpen = (cat?: Category) => {
        if (cat) { setEditingId(cat.id); setFormData({...cat}); } 
        else { setEditingId(null); setFormData({ name: '', image: '' }); }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (editingId) await updateCategory(formData as Category);
        else await addCategory(formData as Category);
        setIsModalOpen(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData(p => ({ ...p, image: reader.result as string }));
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-serif font-bold">Categories</h1><Button onClick={() => handleOpen()}><Plus size={16} className="mr-2"/> Add Category</Button></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white rounded shadow-sm overflow-hidden group relative">
                        <img src={cat.image} className="w-full h-40 object-cover" />
                        <div className="p-4"><h3 className="font-bold">{cat.name}</h3></div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => handleOpen(cat)} className="bg-white p-2 rounded shadow-sm hover:text-blue-600"><Edit size={16}/></button>
                            <button onClick={() => deleteCategory(cat.id)} className="bg-white p-2 rounded shadow-sm hover:text-red-600"><Trash size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-xl">{editingId ? 'Edit Category' : 'New Category'}</h3><button onClick={() => setIsModalOpen(false)}><X size={20}/></button></div>
                        <div className="space-y-4">
                            <Input label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <div>
                                <label className="block text-sm font-medium mb-1">Image</label>
                                {formData.image && <img src={formData.image} className="w-full h-40 object-cover mb-2 rounded" />}
                                <input type="file" onChange={handleImageUpload} />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Users ---
export const AdminUsers: React.FC = () => {
    const { users, addUser, deleteUser } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });

    const handleSave = async () => {
        await addUser(newUser);
        setIsModalOpen(false);
        setNewUser({ username: '', password: '', role: 'staff' });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-serif font-bold">User Management</h1><Button onClick={() => setIsModalOpen(true)}><Plus size={16} className="mr-2"/> Add User</Button></div>
            <div className="bg-white rounded shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase"><tr><th className="px-6 py-4">Username</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Actions</th></tr></thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{u.username}</td>
                                <td className="px-6 py-4 capitalize">{u.role}</td>
                                <td className="px-6 py-4"><button onClick={() => deleteUser(u.id)} className="text-red-600 hover:bg-red-50 p-1 rounded" disabled={u.role === 'admin'}><Trash size={16}/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-xl">Add New User</h3><button onClick={() => setIsModalOpen(false)}><X size={20}/></button></div>
                        <div className="space-y-4">
                            <Input label="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                            <Input label="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                            <div><label className="block text-sm font-medium mb-1">Role</label><select className="w-full border p-2 rounded" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}><option value="staff">Staff</option><option value="admin">Admin</option></select></div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Create User</Button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Logs ---
export const AdminLogs: React.FC = () => {
  const { logs, fetchLogs } = useStore();
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
              {logs.length === 0 && (<tr><td colSpan={4} className="text-center py-8 text-gray-500">No logs found</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Settings ---
export const AdminSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState(config);
  
  useEffect(() => { if (config) setLocalConfig(config); }, [config]);

  const handleSave = () => { updateConfig(localConfig); alert('Settings saved!'); };
  const upload = (file: File, key: keyof SiteConfig) => {
    const reader = new FileReader();
    reader.onloadend = () => setLocalConfig(p => ({ ...p, [key]: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setLocalConfig(prev => ({ ...prev, heroImage: reader.result as string, heroVideo: undefined })); reader.readAsDataURL(file); }
  };
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) { if (file.size > 10 * 1024 * 1024) { alert("Video too large! Max 10MB."); return; } const reader = new FileReader(); reader.onloadend = () => setLocalConfig(prev => ({ ...prev, heroVideo: reader.result as string })); reader.readAsDataURL(file); }
  };
  const handlePromoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setLocalConfig(prev => ({ ...prev, promoImage: reader.result as string })); reader.readAsDataURL(file); }
  };

  return (
    <div className="max-w-4xl pb-20">
      <div className="mb-8"><h1 className="text-2xl font-serif font-bold">Content & Settings</h1></div>
      <div className="space-y-8">
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center"><Hexagon className="mr-2" size={20}/> Brand Identity</h3>
          <Input label="Website Name" value={localConfig.siteName || ''} onChange={e => setLocalConfig({...localConfig, siteName: e.target.value})} />
          <div className="mt-4"><label className="block text-sm font-medium mb-1">Logo</label><input type="file" onChange={e => e.target.files?.[0] && upload(e.target.files[0], 'logo')} /></div>
        </div>
        
        {/* Footer Config */}
        <div className="bg-white p-8 rounded shadow-sm border-l-4 border-blue-500">
          <h3 className="font-bold text-lg mb-4 flex items-center text-blue-800"><Footprints className="mr-2" size={20}/> Footer Configuration</h3>
          <div className="space-y-6">
            <Input label="Footer Shop Section Title" value={localConfig.footerShopTitle || 'SHOP'} onChange={e => setLocalConfig({...localConfig, footerShopTitle: e.target.value})} />
            <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded">
                <p className="col-span-2 text-xs font-bold text-gray-500 uppercase">Footer Links (Title & URL)</p>
                <Input label="Link 1 Text" value={localConfig.footerLink1Label || ''} onChange={e => setLocalConfig({...localConfig, footerLink1Label: e.target.value})} />
                <Input label="Link 1 URL" value={localConfig.footerLink1Url || ''} onChange={e => setLocalConfig({...localConfig, footerLink1Url: e.target.value})} />
                <Input label="Link 2 Text" value={localConfig.footerLink2Label || ''} onChange={e => setLocalConfig({...localConfig, footerLink2Label: e.target.value})} />
                <Input label="Link 2 URL" value={localConfig.footerLink2Url || ''} onChange={e => setLocalConfig({...localConfig, footerLink2Url: e.target.value})} />
                <Input label="Link 3 Text" value={localConfig.footerLink3Label || ''} onChange={e => setLocalConfig({...localConfig, footerLink3Label: e.target.value})} />
                <Input label="Link 3 URL" value={localConfig.footerLink3Url || ''} onChange={e => setLocalConfig({...localConfig, footerLink3Url: e.target.value})} />
                <Input label="Link 4 Text" value={localConfig.footerLink4Label || ''} onChange={e => setLocalConfig({...localConfig, footerLink4Label: e.target.value})} />
                <Input label="Link 4 URL" value={localConfig.footerLink4Url || ''} onChange={e => setLocalConfig({...localConfig, footerLink4Url: e.target.value})} />
            </div>
            <div className="pt-4 border-t">
                <h4 className="font-bold text-sm mb-2 text-gray-600 uppercase">Newsletter Section</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    <Input label="Section Title" value={localConfig.footerNewsletterTitle || ''} onChange={e => setLocalConfig({...localConfig, footerNewsletterTitle: e.target.value})} />
                    <Input label="Input Placeholder" value={localConfig.footerNewsletterPlaceholder || ''} onChange={e => setLocalConfig({...localConfig, footerNewsletterPlaceholder: e.target.value})} />
                    <Input label="Button Text" value={localConfig.footerNewsletterButtonText || ''} onChange={e => setLocalConfig({...localConfig, footerNewsletterButtonText: e.target.value})} />
                </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center"><Layout className="mr-2" size={20}/> Homepage Hero (Static Mode)</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Input label="Tagline" value={localConfig.heroTagline || ''} onChange={e => setLocalConfig({...localConfig, heroTagline: e.target.value})} />
              <Input label="Title" value={localConfig.heroTitle} onChange={e => setLocalConfig({...localConfig, heroTitle: e.target.value})} />
              <Input label="Subtitle" value={localConfig.heroSubtitle} onChange={e => setLocalConfig({...localConfig, heroSubtitle: e.target.value})} />
              <div className="border-t pt-4 mt-4 flex flex-col gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-300 px-4 py-2 rounded text-sm w-fit"><Upload size={16}/> Choose Image<input type="file" className="hidden" accept="image/*" onChange={handleHeroUpload} /></label>
                  <Input label="Video URL" placeholder="https://..." value={localConfig.heroVideo && !localConfig.heroVideo.startsWith('data:') ? localConfig.heroVideo : ''} onChange={e => setLocalConfig({...localConfig, heroVideo: e.target.value})} />
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-300 px-4 py-2 rounded text-sm w-fit"><Video size={16}/> Upload Video<input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} /></label>
              </div>
            </div>
            <div className="aspect-video bg-gray-100 rounded overflow-hidden relative border group">
               {localConfig.heroVideo ? (<video src={localConfig.heroVideo} className="w-full h-full object-cover" autoPlay muted loop playsInline />) : (<img src={localConfig.heroImage || DEFAULT_HERO_IMAGE} className="w-full h-full object-cover" />)}
            </div>
          </div>
        </div>

        {/* Titles, Promo, Trust, Content, Contact sections */}
        <div className="bg-white p-8 rounded shadow-sm"><h3 className="font-bold text-lg mb-4">Titles</h3><div className="grid md:grid-cols-2 gap-6"><Input label="Category Title" value={localConfig.categoryTitle || ''} onChange={e => setLocalConfig({...localConfig, categoryTitle: e.target.value})} /><Input label="Featured Title" value={localConfig.featuredTitle || ''} onChange={e => setLocalConfig({...localConfig, featuredTitle: e.target.value})} /></div></div>
        <div className="bg-white p-8 rounded shadow-sm"><h3 className="font-bold text-lg mb-4">Promo</h3><div className="grid md:grid-cols-2 gap-8"><div className="space-y-4"><Input label="Title" value={localConfig.promoTitle || ''} onChange={e => setLocalConfig({...localConfig, promoTitle: e.target.value})} /><textarea className="w-full border p-2" value={localConfig.promoText || ''} onChange={e => setLocalConfig({...localConfig, promoText: e.target.value})}></textarea><Input label="Button Link" value={localConfig.promoButtonLink || ''} onChange={e => setLocalConfig({...localConfig, promoButtonLink: e.target.value})} /><label className="flex items-center gap-2 cursor-pointer bg-gray-50 border px-4 py-2 text-sm w-fit"><Upload size={16}/> Image<input type="file" className="hidden" accept="image/*" onChange={handlePromoUpload} /></label></div><img src={localConfig.promoImage || DEFAULT_PROMO_IMAGE} className="w-full h-full object-cover rounded" /></div></div>
        <div className="bg-white p-8 rounded shadow-sm"><h3 className="font-bold text-lg mb-4">Content & Contact</h3><div className="space-y-4"><Input label="About Title" value={localConfig.aboutTitle || ''} onChange={e => setLocalConfig({...localConfig, aboutTitle: e.target.value})} /><textarea className="w-full border p-2 h-20" value={localConfig.aboutContent || ''} onChange={e => setLocalConfig({...localConfig, aboutContent: e.target.value})}></textarea><Input label="Email" value={localConfig.contactEmail || ''} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} /><Input label="Address" value={localConfig.contactAddress || ''} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} /></div></div>

        <div className="pt-4 border-t sticky bottom-0 bg-brand-50 p-4 shadow-inner flex justify-end"><Button onClick={handleSave} size="lg">Save All Changes</Button></div>
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
  
  useEffect(() => {
    if (config) {
      setLocalConfig({
        ...config,
        theme: {
          primaryColor: '#2C251F', secondaryColor: '#D5CDC0', backgroundColor: '#F9F8F6',
          fontFamilySans: 'Inter', fontFamilySerif: 'Cormorant Garamond', borderRadius: '0px',
          ...config.theme
        },
        homepageSections: config.homepageSections || ['hero', 'categories', 'featured', 'promo', 'trust', 'slider'],
        heroMode: config.heroMode || 'static',
        heroSlides: config.heroSlides || [],
        sliderImages: config.sliderImages || []
      });
    }
  }, [config]);

  const handleSave = () => { updateConfig(localConfig); alert('Developer settings updated!'); };
  const handleReset = () => {
    if (window.confirm("Reset all developer settings?")) {
      setLocalConfig(prev => ({ ...prev, theme: { primaryColor: '#2C251F', secondaryColor: '#D5CDC0', backgroundColor: '#F9F8F6', fontFamilySans: 'Inter', fontFamilySerif: 'Cormorant Garamond', borderRadius: '0px' }, homepageSections: ['hero', 'categories', 'featured', 'promo', 'trust', 'slider'], heroMode: 'static' }));
    }
  };

  // --- Layout Logic (Visible/Hidden) ---
  const allPossibleSections = ['hero', 'categories', 'featured', 'promo', 'trust', 'slider'];
  const visibleSections = localConfig.homepageSections || [];
  const hiddenSections = allPossibleSections.filter(s => !visibleSections.includes(s));

  const sectionNames: Record<string, string> = { hero: 'Hero Banner', categories: 'Categories Grid', featured: 'Featured Products', promo: 'Promotional Banner', trust: 'Trust Badges', slider: 'Image Gallery / Slider' };

  const toggleSection = (sectionId: string) => {
    if (visibleSections.includes(sectionId)) {
        // Hide it
        setLocalConfig(prev => ({ ...prev, homepageSections: prev.homepageSections?.filter(s => s !== sectionId) }));
    } else {
        // Show it (add to end)
        setLocalConfig(prev => ({ ...prev, homepageSections: [...(prev.homepageSections || []), sectionId] }));
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...visibleSections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newSections.length) {
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      setLocalConfig({ ...localConfig, homepageSections: newSections });
    }
  };

  // --- Slide Logic ---
  const openSlideModal = (idx?: number) => { setEditingSlideIndex(idx ?? null); setNewSlide(idx !== undefined ? { ...localConfig.heroSlides![idx] } : { title: '', subtitle: '', buttonText: 'SHOP', buttonLink: '/shop', image: '' }); setIsSlideModalOpen(true); };
  const saveSlide = () => {
    const slides = [...(localConfig.heroSlides || [])]; const data = { ...newSlide, id: newSlide.id || Date.now().toString() } as HeroSlide;
    if (editingSlideIndex !== null) slides[editingSlideIndex] = data; else slides.push(data);
    setLocalConfig({ ...localConfig, heroSlides: slides }); setIsSlideModalOpen(false);
  };
  const deleteSlide = (idx: number) => { const slides = [...(localConfig.heroSlides || [])]; slides.splice(idx, 1); setLocalConfig({ ...localConfig, heroSlides: slides }); };
  const handleSlideUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onload = () => setNewSlide(p => ({...p, image: r.result as string})); r.readAsDataURL(f); } };

  // --- Gallery Logic (Fixed) ---
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
             // Create new image object
             const newImg: SliderImage = { id: Date.now().toString(), url: reader.result as string };
             // Update local config state safely
             setLocalConfig(prev => ({
                 ...prev,
                 sliderImages: [...(prev.sliderImages || []), newImg]
             }));
        };
        reader.readAsDataURL(file);
        // Reset input value to allow re-uploading same file if needed (though mostly handles 'change')
        e.target.value = '';
    }
  };
  
  const removeGalleryImage = (id: string) => {
      setLocalConfig(p => ({ ...p, sliderImages: p.sliderImages?.filter(i => i.id !== id) }));
  };

  if (!localConfig.theme) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl pb-20">
      <div className="mb-8"><h1 className="text-2xl font-serif font-bold">Developer Settings</h1></div>
      
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Colors & Typography simplified for this view, focusing on requested features */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2"><h3 className="font-bold text-lg mb-4">Theme</h3><div className="grid md:grid-cols-3 gap-4">
            <div><label className="block text-xs font-bold mb-1">Primary Color</label><div className="flex gap-2"><input type="color" value={localConfig.theme.primaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, primaryColor: e.target.value}})} className="w-8 h-8 rounded border-0"/><Input value={localConfig.theme.primaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, primaryColor: e.target.value}})} /></div></div>
            <div><label className="block text-xs font-bold mb-1">Background</label><div className="flex gap-2"><input type="color" value={localConfig.theme.backgroundColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, backgroundColor: e.target.value}})} className="w-8 h-8 rounded border-0"/><Input value={localConfig.theme.backgroundColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, backgroundColor: e.target.value}})} /></div></div>
            <div><label className="block text-xs font-bold mb-1">Radius</label><div className="flex gap-1">{['0px', '4px', '8px', '99px'].map(r => (<button key={r} onClick={() => setLocalConfig({...localConfig, theme: {...localConfig.theme!, borderRadius: r}})} className={`border p-1 text-xs flex-1 ${localConfig.theme?.borderRadius === r ? 'bg-black text-white' : ''}`}>{r}</button>))}</div></div>
        </div></div>

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
                    </div>
                </div>
            )}
        </div>

        {/* Standalone Gallery Config */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2">
            <h3 className="font-bold text-lg mb-2 flex items-center"><Images className="mr-2" size={20}/> Standalone Image Slider / Gallery</h3>
            <p className="text-sm text-gray-500 mb-6">Add images here. This section must be enabled in the "Homepage Layout" below to appear.</p>
            
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                {localConfig.sliderImages?.map((img) => (
                    <div key={img.id} className="relative aspect-square group bg-gray-100 rounded overflow-hidden border">
                        <img src={img.url} className="w-full h-full object-cover" />
                        <button onClick={() => removeGalleryImage(img.id)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm"><X size={14}/></button>
                    </div>
                ))}
                <label className="aspect-square border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded text-gray-400 transition-colors">
                    <Plus size={24}/>
                    <span className="text-xs mt-1">Add Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleGalleryUpload} />
                </label>
            </div>
        </div>

        {/* Section Reordering & Visibility */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Layers className="mr-2" size={20}/> Homepage Layout (Drag & Hide)</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
              <div>
                  <h4 className="font-bold text-sm text-gray-500 uppercase mb-3">Visible Sections</h4>
                  <div className="space-y-2">
                    {visibleSections.map((sectionId, index) => (
                      <div key={sectionId} className="flex items-center justify-between p-3 bg-white border border-brand-200 rounded shadow-sm">
                        <div className="flex items-center gap-3">
                            <button onClick={() => toggleSection(sectionId)} className="text-brand-900 hover:text-rose-500" title="Hide Section"><Eye size={18}/></button>
                            <span className="font-medium capitalize">{sectionNames[sectionId] || sectionId}</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ArrowUp size={16}/></button>
                          <button onClick={() => moveSection(index, 'down')} disabled={index === visibleSections.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ArrowDown size={16}/></button>
                        </div>
                      </div>
                    ))}
                    {visibleSections.length === 0 && <p className="text-sm text-rose-500">No sections visible on homepage!</p>}
                  </div>
              </div>

              <div>
                  <h4 className="font-bold text-sm text-gray-500 uppercase mb-3">Hidden Sections</h4>
                  <div className="space-y-2">
                      {hiddenSections.map(sectionId => (
                          <div key={sectionId} className="flex items-center justify-between p-3 bg-gray-50 border border-dashed rounded opacity-75 hover:opacity-100 transition">
                              <span className="font-medium capitalize text-gray-500">{sectionNames[sectionId] || sectionId}</span>
                              <button onClick={() => toggleSection(sectionId)} className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm font-bold"><Plus size={16}/> Show</button>
                          </div>
                      ))}
                      {hiddenSections.length === 0 && <p className="text-sm text-gray-400 italic">All sections are visible.</p>}
                  </div>
              </div>
          </div>
        </div>

      </div>

      <div className="mt-8 pt-4 border-t flex justify-end gap-4">
         <Button onClick={handleReset} variant="outline">Reset Defaults</Button>
         <Button onClick={handleSave} size="lg">Save Configuration</Button>
      </div>

      {/* Slide Modal */}
      {isSlideModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-xl">Edit Slide</h3><button onClick={() => setIsSlideModalOpen(false)}><X size={20}/></button></div>
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
    return (<div><h1 className="text-2xl font-serif font-bold mb-8">Manage Orders</h1><div className="bg-white rounded shadow-sm overflow-hidden"><table className="w-full text-sm text-left"><thead className="bg-gray-50 text-gray-700 uppercase"><tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Action</th></tr></thead><tbody>{orders.map(order => (<tr key={order.id} className="border-b hover:bg-gray-50"><td className="px-6 py-4 font-medium">{order.id}</td><td className="px-6 py-4"><div>{order.customerName}</div><div className="text-xs text-gray-500">{order.email}</div></td><td className="px-6 py-4">{order.date}</td><td className="px-6 py-4">${order.total}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span></td><td className="px-6 py-4"><select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as any)} className="border text-xs p-1 rounded bg-white"><option>Pending</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></td></tr>))}</tbody></table></div></div>);
};
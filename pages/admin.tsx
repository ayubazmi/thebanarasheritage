

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { Product, Category, User, SiteConfig } from '../types';
import { 
  Plus, Trash, Edit, Package, ShoppingCart, DollarSign, TrendingUp, 
  Upload, Image as ImageIcon, X, Settings, List, Layout, User as UserIcon, Lock, Megaphone, Video, Hexagon, Type, ShieldCheck, Share2, Heart,
  FileText, Footprints, Palette, Code2, ArrowUp, ArrowDown, Move, RotateCcw, MonitorPlay, AlignLeft, AlignCenter, AlignRight, Type as TypeIcon
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

// --- Products Manager ---
export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  
  // Empty product state for creating new
  const initialForm = {
    id: '', name: '', description: '', price: 0, discountPrice: 0, 
    category: '', images: [''], sizes: [], colors: [], 
    newArrival: false, bestSeller: false, stock: 0
  };
  const [form, setForm] = useState<any>(initialForm);

  useEffect(() => {
    if (isEditing) setForm(isEditing);
    else setForm(initialForm);
  }, [isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
        ...form,
        // Ensure arrays are processed if coming from string inputs (simple implementation)
        sizes: Array.isArray(form.sizes) ? form.sizes : form.sizes.toString().split(',').map((s: string) => s.trim()).filter(Boolean),
        colors: Array.isArray(form.colors) ? form.colors : form.colors.toString().split(',').map((c: string) => c.trim()).filter(Boolean),
        images: Array.isArray(form.images) ? form.images : [form.images], // Simplified for demo
    };

    if (isEditing) {
      await updateProduct(productData);
      setIsEditing(null);
    } else {
      await addProduct({ ...productData, id: Date.now().toString() });
      setForm(initialForm);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this product?")) await deleteProduct(id);
  };
  
  // Image handling helper for the form
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, images: [reader.result as string] });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold">Products</h1>
        <Button onClick={() => { setIsEditing(null); setForm(initialForm); document.getElementById('product-form')?.scrollIntoView(); }}>
            <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Product List */}
        <div className="lg:col-span-2 space-y-4">
           {products.map(p => (
             <div key={p.id} className="bg-white p-4 rounded shadow-sm flex gap-4">
               <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                 <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start">
                   <h3 className="font-bold text-brand-900">{p.name}</h3>
                   <div className="flex space-x-2">
                     <button onClick={() => setIsEditing(p)} className="p-2 text-gray-500 hover:bg-gray-100 rounded"><Edit size={16} /></button>
                     <button onClick={() => handleDelete(p.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded"><Trash size={16} /></button>
                   </div>
                 </div>
                 <p className="text-sm text-gray-500 mb-2">{p.category} • ${p.price}</p>
                 <div className="flex gap-2">
                   {p.stock < 5 && <Badge color="bg-rose-100 text-rose-800">Low Stock ({p.stock})</Badge>}
                   {p.newArrival && <Badge color="bg-blue-100 text-blue-800">New</Badge>}
                 </div>
               </div>
             </div>
           ))}
        </div>

        {/* Product Form */}
        <div id="product-form" className="bg-white p-6 rounded shadow-sm h-fit">
           <h3 className="font-bold mb-4">{isEditing ? 'Edit Product' : 'New Product'}</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
             <Input label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
             <div>
               <label className="block text-sm font-medium mb-1">Category</label>
               <select className="w-full border p-2 rounded text-sm" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                 <option value="">Select Category</option>
                 {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
               </select>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <Input label="Price" type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} required />
               <Input label="Sale Price" type="number" value={form.discountPrice || ''} onChange={e => setForm({...form, discountPrice: Number(e.target.value)})} />
             </div>
             <Input label="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
             
             {/* Simple inputs for array fields for demo purposes */}
             <Input label="Sizes (comma separated)" value={Array.isArray(form.sizes) ? form.sizes.join(', ') : form.sizes} onChange={e => setForm({...form, sizes: e.target.value})} placeholder="S, M, L" />
             <Input label="Colors (comma separated)" value={Array.isArray(form.colors) ? form.colors.join(', ') : form.colors} onChange={e => setForm({...form, colors: e.target.value})} placeholder="Red, Blue" />

             <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="flex items-center gap-2">
                    {form.images[0] && <img src={form.images[0]} className="w-10 h-10 object-cover rounded border" />}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
                </div>
             </div>
             
             <div className="flex gap-4 pt-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" checked={form.newArrival} onChange={e => setForm({...form, newArrival: e.target.checked})} />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" checked={form.bestSeller} onChange={e => setForm({...form, bestSeller: e.target.checked})} />
                  <span>Best Seller</span>
                </label>
             </div>

             <div className="flex gap-2 pt-4">
                {isEditing && <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsEditing(null); setForm(initialForm); }}>Cancel</Button>}
                <Button type="submit" className="flex-1">{isEditing ? 'Update' : 'Create'}</Button>
             </div>
           </form>
        </div>
      </div>
    </div>
  );
};

// --- Orders Manager ---
export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">Orders</h1>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map(order => (
                <tr key={order.id} className="bg-white hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {order.items.map(i => (
                      <div key={`${i.id}-${i.selectedSize}-${i.selectedColor}`} className="text-xs">{i.quantity}x {i.name} ({i.selectedSize})</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-bold">${order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status} 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      className="border rounded text-xs p-1"
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
          {orders.length === 0 && <p className="text-center py-4 text-gray-500">No orders found.</p>}
        </div>
      </div>
    </div>
  );
};

// --- Categories Manager ---
export const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useStore();
  const [newCat, setNewCat] = useState({ name: '', image: '' });

  const handleAdd = async () => {
    if (!newCat.name) return;
    await addCategory({ id: Date.now().toString(), ...newCat });
    setNewCat({ name: '', image: '' });
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">Categories</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow-sm h-fit">
          <h3 className="font-bold mb-4">Add Category</h3>
          <div className="space-y-4">
            <Input label="Name" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} />
            <Input label="Image URL" value={newCat.image} onChange={e => setNewCat({...newCat, image: e.target.value})} />
            <Button onClick={handleAdd} className="w-full">Create Category</Button>
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
           <h3 className="font-bold mb-4">Existing Categories</h3>
           <ul className="space-y-2">
             {categories.map(c => (
               <li key={c.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                 <div className="flex items-center space-x-3">
                   <img src={c.image} className="w-10 h-10 object-cover rounded" alt="" />
                   <span>{c.name}</span>
                 </div>
                 <button onClick={() => deleteCategory(c.id)} className="text-rose-500 hover:text-rose-700"><Trash size={16}/></button>
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>
  );
};

// --- Users Manager ---
export const AdminUsers: React.FC = () => {
  const { users, addUser, deleteUser } = useStore();
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) return;
    await addUser({ ...newUser, permissions: [] }); // Default perms empty for now
    setNewUser({ username: '', password: '', role: 'staff' });
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">User Management</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow-sm h-fit">
           <h3 className="font-bold mb-4">Create User</h3>
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
             <Button type="submit" className="w-full">Create User</Button>
           </form>
        </div>

        <div className="bg-white p-6 rounded shadow-sm">
           <h3 className="font-bold mb-4">Users</h3>
           <div className="space-y-4">
             {users.map(u => (
               <div key={u.id} className="flex justify-between items-center p-3 border rounded">
                 <div>
                   <div className="font-bold flex items-center gap-2">
                     <UserIcon size={16}/> {u.username}
                   </div>
                   <div className="text-xs text-gray-500 uppercase">{u.role}</div>
                 </div>
                 {u.role !== 'admin' && (
                   <button onClick={() => deleteUser(u.id)} className="text-rose-500 hover:text-rose-700 p-2"><Trash size={16}/></button>
                 )}
               </div>
             ))}
           </div>
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

        {/* Note: Hero Settings removed from here to consolidate in Developer Settings as requested for easier editing */}

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
        
        // Migration: Populate heroSlides from legacy heroImages if slides are empty
        heroSlides: (config.heroSlides && config.heroSlides.length > 0)
          ? config.heroSlides
          : (config.heroImages || []).map(img => ({
              image: img,
              tagline: config.heroTagline,
              title: config.heroTitle,
              subtitle: config.heroSubtitle,
              textColor: config.heroTextColor,
              textAlign: config.heroTextAlign,
              buttonText: config.heroButtonText || 'SHOP NOW',
              buttonLink: config.heroButtonLink || '/shop'
          })),

        heroMode: config.heroMode || 'static',
        secondarySlideshows: (config.secondarySlideshows || []).map(s => ({
          ...s,
          slides: (s.slides && s.slides.length > 0) ? s.slides : (s.images || []).map(img => ({ image: img, title: '', subtitle: '', textColor: '' }))
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
        heroSlides: [],
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

  // --- Static Hero Handlers ---
  const handleHeroStaticUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalConfig(prev => ({ ...prev, heroImage: reader.result as string, heroVideo: undefined })); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // --- Hero Slideshow Handlers ---
  const handleAddHeroSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalConfig(prev => ({ 
           ...prev, 
           heroSlides: [...(prev.heroSlides || []), {
              image: reader.result as string,
              tagline: '',
              title: '',
              subtitle: '',
              textColor: '#FFFFFF',
              textAlign: 'center',
              buttonText: 'SHOP NOW',
              buttonLink: '/shop'
           }] 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeHeroSlide = (index: number) => {
    setLocalConfig(prev => ({
       ...prev,
       heroSlides: prev.heroSlides?.filter((_, i) => i !== index)
    }));
  };

  const updateHeroSlide = (idx: number, field: string, value: any) => {
    setLocalConfig(prev => ({
       ...prev,
       heroSlides: prev.heroSlides?.map((slide, i) => i === idx ? { ...slide, [field]: value } : slide)
    }));
  };

  // --- Secondary Slideshow Handlers ---
  const addSecondarySlideshow = () => {
     const newId = `slideshow_${Date.now()}`;
     const newSlideshow = { 
       id: newId, 
       title: `New Slideshow`, 
       slides: [],
       images: [],
       textColor: '#2C251F', 
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
                slides: [...s.slides, { image: reader.result as string, title: '', subtitle: '', textColor: '' }] 
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

  const updateSlideField = (id: string, idx: number, field: 'title' | 'subtitle' | 'textColor', value: string) => {
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
       {fontSize && (
           <div className="flex border rounded overflow-hidden text-xs font-bold">
             <button onClick={() => onChangeSize('sm')} className={`px-3 py-2 hover:bg-gray-100 ${fontSize === 'sm' ? 'bg-gray-200' : 'bg-white'}`}>S</button>
             <button onClick={() => onChangeSize('md')} className={`px-3 py-2 hover:bg-gray-100 ${fontSize === 'md' ? 'bg-gray-200' : 'bg-white'}`}>M</button>
             <button onClick={() => onChangeSize('lg')} className={`px-3 py-2 hover:bg-gray-100 ${fontSize === 'lg' ? 'bg-gray-200' : 'bg-white'}`}>L</button>
           </div>
       )}
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
                <input type="color" value={localConfig.theme.primaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, primaryColor: e.target.value}})} className="w-10 h-10 rounded cursor-pointer border-0" />
                <Input value={localConfig.theme.primaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, primaryColor: e.target.value}})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Secondary / Accent Color</label>
              <div className="flex gap-2">
                <input type="color" value={localConfig.theme.secondaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, secondaryColor: e.target.value}})} className="w-10 h-10 rounded cursor-pointer border-0" />
                <Input value={localConfig.theme.secondaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, secondaryColor: e.target.value}})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Page Background Color</label>
              <div className="flex gap-2">
                <input type="color" value={localConfig.theme.backgroundColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, backgroundColor: e.target.value}})} className="w-10 h-10 rounded cursor-pointer border-0" />
                <Input value={localConfig.theme.backgroundColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, backgroundColor: e.target.value}})} />
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Style */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center"><TypeIcon className="mr-2" size={20}/> Typography & Style</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Heading Font (Serif)</label>
              <select className="w-full border p-2 rounded" value={localConfig.theme.fontFamilySerif} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, fontFamilySerif: e.target.value}})}>
                {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Body Font (Sans)</label>
              <select className="w-full border p-2 rounded" value={localConfig.theme.fontFamilySans} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, fontFamilySans: e.target.value}})}>
                {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Border Radius Style</label>
              <div className="grid grid-cols-4 gap-2">
                {['0px', '4px', '8px', '99px'].map(r => (
                  <button key={r} type="button" onClick={() => setLocalConfig({...localConfig, theme: {...localConfig.theme!, borderRadius: r}})} className={`border p-2 text-center text-xs ${localConfig.theme?.borderRadius === r ? 'bg-gray-900 text-white' : 'bg-white hover:bg-gray-50'}`} style={{ borderRadius: r }}>{r === '0px' ? 'Square' : r === '99px' ? 'Round' : r}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Hero Configuration */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-purple-500">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center"><ImageIcon className="mr-2" size={20}/> Hero Section Configuration</h3>
           </div>
           
           {/* Mode Selection */}
           <div className="flex flex-col md:flex-row gap-4 mb-8">
              <label className={`flex-1 p-4 border rounded cursor-pointer transition-all ${localConfig.heroMode === 'static' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                      <input type="radio" name="heroMode" value="static" checked={localConfig.heroMode === 'static' || !localConfig.heroMode} onChange={() => setLocalConfig({...localConfig, heroMode: 'static'})} className="accent-purple-600" />
                      <span className="font-bold text-brand-900">Static Image / Video</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">Single background with centralized text overlay.</p>
              </label>

              <label className={`flex-1 p-4 border rounded cursor-pointer transition-all ${localConfig.heroMode === 'slideshow' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                      <input type="radio" name="heroMode" value="slideshow" checked={localConfig.heroMode === 'slideshow'} onChange={() => setLocalConfig({...localConfig, heroMode: 'slideshow'})} className="accent-purple-600" />
                      <span className="font-bold text-brand-900">Slideshow Carousel</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">Multiple slides, each with customizable text and links.</p>
              </label>
           </div>
           
           {/* Static Config */}
           {localConfig.heroMode === 'static' && (
             <div className="animate-fade-in-up space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h4 className="font-bold text-sm text-gray-700 uppercase mb-2">Text Overlay</h4>
                      <Input label="Tagline (Top)" value={localConfig.heroTagline || ''} onChange={e => setLocalConfig({...localConfig, heroTagline: e.target.value})} placeholder="e.g. New Collection" />
                      <Input label="Main Title" value={localConfig.heroTitle} onChange={e => setLocalConfig({...localConfig, heroTitle: e.target.value})} />
                      <Input label="Subtitle" value={localConfig.heroSubtitle} onChange={e => setLocalConfig({...localConfig, heroSubtitle: e.target.value})} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Button Text" value={localConfig.heroButtonText || 'SHOP NOW'} onChange={e => setLocalConfig({...localConfig, heroButtonText: e.target.value})} />
                        <Input label="Button Link" value={localConfig.heroButtonLink || '/shop'} onChange={e => setLocalConfig({...localConfig, heroButtonLink: e.target.value})} />
                      </div>
                      
                      <div className="pt-2">
                        <label className="block text-sm font-medium mb-2">Text Styling</label>
                        <TextStylingControls 
                            textColor={localConfig.heroTextColor}
                            textAlign={localConfig.heroTextAlign}
                            fontSize={localConfig.heroFontSize}
                            onChangeColor={(v: string) => setLocalConfig({...localConfig, heroTextColor: v})}
                            onChangeAlign={(v: any) => setLocalConfig({...localConfig, heroTextAlign: v})}
                            onChangeSize={(v: any) => setLocalConfig({...localConfig, heroFontSize: v})}
                        />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="font-bold text-sm text-gray-700 uppercase mb-2">Background Media</h4>
                      <div className="aspect-video bg-gray-100 rounded overflow-hidden relative border group">
                        {localConfig.heroVideo ? (
                            <video src={localConfig.heroVideo} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                        ) : (
                            <img src={localConfig.heroImage || DEFAULT_HERO_IMAGE} className="w-full h-full object-cover" alt="Hero Preview" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50">
                            <Upload size={16}/> Upload Image
                            <input type="file" className="hidden" accept="image/*" onChange={handleHeroStaticUpload} />
                        </label>
                        <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50">
                            <Video size={16}/> Upload Video
                            <input type="file" className="hidden" accept="video/*" onChange={handleHeroVideoUpload} />
                        </label>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* Slideshow Config */}
           {localConfig.heroMode === 'slideshow' && (
            <div className="animate-fade-in-up space-y-6">
              <div className="space-y-6">
                 {localConfig.heroSlides?.map((slide, idx) => (
                    <div key={idx} className="border p-4 rounded bg-gray-50 flex flex-col md:flex-row gap-6 relative group">
                       <button onClick={() => removeHeroSlide(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-rose-500"><Trash size={18}/></button>
                       
                       <div className="w-full md:w-1/3 aspect-video bg-gray-200 rounded overflow-hidden">
                          <img src={slide.image} className="w-full h-full object-cover" alt="" />
                       </div>
                       
                       <div className="flex-1 space-y-3">
                          <h4 className="font-bold text-xs uppercase text-gray-400">Slide #{idx + 1} Settings</h4>
                          <div className="grid grid-cols-2 gap-4">
                             <Input placeholder="Tagline" value={slide.tagline || ''} onChange={e => updateHeroSlide(idx, 'tagline', e.target.value)} />
                             <Input placeholder="Main Title" value={slide.title || ''} onChange={e => updateHeroSlide(idx, 'title', e.target.value)} />
                             <Input placeholder="Subtitle" value={slide.subtitle || ''} onChange={e => updateHeroSlide(idx, 'subtitle', e.target.value)} className="col-span-2" />
                             <Input placeholder="Btn Text" value={slide.buttonText || ''} onChange={e => updateHeroSlide(idx, 'buttonText', e.target.value)} />
                             <Input placeholder="Btn Link" value={slide.buttonLink || ''} onChange={e => updateHeroSlide(idx, 'buttonLink', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Slide Styling</label>
                            <TextStylingControls 
                                textColor={slide.textColor}
                                textAlign={slide.textAlign}
                                onChangeColor={(v: string) => updateHeroSlide(idx, 'textColor', v)}
                                onChangeAlign={(v: any) => updateHeroSlide(idx, 'textAlign', v)}
                                onChangeSize={() => {}} // Font size handled globally for consistency or ignored per slide
                            />
                          </div>
                       </div>
                    </div>
                 ))}

                <label className="border-2 border-dashed border-gray-300 rounded p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-brand-900 transition-colors">
                   <Plus className="text-gray-400 mb-2" size={32}/>
                   <span className="text-lg text-gray-500 font-medium">Add New Slide</span>
                   <input type="file" className="hidden" accept="image/*" onChange={handleAddHeroSlide} />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Additional Slideshows */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-indigo-500">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center"><MonitorPlay className="mr-2" size={20}/> Additional Slideshow Sections</h3>
              <Button onClick={addSecondarySlideshow} size="sm"><Plus size={16} className="mr-1"/> Add New Slideshow</Button>
          </div>
          
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
                        <label className="block text-sm font-medium mb-1">Section Default Style</label>
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
                      <div key={slideIdx} className="relative group bg-white rounded border overflow-hidden p-3 flex gap-4 items-start shadow-sm">
                        <div className="w-24 aspect-square bg-gray-200 rounded overflow-hidden relative flex-shrink-0">
                           <img src={slide.image} className="w-full h-full object-cover" alt="" />
                           <button 
                              onClick={() => removeSlideFromSlideshow(slideshow.id, slideIdx)}
                              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash size={20} />
                            </button>
                        </div>
                        <div className="flex-1 space-y-2">
                           <div className="flex justify-between items-center">
                              <p className="text-xs font-bold text-gray-500 uppercase">Slide #{slideIdx + 1}</p>
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-gray-400">Text Color:</label>
                                <input 
                                  type="color" 
                                  value={slide.textColor || slideshow.textColor || '#000000'} 
                                  onChange={(e) => updateSlideField(slideshow.id, slideIdx, 'textColor', e.target.value)}
                                  className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                                  title="Slide Text Color Override"
                                />
                              </div>
                           </div>
                           <Input 
                             placeholder="Title Overlay" 
                             value={slide.title || ''} 
                             onChange={(e) => updateSlideField(slideshow.id, slideIdx, 'title', e.target.value)} 
                           />
                           <Input 
                             placeholder="Subtitle Overlay" 
                             value={slide.subtitle || ''} 
                             onChange={(e) => updateSlideField(slideshow.id, slideIdx, 'subtitle', e.target.value)} 
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
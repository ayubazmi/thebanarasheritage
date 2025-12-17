import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, List, Settings, Users, FileText, 
  Code2, LogOut, Plus, Trash2, Edit2, Save, X, Check, Upload, 
  Type as TypeIcon, Megaphone, Image as ImageIcon, Layout, ArrowLeft,
  Palette, Footprints, MonitorPlay, Move, ArrowUp, ArrowDown, Share2, Hexagon, ShieldCheck, Video,
  AlignLeft, AlignCenter, AlignRight, RotateCcw
} from 'lucide-react';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { Product, Category, Order, User, SiteConfig, SlideshowSection } from '../types';

const DEFAULT_PROMO_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';

// --- Login ---
export const AdminLogin: React.FC = () => {
  const { login, user } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) navigate('/admin');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button className="w-full">Login</Button>
        </form>
      </div>
    </div>
  );
};

// --- Dashboard ---
export const AdminDashboard: React.FC = () => {
  const { products, orders, users } = useStore();
  
  const stats = [
    { label: 'Total Sales', value: `$${orders.reduce((sum, o) => sum + o.total, 0)}`, icon: ShoppingCart, color: 'bg-green-100 text-green-600' },
    { label: 'Orders', value: orders.length, icon: Package, color: 'bg-blue-100 text-blue-600' },
    { label: 'Products', value: products.length, icon: Layout, color: 'bg-purple-100 text-purple-600' },
    { label: 'Users', value: users.length, icon: Users, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div>
      <SectionHeader title="Dashboard" subtitle="Overview of your store performance" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded shadow-sm flex items-center">
            <div className={`p-4 rounded-full mr-4 ${s.color}`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              <h3 className="text-2xl font-bold">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded shadow-sm">
        <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
        {orders.length === 0 ? <p className="text-gray-500">No orders yet.</p> : (
           <table className="w-full text-left">
             <thead>
               <tr className="border-b text-sm text-gray-500">
                 <th className="py-2">Order ID</th>
                 <th className="py-2">Customer</th>
                 <th className="py-2">Date</th>
                 <th className="py-2">Total</th>
                 <th className="py-2">Status</th>
               </tr>
             </thead>
             <tbody>
               {orders.slice(0, 5).map(order => (
                 <tr key={order.id} className="border-b last:border-0">
                   <td className="py-3 text-sm font-mono">{order.id.substring(0, 8)}...</td>
                   <td className="py-3">{order.customerName}</td>
                   <td className="py-3">{order.date}</td>
                   <td className="py-3 font-medium">${order.total}</td>
                   <td className="py-3"><Badge>{order.status}</Badge></td>
                 </tr>
               ))}
             </tbody>
           </table>
        )}
      </div>
    </div>
  );
};

// --- Products ---
export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const initialProduct: Product = {
    id: '', name: '', description: '', price: 0, category: '', 
    images: [''], sizes: [], colors: [], newArrival: false, bestSeller: false, stock: 0
  };
  const [formData, setFormData] = useState<Product>(initialProduct);

  const handleEdit = (p: Product) => {
    setFormData(p);
    setEditing(p);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure?')) await deleteProduct(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanData = {
        ...formData,
        images: formData.images.filter(i => i.trim() !== ''),
        sizes: formData.sizes.filter(s => s.trim() !== ''),
        colors: formData.colors.filter(c => c.trim() !== '')
    };
    
    if (editing) {
      await updateProduct(cleanData);
    } else {
      await addProduct(cleanData);
    }
    setIsFormOpen(false);
    setFormData(initialProduct);
    setEditing(null);
  };

  const updateArray = (field: 'images' | 'sizes' | 'colors', index: number, value: string) => {
      const arr = [...formData[field]];
      arr[index] = value;
      setFormData({ ...formData, [field]: arr });
  };
  
  const addArrayItem = (field: 'images' | 'sizes' | 'colors') => {
      setFormData({ ...formData, [field]: [...formData[field], ''] });
  };
  
  const removeArrayItem = (field: 'images' | 'sizes' | 'colors', index: number) => {
      setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  if (isFormOpen) {
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setIsFormOpen(false)} className="mb-4 flex items-center text-sm text-gray-500 hover:text-black"><ArrowLeft size={16} className="mr-1"/> Back</button>
        <div className="bg-white p-8 rounded shadow-sm">
          <h2 className="text-2xl font-bold mb-6">{editing ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
               <Input label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
               <div className="flex flex-col">
                 <label className="text-sm font-medium mb-1">Category</label>
                 <select 
                    className="border border-gray-200 p-2 rounded text-sm"
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    required
                 >
                   <option value="">Select Category</option>
                   {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                 </select>
               </div>
               <Input label="Price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
               <Input label="Discount Price (Optional)" type="number" value={formData.discountPrice || ''} onChange={e => setFormData({...formData, discountPrice: Number(e.target.value)})} />
               <Input label="Stock" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} required />
            </div>
            
            <div>
               <label className="text-sm font-medium mb-1">Description</label>
               <textarea className="w-full border border-gray-200 p-2 text-sm rounded h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="flex space-x-6">
               <label className="flex items-center space-x-2">
                 <input type="checkbox" checked={formData.newArrival} onChange={e => setFormData({...formData, newArrival: e.target.checked})} />
                 <span className="text-sm font-medium">New Arrival</span>
               </label>
               <label className="flex items-center space-x-2">
                 <input type="checkbox" checked={formData.bestSeller} onChange={e => setFormData({...formData, bestSeller: e.target.checked})} />
                 <span className="text-sm font-medium">Best Seller</span>
               </label>
            </div>

            {['images', 'sizes', 'colors'].map(field => (
                <div key={field}>
                    <label className="text-sm font-medium mb-2 block capitalize">{field}</label>
                    {(formData[field as keyof Product] as string[]).map((item, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                            <Input value={item} onChange={e => updateArray(field as any, idx, e.target.value)} placeholder={field === 'images' ? 'Image URL' : field === 'sizes' ? 'e.g., S, M, L' : 'e.g., Red, Blue'} />
                            <button type="button" onClick={() => removeArrayItem(field as any, idx)} className="text-rose-500"><Trash2 size={16}/></button>
                        </div>
                    ))}
                    <Button type="button" size="sm" variant="secondary" onClick={() => addArrayItem(field as any)}><Plus size={14} className="mr-1"/> Add {field}</Button>
                </div>
            ))}

            <div className="flex justify-end gap-3 border-t pt-6">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit">Save Product</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <SectionHeader title="Products" />
        <Button onClick={() => { setEditing(null); setFormData(initialProduct); setIsFormOpen(true); }}><Plus size={20} className="mr-2"/> Add Product</Button>
      </div>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">Image</th>
              <th className="p-4 font-medium text-gray-500">Name</th>
              <th className="p-4 font-medium text-gray-500">Category</th>
              <th className="p-4 font-medium text-gray-500">Price</th>
              <th className="p-4 font-medium text-gray-500">Stock</th>
              <th className="p-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4"><img src={p.images[0]} className="w-10 h-10 object-cover rounded" alt="" /></td>
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-sm">{p.category}</td>
                <td className="p-4 text-sm">${p.price}</td>
                <td className="p-4 text-sm">{p.stock}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Orders ---
export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  
  return (
    <div>
      <SectionHeader title="Orders" />
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">ID</th>
              <th className="p-4 font-medium text-gray-500">Customer</th>
              <th className="p-4 font-medium text-gray-500">Items</th>
              <th className="p-4 font-medium text-gray-500">Total</th>
              <th className="p-4 font-medium text-gray-500">Date</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
               <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs">{o.id.substring(0,8)}</td>
                  <td className="p-4">
                    <div className="font-medium">{o.customerName}</div>
                    <div className="text-xs text-gray-500">{o.email}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{o.items.length} items</td>
                  <td className="p-4 font-medium">${o.total}</td>
                  <td className="p-4 text-sm text-gray-500">{o.date}</td>
                  <td className="p-4">
                    <select 
                      value={o.status} 
                      onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                      className="text-xs border border-gray-200 rounded p-1 bg-white"
                    >
                      {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
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

// --- Categories ---
export const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useStore();
  const [newCat, setNewCat] = useState({ name: '', image: '' });

  const handleAdd = async (e: React.FormEvent) => {
      e.preventDefault();
      await addCategory({ id: '', ...newCat });
      setNewCat({ name: '', image: '' });
  };

  return (
    <div>
      <SectionHeader title="Categories" />
      <div className="grid md:grid-cols-3 gap-8">
         <div className="bg-white p-6 rounded shadow-sm h-fit">
            <h3 className="font-bold mb-4">Add Category</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input label="Name" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} required />
              <Input label="Image URL" value={newCat.image} onChange={e => setNewCat({...newCat, image: e.target.value})} required />
              <Button className="w-full">Create</Button>
            </form>
         </div>
         <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map(c => (
              <div key={c.id} className="relative group overflow-hidden rounded shadow-sm aspect-video">
                 <img src={c.image} className="w-full h-full object-cover" alt={c.name} />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white font-bold text-xl">{c.name}</h3>
                 </div>
                 <button onClick={() => deleteCategory(c.id)} className="absolute top-2 right-2 bg-white text-rose-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition">
                   <Trash2 size={16} />
                 </button>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

// --- Users ---
export const AdminUsers: React.FC = () => {
    const { users, addUser, deleteUser } = useStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        await addUser({ ...newUser, permissions: [] });
        setIsFormOpen(false);
        setNewUser({ username: '', password: '', role: 'staff' });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <SectionHeader title="User Management" />
                <Button onClick={() => setIsFormOpen(true)}><Plus size={20} className="mr-2"/> Add User</Button>
            </div>
            
            {isFormOpen && (
                <div className="bg-white p-6 rounded shadow-sm mb-8 max-w-xl animate-fade-in-up">
                    <h3 className="font-bold mb-4">New User</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <Input label="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} required />
                        <Input label="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                        <div>
                            <label className="text-sm font-medium mb-1 block">Role</label>
                            <select className="w-full border p-2 rounded" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                             <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                             <Button type="submit">Create User</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-gray-500">Username</th>
                            <th className="p-4 text-gray-500">Role</th>
                            <th className="p-4 text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-b last:border-0">
                                <td className="p-4 font-medium">{u.username}</td>
                                <td className="p-4"><Badge color={u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>{u.role}</Badge></td>
                                <td className="p-4">
                                    {u.role !== 'admin' && (
                                        <button onClick={() => deleteUser(u.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded"><Trash2 size={16}/></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Logs ---
export const AdminLogs: React.FC = () => {
    const { logs, fetchLogs } = useStore();
    useEffect(() => { fetchLogs(); }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
               <SectionHeader title="Access Logs" />
               <Button variant="outline" onClick={() => fetchLogs()} size="sm">Refresh</Button>
            </div>
            <div className="bg-white rounded shadow-sm overflow-hidden border border-gray-200">
                <div className="max-h-[80vh] overflow-y-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="p-3 font-medium text-gray-600">Time</th>
                                <th className="p-3 font-medium text-gray-600">IP Address</th>
                                <th className="p-3 font-medium text-gray-600">Hostname</th>
                                <th className="p-3 font-medium text-gray-600">User Agent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="p-3 whitespace-nowrap text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="p-3 font-mono text-xs">{log.ip}</td>
                                    <td className="p-3 text-gray-600">{log.hostname || '-'}</td>
                                    <td className="p-3 text-gray-500 truncate max-w-xs" title={log.userAgent}>{log.userAgent}</td>
                                </tr>
                            ))}
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
    const [local, setLocal] = useState<SiteConfig>({} as SiteConfig);

    useEffect(() => { if(config) setLocal(config); }, [config]);

    const handleSave = async () => {
        await updateConfig(local);
        alert("Settings Saved!");
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocal(prev => ({ ...prev, logo: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    };

    const handlePromoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocal(prev => ({ ...prev, promoImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    };

    if (!local.siteName) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <SectionHeader title="Content & Settings" />
                <Button onClick={handleSave}><Save size={18} className="mr-2"/> Save Changes</Button>
            </div>

            <div className="space-y-8">
                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center"><Hexagon className="mr-2" size={20}/> Brand Identity</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input label="Site Name" value={local.siteName} onChange={e => setLocal({...local, siteName: e.target.value})} />
                        <Input label="Currency Symbol" value={local.currency} onChange={e => setLocal({...local, currency: e.target.value})} />
                        <div className="md:col-span-2">
                           <label className="block text-sm font-medium mb-1">Logo</label>
                           <div className="flex items-center gap-4">
                              {local.logo && <img src={local.logo} className="h-12 w-auto object-contain bg-gray-100 p-1 rounded" alt="Logo" />}
                              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm font-medium transition">
                                 Upload Logo
                                 <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                              </label>
                           </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow-sm border-l-4 border-brand-900">
                  <h3 className="font-bold text-lg mb-4 flex items-center"><Megaphone className="mr-2" size={20}/> Sale Banner</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Input label="Banner Title" value={local.promoTitle || ''} onChange={e => setLocal({...local, promoTitle: e.target.value})} className="mb-4" />
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea className="w-full border p-2 text-sm h-24 mb-4" value={local.promoText || ''} onChange={e => setLocal({...local, promoText: e.target.value})}></textarea>
                      <div className="grid grid-cols-2 gap-4">
                         <Input label="Button Label" value={local.promoButtonText || ''} onChange={e => setLocal({...local, promoButtonText: e.target.value})} />
                         <Input label="Button Link" value={local.promoButtonLink || ''} onChange={e => setLocal({...local, promoButtonLink: e.target.value})} />
                      </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Banner Image</label>
                        <div className="aspect-video bg-gray-100 rounded overflow-hidden relative border group">
                           <img src={local.promoImage || DEFAULT_PROMO_IMAGE} className="w-full h-full object-cover" alt="Preview" />
                           <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white cursor-pointer font-bold">
                              Change Image
                              <input type="file" className="hidden" accept="image/*" onChange={handlePromoUpload} />
                           </label>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center"><ShieldCheck className="mr-2" size={20}/> Trust Badges</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase text-gray-500">Badge 1</p>
                        <Input value={local.trustBadge1Title} placeholder="Title" onChange={e => setLocal({...local, trustBadge1Title: e.target.value})} />
                        <Input value={local.trustBadge1Text} placeholder="Text" onChange={e => setLocal({...local, trustBadge1Text: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase text-gray-500">Badge 2</p>
                        <Input value={local.trustBadge2Title} placeholder="Title" onChange={e => setLocal({...local, trustBadge2Title: e.target.value})} />
                        <Input value={local.trustBadge2Text} placeholder="Text" onChange={e => setLocal({...local, trustBadge2Text: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase text-gray-500">Badge 3</p>
                        <Input value={local.trustBadge3Title} placeholder="Title" onChange={e => setLocal({...local, trustBadge3Title: e.target.value})} />
                        <Input value={local.trustBadge3Text} placeholder="Text" onChange={e => setLocal({...local, trustBadge3Text: e.target.value})} />
                      </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Contact & Socials</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input label="Email" value={local.contactEmail} onChange={e => setLocal({...local, contactEmail: e.target.value})} />
                        <Input label="Phone" value={local.contactPhone} onChange={e => setLocal({...local, contactPhone: e.target.value})} />
                        <Input label="Address" value={local.contactAddress} onChange={e => setLocal({...local, contactAddress: e.target.value})} className="md:col-span-2" />
                        
                        <div className="md:col-span-2 pt-4 border-t mt-2">
                           <h4 className="font-medium mb-3 flex items-center gap-2"><Share2 size={16}/> Social Media Links</h4>
                           <div className="grid md:grid-cols-3 gap-4">
                              <Input placeholder="Instagram URL" value={local.socialInstagram || ''} onChange={e => setLocal({...local, socialInstagram: e.target.value})} />
                              <Input placeholder="Facebook URL" value={local.socialFacebook || ''} onChange={e => setLocal({...local, socialFacebook: e.target.value})} />
                              <Input placeholder="WhatsApp URL" value={local.socialWhatsapp || ''} onChange={e => setLocal({...local, socialWhatsapp: e.target.value})} />
                           </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-4">About Page Content</h3>
                    <Input label="Title" value={local.aboutTitle} onChange={e => setLocal({...local, aboutTitle: e.target.value})} className="mb-4" />
                    <label className="text-sm font-medium mb-1 block">Content</label>
                    <textarea className="w-full border p-3 rounded h-40" value={local.aboutContent} onChange={e => setLocal({...local, aboutContent: e.target.value})} />
                </div>
            </div>
        </div>
    );
};

// --- Developer Settings ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config || {} as SiteConfig);
  
  // Sync state when config loads
  useEffect(() => {
    if (config && Object.keys(config).length > 0) {
        setLocalConfig({
            ...JSON.parse(JSON.stringify(config)),
            // Migration for existing images to slides if needed
            secondarySlideshows: (config.secondarySlideshows || []).map(s => ({
              ...s,
              slides: (s.slides && s.slides.length > 0) 
                ? s.slides 
                : (s.images || []).map(img => ({ image: img, title: '', subtitle: '', textColor: '' }))
            }))
        });
    }
  }, [config]);

  const handleSave = async () => {
    try {
        await updateConfig(localConfig);
        alert("Configuration saved successfully!");
    } catch (e) {
        alert("Failed to save configuration.");
    }
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
        heroMode: 'static',
        heroTextColor: '#FFFFFF',
        heroTextAlign: 'center',
        heroFontSize: 'md',
        secondarySlideshows: []
      }));
    }
  };

  const fonts = [
    { name: 'Inter (Sans)', value: 'Inter' },
    { name: 'Roboto (Sans)', value: 'Roboto' },
    { name: 'Open Sans (Sans)', value: 'Open Sans' },
    { name: 'Lato (Sans)', value: 'Lato' },
    { name: 'Montserrat (Sans)', value: 'Montserrat' },
    { name: 'Playfair Display (Serif)', value: 'Playfair Display' },
    { name: 'Cormorant Garamond (Serif)', value: 'Cormorant Garamond' },
    { name: 'Merriweather (Serif)', value: 'Merriweather' },
  ];

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
     return id; 
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...(localConfig.homepageSections || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newSections.length) {
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      setLocalConfig({ ...localConfig, homepageSections: newSections });
    }
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
                slides: [...(s.slides || []), { image: reader.result as string, title: '', subtitle: '', textColor: '' }] 
            } : s)
         }));
      };
      reader.readAsDataURL(file);
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

  if (!localConfig.theme) return <div className="p-8">Loading configuration...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-brand-50 z-10 py-4">
        <div>
           <h1 className="text-3xl font-serif text-brand-900">Developer Settings</h1>
           <p className="text-gray-500">Customize theme, layout, and components.</p>
        </div>
        <div className="flex gap-3">
            <Button onClick={handleReset} variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700">
               <RotateCcw size={16} className="mr-2" /> Reset
            </Button>
            <Button onClick={handleSave} size="lg"><Save size={18} className="mr-2"/> Save Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Color Palette */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Palette className="mr-2" size={20}/> Color Palette</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Primary (Brand 900)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={localConfig.theme.primaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, primaryColor: e.target.value}})} className="h-10 w-10 border-0 p-0 rounded cursor-pointer" />
                <Input value={localConfig.theme.primaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, primaryColor: e.target.value}})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Secondary (Accent)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={localConfig.theme.secondaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, secondaryColor: e.target.value}})} className="h-10 w-10 border-0 p-0 rounded cursor-pointer" />
                <Input value={localConfig.theme.secondaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, secondaryColor: e.target.value}})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Background (Page)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={localConfig.theme.backgroundColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, backgroundColor: e.target.value}})} className="h-10 w-10 border-0 p-0 rounded cursor-pointer" />
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
                  <button key={r} type="button" onClick={() => setLocalConfig({...localConfig, theme: {...localConfig.theme!, borderRadius: r}})} className={`border p-2 text-center text-xs ${localConfig.theme?.borderRadius === r ? 'bg-brand-900 text-white' : 'bg-white hover:bg-gray-50'}`} style={{ borderRadius: r }}>{r === '0px' ? 'Square' : r === '99px' ? 'Round' : r}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Bar Settings */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-blue-500">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg flex items-center"><Megaphone className="mr-2" size={20}/> Top Announcement Bar</h3>
             <label className="flex items-center cursor-pointer">
                <span className="mr-3 text-sm font-medium text-gray-700">{localConfig.announcementEnabled ? 'Enabled' : 'Disabled'}</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={localConfig.announcementEnabled || false} onChange={e => setLocalConfig({...localConfig, announcementEnabled: e.target.checked})} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${localConfig.announcementEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${localConfig.announcementEnabled ? 'translate-x-4' : ''}`}></div>
                </div>
             </label>
          </div>

          {localConfig.announcementEnabled && (
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
               <div className="space-y-4">
                  <Input label="Announcement Text" value={localConfig.announcementText || ''} onChange={e => setLocalConfig({...localConfig, announcementText: e.target.value})} placeholder="Free Shipping on orders over $100!" />
                  <Input label="Link URL (Optional)" value={localConfig.announcementLink || ''} onChange={e => setLocalConfig({...localConfig, announcementLink: e.target.value})} placeholder="/shop" />
                  
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" checked={localConfig.announcementBlink || false} onChange={e => setLocalConfig({...localConfig, announcementBlink: e.target.checked})} id="blink-toggle" className="rounded text-brand-900 focus:ring-brand-900" />
                    <label htmlFor="blink-toggle" className="text-sm font-medium cursor-pointer">Enable Blinking Animation</label>
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Background Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={localConfig.announcementBgColor || '#000000'} 
                        onChange={e => setLocalConfig({...localConfig, announcementBgColor: e.target.value})}
                        className="w-10 h-10 rounded cursor-pointer border-0 p-0"
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
                        className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                      />
                      <Input 
                        value={localConfig.announcementTextColor || '#FFFFFF'} 
                        onChange={e => setLocalConfig({...localConfig, announcementTextColor: e.target.value})} 
                      />
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
        
        {/* Additional Slideshows (New Feature) */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-indigo-500">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center"><MonitorPlay className="mr-2" size={20}/> Additional Slideshow Sections</h3>
              <Button onClick={addSecondarySlideshow} size="sm"><Plus size={16} className="mr-1"/> Add New Slideshow</Button>
          </div>
          <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded">
             Create standalone slideshows for specific collections or campaigns. You can add text overlays to each slide.
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

                     <button onClick={() => removeSecondarySlideshow(slideshow.id)} className="text-rose-500 hover:text-rose-700 p-2"><Trash2 size={20}/></button>
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
                              <Trash2 size={16} />
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
                       <Plus className="text-gray-400 mb-2" size={24}/>
                       <span className="text-sm text-gray-500 font-medium">Add New Slide</span>
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
    </div>
  );
};
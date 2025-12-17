import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, List, Settings, Users, FileText, 
  Code2, LogOut, Plus, Trash2, Edit2, Save, X, Check, Upload, 
  Type as TypeIcon, Megaphone, Image as ImageIcon, Layout, ArrowLeft
} from 'lucide-react';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { Product, Category, Order, User, SiteConfig, SlideshowSection } from '../types';

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
    // Filter empty strings from arrays
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

            {/* Checkboxes */}
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

            {/* Array Fields */}
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

    if (!local.siteName) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <SectionHeader title="Content & Settings" />
                <Button onClick={handleSave}><Save size={18} className="mr-2"/> Save Changes</Button>
            </div>

            <div className="space-y-8">
                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Brand Identity</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input label="Site Name" value={local.siteName} onChange={e => setLocal({...local, siteName: e.target.value})} />
                        <Input label="Currency Symbol" value={local.currency} onChange={e => setLocal({...local, currency: e.target.value})} />
                        <Input label="Logo URL" value={local.logo || ''} onChange={e => setLocal({...local, logo: e.target.value})} className="md:col-span-2" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input label="Email" value={local.contactEmail} onChange={e => setLocal({...local, contactEmail: e.target.value})} />
                        <Input label="Phone" value={local.contactPhone} onChange={e => setLocal({...local, contactPhone: e.target.value})} />
                        <Input label="Address" value={local.contactAddress} onChange={e => setLocal({...local, contactAddress: e.target.value})} className="md:col-span-2" />
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
        setLocalConfig(JSON.parse(JSON.stringify(config))); // Deep copy
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

  if (!localConfig.theme) return <div className="p-8">Loading configuration...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-brand-50 z-10 py-4">
        <div>
           <h1 className="text-3xl font-serif text-brand-900">Developer Settings</h1>
           <p className="text-gray-500">Customize theme, layout, and components.</p>
        </div>
        <Button onClick={handleSave} size="lg"><Save size={18} className="mr-2"/> Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Colors */}
        <div className="bg-white p-8 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Code2 className="mr-2" size={20}/> Color Palette</h3>
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
        
        {/* Hero Configuration */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2">
            <h3 className="font-bold text-lg mb-6 flex items-center"><ImageIcon className="mr-2" size={20}/> Hero Section</h3>
            
            <div className="mb-6 flex gap-6">
                <label className="flex items-center space-x-2">
                    <input type="radio" name="heroMode" checked={localConfig.heroMode === 'static'} onChange={() => setLocalConfig({...localConfig, heroMode: 'static'})} />
                    <span>Static Image/Video</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input type="radio" name="heroMode" checked={localConfig.heroMode === 'slideshow'} onChange={() => setLocalConfig({...localConfig, heroMode: 'slideshow'})} />
                    <span>Slideshow</span>
                </label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Input label="Title" value={localConfig.heroTitle} onChange={e => setLocalConfig({...localConfig, heroTitle: e.target.value})} />
                    <Input label="Subtitle" value={localConfig.heroSubtitle} onChange={e => setLocalConfig({...localConfig, heroSubtitle: e.target.value})} />
                    <Input label="Tagline" value={localConfig.heroTagline} onChange={e => setLocalConfig({...localConfig, heroTagline: e.target.value})} />
                </div>
                
                <div className="space-y-4">
                    {localConfig.heroMode === 'static' ? (
                        <>
                           <Input label="Hero Image URL" value={localConfig.heroImage} onChange={e => setLocalConfig({...localConfig, heroImage: e.target.value})} />
                           <Input label="Hero Video URL (Optional)" value={localConfig.heroVideo || ''} onChange={e => setLocalConfig({...localConfig, heroVideo: e.target.value})} placeholder="mp4 url" />
                        </>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium mb-2">Slideshow Images (One URL per line)</label>
                            <textarea 
                                className="w-full border p-2 rounded h-32" 
                                value={localConfig.heroImages?.join('\n') || ''} 
                                onChange={e => setLocalConfig({...localConfig, heroImages: e.target.value.split('\n')})}
                                placeholder="https://example.com/image1.jpg"
                            />
                        </div>
                    )}
                </div>

                <div className="md:col-span-2 grid md:grid-cols-3 gap-6 pt-4 border-t mt-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Text Alignment</label>
                        <select className="w-full border p-2 rounded" value={localConfig.heroTextAlign || 'center'} onChange={e => setLocalConfig({...localConfig, heroTextAlign: e.target.value as any})}>
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Font Size</label>
                        <select className="w-full border p-2 rounded" value={localConfig.heroFontSize || 'md'} onChange={e => setLocalConfig({...localConfig, heroFontSize: e.target.value as any})}>
                            <option value="sm">Small</option>
                            <option value="md">Medium</option>
                            <option value="lg">Large</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Text Color</label>
                        <div className="flex gap-2">
                            <input type="color" value={localConfig.heroTextColor || '#FFFFFF'} onChange={e => setLocalConfig({...localConfig, heroTextColor: e.target.value})} className="h-10 w-10 border-0 p-0 rounded cursor-pointer" />
                            <Input value={localConfig.heroTextColor || '#FFFFFF'} onChange={e => setLocalConfig({...localConfig, heroTextColor: e.target.value})} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

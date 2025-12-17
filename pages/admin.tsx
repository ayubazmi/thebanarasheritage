import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { 
  Plus, Trash2, Edit, Save, X, Upload, Eye, Check, RefreshCw, 
  ArrowUp, ArrowDown, Layout, Image as ImageIcon, Type, Monitor, Search, Lock, List
} from 'lucide-react';
import { Product, Category, Order, User, Page, SiteConfig, Slide, SlideshowSection, VerticalCarouselSection } from '../types';

// Helper: Convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// --- Admin Login ---
export const AdminLogin: React.FC = () => {
  const { login, user } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { if (user) navigate('/admin'); }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-serif mb-6 text-center text-brand-900">Admin Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    </div>
  );
};

// --- Admin Dashboard ---
export const AdminDashboard: React.FC = () => {
  const { orders, products, logs, users } = useStore();
  
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const recentLogs = logs.slice(0, 10);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color} text-white`}><Icon size={24} /></div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-brand-900">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <SectionHeader title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Sales" value={`$${totalSales.toLocaleString()}`} icon={Layout} color="bg-emerald-500" />
        <StatCard title="Total Orders" value={orders.length} icon={Check} color="bg-blue-500" />
        <StatCard title="Pending" value={pendingOrders} icon={RefreshCw} color="bg-amber-500" />
        <StatCard title="Products" value={products.length} icon={ImageIcon} color="bg-purple-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
           <h3 className="font-bold text-lg mb-4 text-brand-900">Recent Access Logs</h3>
           <div className="space-y-3">
             {recentLogs.map(log => (
               <div key={log.id} className="text-sm border-b border-gray-50 pb-2 last:border-0 flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="font-medium text-gray-700">{log.ip}</span>
                    <span className="text-xs text-gray-400">{log.userAgent.substring(0, 40)}...</span>
                 </div>
                 <span className="font-mono text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
               </div>
             ))}
             {recentLogs.length === 0 && <p className="text-gray-400 text-sm">No logs available.</p>}
           </div>
        </div>
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
           <h3 className="font-bold text-lg mb-4 text-brand-900">System Status</h3>
           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-sm text-gray-600">Users</span>
               <Badge>{users.length}</Badge>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-gray-600">Server Status</span>
               <Badge color="bg-green-100 text-green-800">Online</Badge>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin Products ---
export const AdminProducts: React.FC = () => {
  const { products, deleteProduct, addProduct, updateProduct, categories } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const handleEdit = (p: Product) => {
    setEditing(p);
    setFormData(p);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setFormData({
      name: '', description: '', price: 0, category: categories[0]?.name || '',
      images: [], sizes: [], colors: [], newArrival: false, bestSeller: false, stock: 0
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateProduct({ ...editing, ...formData } as Product);
    } else {
      await addProduct(formData as Product);
    }
    setIsFormOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), base64] }));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <SectionHeader title="Products" />
        <Button onClick={handleCreate}><Plus size={18} className="mr-2" /> Add Product</Button>
      </div>

      {isFormOpen ? (
        <div className="bg-white p-6 rounded shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-bold">{editing ? 'Edit Product' : 'New Product'}</h3>
            <button onClick={() => setIsFormOpen(false)}><X /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
               <Input label="Price" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />
               <Input label="Discount Price" type="number" value={formData.discountPrice || ''} onChange={e => setFormData({ ...formData, discountPrice: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                className="w-full border p-2 rounded text-sm"
                value={formData.category} 
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea className="w-full border p-2 rounded text-sm" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Stock" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} />
              <div className="flex items-center space-x-4 mt-6">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.newArrival} onChange={e => setFormData({ ...formData, newArrival: e.target.checked })} />
                  <span className="text-sm">New Arrival</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.bestSeller} onChange={e => setFormData({ ...formData, bestSeller: e.target.checked })} />
                  <span className="text-sm">Best Seller</span>
                </label>
              </div>
            </div>
            {/* Simple Array Inputs for Sizes/Colors */}
             <Input label="Sizes (comma separated)" value={formData.sizes?.join(', ')} onChange={e => setFormData({ ...formData, sizes: e.target.value.split(',').map(s => s.trim()) })} />
             <Input label="Colors (comma separated)" value={formData.colors?.join(', ')} onChange={e => setFormData({ ...formData, colors: e.target.value.split(',').map(s => s.trim()) })} />
            
            <div>
               <label className="block text-sm font-medium mb-2">Images</label>
               <div className="flex flex-wrap gap-4 mb-2">
                 {formData.images?.map((img, i) => (
                   <div key={i} className="relative w-20 h-20">
                     <img src={img} alt="" className="w-full h-full object-cover rounded" />
                     <button type="button" onClick={() => setFormData(prev => ({...prev, images: prev.images?.filter((_, idx) => idx !== i)}))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={12}/></button>
                   </div>
                 ))}
               </div>
               <input type="file" onChange={handleImageUpload} />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit">Save Product</Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Likes</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p.id}>
                  <td className="p-4"><img src={p.images[0]} className="w-10 h-10 object-cover rounded" alt="" /></td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">${p.price}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4 text-rose-500 font-bold">{p.likes || 0}</td>
                  <td className="p-4 flex space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Admin Orders ---
export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  
  return (
    <div>
      <SectionHeader title="Orders" />
      <div className="bg-white rounded shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="p-4 font-mono text-xs">{o.id.slice(-6)}</td>
                  <td className="p-4">
                    <div className="font-medium">{o.customerName}</div>
                    <div className="text-xs text-gray-500">{o.email}</div>
                  </td>
                  <td className="p-4">{o.items.length} items</td>
                  <td className="p-4">${o.total}</td>
                  <td className="p-4">{o.date}</td>
                  <td className="p-4">
                    <select 
                      value={o.status} 
                      onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                      className="border-none bg-gray-100 rounded text-xs py-1 px-2 cursor-pointer focus:ring-0"
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

// --- Admin Categories ---
export const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useStore();
  const [newCat, setNewCat] = useState({ name: '', image: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name || !newCat.image) return;
    await addCategory({ id: '', ...newCat });
    setNewCat({ name: '', image: '' });
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files?.[0]) {
      const b64 = await fileToBase64(e.target.files[0]);
      setNewCat({...newCat, image: b64});
    }
  };

  return (
    <div>
       <SectionHeader title="Categories" />
       <div className="grid md:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded shadow-sm h-fit">
           <h3 className="font-bold mb-4">Add Category</h3>
           <form onSubmit={handleAdd} className="space-y-4">
             <Input label="Name" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} />
             <div>
               <label className="block text-sm font-medium mb-1">Image</label>
               <input type="file" onChange={handleImage} className="text-sm" />
               {newCat.image && <img src={newCat.image} className="mt-2 h-20 w-20 object-cover rounded" alt="Preview" />}
             </div>
             <Button type="submit">Add Category</Button>
           </form>
         </div>
         <div className="space-y-4">
           {categories.map(c => (
             <div key={c.id} className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={c.image} alt="" className="w-12 h-12 object-cover rounded" />
                  <span className="font-medium">{c.name}</span>
                </div>
                <button onClick={() => deleteCategory(c.id)} className="text-red-500"><Trash2 size={18}/></button>
             </div>
           ))}
         </div>
       </div>
    </div>
  );
};

// --- Admin Pages ---
export const AdminPages: React.FC = () => {
  const { pages, addPage, updatePage, deletePage } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Page | null>(null);
  const [formData, setFormData] = useState<Partial<Page>>({});

  const handleCreate = () => {
    setEditing(null);
    setFormData({ title: '', slug: '', content: '', showInNav: false, showInFooter: false, textAlign: 'left', fontSize: 'md', textColor: '#000000' });
    setIsFormOpen(true);
  };

  const handleEdit = (p: Page) => {
    setEditing(p);
    setFormData(p);
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updatePage({ ...editing, ...formData } as Page);
    } else {
      await addPage(formData as Page);
    }
    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <SectionHeader title="Pages" />
        <Button onClick={handleCreate}><Plus size={18} className="mr-2" /> Add Page</Button>
      </div>

      {isFormOpen ? (
        <div className="bg-white p-6 rounded shadow-sm">
           <h3 className="font-bold mb-6">{editing ? 'Edit Page' : 'New Page'}</h3>
           <form onSubmit={handleSave} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <Input label="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                <Input label="Slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required placeholder="e.g. shipping-policy" />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Content (HTML allowed)</label>
                <textarea 
                  className="w-full border p-2 rounded text-sm h-64 font-mono"
                  value={formData.content} 
                  onChange={e => setFormData({ ...formData, content: e.target.value })} 
                />
             </div>
             
             {/* Styling Options */}
             <div className="grid grid-cols-3 gap-4 border-t pt-4">
                <div>
                   <label className="block text-sm font-medium mb-1">Text Align</label>
                   <select className="w-full border p-2 rounded text-sm" value={formData.textAlign} onChange={e => setFormData({...formData, textAlign: e.target.value as any})}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Font Size</label>
                   <select className="w-full border p-2 rounded text-sm" value={formData.fontSize} onChange={e => setFormData({...formData, fontSize: e.target.value as any})}>
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Text Color</label>
                   <div className="flex items-center space-x-2">
                      <input type="color" value={formData.textColor || '#000000'} onChange={e => setFormData({...formData, textColor: e.target.value})} className="h-9 w-9 border p-0.5 rounded cursor-pointer" />
                      <span className="text-xs text-gray-500">{formData.textColor}</span>
                   </div>
                </div>
             </div>

             <div className="flex space-x-6 pt-2">
               <label className="flex items-center space-x-2">
                 <input type="checkbox" checked={formData.showInNav} onChange={e => setFormData({ ...formData, showInNav: e.target.checked })} />
                 <span className="text-sm">Show in Navbar</span>
               </label>
               <label className="flex items-center space-x-2">
                 <input type="checkbox" checked={formData.showInFooter} onChange={e => setFormData({ ...formData, showInFooter: e.target.checked })} />
                 <span className="text-sm">Show in Footer</span>
               </label>
             </div>

             <div className="flex justify-end space-x-2 mt-4">
               <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
               <Button type="submit">Save Page</Button>
             </div>
           </form>
        </div>
      ) : (
        <div className="space-y-4">
           {pages.map(p => (
             <div key={p.id} className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
               <div>
                  <h4 className="font-medium">{p.title}</h4>
                  <p className="text-xs text-gray-500">/{p.slug}</p>
               </div>
               <div className="flex items-center space-x-2">
                 {p.showInNav && <Badge color="bg-blue-100 text-blue-800">Nav</Badge>}
                 {p.showInFooter && <Badge color="bg-green-100 text-green-800">Footer</Badge>}
                 <button onClick={() => handleEdit(p)} className="p-2 hover:bg-gray-100 rounded text-blue-600"><Edit size={16} /></button>
                 <button onClick={() => deletePage(p.id)} className="p-2 hover:bg-gray-100 rounded text-red-600"><Trash2 size={16} /></button>
               </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

// --- Admin Users ---
export const AdminUsers: React.FC = () => {
  const { users, addUser, deleteUser, changeUserPassword } = useStore();
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) return;
    await addUser({ ...newUser, permissions: [] });
    setNewUser({ username: '', password: '', role: 'staff' });
  };

  return (
    <div>
      <SectionHeader title="User Management" />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow-sm h-fit">
          <h3 className="font-bold mb-4">Add User</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <Input label="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
            <Input label="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <div>
               <label className="block text-sm font-medium mb-1">Role</label>
               <select className="w-full border p-2 rounded text-sm" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                 <option value="staff">Staff</option>
                 <option value="admin">Admin</option>
               </select>
            </div>
            <Button type="submit">Create User</Button>
          </form>
        </div>
        <div className="space-y-4">
           {users.map(u => (
             <div key={u.id} className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
               <div>
                 <p className="font-medium">{u.username}</p>
                 <span className="text-xs text-gray-500 uppercase">{u.role}</span>
               </div>
               {u.username !== 'admin' && (
                 <button onClick={() => deleteUser(u.id)} className="text-red-500"><Trash2 size={18}/></button>
               )}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- Admin Logs ---
export const AdminLogs: React.FC = () => {
  const { logs, fetchLogs } = useStore();
  useEffect(() => { fetchLogs(); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <SectionHeader title="Visitor Logs" />
         <Button onClick={fetchLogs} variant="outline" size="sm"><RefreshCw size={14} className="mr-2"/> Refresh</Button>
      </div>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="p-4">Time</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Hostname</th>
                <th className="p-4">User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 font-mono text-xs">{log.ip}</td>
                  <td className="p-4 font-mono text-xs text-gray-600">{log.hostname || '-'}</td>
                  <td className="p-4 text-xs text-gray-500 truncate max-w-xs" title={log.userAgent}>{log.userAgent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Admin Settings (Content) ---
export const AdminSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [formData, setFormData] = useState<SiteConfig>(config);

  useEffect(() => { setFormData(config); }, [config]);

  const handleSave = async () => {
    await updateConfig(formData);
    alert('Settings Saved!');
  };

  const handleChange = (field: keyof SiteConfig, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div className="flex justify-between items-center">
         <SectionHeader title="Content & Settings" />
         <Button onClick={handleSave}><Save size={18} className="mr-2"/> Save Changes</Button>
       </div>

       {/* General */}
       <div className="bg-white p-6 rounded shadow-sm">
         <h3 className="font-bold mb-4 border-b pb-2">General Info</h3>
         <div className="grid grid-cols-2 gap-6">
           <Input label="Site Name" value={formData.siteName || ''} onChange={e => handleChange('siteName', e.target.value)} />
           <Input label="Currency Symbol" value={formData.currency || ''} onChange={e => handleChange('currency', e.target.value)} />
           <div>
             <label className="block text-sm font-medium mb-1">Logo URL</label>
             <input type="text" className="w-full border p-2 rounded text-sm" value={formData.logo || ''} onChange={e => handleChange('logo', e.target.value)} />
           </div>
         </div>
       </div>

       {/* Hero Content */}
       <div className="bg-white p-6 rounded shadow-sm">
         <h3 className="font-bold mb-4 border-b pb-2">Hero Section Content</h3>
         <div className="space-y-4">
           <Input label="Tagline" value={formData.heroTagline || ''} onChange={e => handleChange('heroTagline', e.target.value)} />
           <Input label="Title" value={formData.heroTitle || ''} onChange={e => handleChange('heroTitle', e.target.value)} />
           <Input label="Subtitle" value={formData.heroSubtitle || ''} onChange={e => handleChange('heroSubtitle', e.target.value)} />
           {formData.heroMode === 'static' && (
              <Input label="Hero Image URL" value={formData.heroImage || ''} onChange={e => handleChange('heroImage', e.target.value)} />
           )}
           {formData.heroMode === 'static' && (
              <Input label="Hero Video URL (Optional)" value={formData.heroVideo || ''} onChange={e => handleChange('heroVideo', e.target.value)} />
           )}
         </div>
       </div>

       {/* Promo */}
       <div className="bg-white p-6 rounded shadow-sm">
         <h3 className="font-bold mb-4 border-b pb-2">Promo Banner</h3>
         <div className="space-y-4">
            <Input label="Title" value={formData.promoTitle || ''} onChange={e => handleChange('promoTitle', e.target.value)} />
            <Input label="Text" value={formData.promoText || ''} onChange={e => handleChange('promoText', e.target.value)} />
            <Input label="Button Text" value={formData.promoButtonText || ''} onChange={e => handleChange('promoButtonText', e.target.value)} />
            <Input label="Image URL" value={formData.promoImage || ''} onChange={e => handleChange('promoImage', e.target.value)} />
         </div>
       </div>

       {/* Footer */}
       <div className="bg-white p-6 rounded shadow-sm">
         <h3 className="font-bold mb-4 border-b pb-2">Footer Content</h3>
         <div className="grid grid-cols-2 gap-4">
            <Input label="Shop Column Title" value={formData.footerShopTitle || ''} onChange={e => handleChange('footerShopTitle', e.target.value)} />
            <Input label="Newsletter Title" value={formData.footerNewsletterTitle || ''} onChange={e => handleChange('footerNewsletterTitle', e.target.value)} />
         </div>
       </div>
    </div>
  );
};

// --- Admin Developer Settings (Theme & Layout) ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [formData, setFormData] = useState<SiteConfig>(config);
  
  // Local state for dragging or ordering could be added here
  
  useEffect(() => { setFormData(config); }, [config]);

  const handleSave = async () => {
    await updateConfig(formData);
    alert('Developer Configuration Saved!');
  };

  const handleThemeChange = (key: keyof SiteConfig['theme'], val: string) => {
    setFormData(prev => ({
      ...prev,
      theme: { ...prev.theme, [key]: val } as any
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'slideshow' | 'vertical', id?: string) => {
     if (e.target.files && e.target.files[0]) {
       const base64 = await fileToBase64(e.target.files[0]);
       
       if (type === 'hero') {
         setFormData(prev => ({ ...prev, heroImages: [...(prev.heroImages || []), base64] }));
       } else if (type === 'slideshow' && id) {
          setFormData(prev => ({
             ...prev,
             secondarySlideshows: prev.secondarySlideshows?.map(s => 
               s.id === id 
                 ? { ...s, slides: [...(s.slides || []), { image: base64, title: '', subtitle: '' }] } 
                 : s
             )
          }));
       } else if (type === 'vertical' && id) {
          setFormData(prev => ({
             ...prev,
             verticalCarousels: prev.verticalCarousels?.map(c => 
               c.id === id 
                 ? { ...c, slides: [...(c.slides || []), { image: base64, title: '', subtitle: '' }] } 
                 : c
             )
          }));
       }
     }
  };

  const addSection = (type: 'slideshow' | 'vertical') => {
    const id = `${type}_${Date.now()}`;
    if (type === 'slideshow') {
       setFormData(prev => ({
         ...prev,
         secondarySlideshows: [...(prev.secondarySlideshows || []), { id, title: 'New Slideshow', slides: [] }],
         homepageSections: [...(prev.homepageSections || []), id]
       }));
    } else {
       setFormData(prev => ({
         ...prev,
         verticalCarousels: [...(prev.verticalCarousels || []), { id, title: 'New Carousel', slides: [] }],
         homepageSections: [...(prev.homepageSections || []), id]
       }));
    }
  };
  
  const removeSection = (id: string, type: 'slideshow' | 'vertical') => {
     setFormData(prev => ({
       ...prev,
       homepageSections: prev.homepageSections?.filter(sid => sid !== id),
       secondarySlideshows: type === 'slideshow' ? prev.secondarySlideshows?.filter(s => s.id !== id) : prev.secondarySlideshows,
       verticalCarousels: type === 'vertical' ? prev.verticalCarousels?.filter(c => c.id !== id) : prev.verticalCarousels
     }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
       <div className="flex justify-between items-center">
         <SectionHeader title="Developer Settings" />
         <Button onClick={handleSave}><Save size={18} className="mr-2"/> Save Config</Button>
       </div>

       {/* Theme Config */}
       <div className="bg-white p-6 rounded shadow-sm">
         <h3 className="font-bold mb-6 flex items-center"><Monitor className="mr-2"/> Theme Configuration</h3>
         <div className="grid grid-cols-3 gap-6">
           <div>
             <label className="block text-sm font-medium mb-1">Primary Color (900)</label>
             <div className="flex items-center space-x-2">
               <input type="color" value={formData.theme?.primaryColor || '#000000'} onChange={e => handleThemeChange('primaryColor', e.target.value)} className="h-10 w-full cursor-pointer border rounded" />
             </div>
           </div>
           <div>
             <label className="block text-sm font-medium mb-1">Secondary Color (200)</label>
             <div className="flex items-center space-x-2">
               <input type="color" value={formData.theme?.secondaryColor || '#ffffff'} onChange={e => handleThemeChange('secondaryColor', e.target.value)} className="h-10 w-full cursor-pointer border rounded" />
             </div>
           </div>
           <div>
             <label className="block text-sm font-medium mb-1">Background Color (50)</label>
             <div className="flex items-center space-x-2">
               <input type="color" value={formData.theme?.backgroundColor || '#ffffff'} onChange={e => handleThemeChange('backgroundColor', e.target.value)} className="h-10 w-full cursor-pointer border rounded" />
             </div>
           </div>
           <div>
             <label className="block text-sm font-medium mb-1">Sans Font</label>
             <select className="w-full border p-2 rounded text-sm" value={formData.theme?.fontFamilySans} onChange={e => handleThemeChange('fontFamilySans', e.target.value)}>
               <option value="Inter">Inter</option>
               <option value="Helvetica">Helvetica</option>
               <option value="Arial">Arial</option>
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium mb-1">Serif Font</label>
             <select className="w-full border p-2 rounded text-sm" value={formData.theme?.fontFamilySerif} onChange={e => handleThemeChange('fontFamilySerif', e.target.value)}>
               <option value="Cormorant Garamond">Cormorant Garamond</option>
               <option value="Playfair Display">Playfair Display</option>
               <option value="Merriweather">Merriweather</option>
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium mb-1">Border Radius</label>
             <select className="w-full border p-2 rounded text-sm" value={formData.theme?.borderRadius} onChange={e => handleThemeChange('borderRadius', e.target.value)}>
               <option value="0px">Sharp (0px)</option>
               <option value="4px">Slight (4px)</option>
               <option value="8px">Soft (8px)</option>
               <option value="99px">Round (99px)</option>
             </select>
           </div>
         </div>
       </div>

       {/* Hero Layout */}
       <div className="bg-white p-6 rounded shadow-sm">
         <h3 className="font-bold mb-4 flex items-center"><Layout className="mr-2"/> Hero Configuration</h3>
         <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
               <label className="block text-sm font-medium mb-1">Mode</label>
               <select className="w-full border p-2 rounded text-sm" value={formData.heroMode} onChange={e => setFormData({...formData, heroMode: e.target.value as any})}>
                  <option value="static">Static Image/Video</option>
                  <option value="slideshow">Slideshow</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Text Align</label>
               <select className="w-full border p-2 rounded text-sm" value={formData.heroTextAlign} onChange={e => setFormData({...formData, heroTextAlign: e.target.value as any})}>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Text Color</label>
               <div className="flex items-center space-x-2">
                 <input type="color" value={formData.heroTextColor || '#ffffff'} onChange={e => setFormData({...formData, heroTextColor: e.target.value})} className="h-8 w-8 border rounded" />
                 <span className="text-xs">{formData.heroTextColor}</span>
               </div>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Font Size</label>
               <select className="w-full border p-2 rounded text-sm" value={formData.heroFontSize} onChange={e => setFormData({...formData, heroFontSize: e.target.value as any})}>
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
               </select>
            </div>
         </div>
         
         {formData.heroMode === 'slideshow' && (
           <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Hero Slides</label>
              <div className="grid grid-cols-4 gap-4">
                 {formData.heroImages?.map((img, i) => (
                   <div key={i} className="relative aspect-video bg-gray-100 rounded overflow-hidden group">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button onClick={() => setFormData(prev => ({...prev, heroImages: prev.heroImages?.filter((_, idx) => idx !== i)}))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><X size={12}/></button>
                   </div>
                 ))}
                 <label className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 aspect-video">
                    <Plus className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add Slide</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'hero')} />
                 </label>
              </div>
           </div>
         )}
       </div>

       {/* Vertical Carousels */}
       <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-brand-900">Vertical Carousels</h3>
            <Button onClick={() => addSection('vertical')} size="sm" variant="secondary"><Plus size={14} className="mr-2"/> Add Carousel</Button>
         </div>
         {formData.verticalCarousels?.map(carousel => (
            <div key={carousel.id} className="bg-white p-6 rounded shadow-sm border border-orange-100">
               <div className="flex justify-between items-center mb-4 border-b border-orange-50 pb-2">
                 <div className="flex items-center gap-2">
                   <Input 
                      value={carousel.title || ''} 
                      placeholder="Carousel Title"
                      className="w-64"
                      onChange={e => setFormData(prev => ({
                        ...prev, 
                        verticalCarousels: prev.verticalCarousels?.map(c => c.id === carousel.id ? {...c, title: e.target.value} : c)
                      }))}
                   />
                   <span className="text-xs text-gray-400 font-mono">{carousel.id}</span>
                 </div>
                 <button onClick={() => removeSection(carousel.id, 'vertical')} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
               </div>
               
               <div className="flex overflow-x-auto gap-4 pb-2">
                  {carousel.slides?.map((slide, idx) => (
                     <div key={idx} className="relative w-32 aspect-[9/16] bg-gray-100 flex-shrink-0 rounded overflow-hidden group">
                        <img src={slide.image} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-2 space-y-2">
                           <input 
                             placeholder="Title" 
                             className="w-full text-xs bg-white/90 p-1 rounded" 
                             value={slide.title || ''}
                             onChange={(e) => setFormData(prev => ({
                               ...prev,
                               verticalCarousels: prev.verticalCarousels?.map(c => 
                                 c.id === carousel.id 
                                   ? {...c, slides: c.slides.map((s, i) => i === idx ? {...s, title: e.target.value} : s)} 
                                   : c
                               )
                             }))}
                           />
                           <input 
                             placeholder="Subtitle" 
                             className="w-full text-xs bg-white/90 p-1 rounded"
                             value={slide.subtitle || ''}
                             onChange={(e) => setFormData(prev => ({
                               ...prev,
                               verticalCarousels: prev.verticalCarousels?.map(c => 
                                 c.id === carousel.id 
                                   ? {...c, slides: c.slides.map((s, i) => i === idx ? {...s, subtitle: e.target.value} : s)} 
                                   : c
                               )
                             }))}
                           />
                           <button onClick={() => setFormData(prev => ({
                             ...prev,
                             verticalCarousels: prev.verticalCarousels?.map(c => 
                               c.id === carousel.id 
                                 ? {...c, slides: c.slides.filter((_, i) => i !== idx)} 
                                 : c
                             )
                           }))} className="bg-red-500 text-white p-1 rounded-full"><Trash2 size={12}/></button>
                        </div>
                     </div>
                  ))}
                  
                  {/* The exact label from the error, corrected to use valid carousel.id */}
                  <label className="border-2 border-dashed border-orange-200 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-orange-500 transition-colors aspect-[9/16] min-w-[128px]">
                     <Plus className="text-orange-400 mb-2" size={24}/>
                     <span className="text-sm text-orange-500 font-medium text-center">Add Vertical Slide</span>
                     <span className="text-xs text-gray-400 mt-1 text-center">Rec: 1080x1920px or 9:16 ratio</span>
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'vertical', carousel.id)} />
                  </label>
               </div>
            </div>
         ))}
       </div>

       {/* Secondary Slideshows */}
       <div className="space-y-6 pt-8 border-t">
         <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-brand-900">Secondary Slideshows</h3>
            <Button onClick={() => addSection('slideshow')} size="sm" variant="secondary"><Plus size={14} className="mr-2"/> Add Slideshow</Button>
         </div>
         {formData.secondarySlideshows?.map(slideshow => (
            <div key={slideshow.id} className="bg-white p-6 rounded shadow-sm">
               <div className="flex justify-between items-center mb-4 border-b pb-2">
                 <div className="flex gap-4">
                    <Input 
                      value={slideshow.title || ''} 
                      placeholder="Section Title"
                      onChange={e => setFormData(prev => ({
                        ...prev, 
                        secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === slideshow.id ? {...s, title: e.target.value} : s)
                      }))}
                    />
                    <select 
                      className="border rounded px-2 text-sm" 
                      value={slideshow.textAlign}
                      onChange={e => setFormData(prev => ({
                        ...prev, 
                        secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === slideshow.id ? {...s, textAlign: e.target.value as any} : s)
                      }))}
                    >
                      <option value="left">Left Align</option>
                      <option value="center">Center Align</option>
                      <option value="right">Right Align</option>
                    </select>
                 </div>
                 <button onClick={() => removeSection(slideshow.id, 'slideshow')} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
               </div>
               
               <div className="grid grid-cols-4 gap-4">
                  {/* Map existing slides */}
                  {slideshow.slides?.map((slide, idx) => (
                     <div key={idx} className="relative aspect-video bg-gray-100 rounded overflow-hidden group">
                        <img src={slide.image} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition p-2 flex flex-col justify-center space-y-2">
                            <input 
                             placeholder="Title" 
                             className="w-full text-xs bg-white/90 p-1 rounded" 
                             value={slide.title || ''}
                             onChange={(e) => setFormData(prev => ({
                               ...prev,
                               secondarySlideshows: prev.secondarySlideshows?.map(s => 
                                 s.id === slideshow.id 
                                   ? {...s, slides: s.slides.map((sl, i) => i === idx ? {...sl, title: e.target.value} : sl)} 
                                   : s
                               )
                             }))}
                           />
                           <input 
                             placeholder="Subtitle" 
                             className="w-full text-xs bg-white/90 p-1 rounded" 
                             value={slide.subtitle || ''}
                             onChange={(e) => setFormData(prev => ({
                               ...prev,
                               secondarySlideshows: prev.secondarySlideshows?.map(s => 
                                 s.id === slideshow.id 
                                   ? {...s, slides: s.slides.map((sl, i) => i === idx ? {...sl, subtitle: e.target.value} : sl)} 
                                   : s
                               )
                             }))}
                           />
                           <button onClick={() => setFormData(prev => ({
                               ...prev,
                               secondarySlideshows: prev.secondarySlideshows?.map(s => 
                                 s.id === slideshow.id 
                                   ? {...s, slides: s.slides.filter((_, i) => i !== idx)} 
                                   : s
                               )
                             }))} 
                             className="self-center bg-red-500 text-white p-1 rounded-full"><Trash2 size={12}/>
                           </button>
                        </div>
                     </div>
                  ))}
                  <label className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 aspect-video">
                    <Plus className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add Slide</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'slideshow', slideshow.id)} />
                  </label>
               </div>
            </div>
         ))}
       </div>
    </div>
  );
};

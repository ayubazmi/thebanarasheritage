import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, Badge } from '../components/ui';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings, Users, 
  Plus, Trash2, Edit, Save, X, Search, ChevronRight, FileText, 
  Megaphone, Code2, AlertTriangle, CheckCircle, Upload
} from 'lucide-react';
import { Product, Category, Order, User, SiteConfig } from '../types';

// --- Admin Login ---
export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, error } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/admin');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (e) {
      // error handled in store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-serif font-bold text-brand-900 mb-6 text-center">Admin Login</h1>
        {error && <div className="bg-rose-100 text-rose-600 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    </div>
  );
};

// --- Dashboard ---
export const AdminDashboard: React.FC = () => {
  const { orders, products, logs } = useStore();
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  
  return (
    <div>
      <h1 className="text-2xl font-bold font-serif text-brand-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Revenue</h3>
          <p className="text-3xl font-bold text-brand-900 mt-2">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Orders</h3>
          <p className="text-3xl font-bold text-brand-900 mt-2">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Products</h3>
          <p className="text-3xl font-bold text-brand-900 mt-2">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Recent Visits</h3>
          <p className="text-3xl font-bold text-brand-900 mt-2">{logs.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-sm">
        <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id}>
                  <td className="px-4 py-3 text-gray-500">#{order.id.slice(-6)}</td>
                  <td className="px-4 py-3 font-medium">{order.customerName}</td>
                  <td className="px-4 py-3 text-gray-500">{order.date}</td>
                  <td className="px-4 py-3">${order.total}</td>
                  <td className="px-4 py-3">
                    <Badge color={order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Products ---
export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Product>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editData.id) {
      await updateProduct(editData as Product);
    } else {
      await addProduct(editData as Product);
    }
    setIsEditing(false);
    setEditData({});
  };

  const openEdit = (p?: Product) => {
    setEditData(p || { 
      name: '', description: '', price: 0, category: categories[0]?.name || '', 
      images: [''], sizes: [], colors: [], stock: 0 
    });
    setIsEditing(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-serif text-brand-900">Products</h1>
        <Button onClick={() => openEdit()}><Plus size={18} className="mr-2" /> Add Product</Button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editData.id ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} required />
                <Input label="Price" type="number" value={editData.price} onChange={e => setEditData({...editData, price: Number(e.target.value)})} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  className="w-full border p-2 rounded text-sm bg-white"
                  value={editData.category} 
                  onChange={e => setEditData({...editData, category: e.target.value})}
                >
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <Input label="Description" value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} />
              <Input label="Image URL" value={editData.images?.[0]} onChange={e => setEditData({...editData, images: [e.target.value]})} />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Stock" type="number" value={editData.stock} onChange={e => setEditData({...editData, stock: Number(e.target.value)})} />
                <Input label="Discount Price" type="number" value={editData.discountPrice || ''} onChange={e => setEditData({...editData, discountPrice: Number(e.target.value)})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Sizes (comma sep)" value={editData.sizes?.join(',')} onChange={e => setEditData({...editData, sizes: e.target.value.split(',').map(s => s.trim())})} />
                <Input label="Colors (comma sep)" value={editData.colors?.join(',')} onChange={e => setEditData({...editData, colors: e.target.value.split(',').map(s => s.trim())})} />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit">Save Product</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={p.images[0]} className="w-10 h-10 object-cover rounded" alt="" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="px-6 py-4">{p.category}</td>
                <td className="px-6 py-4">${p.price}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                  <button onClick={() => deleteProduct(p.id)} className="text-rose-600 hover:text-rose-800"><Trash2 size={16} /></button>
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
      <h1 className="text-2xl font-bold font-serif text-brand-900 mb-6">Orders</h1>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">#{order.id.slice(-6)}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-xs text-gray-500">{order.email}</div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">
                  {order.items.map(i => <div key={i.id}>{i.quantity}x {i.name}</div>)}
                </td>
                <td className="px-6 py-4 font-medium">${order.total}</td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status} 
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                    className="border-gray-200 text-xs rounded p-1"
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
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold font-serif text-brand-900 mb-6">Categories</h1>
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map(c => (
                <tr key={c.id}>
                  <td className="px-6 py-4">
                    <img src={c.image} className="w-12 h-16 object-cover rounded-sm" alt="" />
                  </td>
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteCategory(c.id)} className="text-rose-600 hover:text-rose-800"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div className="bg-white p-6 rounded shadow-sm sticky top-6">
          <h3 className="font-bold mb-4">Add Category</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <Input label="Name" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} required />
            <Input label="Image URL" value={newCat.image} onChange={e => setNewCat({...newCat, image: e.target.value})} required />
            <Button type="submit" className="w-full">Add Category</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Users ---
export const AdminUsers: React.FC = () => {
  const { users, addUser, deleteUser } = useStore();
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addUser({ ...newUser, role: newUser.role as 'admin'|'staff', permissions: [] });
    setNewUser({ username: '', password: '', role: 'staff' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-serif text-brand-900 mb-6">User Management</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-6 py-4 font-medium">{u.username}</td>
                  <td className="px-6 py-4 capitalize">{u.role}</td>
                  <td className="px-6 py-4 text-right">
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u.id)} className="text-rose-600 hover:text-rose-800"><Trash2 size={16} /></button>
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
            <Input label="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} required />
            <Input label="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select className="w-full border p-2 rounded text-sm" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
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

// --- Logs ---
export const AdminLogs: React.FC = () => {
  const { logs, fetchLogs } = useStore();
  
  useEffect(() => { fetchLogs(); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold font-serif text-brand-900">Access Logs</h1>
         <Button variant="outline" size="sm" onClick={fetchLogs}>Refresh</Button>
      </div>
      <div className="bg-white rounded shadow-sm overflow-hidden border border-gray-200">
        <div className="max-h-[80vh] overflow-y-auto">
          <table className="w-full text-xs font-mono">
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left">Timestamp</th>
                <th className="px-4 py-2 text-left">IP</th>
                <th className="px-4 py-2 text-left">Hostname</th>
                <th className="px-4 py-2 text-left">User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 text-blue-600">{log.ip}</td>
                  <td className="px-4 py-2">{log.hostname || '-'}</td>
                  <td className="px-4 py-2 truncate max-w-xs text-gray-500">{log.userAgent}</td>
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
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);

  useEffect(() => { if (config) setLocalConfig(config); }, [config]);

  const handleSave = async () => {
    await updateConfig(localConfig);
    alert('Settings Saved!');
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-serif text-brand-900">Content & Settings</h1>
        <Button onClick={handleSave}><Save size={18} className="mr-2" /> Save Changes</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* General Info */}
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4">General Information</h3>
          <div className="space-y-4">
            <Input label="Site Name" value={localConfig.siteName || ''} onChange={e => setLocalConfig({...localConfig, siteName: e.target.value})} />
            <Input label="Logo URL" value={localConfig.logo || ''} onChange={e => setLocalConfig({...localConfig, logo: e.target.value})} />
            <Input label="Contact Email" value={localConfig.contactEmail || ''} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} />
            <Input label="Contact Phone" value={localConfig.contactPhone || ''} onChange={e => setLocalConfig({...localConfig, contactPhone: e.target.value})} />
            <Input label="Address" value={localConfig.contactAddress || ''} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} />
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4">Hero Section</h3>
          <div className="space-y-4">
            <Input label="Hero Title" value={localConfig.heroTitle || ''} onChange={e => setLocalConfig({...localConfig, heroTitle: e.target.value})} />
            <Input label="Hero Subtitle" value={localConfig.heroSubtitle || ''} onChange={e => setLocalConfig({...localConfig, heroSubtitle: e.target.value})} />
            <Input label="Hero Tagline" value={localConfig.heroTagline || ''} onChange={e => setLocalConfig({...localConfig, heroTagline: e.target.value})} />
            <Input label="Background Image URL" value={localConfig.heroImage || ''} onChange={e => setLocalConfig({...localConfig, heroImage: e.target.value})} />
            <Input label="Background Video URL (Optional)" value={localConfig.heroVideo || ''} onChange={e => setLocalConfig({...localConfig, heroVideo: e.target.value})} />
          </div>
        </div>

        {/* Announcement Bar Settings (Reordered) */}
        <div className="bg-white p-8 rounded shadow-sm md:col-span-2 border-l-4 border-yellow-400">
          <h3 className="font-bold text-lg mb-6 flex items-center"><Megaphone className="mr-2" size={20}/> Announcement Bar</h3>
          
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
                     announcementBlink: e.target.checked // Auto-enable blink when bar is enabled
                   })}
                 />
                 <span className="font-medium text-sm">Enable Announcement Bar</span>
               </label>
            </div>

            {localConfig.announcementEnabled && (
              <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up p-4 bg-gray-50 rounded">
                <Input 
                  label="Announcement Text" 
                  value={localConfig.announcementText || ''} 
                  placeholder="e.g., Free Shipping on Orders Over $50!" 
                  onChange={e => setLocalConfig({...localConfig, announcementText: e.target.value})} 
                />
                <Input 
                  label="Link URL (Optional)" 
                  value={localConfig.announcementLink || ''} 
                  placeholder="/shop" 
                  onChange={e => setLocalConfig({...localConfig, announcementLink: e.target.value})} 
                />
                
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
            )}
          </div>
        </div>

        {/* Promo Section */}
        <div className="bg-white p-6 rounded shadow-sm md:col-span-2">
          <h3 className="font-bold text-lg mb-4">Promo Section</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Promo Title" value={localConfig.promoTitle || ''} onChange={e => setLocalConfig({...localConfig, promoTitle: e.target.value})} />
            <Input label="Promo Image URL" value={localConfig.promoImage || ''} onChange={e => setLocalConfig({...localConfig, promoImage: e.target.value})} />
            <div className="md:col-span-2">
              <Input label="Promo Text" value={localConfig.promoText || ''} onChange={e => setLocalConfig({...localConfig, promoText: e.target.value})} />
            </div>
            <Input label="Button Text" value={localConfig.promoButtonText || ''} onChange={e => setLocalConfig({...localConfig, promoButtonText: e.target.value})} />
            <Input label="Button Link" value={localConfig.promoButtonLink || ''} onChange={e => setLocalConfig({...localConfig, promoButtonLink: e.target.value})} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Developer Settings ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [jsonConfig, setJsonConfig] = useState('');

  useEffect(() => { 
    if (config) setJsonConfig(JSON.stringify(config, null, 2)); 
  }, [config]);

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(jsonConfig);
      await updateConfig(parsed);
      alert('Config updated successfully!');
    } catch (e) {
      alert('Invalid JSON');
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-serif text-brand-900">Developer Settings</h1>
        <Button onClick={handleSave}><Code2 size={18} className="mr-2" /> Push Config</Button>
      </div>
      <div className="bg-white p-6 rounded shadow-sm">
        <p className="text-sm text-gray-500 mb-4">Directly edit the raw JSON configuration for the site. Be careful.</p>
        <textarea 
          className="w-full h-[600px] font-mono text-xs p-4 bg-gray-50 border rounded focus:outline-none focus:ring-1 focus:ring-brand-900"
          value={jsonConfig}
          onChange={e => setJsonConfig(e.target.value)}
        />
      </div>
    </div>
  );
};

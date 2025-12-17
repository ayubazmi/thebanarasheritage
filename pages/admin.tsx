import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { 
  Trash2, Edit, Plus, Save, X, RefreshCw 
} from 'lucide-react';
import { Product, Page, SiteConfig, Slide } from '../types';

// Helper for file reading
const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// --- Admin Login ---
export const AdminLogin: React.FC = () => {
  const { login, user } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate('/admin');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-serif font-bold text-center text-brand-900 mb-6">Admin Login</h2>
        {error && <div className="bg-rose-100 text-rose-600 p-3 rounded mb-4 text-sm">{error}</div>}
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
  const { orders, products, logs } = useStore();
  
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const uniqueVisitors = new Set(logs.map(l => l.ip)).size;

  const StatCard = ({ title, value, sub }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <div className="text-3xl font-bold text-brand-900 mt-2">{value}</div>
      {sub && <div className="text-xs text-brand-800 mt-1">{sub}</div>}
    </div>
  );

  return (
    <div>
      <SectionHeader title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} sub={`${orders.length} orders total`} />
        <StatCard title="Pending Orders" value={pendingOrders} sub="Needs attention" />
        <StatCard title="Total Products" value={products.length} sub={`${products.filter(p => p.stock < 5).length} low stock`} />
        <StatCard title="Total Visitors" value={uniqueVisitors} sub="Unique IPs" />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
        <table className="w-full text-left text-sm">
          <thead className="border-b">
            <tr>
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(order => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="py-3 text-gray-500">#{order.id.slice(-6)}</td>
                <td className="py-3 font-medium">{order.customerName}</td>
                <td className="py-3"><Badge>{order.status}</Badge></td>
                <td className="py-3 text-right font-medium">${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Products ---
export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Product>>({});

  const handleSave = async () => {
    if (!editData.name || !editData.price) return alert("Name and Price required");
    
    const productData = {
      ...editData,
      price: Number(editData.price),
      stock: Number(editData.stock || 0),
      discountPrice: editData.discountPrice ? Number(editData.discountPrice) : undefined,
      images: editData.images || [],
      sizes: typeof editData.sizes === 'string' ? (editData.sizes as string).split(',').map(s => s.trim()) : (editData.sizes || []),
      colors: typeof editData.colors === 'string' ? (editData.colors as string).split(',').map(c => c.trim()) : (editData.colors || []),
    } as Product;

    if (editData.id) {
      await updateProduct(productData);
    } else {
      await addProduct(productData);
    }
    setIsEditing(false);
    setEditData({});
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await readFile(e.target.files[0]);
      setEditData(prev => ({ ...prev, images: [...(prev.images || []), base64] }));
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl bg-white p-8 rounded-lg shadow-sm">
        <SectionHeader title={editData.id ? "Edit Product" : "Add Product"} />
        <div className="grid grid-cols-2 gap-6">
          <Input label="Product Name" value={editData.name || ''} onChange={e => setEditData({...editData, name: e.target.value})} />
          <div className="w-full">
            <label className="block text-sm font-medium text-brand-900 mb-1">Category</label>
            <select 
              className="w-full border border-gray-200 bg-white px-4 py-2 text-sm"
              value={editData.category || ''}
              onChange={e => setEditData({...editData, category: e.target.value})}
            >
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Price" type="number" value={editData.price || ''} onChange={e => setEditData({...editData, price: Number(e.target.value)})} />
          <Input label="Discount Price" type="number" value={editData.discountPrice || ''} onChange={e => setEditData({...editData, discountPrice: Number(e.target.value)})} />
          <Input label="Stock" type="number" value={editData.stock || ''} onChange={e => setEditData({...editData, stock: Number(e.target.value)})} />
          <div className="col-span-2">
            <label className="block text-sm font-medium text-brand-900 mb-1">Description</label>
            <textarea className="w-full border border-gray-200 p-2 text-sm h-32" value={editData.description || ''} onChange={e => setEditData({...editData, description: e.target.value})} />
          </div>
          <Input label="Sizes (comma separated)" value={Array.isArray(editData.sizes) ? editData.sizes.join(', ') : editData.sizes || ''} onChange={e => setEditData({...editData, sizes: e.target.value})} />
          <Input label="Colors (comma separated)" value={Array.isArray(editData.colors) ? editData.colors.join(', ') : editData.colors || ''} onChange={e => setEditData({...editData, colors: e.target.value})} />
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-brand-900 mb-2">Images</label>
            <div className="flex gap-4 flex-wrap">
              {editData.images?.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 bg-gray-100">
                  <img src={img} className="w-full h-full object-cover" />
                  <button onClick={() => setEditData(prev => ({...prev, images: prev.images?.filter((_, i) => i !== idx)}))} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"><X size={12}/></button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-brand-500">
                <Plus className="text-gray-400" />
                <input type="file" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
          
          <div className="col-span-2 flex gap-4">
             <label className="flex items-center gap-2"><input type="checkbox" checked={editData.newArrival || false} onChange={e => setEditData({...editData, newArrival: e.target.checked})} /> New Arrival</label>
             <label className="flex items-center gap-2"><input type="checkbox" checked={editData.bestSeller || false} onChange={e => setEditData({...editData, bestSeller: e.target.checked})} /> Best Seller</label>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Product</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <SectionHeader title="Products" />
        <Button onClick={() => { setEditData({}); setIsEditing(true); }}><Plus size={16} className="mr-2"/> Add Product</Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 w-20 h-20"><img src={p.images[0]} className="w-16 h-16 object-cover rounded" /></td>
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">${p.price}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditData(p); setIsEditing(true); }} className="p-2 text-brand-600 hover:bg-brand-50 rounded"><Edit size={16}/></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16}/></button>
                  </div>
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
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">Order #{order.id.slice(-6)}</h3>
                <p className="text-gray-500 text-sm">{new Date(order.date).toLocaleDateString()} by {order.customerName}</p>
                <p className="text-gray-500 text-sm">{order.email}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold mb-2">${order.total}</div>
                <select 
                  value={order.status} 
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                  className="text-sm border rounded p-1"
                >
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium text-sm mb-2">Items</h4>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name} ({item.selectedSize}, {item.selectedColor})</span>
                    <span>${(item.discountPrice || item.price) * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Categories ---
export const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useStore();
  const [newCat, setNewCat] = useState({ name: '', image: '' });

  const handleAdd = async () => {
    if (!newCat.name) return;
    await addCategory({ id: newCat.name.toLowerCase().replace(/\s+/g, '-'), ...newCat });
    setNewCat({ name: '', image: '' });
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const base64 = await readFile(e.target.files[0]);
      setNewCat(prev => ({ ...prev, image: base64 }));
    }
  };

  return (
    <div>
      <SectionHeader title="Categories" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h3 className="font-bold mb-4">Add Category</h3>
          <div className="space-y-4">
            <Input label="Name" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} />
            <div>
               <label className="block text-sm font-medium mb-1">Image</label>
               {newCat.image && <img src={newCat.image} className="h-32 w-full object-cover mb-2 rounded" />}
               <input type="file" onChange={handleImage} />
            </div>
            <Button onClick={handleAdd} className="w-full">Add Category</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="relative group aspect-square bg-gray-100 rounded overflow-hidden">
              <img src={cat.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white font-bold mb-2">{cat.name}</span>
                <button onClick={() => deleteCategory(cat.id)} className="bg-white text-rose-500 p-2 rounded-full"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Pages Management ---
export const AdminPages: React.FC = () => {
  const { pages, addPage, updatePage, deletePage } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Page>>({});

  const handleSave = async () => {
    if (!editData.title || !editData.slug || !editData.content) return alert("Title, Slug and Content required");
    const pageData = editData as Page;
    if (editData.id) await updatePage(pageData);
    else await addPage({ ...pageData, id: '' }); // ID generated by backend/store logic usually
    setIsEditing(false);
    setEditData({});
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl bg-white p-8 rounded-lg shadow-sm">
        <SectionHeader title={editData.id ? "Edit Page" : "Add Page"} />
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Input label="Page Title" value={editData.title || ''} onChange={e => setEditData({...editData, title: e.target.value})} />
            <Input label="URL Slug" value={editData.slug || ''} onChange={e => setEditData({...editData, slug: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-3 gap-6">
             <div>
               <label className="block text-sm font-medium mb-1">Text Color</label>
               <input type="color" value={editData.textColor || '#000000'} onChange={e => setEditData({...editData, textColor: e.target.value})} className="w-full h-10 cursor-pointer"/>
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Text Align</label>
               <select value={editData.textAlign || 'left'} onChange={e => setEditData({...editData, textAlign: e.target.value as any})} className="w-full border p-2 text-sm rounded">
                 <option value="left">Left</option>
                 <option value="center">Center</option>
                 <option value="right">Right</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Font Size</label>
               <select value={editData.fontSize || 'md'} onChange={e => setEditData({...editData, fontSize: e.target.value as any})} className="w-full border p-2 text-sm rounded">
                 <option value="sm">Small</option>
                 <option value="md">Medium</option>
                 <option value="lg">Large</option>
               </select>
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium mb-1">Content (HTML Supported)</label>
             <textarea className="w-full border border-gray-200 p-4 font-mono text-sm h-64 rounded" value={editData.content || ''} onChange={e => setEditData({...editData, content: e.target.value})} />
          </div>

          <div className="flex gap-6">
             <label className="flex items-center gap-2"><input type="checkbox" checked={editData.showInNav || false} onChange={e => setEditData({...editData, showInNav: e.target.checked})} /> Show in Navigation</label>
             <label className="flex items-center gap-2"><input type="checkbox" checked={editData.showInFooter || false} onChange={e => setEditData({...editData, showInFooter: e.target.checked})} /> Show in Footer</label>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <SectionHeader title="Pages" />
        <Button onClick={() => { setEditData({}); setIsEditing(true); }}><Plus size={16} className="mr-2"/> Add Page</Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Visibility</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium">{p.title}</td>
                <td className="p-4 text-gray-500">/{p.slug}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {p.showInNav && <Badge color="bg-blue-100 text-blue-800">Nav</Badge>}
                    {p.showInFooter && <Badge color="bg-green-100 text-green-800">Footer</Badge>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditData(p); setIsEditing(true); }} className="p-2 text-brand-600 hover:bg-brand-50 rounded"><Edit size={16}/></button>
                    <button onClick={() => deletePage(p.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Users ---
export const AdminUsers: React.FC = () => {
  const { users, addUser, deleteUser, changeUserPassword } = useStore();
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });

  const handleAdd = async () => {
    if (!newUser.username || !newUser.password) return;
    await addUser(newUser as any);
    setNewUser({ username: '', password: '', role: 'staff' });
  };

  return (
    <div>
      <SectionHeader title="User Management" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm h-fit col-span-1">
          <h3 className="font-bold mb-4">Add User</h3>
          <div className="space-y-4">
            <Input label="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
            <Input label="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <div>
               <label className="block text-sm font-medium mb-1">Role</label>
               <select className="w-full border p-2 rounded" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                 <option value="staff">Staff</option>
                 <option value="admin">Admin</option>
               </select>
            </div>
            <Button onClick={handleAdd} className="w-full">Create User</Button>
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Username</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-medium">{u.username}</td>
                  <td className="p-4"><Badge>{u.role}</Badge></td>
                  <td className="p-4">
                    {u.username !== 'admin' && (
                      <button onClick={() => deleteUser(u.id)} className="text-rose-600 hover:underline">Delete</button>
                    )}
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

// --- Logs ---
export const AdminLogs: React.FC = () => {
  const { logs, fetchLogs } = useStore();
  useEffect(() => { fetchLogs(); }, []);

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <SectionHeader title="Visitor Logs" />
        <Button size="sm" variant="outline" onClick={fetchLogs}><RefreshCw size={14} className="mr-2"/> Refresh</Button>
       </div>
       <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
         <table className="w-full text-left text-xs font-mono">
           <thead className="bg-gray-50 border-b">
             <tr>
               <th className="p-3">Time</th>
               <th className="p-3">IP / Host</th>
               <th className="p-3">User Agent</th>
             </tr>
           </thead>
           <tbody>
             {logs.map((log, i) => (
               <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                 <td className="p-3 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                 <td className="p-3">
                    <div className="font-bold">{log.ip}</div>
                    {log.hostname && log.hostname !== log.ip && <div className="text-gray-500">{log.hostname}</div>}
                 </td>
                 <td className="p-3 truncate max-w-xs" title={log.userAgent}>{log.userAgent}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};

// --- Settings (Basic) ---
export const AdminSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);

  useEffect(() => { setLocalConfig(config); }, [config]);

  const handleSave = () => updateConfig(localConfig);

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <SectionHeader title="General Settings" />
        <Button onClick={handleSave}><Save size={16} className="mr-2"/> Save Changes</Button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm space-y-8">
         <div className="grid grid-cols-2 gap-6">
           <Input label="Site Name" value={localConfig.siteName || ''} onChange={e => setLocalConfig({...localConfig, siteName: e.target.value})} />
           <Input label="Currency Symbol" value={localConfig.currency || ''} onChange={e => setLocalConfig({...localConfig, currency: e.target.value})} />
         </div>

         <div className="border-t pt-6">
           <h3 className="font-bold mb-4">Contact Info</h3>
           <div className="grid grid-cols-2 gap-6">
             <Input label="Email" value={localConfig.contactEmail || ''} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} />
             <Input label="Phone" value={localConfig.contactPhone || ''} onChange={e => setLocalConfig({...localConfig, contactPhone: e.target.value})} />
             <Input label="Address" className="col-span-2" value={localConfig.contactAddress || ''} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} />
           </div>
         </div>
         
         <div className="border-t pt-6">
           <h3 className="font-bold mb-4">Announcement Bar</h3>
           <div className="space-y-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={localConfig.announcementEnabled || false} onChange={e => setLocalConfig({...localConfig, announcementEnabled: e.target.checked})} /> Enable Announcement Bar</label>
              {localConfig.announcementEnabled && (
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                  <Input label="Message" className="col-span-2" value={localConfig.announcementText || ''} onChange={e => setLocalConfig({...localConfig, announcementText: e.target.value})} />
                  <Input label="Link URL" value={localConfig.announcementLink || ''} onChange={e => setLocalConfig({...localConfig, announcementLink: e.target.value})} />
                  <div className="flex items-end mb-2">
                     <label className="flex items-center gap-2"><input type="checkbox" checked={localConfig.announcementBlink || false} onChange={e => setLocalConfig({...localConfig, announcementBlink: e.target.checked})} /> Blinking Effect</label>
                  </div>
                  <Input label="Background Color" type="color" value={localConfig.announcementBgColor || '#000000'} onChange={e => setLocalConfig({...localConfig, announcementBgColor: e.target.value})} />
                  <Input label="Text Color" type="color" value={localConfig.announcementTextColor || '#FFFFFF'} onChange={e => setLocalConfig({...localConfig, announcementTextColor: e.target.value})} />
                </div>
              )}
           </div>
         </div>
      </div>
    </div>
  );
};

// --- Developer Settings (Advanced) ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);

  useEffect(() => { setLocalConfig(config); }, [config]);

  const handleSave = () => updateConfig(localConfig);

  // Helper to handle slide/image uploads
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'hero' | 'slideshow' | 'vertical', id?: string) => {
    if (!e.target.files?.[0]) return;
    const base64 = await readFile(e.target.files[0]);

    if (field === 'hero') {
      // Toggle between single image or adding to slideshow list depending on mode
      if (localConfig.heroMode === 'slideshow') {
         setLocalConfig(prev => ({ ...prev, heroImages: [...(prev.heroImages || []), base64] }));
      } else {
         setLocalConfig(prev => ({ ...prev, heroImage: base64 }));
      }
    } else if (field === 'slideshow' && id) {
       // Add to specific slideshow
       setLocalConfig(prev => ({
         ...prev,
         secondarySlideshows: prev.secondarySlideshows?.map(s => 
           s.id === id 
             ? { ...s, slides: [...(s.slides || []), { image: base64, title: 'New Slide' }] } 
             : s
         )
       }));
    } else if (field === 'vertical' && id) {
       setLocalConfig(prev => ({
         ...prev,
         verticalCarousels: prev.verticalCarousels?.map(c => 
           c.id === id 
             ? { ...c, slides: [...(c.slides || []), { image: base64, title: 'New Card' }] } 
             : c
         )
       }));
    }
  };

  const addSlideshow = () => {
    const newId = `slideshow_${Date.now()}`;
    setLocalConfig(prev => ({
      ...prev,
      secondarySlideshows: [...(prev.secondarySlideshows || []), { id: newId, title: 'New Slideshow', slides: [] }],
      homepageSections: [...(prev.homepageSections || []), newId]
    }));
  };

  const addVerticalCarousel = () => {
    const newId = `vertical_${Date.now()}`;
    setLocalConfig(prev => ({
      ...prev,
      verticalCarousels: [...(prev.verticalCarousels || []), { id: newId, title: 'New Vertical Carousel', slides: [] }],
      homepageSections: [...(prev.homepageSections || []), newId]
    }));
  };

  const removeSection = (id: string, type: 'slideshow' | 'vertical') => {
     if (type === 'slideshow') {
        setLocalConfig(prev => ({
          ...prev,
          secondarySlideshows: prev.secondarySlideshows?.filter(s => s.id !== id),
          homepageSections: prev.homepageSections?.filter(sid => sid !== id)
        }));
     } else {
        setLocalConfig(prev => ({
          ...prev,
          verticalCarousels: prev.verticalCarousels?.filter(s => s.id !== id),
          homepageSections: prev.homepageSections?.filter(sid => sid !== id)
        }));
     }
  };

  // Helper for Slide Editing
  const updateSlide = (
      parentId: string, 
      slideIndex: number, 
      field: keyof Slide, 
      val: string, 
      type: 'slideshow' | 'vertical'
  ) => {
      if (type === 'slideshow') {
         setLocalConfig(prev => ({
           ...prev,
           secondarySlideshows: prev.secondarySlideshows?.map(s => 
             s.id === parentId 
               ? { ...s, slides: s.slides?.map((slide, i) => i === slideIndex ? { ...slide, [field]: val } : slide) }
               : s
           )
         }));
      } else {
         setLocalConfig(prev => ({
           ...prev,
           verticalCarousels: prev.verticalCarousels?.map(c => 
             c.id === parentId 
               ? { ...c, slides: c.slides.map((slide, i) => i === slideIndex ? { ...slide, [field]: val } : slide) }
               : c
           )
         }));
      }
  };

  return (
    <div className="max-w-5xl pb-20">
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-brand-50 py-4 z-10 border-b border-gray-200">
        <SectionHeader title="Developer & Theme Settings" />
        <Button onClick={handleSave}><Save size={16} className="mr-2"/> Save Config</Button>
      </div>

      <div className="space-y-12">
        {/* Theme Colors */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-serif font-bold mb-6">Theme Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
               <label className="block text-sm font-medium mb-1">Primary (900)</label>
               <div className="flex gap-2">
                 <input type="color" value={localConfig.theme?.primaryColor || '#000000'} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, primaryColor: e.target.value}})} className="h-10 w-10 cursor-pointer border rounded"/>
                 <input type="text" value={localConfig.theme?.primaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, primaryColor: e.target.value}})} className="border p-2 rounded flex-1"/>
               </div>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Secondary (200)</label>
               <div className="flex gap-2">
                 <input type="color" value={localConfig.theme?.secondaryColor || '#000000'} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, secondaryColor: e.target.value}})} className="h-10 w-10 cursor-pointer border rounded"/>
                 <input type="text" value={localConfig.theme?.secondaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, secondaryColor: e.target.value}})} className="border p-2 rounded flex-1"/>
               </div>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Background (50)</label>
               <div className="flex gap-2">
                 <input type="color" value={localConfig.theme?.backgroundColor || '#000000'} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, backgroundColor: e.target.value}})} className="h-10 w-10 cursor-pointer border rounded"/>
                 <input type="text" value={localConfig.theme?.backgroundColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, backgroundColor: e.target.value}})} className="border p-2 rounded flex-1"/>
               </div>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
           <h3 className="text-xl font-serif font-bold mb-6">Hero Section</h3>
           <div className="space-y-6">
              <div className="flex gap-4 mb-4">
                 <label className={`cursor-pointer px-4 py-2 border rounded ${localConfig.heroMode === 'static' ? 'bg-brand-900 text-white' : 'hover:bg-gray-50'}`}>
                    <input type="radio" className="hidden" name="heroMode" checked={localConfig.heroMode === 'static'} onChange={() => setLocalConfig({...localConfig, heroMode: 'static'})} />
                    Static Image
                 </label>
                 <label className={`cursor-pointer px-4 py-2 border rounded ${localConfig.heroMode === 'slideshow' ? 'bg-brand-900 text-white' : 'hover:bg-gray-50'}`}>
                    <input type="radio" className="hidden" name="heroMode" checked={localConfig.heroMode === 'slideshow'} onChange={() => setLocalConfig({...localConfig, heroMode: 'slideshow'})} />
                    Slideshow
                 </label>
              </div>

              {localConfig.heroMode === 'static' ? (
                <div>
                  <p className="text-sm font-bold mb-2">Main Hero Image</p>
                  <div className="relative h-64 bg-gray-100 rounded overflow-hidden group">
                     <img src={localConfig.heroImage} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <label className="cursor-pointer bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-200">
                           Change Image <input type="file" className="hidden" onChange={e => handleUpload(e, 'hero')} />
                        </label>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                   {localConfig.heroImages?.map((img, idx) => (
                     <div key={idx} className="relative aspect-video bg-gray-100 rounded overflow-hidden group">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setLocalConfig(prev => ({...prev, heroImages: prev.heroImages?.filter((_, i) => i !== idx)}))}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={14}/>
                        </button>
                     </div>
                   ))}
                   <label className="aspect-video border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-gray-50">
                      <Plus className="text-gray-400 mb-2"/>
                      <span className="text-sm text-gray-500">Add Slide</span>
                      <input type="file" className="hidden" onChange={e => handleUpload(e, 'hero')} />
                   </label>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                 <Input label="Hero Title" value={localConfig.heroTitle} onChange={e => setLocalConfig({...localConfig, heroTitle: e.target.value})} />
                 <Input label="Hero Tagline" value={localConfig.heroTagline} onChange={e => setLocalConfig({...localConfig, heroTagline: e.target.value})} />
                 <div className="col-span-2">
                   <Input label="Hero Subtitle" value={localConfig.heroSubtitle} onChange={e => setLocalConfig({...localConfig, heroSubtitle: e.target.value})} />
                 </div>
                 <div className="flex gap-4">
                    <div className="w-1/3">
                      <label className="block text-sm font-medium mb-1">Text Color</label>
                      <input type="color" className="w-full h-10 border rounded" value={localConfig.heroTextColor || '#FFFFFF'} onChange={e => setLocalConfig({...localConfig, heroTextColor: e.target.value})} />
                    </div>
                    <div className="w-1/3">
                      <label className="block text-sm font-medium mb-1">Text Align</label>
                      <select className="w-full border p-2 h-10 rounded" value={localConfig.heroTextAlign || 'center'} onChange={e => setLocalConfig({...localConfig, heroTextAlign: e.target.value as any})}>
                         <option value="left">Left</option>
                         <option value="center">Center</option>
                         <option value="right">Right</option>
                      </select>
                    </div>
                     <div className="w-1/3">
                      <label className="block text-sm font-medium mb-1">Font Size</label>
                      <select className="w-full border p-2 h-10 rounded" value={localConfig.heroFontSize || 'md'} onChange={e => setLocalConfig({...localConfig, heroFontSize: e.target.value as any})}>
                         <option value="sm">Small</option>
                         <option value="md">Medium</option>
                         <option value="lg">Large</option>
                      </select>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Dynamic Sections */}
        <div className="space-y-6">
           <div className="flex justify-between items-center">
             <h3 className="text-xl font-serif font-bold">Additional Sections</h3>
             <div className="flex gap-2">
               <Button onClick={addSlideshow} size="sm" variant="outline"><Plus size={14} className="mr-1"/> Add Slideshow</Button>
               <Button onClick={addVerticalCarousel} size="sm" variant="outline"><Plus size={14} className="mr-1"/> Add Vertical Carousel</Button>
             </div>
           </div>

           {/* Render Slideshow Editors */}
           {localConfig.secondarySlideshows?.map((slideshow, idx) => (
             <div key={slideshow.id} className="bg-white p-6 rounded-lg shadow-sm border border-brand-100 relative">
                <button onClick={() => removeSection(slideshow.id, 'slideshow')} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                <div className="mb-4">
                   <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-2">Slideshow Section</h4>
                   <Input label="Section Title (Optional)" value={slideshow.title || ''} onChange={e => setLocalConfig(prev => ({...prev, secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === slideshow.id ? {...s, title: e.target.value} : s)}))} />
                </div>
                
                {/* Slides Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                   {slideshow.slides?.map((slide, sIdx) => (
                     <div key={sIdx} className="border rounded p-3 bg-gray-50 relative group">
                        <img src={slide.image} className="w-full h-32 object-cover rounded mb-2" />
                        <button 
                           onClick={() => setLocalConfig(prev => ({...prev, secondarySlideshows: prev.secondarySlideshows?.map(s => s.id === slideshow.id ? {...s, slides: s.slides?.filter((_, i) => i !== sIdx)} : s)}))}
                           className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                           <X size={12}/>
                        </button>
                        <input className="w-full text-xs border p-1 mb-1 rounded" placeholder="Slide Title" value={slide.title || ''} onChange={e => updateSlide(slideshow.id, sIdx, 'title', e.target.value, 'slideshow')} />
                        <input className="w-full text-xs border p-1 rounded" placeholder="Subtitle" value={slide.subtitle || ''} onChange={e => updateSlide(slideshow.id, sIdx, 'subtitle', e.target.value, 'slideshow')} />
                     </div>
                   ))}
                   <label className="border-2 border-dashed border-brand-200 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-brand-500 transition-colors">
                       <Plus className="text-brand-400 mb-2" size={24}/>
                       <span className="text-sm text-brand-500 font-medium">Add Slide</span>
                       <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'slideshow', slideshow.id)} />
                   </label>
                </div>
             </div>
           ))}

           {/* Render Vertical Carousel Editors */}
           {localConfig.verticalCarousels?.map((carousel, idx) => (
             <div key={carousel.id} className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 relative">
                <button onClick={() => removeSection(carousel.id, 'vertical')} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                <div className="mb-4">
                   <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-2">Vertical Carousel Section</h4>
                   <Input label="Section Title" value={carousel.title || ''} onChange={e => setLocalConfig(prev => ({...prev, verticalCarousels: prev.verticalCarousels?.map(c => c.id === carousel.id ? {...c, title: e.target.value} : c)}))} />
                </div>
                
                {/* Vertical Slides Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                   {carousel.slides.map((slide, sIdx) => (
                     <div key={sIdx} className="border rounded p-3 bg-gray-50 relative group">
                        <div className="aspect-[9/16] bg-gray-200 rounded mb-2 overflow-hidden">
                           <img src={slide.image} className="w-full h-full object-cover" />
                        </div>
                        <button 
                           onClick={() => setLocalConfig(prev => ({...prev, verticalCarousels: prev.verticalCarousels?.map(c => c.id === carousel.id ? {...c, slides: c.slides.filter((_, i) => i !== sIdx)} : c)}))}
                           className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                           <X size={12}/>
                        </button>
                        <input className="w-full text-xs border p-1 mb-1 rounded" placeholder="Card Title" value={slide.title || ''} onChange={e => updateSlide(carousel.id, sIdx, 'title', e.target.value, 'vertical')} />
                        <input className="w-full text-xs border p-1 rounded" placeholder="Subtitle" value={slide.subtitle || ''} onChange={e => updateSlide(carousel.id, sIdx, 'subtitle', e.target.value, 'vertical')} />
                     </div>
                   ))}
                   <label className="border-2 border-dashed border-orange-200 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-orange-500 transition-colors aspect-[9/16]">
                       <Plus className="text-orange-400 mb-2" size={24}/>
                       <span className="text-sm text-orange-500 font-medium text-center">Add Vertical Slide</span>
                       <span className="text-xs text-gray-400 mt-1 text-center">Rec: 1080x1920px</span>
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'vertical', carousel.id)} />
                   </label>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
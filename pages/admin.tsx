import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp, Image as ImageIcon, 
  Upload, Check, AlertTriangle, Search, Eye, RefreshCw, Layers, LayoutTemplate,
  Monitor, Smartphone
} from 'lucide-react';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { Product, Category, Order, Page, User, Slide, SlideshowSection, VerticalCarouselSection, SiteConfig } from '../types';

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
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center text-brand-900">Admin Login</h2>
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

// --- Admin Dashboard ---
export const AdminDashboard: React.FC = () => {
  const { orders, products, users } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const lowStock = products.filter(p => p.stock < 10).length;

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
       <div>
         <p className="text-gray-500 text-sm font-medium">{title}</p>
         <h3 className="text-3xl font-bold text-brand-900 mt-1">{value}</h3>
       </div>
       <div className={`p-3 rounded-full ${color}`}>
         <Icon className="w-6 h-6 text-white" />
       </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <SectionHeader title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={Check} color="bg-green-500" />
        <StatCard title="Pending Orders" value={pendingOrders} icon={RefreshCw} color="bg-amber-500" />
        <StatCard title="Total Products" value={products.length} icon={Layers} color="bg-blue-500" />
        <StatCard title="Low Stock Items" value={lowStock} icon={AlertTriangle} color="bg-rose-500" />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id}>
                  <td className="py-3">#{order.id.slice(-6)}</td>
                  <td className="py-3">{order.customerName}</td>
                  <td className="py-3">{order.date}</td>
                  <td className="py-3">${order.total}</td>
                  <td className="py-3">
                    <Badge color={order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}>
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

// --- Admin Products ---
export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const resetForm = () => { setEditing(null); setIsAdding(false); setFormData({}); };

  const handleSave = async () => {
    if (!formData.name || !formData.price) return alert("Name and Price are required");
    
    const productData = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      stock: Number(formData.stock || 0),
      images: formData.images || [],
      sizes: formData.sizes || [],
      colors: formData.colors || [],
      likes: formData.likes || 0
    } as Product;

    if (editing) {
      await updateProduct({ ...editing, ...productData });
    } else {
      await addProduct(productData);
    }
    resetForm();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), base64] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== index) }));
  };

  if (isAdding || editing) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{editing ? 'Edit Product' : 'Add Product'}</h2>
          <Button variant="outline" onClick={resetForm}><X size={20} /></Button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Input label="Product Name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <div className="space-y-1">
             <label className="text-sm font-medium">Category</label>
             <select 
               className="w-full border p-2 rounded text-sm bg-white"
               value={formData.category || ''}
               onChange={e => setFormData({ ...formData, category: e.target.value })}
             >
               <option value="">Select Category</option>
               {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
             </select>
          </div>
          <Input label="Price" type="number" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
          <Input label="Discount Price" type="number" value={formData.discountPrice || ''} onChange={e => setFormData({ ...formData, discountPrice: Number(e.target.value) })} />
          <Input label="Stock" type="number" value={formData.stock || ''} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} />
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              className="w-full border p-2 rounded text-sm" 
              rows={4}
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div className="col-span-2">
             <label className="block text-sm font-medium mb-2">Images</label>
             <div className="flex flex-wrap gap-4">
               {formData.images?.map((img, idx) => (
                 <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden group">
                   <img src={img} className="w-full h-full object-cover" alt="" />
                   <button onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                     <Trash2 size={16} />
                   </button>
                 </div>
               ))}
               <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                 <Upload size={20} className="text-gray-400" />
                 <span className="text-xs text-gray-500 mt-1">Upload</span>
                 <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
               </label>
             </div>
          </div>

          <div className="col-span-2">
             <label className="block text-sm font-medium mb-2">Options (Comma separated)</label>
             <div className="grid grid-cols-2 gap-4">
               <Input label="Sizes (e.g., S, M, L)" value={formData.sizes?.join(', ') || ''} onChange={e => setFormData({ ...formData, sizes: e.target.value.split(',').map(s => s.trim()) })} />
               <Input label="Colors (e.g., Red, Blue)" value={formData.colors?.join(', ') || ''} onChange={e => setFormData({ ...formData, colors: e.target.value.split(',').map(s => s.trim()) })} />
             </div>
          </div>

          <div className="col-span-2 flex items-center space-x-6">
             <label className="flex items-center space-x-2">
               <input type="checkbox" checked={formData.newArrival || false} onChange={e => setFormData({ ...formData, newArrival: e.target.checked })} />
               <span className="text-sm">New Arrival</span>
             </label>
             <label className="flex items-center space-x-2">
               <input type="checkbox" checked={formData.bestSeller || false} onChange={e => setFormData({ ...formData, bestSeller: e.target.checked })} />
               <span className="text-sm">Best Seller</span>
             </label>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
           <Button variant="outline" onClick={resetForm}>Cancel</Button>
           <Button onClick={handleSave}>Save Product</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <SectionHeader title="Products" />
        <Button onClick={() => setIsAdding(true)}><Plus size={18} className="mr-2" /> Add Product</Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Likes</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center space-x-3">
                  <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">${p.price}</td>
                <td className="p-4">
                  <Badge color={p.stock < 10 ? 'bg-rose-100 text-rose-800' : 'bg-green-100 text-green-800'}>{p.stock}</Badge>
                </td>
                <td className="p-4">{p.likes || 0}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => { setEditing(p); setFormData(p); }} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                  <button onClick={() => { if(confirm('Delete?')) deleteProduct(p.id); }} className="text-rose-600 hover:text-rose-800"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Admin Orders ---
export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div>
      <SectionHeader title="Orders" />
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(o => (
              <tr key={o.id}>
                <td className="p-4">#{o.id.slice(-6)}</td>
                <td className="p-4">
                  <div className="font-medium">{o.customerName}</div>
                  <div className="text-xs text-gray-500">{o.email}</div>
                </td>
                <td className="p-4 text-xs text-gray-600 max-w-xs truncate">
                  {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </td>
                <td className="p-4 font-medium">${o.total}</td>
                <td className="p-4">
                   <select 
                     value={o.status} 
                     onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                     className={`text-xs font-semibold py-1 px-2 rounded border-none focus:ring-0 cursor-pointer ${
                       o.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                       o.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                       o.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                     }`}
                   >
                     <option value="Pending">Pending</option>
                     <option value="Shipped">Shipped</option>
                     <option value="Delivered">Delivered</option>
                     <option value="Cancelled">Cancelled</option>
                   </select>
                </td>
                <td className="p-4 text-xs text-gray-500">{o.date}</td>
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

  const handleAdd = async () => {
    if (!newCat.name) return;
    await addCategory({ id: '', ...newCat }); // ID generated by backend
    setNewCat({ name: '', image: '' });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setNewCat({ ...newCat, image: base64 });
    }
  };

  return (
    <div>
      <SectionHeader title="Categories" />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
           <div className="grid grid-cols-2 gap-4">
             {categories.map(c => (
               <div key={c.id} className="bg-white rounded-lg shadow-sm border p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {c.image && <img src={c.image} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{c.name}</h3>
                  </div>
                  <button onClick={() => deleteCategory(c.id)} className="text-gray-400 hover:text-rose-600"><Trash2 size={18} /></button>
               </div>
             ))}
           </div>
        </div>
        <div>
           <div className="bg-white p-6 rounded-lg shadow-sm border">
             <h3 className="font-bold mb-4">Add Category</h3>
             <div className="space-y-4">
               <Input label="Name" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} />
               <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  {newCat.image ? (
                    <div className="relative mb-2 h-32 rounded overflow-hidden">
                       <img src={newCat.image} className="w-full h-full object-cover" alt="" />
                       <button onClick={() => setNewCat({ ...newCat, image: '' })} className="absolute top-2 right-2 bg-white rounded-full p-1"><X size={14}/></button>
                    </div>
                  ) : (
                    <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" accept="image/*" onChange={handleUpload} />
                  )}
               </div>
               <Button className="w-full" onClick={handleAdd}>Add Category</Button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin Pages ---
export const AdminPages: React.FC = () => {
  const { pages, addPage, updatePage, deletePage } = useStore();
  const [editing, setEditing] = useState<Page | null>(null);
  const [formData, setFormData] = useState<Partial<Page>>({});

  const handleSave = async () => {
     if(!formData.title || !formData.content) return alert("Title and Content required");
     
     const slug = formData.slug || formData.title.toLowerCase().replace(/ /g, '-');
     const pageData = { 
       ...formData, 
       slug, 
       showInNav: formData.showInNav || false, 
       showInFooter: formData.showInFooter || false,
       textColor: formData.textColor,
       textAlign: formData.textAlign || 'left',
       fontSize: formData.fontSize || 'md'
     } as Page;

     if (editing) {
       await updatePage({ ...editing, ...pageData });
     } else {
       await addPage({ id: '', ...pageData } as Page);
     }
     setEditing(null);
     setFormData({});
  };

  const handleEdit = (p: Page) => { setEditing(p); setFormData(p); };

  return (
    <div>
      <SectionHeader title="Custom Pages" />
      <div className="grid md:grid-cols-2 gap-8">
         <div className="space-y-4">
            {pages.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                 <div>
                   <h3 className="font-bold">{p.title}</h3>
                   <span className="text-xs text-gray-500">/{p.slug}</span>
                 </div>
                 <div className="flex space-x-2">
                    <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                    <button onClick={() => { if(confirm("Delete?")) deletePage(p.id); }} className="p-2 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16}/></button>
                 </div>
              </div>
            ))}
         </div>

         <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold mb-4">{editing ? 'Edit Page' : 'Create Page'}</h3>
            <div className="space-y-4">
              <Input label="Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
              <Input label="Slug (Optional)" placeholder="auto-generated" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Text Align</label>
                    <select className="w-full border p-2 text-sm rounded" value={formData.textAlign || 'left'} onChange={e => setFormData({...formData, textAlign: e.target.value as any})}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Font Size</label>
                    <select className="w-full border p-2 text-sm rounded" value={formData.fontSize || 'md'} onChange={e => setFormData({...formData, fontSize: e.target.value as any})}>
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content (HTML allowed)</label>
                <textarea className="w-full border p-2 text-sm h-48 rounded" value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})}></textarea>
              </div>

              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={formData.showInNav || false} onChange={e => setFormData({...formData, showInNav: e.target.checked})} /> <span>Show in Navbar</span></label>
                <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={formData.showInFooter || false} onChange={e => setFormData({...formData, showInFooter: e.target.checked})} /> <span>Show in Footer</span></label>
              </div>

              <div className="flex space-x-2 pt-2">
                 {editing && <Button variant="outline" onClick={() => { setEditing(null); setFormData({}); }} className="flex-1">Cancel</Button>}
                 <Button onClick={handleSave} className="flex-1">{editing ? 'Update' : 'Create'}</Button>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- Admin Users ---
export const AdminUsers: React.FC = () => {
  const { users, addUser, deleteUser, changeUserPassword } = useStore();
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });

  const handleAdd = async () => {
    if (!newUser.username || !newUser.password) return;
    await addUser(newUser);
    setNewUser({ username: '', password: '', role: 'staff' });
  };

  const handleChangePassword = async (id: string) => {
    const pass = prompt("Enter new password:");
    if (pass) await changeUserPassword(id, pass);
  };

  return (
    <div>
      <SectionHeader title="User Management" />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
           {users.map(u => (
             <div key={u.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                <div>
                   <h4 className="font-bold">{u.username}</h4>
                   <span className="text-xs uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-600">{u.role}</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleChangePassword(u.id)}>Reset Pwd</Button>
                  {u.username !== 'admin' && (
                    <Button size="sm" variant="danger" onClick={() => { if(confirm('Delete user?')) deleteUser(u.id); }}>Delete</Button>
                  )}
                </div>
             </div>
           ))}
        </div>
        <div>
           <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-bold mb-4">Add User</h3>
              <div className="space-y-4">
                 <Input label="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
                 <Input label="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                 <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select className="w-full border p-2 rounded" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                       <option value="staff">Staff</option>
                       <option value="admin">Admin</option>
                    </select>
                 </div>
                 <Button className="w-full" onClick={handleAdd}>Create User</Button>
              </div>
           </div>
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
        <Button variant="outline" onClick={fetchLogs}><RefreshCw size={16} className="mr-2" /> Refresh</Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
         <table className="w-full text-left text-sm">
           <thead className="bg-gray-50 border-b">
             <tr>
               <th className="p-3">Time</th>
               <th className="p-3">IP Address</th>
               <th className="p-3">Hostname</th>
               <th className="p-3">User Agent</th>
             </tr>
           </thead>
           <tbody className="divide-y">
             {logs.map(log => (
               <tr key={log.id}>
                 <td className="p-3 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                 <td className="p-3 font-mono text-xs">{log.ip}</td>
                 <td className="p-3 text-xs">{log.hostname || '-'}</td>
                 <td className="p-3 text-xs text-gray-500 max-w-xs truncate" title={log.userAgent}>{log.userAgent}</td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
};

// --- Admin Settings (General) ---
export const AdminSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);

  useEffect(() => { setLocalConfig(config); }, [config]);

  const handleSave = () => {
    updateConfig(localConfig);
    alert("Settings Saved!");
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const sections = [...(localConfig.homepageSections || [])];
    if (direction === 'up' && index > 0) {
      [sections[index], sections[index-1]] = [sections[index-1], sections[index]];
    } else if (direction === 'down' && index < sections.length - 1) {
      [sections[index], sections[index+1]] = [sections[index+1], sections[index]];
    }
    setLocalConfig({ ...localConfig, homepageSections: sections });
  };

  const toggleSection = (id: string) => {
    const current = localConfig.homepageSections || [];
    if (current.includes(id)) {
       setLocalConfig({ ...localConfig, homepageSections: current.filter(s => s !== id) });
    } else {
       setLocalConfig({ ...localConfig, homepageSections: [...current, id] });
    }
  };

  // Available Sections (Static + Dynamic)
  const availableSections = [
    { id: 'hero', name: 'Hero Banner' },
    { id: 'categories', name: 'Category Grid' },
    { id: 'featured', name: 'Featured Products' },
    { id: 'promo', name: 'Promo Banner' },
    { id: 'trust', name: 'Trust Badges' },
    ...(localConfig.secondarySlideshows?.map(s => ({ id: s.id, name: `Slideshow: ${s.title || s.id}` })) || []),
    ...(localConfig.verticalCarousels?.map(s => ({ id: s.id, name: `Vertical: ${s.title || s.id}` })) || [])
  ];

  return (
     <div className="max-w-4xl space-y-8">
        <div className="flex justify-between items-center">
          <SectionHeader title="Content & Settings" />
          <Button onClick={handleSave}><Save size={18} className="mr-2"/> Save Changes</Button>
        </div>

        {/* Homepage Layout */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
           <h3 className="font-bold mb-4 flex items-center"><LayoutTemplate size={18} className="mr-2"/> Homepage Layout</h3>
           <p className="text-sm text-gray-500 mb-4">Enable and reorder sections for your homepage.</p>
           
           <div className="space-y-2">
             {localConfig.homepageSections?.map((sectionId, idx) => {
                const name = availableSections.find(s => s.id === sectionId)?.name || sectionId;
                return (
                  <div key={sectionId} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                     <span className="font-medium">{name}</span>
                     <div className="flex items-center space-x-2">
                        <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ChevronUp size={16}/></button>
                        <button onClick={() => moveSection(idx, 'down')} disabled={idx === (localConfig.homepageSections?.length || 0) - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ChevronDown size={16}/></button>
                        <button onClick={() => toggleSection(sectionId)} className="p-1 text-rose-500 hover:bg-rose-50 rounded"><X size={16}/></button>
                     </div>
                  </div>
                );
             })}
           </div>

           <div className="mt-6 pt-6 border-t">
              <label className="text-sm font-bold mb-2 block">Available Sections</label>
              <div className="flex flex-wrap gap-2">
                 {availableSections.filter(s => !localConfig.homepageSections?.includes(s.id)).map(s => (
                    <button key={s.id} onClick={() => toggleSection(s.id)} className="px-3 py-1 bg-white border border-dashed border-gray-300 rounded-full text-sm hover:border-brand-900 hover:text-brand-900 transition flex items-center">
                       <Plus size={14} className="mr-1"/> {s.name}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Brand Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border grid md:grid-cols-2 gap-6">
           <h3 className="col-span-2 font-bold border-b pb-2">Brand Information</h3>
           <Input label="Site Name" value={localConfig.siteName || ''} onChange={e => setLocalConfig({...localConfig, siteName: e.target.value})} />
           <Input label="Currency Symbol" value={localConfig.currency || ''} onChange={e => setLocalConfig({...localConfig, currency: e.target.value})} />
           <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">About Text (Footer)</label>
              <textarea className="w-full border p-2 rounded text-sm" rows={3} value={localConfig.aboutContent || ''} onChange={e => setLocalConfig({...localConfig, aboutContent: e.target.value})} />
           </div>
        </div>
        
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border grid md:grid-cols-2 gap-6">
           <h3 className="col-span-2 font-bold border-b pb-2">Contact Details</h3>
           <Input label="Email" value={localConfig.contactEmail || ''} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} />
           <Input label="Phone" value={localConfig.contactPhone || ''} onChange={e => setLocalConfig({...localConfig, contactPhone: e.target.value})} />
           <Input label="Address" className="col-span-2" value={localConfig.contactAddress || ''} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} />
        </div>

        {/* Announcement Bar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
           <h3 className="font-bold border-b pb-2">Announcement Bar</h3>
           <label className="flex items-center space-x-2">
              <input type="checkbox" checked={localConfig.announcementEnabled || false} onChange={e => setLocalConfig({...localConfig, announcementEnabled: e.target.checked})} />
              <span className="font-medium">Enable Announcement Bar</span>
           </label>
           {localConfig.announcementEnabled && (
             <div className="grid md:grid-cols-2 gap-4 pl-6 border-l-2 border-brand-100">
                <Input label="Text" value={localConfig.announcementText || ''} onChange={e => setLocalConfig({...localConfig, announcementText: e.target.value})} />
                <Input label="Link (Optional)" value={localConfig.announcementLink || ''} onChange={e => setLocalConfig({...localConfig, announcementLink: e.target.value})} />
                <div className="flex items-center space-x-4">
                   <div>
                     <label className="text-xs block mb-1">Bg Color</label>
                     <input type="color" value={localConfig.announcementBgColor || '#000000'} onChange={e => setLocalConfig({...localConfig, announcementBgColor: e.target.value})} />
                   </div>
                   <div>
                     <label className="text-xs block mb-1">Text Color</label>
                     <input type="color" value={localConfig.announcementTextColor || '#FFFFFF'} onChange={e => setLocalConfig({...localConfig, announcementTextColor: e.target.value})} />
                   </div>
                   <label className="flex items-center space-x-2 mt-4">
                      <input type="checkbox" checked={localConfig.announcementBlink || false} onChange={e => setLocalConfig({...localConfig, announcementBlink: e.target.checked})} />
                      <span className="text-sm">Blink Effect</span>
                   </label>
                </div>
             </div>
           )}
        </div>
     </div>
  );
};

// --- Admin Developer Settings (Advanced) ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [activeTab, setActiveTab] = useState<'theme' | 'hero' | 'slideshows' | 'vertical'>('theme');

  useEffect(() => { setLocalConfig(config); }, [config]);

  const handleSave = () => {
    updateConfig(localConfig);
    alert("Configuration Saved!");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'vertical' | 'slideshow', id?: string) => {
     if (e.target.files?.[0]) {
        const base64 = await fileToBase64(e.target.files[0]);
        
        if (type === 'hero') {
           // Add to heroImages array
           setLocalConfig(prev => ({
              ...prev,
              heroImages: [...(prev.heroImages || []), base64]
           }));
        } else if (type === 'vertical' && id) {
           // Add to specific vertical carousel
           setLocalConfig(prev => ({
              ...prev,
              verticalCarousels: prev.verticalCarousels?.map(vc => 
                 vc.id === id ? { ...vc, slides: [...vc.slides, { image: base64, title: '', subtitle: '' }] } : vc
              )
           }));
        } else if (type === 'slideshow' && id) {
           // Add to secondary slideshow
           setLocalConfig(prev => ({
              ...prev,
              secondarySlideshows: prev.secondarySlideshows?.map(ss => 
                 ss.id === id ? { ...ss, slides: [...(ss.slides || []), { image: base64, title: '', subtitle: '' }] } : ss
              )
           }));
        }
     }
  };

  // Helper to add new sections
  const addSecondarySlideshow = () => {
     const newId = `slideshow_${Date.now()}`;
     setLocalConfig(prev => ({
        ...prev,
        secondarySlideshows: [...(prev.secondarySlideshows || []), { id: newId, title: 'New Slideshow', slides: [] }]
     }));
  };

  const addVerticalCarousel = () => {
     const newId = `vertical_${Date.now()}`;
     setLocalConfig(prev => ({
        ...prev,
        verticalCarousels: [...(prev.verticalCarousels || []), { id: newId, title: 'New Vertical Reel', slides: [] }]
     }));
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex justify-between items-center">
         <SectionHeader title="Developer Settings" subtitle="Advanced layout and theme configuration" />
         <Button onClick={handleSave}><Save size={18} className="mr-2"/> Save Config</Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b">
         {[
            { id: 'theme', icon: Monitor, label: 'Theme & Colors' },
            { id: 'hero', icon: LayoutTemplate, label: 'Hero Section' },
            { id: 'slideshows', icon: ImageIcon, label: 'Slideshows' },
            { id: 'vertical', icon: Smartphone, label: 'Vertical Reels' },
         ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors ${activeTab === tab.id ? 'border-brand-900 text-brand-900' : 'border-transparent text-gray-500 hover:text-brand-800'}`}
            >
               <tab.icon size={16}/> <span>{tab.label}</span>
            </button>
         ))}
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border min-h-[400px]">
         
         {/* THEME TAB */}
         {activeTab === 'theme' && (
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h3 className="font-bold border-b pb-2">Color Palette</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs text-gray-500 block mb-1">Primary (Brand 900)</label>
                        <div className="flex items-center space-x-2">
                           <input type="color" className="h-8 w-8 rounded cursor-pointer" value={localConfig.theme?.primaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, primaryColor: e.target.value}})} />
                           <span className="text-sm font-mono">{localConfig.theme?.primaryColor}</span>
                        </div>
                     </div>
                     <div>
                        <label className="text-xs text-gray-500 block mb-1">Secondary (Accents)</label>
                        <div className="flex items-center space-x-2">
                           <input type="color" className="h-8 w-8 rounded cursor-pointer" value={localConfig.theme?.secondaryColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, secondaryColor: e.target.value}})} />
                           <span className="text-sm font-mono">{localConfig.theme?.secondaryColor}</span>
                        </div>
                     </div>
                     <div>
                        <label className="text-xs text-gray-500 block mb-1">Background (Page)</label>
                        <div className="flex items-center space-x-2">
                           <input type="color" className="h-8 w-8 rounded cursor-pointer" value={localConfig.theme?.backgroundColor} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, backgroundColor: e.target.value}})} />
                           <span className="text-sm font-mono">{localConfig.theme?.backgroundColor}</span>
                        </div>
                     </div>
                     <div>
                        <label className="text-xs text-gray-500 block mb-1">Footer Background</label>
                        <div className="flex items-center space-x-2">
                           <input type="color" className="h-8 w-8 rounded cursor-pointer" value={localConfig.footerBgColor} onChange={e => setLocalConfig({...localConfig, footerBgColor: e.target.value})} />
                           <span className="text-sm font-mono">{localConfig.footerBgColor}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="font-bold border-b pb-2">Typography & Shape</h3>
                  <div className="space-y-3">
                     <Input label="Sans Font Family" value={localConfig.theme?.fontFamilySans} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, fontFamilySans: e.target.value}})} />
                     <Input label="Serif Font Family" value={localConfig.theme?.fontFamilySerif} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, fontFamilySerif: e.target.value}})} />
                     <div>
                        <label className="text-sm font-medium mb-1 block">Border Radius</label>
                        <select className="w-full border p-2 rounded" value={localConfig.theme?.borderRadius} onChange={e => setLocalConfig({...localConfig, theme: {...localConfig.theme!, borderRadius: e.target.value}})}>
                           <option value="0px">None (0px)</option>
                           <option value="4px">Small (4px)</option>
                           <option value="8px">Medium (8px)</option>
                           <option value="12px">Large (12px)</option>
                           <option value="99px">Pill (99px)</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* HERO TAB */}
         {activeTab === 'hero' && (
            <div className="space-y-6">
               <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                     <input type="radio" name="heroMode" checked={localConfig.heroMode === 'static'} onChange={() => setLocalConfig({...localConfig, heroMode: 'static'})} />
                     <span className="font-medium">Static Image/Video</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                     <input type="radio" name="heroMode" checked={localConfig.heroMode === 'slideshow'} onChange={() => setLocalConfig({...localConfig, heroMode: 'slideshow'})} />
                     <span className="font-medium">Slideshow</span>
                  </label>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <Input label="Hero Title" value={localConfig.heroTitle} onChange={e => setLocalConfig({...localConfig, heroTitle: e.target.value})} />
                     <Input label="Hero Subtitle" value={localConfig.heroSubtitle} onChange={e => setLocalConfig({...localConfig, heroSubtitle: e.target.value})} />
                     <Input label="Tagline (Small Text)" value={localConfig.heroTagline} onChange={e => setLocalConfig({...localConfig, heroTagline: e.target.value})} />
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs mb-1">Text Color</label>
                           <input type="color" value={localConfig.heroTextColor || '#FFFFFF'} onChange={e => setLocalConfig({...localConfig, heroTextColor: e.target.value})} />
                        </div>
                        <div>
                           <label className="block text-xs mb-1">Text Align</label>
                           <select className="border p-1 rounded text-sm w-full" value={localConfig.heroTextAlign || 'center'} onChange={e => setLocalConfig({...localConfig, heroTextAlign: e.target.value as any})}>
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  <div>
                     {localConfig.heroMode === 'static' ? (
                        <div className="space-y-4">
                           <label className="block text-sm font-medium">Main Image</label>
                           {localConfig.heroImage ? (
                              <div className="relative aspect-video rounded overflow-hidden group">
                                 <img src={localConfig.heroImage} className="w-full h-full object-cover" alt="" />
                                 <button onClick={() => setLocalConfig({...localConfig, heroImage: ''})} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"><X size={16}/></button>
                              </div>
                           ) : (
                              <input type="file" onChange={async (e) => { if(e.target.files?.[0]) setLocalConfig({...localConfig, heroImage: await fileToBase64(e.target.files[0])}) }} />
                           )}
                           <Input label="Or Video URL (Optional)" placeholder="https://..." value={localConfig.heroVideo || ''} onChange={e => setLocalConfig({...localConfig, heroVideo: e.target.value})} />
                        </div>
                     ) : (
                        <div className="space-y-4">
                           <label className="block text-sm font-medium">Slideshow Images</label>
                           <div className="grid grid-cols-3 gap-2">
                              {localConfig.heroImages?.map((img, idx) => (
                                 <div key={idx} className="relative aspect-square rounded overflow-hidden">
                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                    <button onClick={() => setLocalConfig(prev => ({...prev, heroImages: prev.heroImages?.filter((_, i) => i !== idx)}))} className="absolute top-1 right-1 bg-white/80 rounded-full p-1"><X size={12}/></button>
                                 </div>
                              ))}
                              <label className="border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 aspect-square">
                                 <Plus className="text-gray-400" />
                                 <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'hero')} />
                              </label>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}

         {/* SLIDESHOWS TAB */}
         {activeTab === 'slideshows' && (
            <div className="space-y-8">
               {localConfig.secondarySlideshows?.map((ss, idx) => (
                  <div key={ss.id} className="border p-4 rounded-lg bg-gray-50">
                     <div className="flex justify-between mb-4">
                        <div className="flex items-center space-x-2">
                           <Badge>{ss.id}</Badge>
                           <Input className="h-8 py-1" value={ss.title || ''} onChange={e => {
                              const updated = [...(localConfig.secondarySlideshows || [])];
                              updated[idx] = { ...ss, title: e.target.value };
                              setLocalConfig({...localConfig, secondarySlideshows: updated});
                           }} placeholder="Slideshow Title" />
                        </div>
                        <Button size="sm" variant="danger" onClick={() => setLocalConfig({...localConfig, secondarySlideshows: localConfig.secondarySlideshows?.filter(s => s.id !== ss.id)})}>Remove</Button>
                     </div>
                     
                     {/* Slide List */}
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ss.slides?.map((slide, sIdx) => (
                           <div key={sIdx} className="relative group border rounded overflow-hidden">
                              <img src={slide.image} className="w-full h-32 object-cover" alt="" />
                              <button onClick={() => {
                                 const updated = [...(localConfig.secondarySlideshows || [])];
                                 updated[idx].slides = ss.slides?.filter((_, i) => i !== sIdx) || [];
                                 setLocalConfig({...localConfig, secondarySlideshows: updated});
                              }} className="absolute top-1 right-1 bg-white p-1 rounded-full"><X size={12}/></button>
                              
                              <div className="p-2 bg-white text-xs space-y-1">
                                 <input className="w-full border p-1" placeholder="Title" value={slide.title || ''} onChange={e => {
                                    const updated = [...(localConfig.secondarySlideshows || [])];
                                    updated[idx].slides![sIdx].title = e.target.value;
                                    setLocalConfig({...localConfig, secondarySlideshows: updated});
                                 }} />
                                 <input className="w-full border p-1" placeholder="Subtitle" value={slide.subtitle || ''} onChange={e => {
                                    const updated = [...(localConfig.secondarySlideshows || [])];
                                    updated[idx].slides![sIdx].subtitle = e.target.value;
                                    setLocalConfig({...localConfig, secondarySlideshows: updated});
                                 }} />
                              </div>
                           </div>
                        ))}
                        <label className="border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-white h-full min-h-[140px]">
                           <Plus className="text-gray-400 mb-1" />
                           <span className="text-xs text-gray-500">Add Slide</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'slideshow', ss.id)} />
                        </label>
                     </div>
                  </div>
               ))}
               <Button variant="outline" onClick={addSecondarySlideshow} className="w-full"><Plus size={16} className="mr-2"/> Create New Slideshow Section</Button>
            </div>
         )}

         {/* VERTICAL TAB */}
         {activeTab === 'vertical' && (
            <div className="space-y-8">
               {localConfig.verticalCarousels?.map((carousel, idx) => (
                  <div key={carousel.id} className="border p-4 rounded-lg bg-gray-50">
                     <div className="flex justify-between mb-4">
                        <Input value={carousel.title || ''} onChange={e => {
                           const updated = [...(localConfig.verticalCarousels || [])];
                           updated[idx].title = e.target.value;
                           setLocalConfig({...localConfig, verticalCarousels: updated});
                        }} placeholder="Carousel Title (e.g., Trending on TikTok)" />
                        <Button size="sm" variant="danger" onClick={() => setLocalConfig({...localConfig, verticalCarousels: localConfig.verticalCarousels?.filter(c => c.id !== carousel.id)})}>Delete Reel</Button>
                     </div>
                     
                     <div className="flex overflow-x-auto space-x-4 pb-4">
                        {carousel.slides.map((slide, sIdx) => (
                           <div key={sIdx} className="w-32 flex-shrink-0 relative group">
                              <div className="aspect-[9/16] rounded-lg overflow-hidden bg-gray-200 mb-2 relative">
                                 <img src={slide.image} className="w-full h-full object-cover" alt="" />
                                 <button onClick={() => {
                                    const updated = [...(localConfig.verticalCarousels || [])];
                                    updated[idx].slides = carousel.slides.filter((_, i) => i !== sIdx);
                                    setLocalConfig({...localConfig, verticalCarousels: updated});
                                 }} className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500"><X size={12}/></button>
                              </div>
                              <input className="w-full text-xs border p-1 rounded mb-1" placeholder="Title" value={slide.title || ''} onChange={e => {
                                    const updated = [...(localConfig.verticalCarousels || [])];
                                    updated[idx].slides[sIdx].title = e.target.value;
                                    setLocalConfig({...localConfig, verticalCarousels: updated});
                              }} />
                           </div>
                        ))}
                        <label className="border-2 border-dashed border-orange-200 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-orange-500 transition-colors aspect-[9/16] min-w-[128px]">
                           <Plus className="text-orange-400 mb-2" size={24}/>
                           <span className="text-sm text-orange-500 font-medium text-center">Add Vertical Slide</span>
                           <span className="text-xs text-gray-400 mt-1 text-center">Rec: 1080x1920px</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'vertical', carousel.id)} />
                        </label>
                     </div>
                  </div>
               ))}
               <Button variant="outline" onClick={addVerticalCarousel} className="w-full"><Plus size={16} className="mr-2"/> Create New Vertical Carousel</Button>
            </div>
         )}
      </div>
    </div>
  );
};

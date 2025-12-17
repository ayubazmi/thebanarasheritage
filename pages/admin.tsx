import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Edit, Save, X, Eye, 
  LayoutDashboard, Package, ShoppingCart, List, Users, FileText, Settings, Code2, File,
  AlertCircle, Check, ChevronUp, ChevronDown
} from 'lucide-react';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { Product, Category, Order, User, Page, SiteConfig, Slide, VerticalCarouselSection, SlideshowSection, ThemeConfig } from '../types';

// Helper for image upload
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/admin');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-serif font-bold text-center mb-6">Admin Login</h2>
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
  const { orders, products, users } = useStore();
  
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-brand-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-brand-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Sales" value={`$${totalSales.toLocaleString()}`} icon={ShoppingCart} color="bg-emerald-500" />
        <StatCard title="Total Orders" value={orders.length} icon={FileText} color="bg-blue-500" />
        <StatCard title="Pending Orders" value={pendingOrders} icon={AlertCircle} color="bg-amber-500" />
        <StatCard title="Total Products" value={products.length} icon={Package} color="bg-purple-500" />
      </div>
    </div>
  );
};

// --- Products ---
export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const initialForm: Product = {
    id: '', name: '', description: '', price: 0, category: '', images: [], sizes: [], colors: [], newArrival: false, bestSeller: false, stock: 0
  };
  const [form, setForm] = useState<Product>(initialForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await updateProduct(form);
    else await addProduct(form);
    setIsModalOpen(false);
    setForm(initialForm);
    setEditing(null);
  };

  const handleEdit = (p: Product) => {
    setEditing(p);
    setForm(p);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setForm(prev => ({ ...prev, images: [...prev.images, base64] }));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => { setEditing(null); setForm(initialForm); setIsModalOpen(true); }}>
          <Plus size={18} className="mr-2" /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Likes</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">${p.price}</td>
                <td className="p-4"><Badge>{p.category}</Badge></td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">{p.likes || 0}</td>
                <td className="p-4 flex space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                  <button onClick={() => deleteProduct(p.id)} className="text-rose-600 hover:text-rose-800"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price" type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} required />
                <Input label="Discount Price" type="number" value={form.discountPrice || ''} onChange={e => setForm({...form, discountPrice: Number(e.target.value)})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} required />
                <div>
                   <label className="block text-sm font-medium mb-1">Category</label>
                   <select className="w-full border p-2 rounded" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                     <option value="">Select...</option>
                     {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                   </select>
                </div>
              </div>
              <Input label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              
              <div>
                <label className="block text-sm font-medium mb-1">Sizes (comma separated)</label>
                <Input value={form.sizes.join(', ')} onChange={e => setForm({...form, sizes: e.target.value.split(',').map(s => s.trim())})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Colors (comma separated)</label>
                <Input value={form.colors.join(', ')} onChange={e => setForm({...form, colors: e.target.value.split(',').map(s => s.trim())})} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16">
                      <img src={img} className="w-full h-full object-cover rounded" />
                      <button type="button" onClick={() => setForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== idx)}))} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5"><X size={12}/></button>
                    </div>
                  ))}
                  <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-500">
                    <Plus className="text-gray-400" />
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <label className="flex items-center space-x-2"><input type="checkbox" checked={form.newArrival} onChange={e => setForm({...form, newArrival: e.target.checked})} /> <span>New Arrival</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" checked={form.bestSeller} onChange={e => setForm({...form, bestSeller: e.target.checked})} /> <span>Best Seller</span></label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Orders ---
export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Orders</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b">
                <td className="p-4 text-sm text-gray-500">#{order.id.slice(-6)}</td>
                <td className="p-4">
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-xs text-gray-500">{order.email}</div>
                </td>
                <td className="p-4 text-sm">{order.date}</td>
                <td className="p-4 font-bold">${order.total}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{order.status}</span>
                </td>
                <td className="p-4">
                  <select 
                    className="border text-sm rounded p-1"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
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
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) return;
    await addCategory({ id: '', name, image });
    setName('');
    setImage('');
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(await fileToBase64(e.target.files[0]));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Categories</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h3 className="font-bold mb-4">Add Category</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" value={name} onChange={e => setName(e.target.value)} />
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <input type="file" onChange={handleImage} className="text-sm" />
              {image && <img src={image} className="mt-2 h-20 w-20 object-cover rounded" />}
            </div>
            <Button className="w-full">Create Category</Button>
          </form>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {categories.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={c.image} className="w-12 h-12 rounded object-cover" />
                <span className="font-medium">{c.name}</span>
              </div>
              <button onClick={() => deleteCategory(c.id)} className="text-gray-400 hover:text-rose-500"><Trash2 size={18} /></button>
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
  const [form, setForm] = useState({ username: '', password: '', role: 'staff' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addUser({ ...form, permissions: [] } as any);
    setForm({ username: '', password: '', role: 'staff' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">User Management</h1>
      <div className="grid md:grid-cols-3 gap-8">
         <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h3 className="font-bold mb-4">Add User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
              <Input label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select className="w-full border p-2 rounded" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Button className="w-full">Create User</Button>
            </form>
         </div>
         <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                     <tr><th className="p-4">Username</th><th className="p-4">Role</th><th className="p-4">Action</th></tr>
                  </thead>
                  <tbody>
                     {users.map(u => (
                        <tr key={u.id} className="border-b">
                           <td className="p-4">{u.username}</td>
                           <td className="p-4"><Badge>{u.role}</Badge></td>
                           <td className="p-4">
                              {u.username !== 'admin' && (
                                <button onClick={() => deleteUser(u.id)} className="text-rose-500"><Trash2 size={18}/></button>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- Access Logs ---
export const AdminLogs: React.FC = () => {
  const { logs, fetchLogs } = useStore();

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div>
       <div className="flex justify-between items-center mb-8">
         <h1 className="text-2xl font-bold">Access Logs</h1>
         <Button onClick={() => fetchLogs()} variant="outline" size="sm">Refresh</Button>
       </div>
       <div className="bg-white rounded-lg shadow overflow-hidden">
         <table className="w-full text-left text-sm">
           <thead className="bg-gray-50 border-b">
             <tr>
               <th className="p-3">Time</th>
               <th className="p-3">Hostname</th>
               <th className="p-3">IP</th>
               <th className="p-3">User Agent</th>
             </tr>
           </thead>
           <tbody>
             {logs.map(log => (
               <tr key={log.id} className="border-b font-mono text-xs">
                 <td className="p-3 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                 <td className="p-3 font-semibold text-brand-900">{log.hostname || '-'}</td>
                 <td className="p-3">{log.ip}</td>
                 <td className="p-3 truncate max-w-xs" title={log.userAgent}>{log.userAgent}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};

// --- Custom Pages ---
export const AdminPages: React.FC = () => {
  const { pages, addPage, updatePage, deletePage } = useStore();
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState<Page>({ 
    id: '', title: '', slug: '', content: '', showInNav: true, showInFooter: false, 
    textColor: '#000000', textAlign: 'left', fontSize: 'md' 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await updatePage(form);
    else await addPage(form);
    setIsModalOpen(false);
    setForm({ id: '', title: '', slug: '', content: '', showInNav: true, showInFooter: false, textColor: '#000000', textAlign: 'left', fontSize: 'md' });
    setEditing(null);
  };

  const handleEdit = (p: Page) => {
    setEditing(p);
    setForm(p);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Custom Pages</h1>
        <Button onClick={() => setIsModalOpen(true)}><Plus size={18} className="mr-2"/> Add Page</Button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
             <tr><th className="p-4">Title</th><th className="p-4">Slug</th><th className="p-4">Nav?</th><th className="p-4">Footer?</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
             {pages.map(p => (
               <tr key={p.id} className="border-b">
                 <td className="p-4 font-medium">{p.title}</td>
                 <td className="p-4 text-gray-500">/{p.slug}</td>
                 <td className="p-4">{p.showInNav ? <Check className="text-green-500" size={16}/> : '-'}</td>
                 <td className="p-4">{p.showInFooter ? <Check className="text-green-500" size={16}/> : '-'}</td>
                 <td className="p-4 flex space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600"><Edit size={18}/></button>
                    <button onClick={() => deletePage(p.id)} className="text-rose-600"><Trash2 size={18}/></button>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
             <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Page' : 'New Page'}</h2>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <Input label="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                 <Input label="Slug (e.g., 'returns')" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required />
               </div>
               
               <div>
                  <label className="block text-sm font-medium mb-1">Content (HTML Supported)</label>
                  <textarea 
                    className="w-full h-64 border rounded p-2 font-mono text-sm" 
                    value={form.content} 
                    onChange={e => setForm({...form, content: e.target.value})} 
                  />
                  <p className="text-xs text-gray-400 mt-1">Use HTML tags for formatting like &lt;h2&gt;, &lt;p&gt;, &lt;b&gt;, etc.</p>
               </div>
               
               <div className="grid grid-cols-3 gap-4 border-t pt-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Text Color</label>
                    <div className="flex items-center space-x-2">
                       <input type="color" value={form.textColor || '#000000'} onChange={e => setForm({...form, textColor: e.target.value})} className="h-8 w-8 cursor-pointer rounded border"/>
                       <input type="text" value={form.textColor || '#000000'} onChange={e => setForm({...form, textColor: e.target.value})} className="border rounded px-2 py-1 text-sm w-24"/>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Text Align</label>
                    <select value={form.textAlign} onChange={e => setForm({...form, textAlign: e.target.value as any})} className="border rounded p-1 w-full text-sm">
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Font Size</label>
                    <select value={form.fontSize} onChange={e => setForm({...form, fontSize: e.target.value as any})} className="border rounded p-1 w-full text-sm">
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                    </select>
                 </div>
               </div>

               <div className="flex space-x-6 pt-2">
                 <label className="flex items-center space-x-2"><input type="checkbox" checked={form.showInNav} onChange={e => setForm({...form, showInNav: e.target.checked})} /> <span>Show in Navigation</span></label>
                 <label className="flex items-center space-x-2"><input type="checkbox" checked={form.showInFooter} onChange={e => setForm({...form, showInFooter: e.target.checked})} /> <span>Show in Footer Links</span></label>
               </div>

               <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Page</Button>
               </div>
             </form>
           </div>
         </div>
      )}
    </div>
  );
};

// --- Settings (Complex) ---
export const AdminSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState<SiteConfig>({ ...config });
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => { if (config) setLocalConfig(config); }, [config]);

  const handleSave = async () => {
    await updateConfig(localConfig);
    alert("Configuration Saved!");
  };

  const handleImageUpload = async (key: keyof SiteConfig, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setLocalConfig(prev => ({ ...prev, [key]: base64 }));
    }
  };

  // --- Vertical Carousel Logic ---
  const addVerticalCarousel = () => {
    const newCarousel: VerticalCarouselSection = { id: `vc_${Date.now()}`, title: 'New Collection', slides: [] };
    setLocalConfig(prev => ({ ...prev, verticalCarousels: [...(prev.verticalCarousels || []), newCarousel] }));
  };
  const removeVerticalCarousel = (id: string) => {
    setLocalConfig(prev => ({ ...prev, verticalCarousels: prev.verticalCarousels?.filter(vc => vc.id !== id) }));
  };
  const addSlideToVerticalCarousel = async (carouselId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      const newSlide: Slide = { image: base64, title: 'Slide Title', subtitle: 'Slide Subtitle', textColor: '#FFFFFF' };
      setLocalConfig(prev => ({
        ...prev,
        verticalCarousels: prev.verticalCarousels?.map(vc => 
          vc.id === carouselId ? { ...vc, slides: [...(vc.slides || []), newSlide] } : vc
        )
      }));
    }
  };
  const removeSlideFromVerticalCarousel = (carouselId: string, slideIdx: number) => {
      setLocalConfig(prev => ({
        ...prev,
        verticalCarousels: prev.verticalCarousels?.map(vc => 
          vc.id === carouselId ? { ...vc, slides: vc.slides.filter((_, idx) => idx !== slideIdx) } : vc
        )
      }));
  };
  const updateVerticalSlide = (carouselId: string, slideIdx: number, field: keyof Slide, value: string) => {
      setLocalConfig(prev => ({
        ...prev,
        verticalCarousels: prev.verticalCarousels?.map(vc => 
          vc.id === carouselId ? { ...vc, slides: vc.slides.map((s, idx) => idx === slideIdx ? { ...s, [field]: value } : s) } : vc
        )
      }));
  };

  const tabs = ['general', 'hero', 'verticals', 'promo', 'footer'];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-brand-50 pt-4 pb-4 z-10">
        <h1 className="text-2xl font-bold">Content & Settings</h1>
        <Button onClick={handleSave}><Save size={18} className="mr-2" /> Save Changes</Button>
      </div>

      <div className="flex space-x-1 mb-6 border-b overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 capitalize ${activeTab === t ? 'border-b-2 border-brand-900 font-bold' : 'text-gray-500'}`}>{t}</button>
        ))}
      </div>

      <div className="space-y-8">
        {/* General */}
        {activeTab === 'general' && (
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <h3 className="font-bold border-b pb-2">Brand Identity</h3>
            <Input label="Site Name" value={localConfig.siteName} onChange={e => setLocalConfig({...localConfig, siteName: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Logo</label>
                  <input type="file" onChange={e => handleImageUpload('logo', e)} className="text-sm" />
                  {localConfig.logo && <img src={localConfig.logo} className="mt-2 h-12 object-contain" />}
               </div>
               <Input label="Currency Symbol" value={localConfig.currency} onChange={e => setLocalConfig({...localConfig, currency: e.target.value})} />
            </div>
            
            <h3 className="font-bold border-b pb-2 pt-4">Announcement Bar</h3>
            <div className="flex items-center space-x-4 mb-2">
               <label className="flex items-center space-x-2"><input type="checkbox" checked={localConfig.announcementEnabled} onChange={e => setLocalConfig({...localConfig, announcementEnabled: e.target.checked})} /> <span>Enabled</span></label>
               <label className="flex items-center space-x-2"><input type="checkbox" checked={localConfig.announcementBlink} onChange={e => setLocalConfig({...localConfig, announcementBlink: e.target.checked})} /> <span>Blinking Effect</span></label>
            </div>
            <Input label="Text" value={localConfig.announcementText} onChange={e => setLocalConfig({...localConfig, announcementText: e.target.value})} />
            <div className="grid grid-cols-3 gap-4">
              <Input label="Link (Optional)" value={localConfig.announcementLink} onChange={e => setLocalConfig({...localConfig, announcementLink: e.target.value})} />
              <Input label="Background Color" type="color" value={localConfig.announcementBgColor} onChange={e => setLocalConfig({...localConfig, announcementBgColor: e.target.value})} className="h-10" />
              <Input label="Text Color" type="color" value={localConfig.announcementTextColor} onChange={e => setLocalConfig({...localConfig, announcementTextColor: e.target.value})} className="h-10" />
            </div>
          </div>
        )}

        {/* Hero */}
        {activeTab === 'hero' && (
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <h3 className="font-bold border-b pb-2">Hero Section</h3>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-4">
                  <Input label="Title" value={localConfig.heroTitle} onChange={e => setLocalConfig({...localConfig, heroTitle: e.target.value})} />
                  <Input label="Subtitle" value={localConfig.heroSubtitle} onChange={e => setLocalConfig({...localConfig, heroSubtitle: e.target.value})} />
                  <Input label="Tagline" value={localConfig.heroTagline} onChange={e => setLocalConfig({...localConfig, heroTagline: e.target.value})} />
               </div>
               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={localConfig.heroTextColor || '#FFFFFF'} onChange={e => setLocalConfig({...localConfig, heroTextColor: e.target.value})} />
                      <span className="text-xs">{localConfig.heroTextColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Text Alignment</label>
                    <select value={localConfig.heroTextAlign} onChange={e => setLocalConfig({...localConfig, heroTextAlign: e.target.value as any})} className="border p-2 rounded w-full">
                       <option value="left">Left</option>
                       <option value="center">Center</option>
                       <option value="right">Right</option>
                    </select>
                  </div>
               </div>
            </div>
            
            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-2">Hero Background Image</label>
              <input type="file" onChange={e => handleImageUpload('heroImage', e)} />
              {localConfig.heroImage && <img src={localConfig.heroImage} className="mt-2 h-40 object-cover rounded" />}
            </div>
          </div>
        )}

        {/* Vertical Carousels */}
        {activeTab === 'verticals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Vertical Carousels</h3>
              <Button onClick={addVerticalCarousel} size="sm"><Plus size={16} className="mr-1"/> Add New Section</Button>
            </div>
            
            {localConfig.verticalCarousels?.map((carousel, cIdx) => (
               <div key={carousel.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                     <div className="flex items-center gap-4 flex-1">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{carousel.id}</span>
                        <input 
                          type="text" 
                          placeholder="Section Title" 
                          className="font-bold text-lg border-none focus:ring-0 w-full" 
                          value={carousel.title} 
                          onChange={(e) => {
                             const updated = [...(localConfig.verticalCarousels || [])];
                             updated[cIdx].title = e.target.value;
                             setLocalConfig({ ...localConfig, verticalCarousels: updated });
                          }}
                        />
                     </div>
                     <button onClick={() => removeVerticalCarousel(carousel.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded"><Trash2 size={18}/></button>
                  </div>

                  {/* Slides Grid */}
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {carousel.slides.map((slide, sIdx) => (
                       <div key={sIdx} className="flex-shrink-0 w-48 bg-gray-50 rounded p-2 relative group">
                          <img src={slide.image} className="w-full h-64 object-cover rounded mb-2" />
                          <button 
                            onClick={() => removeSlideFromVerticalCarousel(carousel.id, sIdx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12}/>
                          </button>
                          <div className="space-y-1">
                             <input className="w-full text-xs border p-1 rounded" placeholder="Title" value={slide.title} onChange={e => updateVerticalSlide(carousel.id, sIdx, 'title', e.target.value)} />
                             <input className="w-full text-xs border p-1 rounded" placeholder="Subtitle" value={slide.subtitle} onChange={e => updateVerticalSlide(carousel.id, sIdx, 'subtitle', e.target.value)} />
                             <div className="flex items-center gap-1">
                                <input type="color" className="w-4 h-4" value={slide.textColor || '#FFFFFF'} onChange={e => updateVerticalSlide(carousel.id, sIdx, 'textColor', e.target.value)} />
                                <span className="text-[10px] text-gray-400">Color</span>
                             </div>
                          </div>
                       </div>
                    ))}
                    <label className="border-2 border-dashed border-orange-200 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-orange-500 transition-colors w-48 h-80 flex-shrink-0">
                       <Plus className="text-orange-400 mb-2" size={24}/>
                       <span className="text-sm text-orange-500 font-medium">Add Vertical Slide</span>
                       <span className="text-xs text-gray-400 mt-1">Rec: 508x702px</span>
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => addSlideToVerticalCarousel(carousel.id, e)} />
                    </label>
                  </div>
               </div>
             ))}
             {(!localConfig.verticalCarousels || localConfig.verticalCarousels.length === 0) && (
               <p className="text-center text-gray-400 italic">No vertical carousels added yet.</p>
             )}
          </div>
        )}

        {/* Promo */}
        {activeTab === 'promo' && (
           <div className="bg-white p-6 rounded-lg shadow space-y-6">
              <h3 className="font-bold border-b pb-2">Promotional Banner</h3>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <Input label="Title" value={localConfig.promoTitle} onChange={e => setLocalConfig({...localConfig, promoTitle: e.target.value})} />
                    <Input label="Text" value={localConfig.promoText} onChange={e => setLocalConfig({...localConfig, promoText: e.target.value})} />
                    <Input label="Button Label" value={localConfig.promoButtonText} onChange={e => setLocalConfig({...localConfig, promoButtonText: e.target.value})} />
                    <Input label="Button Link" value={localConfig.promoButtonLink} onChange={e => setLocalConfig({...localConfig, promoButtonLink: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-2">Image</label>
                    <input type="file" onChange={e => handleImageUpload('promoImage', e)} />
                    {localConfig.promoImage && <img src={localConfig.promoImage} className="mt-2 h-48 w-full object-cover rounded" />}
                 </div>
              </div>
           </div>
        )}
        
        {/* Footer */}
        {activeTab === 'footer' && (
           <div className="bg-white p-6 rounded-lg shadow space-y-6">
             <h3 className="font-bold border-b pb-2">Footer & Contact</h3>
             <div className="grid grid-cols-2 gap-6">
               <Input label="Contact Email" value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} />
               <Input label="Contact Phone" value={localConfig.contactPhone} onChange={e => setLocalConfig({...localConfig, contactPhone: e.target.value})} />
               <Input label="Address" value={localConfig.contactAddress} onChange={e => setLocalConfig({...localConfig, contactAddress: e.target.value})} className="col-span-2" />
             </div>
             <div className="grid grid-cols-2 gap-6 mt-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={localConfig.footerBgColor || '#2C251F'} onChange={e => setLocalConfig({...localConfig, footerBgColor: e.target.value})} />
                    <span className="text-sm">{localConfig.footerBgColor}</span>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={localConfig.footerTextColor || '#F3F4F6'} onChange={e => setLocalConfig({...localConfig, footerTextColor: e.target.value})} />
                    <span className="text-sm">{localConfig.footerTextColor}</span>
                  </div>
               </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

// --- Developer Settings (Theme) ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [theme, setTheme] = useState<ThemeConfig>({
    primaryColor: '#2C251F', secondaryColor: '#D5CDC0', backgroundColor: '#F9F8F6',
    fontFamilySans: 'Inter', fontFamilySerif: 'Cormorant Garamond', borderRadius: '0px'
  });

  useEffect(() => { if (config.theme) setTheme(config.theme); }, [config]);

  const save = async () => {
    await updateConfig({ ...config, theme });
    alert("Theme Updated!");
  };

  const ColorPicker = ({ label, val, set }: any) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex items-center space-x-2">
        <input type="color" value={val} onChange={e => set(e.target.value)} className="h-10 w-10 border rounded cursor-pointer" />
        <input type="text" value={val} onChange={e => set(e.target.value)} className="border p-2 rounded text-sm w-28" />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Developer / Theme Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow space-y-8">
         <div>
           <h3 className="font-bold border-b pb-2 mb-4">Color Palette</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <ColorPicker label="Primary (Brand 900)" val={theme.primaryColor} set={(v: string) => setTheme({...theme, primaryColor: v})} />
             <ColorPicker label="Secondary (Brand 200)" val={theme.secondaryColor} set={(v: string) => setTheme({...theme, secondaryColor: v})} />
             <ColorPicker label="Background (Brand 50)" val={theme.backgroundColor} set={(v: string) => setTheme({...theme, backgroundColor: v})} />
           </div>
         </div>
         
         <div>
           <h3 className="font-bold border-b pb-2 mb-4">Typography</h3>
           <div className="grid grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium mb-1">Sans Serif Font</label>
                <select value={theme.fontFamilySans} onChange={e => setTheme({...theme, fontFamilySans: e.target.value})} className="border p-2 rounded w-full">
                   <option value="Inter">Inter</option>
                   <option value="Arial">Arial</option>
                   <option value="Helvetica">Helvetica</option>
                   <option value="system-ui">System UI</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Serif Font</label>
                <select value={theme.fontFamilySerif} onChange={e => setTheme({...theme, fontFamilySerif: e.target.value})} className="border p-2 rounded w-full">
                   <option value="Cormorant Garamond">Cormorant Garamond</option>
                   <option value="Playfair Display">Playfair Display</option>
                   <option value="Merriweather">Merriweather</option>
                   <option value="Times New Roman">Times New Roman</option>
                </select>
             </div>
           </div>
         </div>

         <div>
           <h3 className="font-bold border-b pb-2 mb-4">UI Elements</h3>
           <div>
              <label className="block text-sm font-medium mb-1">Border Radius</label>
              <div className="flex space-x-4">
                 {['0px', '4px', '8px', '12px', '99px'].map(r => (
                   <button 
                    key={r} 
                    onClick={() => setTheme({...theme, borderRadius: r})}
                    className={`px-4 py-2 border ${theme.borderRadius === r ? 'bg-brand-900 text-white' : 'bg-gray-50'}`}
                    style={{ borderRadius: r }}
                   >
                     {r === '0px' ? 'Square' : r === '99px' ? 'Round' : r}
                   </button>
                 ))}
              </div>
           </div>
         </div>

         <Button onClick={save} className="w-full">Update Theme</Button>
      </div>
    </div>
  );
};

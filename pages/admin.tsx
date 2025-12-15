import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { Product, Category, User, LayoutSection, SiteConfig } from '../types';
import { 
  Plus, Trash, Edit, Package, ShoppingCart, DollarSign, TrendingUp, 
  Upload, Image as ImageIcon, X, Settings, List, Layout, User as UserIcon, Lock, Megaphone, Video, Hexagon, Type, ShieldCheck, Share2, Heart, Palette, GripVertical, Eye, EyeOff, MoveUp, MoveDown, RotateCcw, AlignLeft, AlignCenter, AlignRight, FileText, Monitor, Globe, Footprints, Shield, ShieldAlert, CheckCircle, Ban, Terminal, ChevronRight, Copy
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

// --- Connection Modal Component ---
const ConnectionModal: React.FC<{ 
    ip: string; 
    onClose: () => void; 
}> = ({ ip, onClose }) => {
    const [copied, setCopied] = useState(false);
    const [mode, setMode] = useState<'http' | 'ssh'>('http');
    
    // HTTP Monitor Command (Python pretty-print wrapper for "Real-Time" feel)
    const apiUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000';
    
    const httpCommand = `export API="${apiUrl}/api/logs"; while true; do curl -s $API | python3 -c "import sys, json; d=json.load(sys.stdin); print(f'\\033[92m[ACTIVE]\\033[0m {d[0]['ip']} | {d[0].get('path', '/')} | {d[0]['device']} | {d[0]['accessTime']}')"; sleep 2; done`;

    // SSH Command (Simulated - Requires Agent)
    const port = 2200 + Math.floor(Math.random() * 99); 
    const sshCommand = `ssh root@${ip} -p ${port}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(mode === 'http' ? httpCommand : sshCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-black border border-green-500 w-full max-w-3xl rounded-sm flex flex-col shadow-[0_0_30px_rgba(34,197,94,0.15)] relative overflow-hidden p-6">
                {/* CRT Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20"></div>
                
                <button onClick={onClose} className="absolute top-4 right-4 text-green-700 hover:text-green-400 z-20"><X size={20}/></button>

                <h3 className="text-green-500 font-bold text-lg mb-4 flex items-center gap-2 relative z-20">
                    <Terminal size={18} /> Remote Uplink Established
                </h3>

                <p className="text-green-800 text-xs mb-4 relative z-20">
                    Target Identity: <span className="text-green-500">{ip}</span>
                </p>

                <div className="flex space-x-4 mb-4 relative z-20 text-xs">
                    <button 
                        onClick={() => setMode('http')} 
                        className={`px-3 py-1 border transition-colors ${mode === 'http' ? 'border-green-500 text-green-400 bg-green-900/30' : 'border-green-900 text-green-800 hover:text-green-600'}`}
                    >
                        Live Dashboard (HTTP)
                    </button>
                    <button 
                        onClick={() => setMode('ssh')} 
                        className={`px-3 py-1 border transition-colors ${mode === 'ssh' ? 'border-green-500 text-green-400 bg-green-900/30' : 'border-green-900 text-green-800 hover:text-green-600'}`}
                    >
                        SSH Tunnel (Direct)
                    </button>
                </div>

                <div className="bg-green-900/10 border border-green-900/30 p-4 rounded mb-2 flex items-center justify-between group relative z-20">
                    <code className="text-green-400 text-sm select-all font-mono break-all pr-4">
                        {mode === 'http' ? httpCommand : sshCommand}
                    </code>
                    <button 
                        onClick={handleCopy} 
                        className="text-green-700 hover:text-green-400 transition-colors flex items-center gap-2 text-xs uppercase font-bold shrink-0"
                    >
                        {copied ? <span className="text-green-500 flex items-center gap-1"><CheckCircle size={14} /> Copied</span> : <span className="flex items-center gap-1"><Copy size={14}/> Copy</span>}
                    </button>
                </div>

                <div className="text-[10px] text-green-900/80 border-t border-green-900/30 pt-4 relative z-20 italic">
                    {mode === 'http' ? (
                        <p>&gt; Establishes a real-time HTTP link to stream visitor activity (Path, IP, Device) to your terminal. Requires curl & python3.</p>
                    ) : (
                        <p>&gt; SSH Connection requires the client to have the 'Lumiere Agent' installed and listening on port {port}. Connection refused indicates no agent.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

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

// --- Admin Products ---
export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({});

  const handleEdit = (product: Product) => {
    setEditing(product);
    setFormData(product);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditing(null);
    setFormData({
        name: '', description: '', price: 0, category: categories[0]?.name || '', 
        images: [''], sizes: [], colors: [], stock: 0
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (editing) {
          await updateProduct({ ...editing, ...formData } as Product);
      } else {
          // ensure required fields
          await addProduct({ ...formData, id: Date.now().toString(), likes: 0 } as Product);
      }
      setIsFormOpen(false);
  };

  const handleDelete = async (id: string) => {
      if(confirm("Are you sure?")) await deleteProduct(id);
  }

  return (
      <div>
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-serif font-bold">Products</h1>
              <Button onClick={handleAddNew}><Plus size={16} className="mr-2" /> Add Product</Button>
          </div>

          {/* List */}
          <div className="bg-white rounded shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                      <tr>
                          <th className="px-6 py-3">Image</th>
                          <th className="px-6 py-3">Name</th>
                          <th className="px-6 py-3">Category</th>
                          <th className="px-6 py-3">Price</th>
                          <th className="px-6 py-3">Stock</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y">
                      {products.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                  <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded bg-gray-100" />
                              </td>
                              <td className="px-6 py-4 font-medium">{p.name}</td>
                              <td className="px-6 py-4">{p.category}</td>
                              <td className="px-6 py-4">${p.price}</td>
                              <td className="px-6 py-4">{p.stock}</td>
                              <td className="px-6 py-4 text-right space-x-2">
                                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800"><Trash size={16} /></button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* Modal/Form Overlay */}
          {isFormOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                      <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-bold">{editing ? 'Edit Product' : 'New Product'}</h2>
                          <button onClick={() => setIsFormOpen(false)}><X /></button>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                              <Input label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                              <div className="flex flex-col">
                                  <label className="text-sm font-medium mb-1">Category</label>
                                  <select 
                                    className="border p-2 rounded text-sm" 
                                    value={formData.category} 
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                  >
                                      <option value="">Select Category</option>
                                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                  </select>
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                              <Input label="Price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                              <Input label="Discount Price" type="number" value={formData.discountPrice || ''} onChange={e => setFormData({...formData, discountPrice: Number(e.target.value)})} />
                              <Input label="Stock" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} required />
                          </div>

                          <div>
                              <label className="block text-sm font-medium mb-1">Description</label>
                              <textarea className="w-full border p-2 rounded text-sm h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                          </div>

                          <Input label="Image URL (Comma separated for multiple)" value={formData.images?.join(',')} onChange={e => setFormData({...formData, images: e.target.value.split(',')})} />

                          <div className="grid grid-cols-2 gap-4">
                              <Input label="Sizes (Comma separated)" value={formData.sizes?.join(',')} onChange={e => setFormData({...formData, sizes: e.target.value.split(',').filter(Boolean)})} />
                              <Input label="Colors (Comma separated)" value={formData.colors?.join(',')} onChange={e => setFormData({...formData, colors: e.target.value.split(',').filter(Boolean)})} />
                          </div>

                          <div className="flex gap-4">
                              <label className="flex items-center space-x-2">
                                  <input type="checkbox" checked={formData.newArrival} onChange={e => setFormData({...formData, newArrival: e.target.checked})} />
                                  <span className="text-sm">New Arrival</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                  <input type="checkbox" checked={formData.bestSeller} onChange={e => setFormData({...formData, bestSeller: e.target.checked})} />
                                  <span className="text-sm">Best Seller</span>
                              </label>
                          </div>

                          <div className="flex justify-end gap-2 mt-6">
                              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                              <Button type="submit">Save Product</Button>
                          </div>
                      </form>
                  </div>
              </div>
          )}
      </div>
  );
};

// --- Admin Categories ---
export const AdminCategories: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useStore();
    const [editing, setEditing] = useState<Category | null>(null);
    const [formData, setFormData] = useState<Partial<Category>>({});
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            await updateCategory({ ...editing, ...formData } as Category);
        } else {
            await addCategory({ ...formData, id: Date.now().toString().toLowerCase().replace(/\s/g, '-') } as Category);
        }
        setIsFormOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-serif font-bold">Categories</h1>
              <Button onClick={() => { setEditing(null); setFormData({ name: '', image: '' }); setIsFormOpen(true); }}><Plus size={16} className="mr-2" /> Add Category</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(c => (
                    <div key={c.id} className="bg-white p-4 rounded shadow-sm border flex items-center gap-4">
                        <img src={c.image} alt="" className="w-16 h-16 object-cover rounded bg-gray-100" />
                        <div className="flex-1">
                            <h3 className="font-bold">{c.name}</h3>
                            <p className="text-xs text-gray-500">ID: {c.id}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => { setEditing(c); setFormData(c); setIsFormOpen(true); }} className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"><Edit size={14} /></button>
                            <button onClick={() => { if(confirm("Delete?")) deleteCategory(c.id); }} className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100"><Trash size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {isFormOpen && (
                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded p-6 w-full max-w-md">
                        <h2 className="font-bold text-lg mb-4">{editing ? 'Edit Category' : 'New Category'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            <Input label="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </div>
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
            <h1 className="text-2xl font-serif font-bold mb-6">Orders</h1>
            <div className="bg-white rounded shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Items</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map(o => (
                            <tr key={o.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-xs">{o.id}</td>
                                <td className="px-6 py-4">{o.date}</td>
                                <td className="px-6 py-4">
                                    <div className="font-bold">{o.customerName}</div>
                                    <div className="text-xs text-gray-500">{o.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs">
                                        {o.items.map((i, idx) => (
                                            <div key={idx}>{i.quantity}x {i.name} ({i.selectedSize})</div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold">${o.total}</td>
                                <td className="px-6 py-4">
                                    <select 
                                        className="border rounded px-2 py-1 text-xs bg-white"
                                        value={o.status}
                                        onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                         {orders.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-500">No orders found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Admin Users ---
export const AdminUsers: React.FC = () => {
    const { users, addUser, deleteUser } = useStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'staff' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addUser(formData);
        setIsFormOpen(false);
        setFormData({ username: '', password: '', role: 'staff' });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-serif font-bold">User Management</h1>
              <Button onClick={() => setIsFormOpen(true)}><Plus size={16} className="mr-2" /> Add User</Button>
            </div>

            <div className="bg-white rounded shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-3">Username</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{u.username}</td>
                                <td className="px-6 py-4 capitalize">
                                    <Badge color={u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}>
                                        {u.role}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {u.username !== 'admin' && (
                                        <button onClick={() => { if(confirm("Delete user?")) deleteUser(u.id); }} className="text-red-600 hover:text-red-800"><Trash size={16} /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             {isFormOpen && (
                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded p-6 w-full max-w-md">
                        <h2 className="font-bold text-lg mb-4">Add User</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input label="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
                            <Input label="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1">Role</label>
                                <select className="border p-2 rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
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
                 </div>
            )}
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
        alert("Settings Saved");
    };

    const handleChange = (key: keyof SiteConfig, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-serif font-bold">Content & Settings</h1>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>

            <div className="space-y-8">
                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">General Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Logo URL" value={formData.logo || ''} onChange={e => handleChange('logo', e.target.value)} />
                        <Input label="Currency Symbol" value={formData.currency || '$'} onChange={e => handleChange('currency', e.target.value)} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">Contact Page</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Email" value={formData.contactEmail || ''} onChange={e => handleChange('contactEmail', e.target.value)} />
                        <Input label="Phone" value={formData.contactPhone || ''} onChange={e => handleChange('contactPhone', e.target.value)} />
                        <Input label="Address" value={formData.contactAddress || ''} onChange={e => handleChange('contactAddress', e.target.value)} className="col-span-2" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">Social Media</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Instagram URL" value={formData.socialInstagram || ''} onChange={e => handleChange('socialInstagram', e.target.value)} />
                        <Input label="Facebook URL" value={formData.socialFacebook || ''} onChange={e => handleChange('socialFacebook', e.target.value)} />
                        <Input label="WhatsApp URL" value={formData.socialWhatsapp || ''} onChange={e => handleChange('socialWhatsapp', e.target.value)} />
                    </div>
                </div>
                
                 <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">Footer Content</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <Input label="Footer Logo URL" value={formData.footerLogo || ''} onChange={e => handleChange('footerLogo', e.target.value)} />
                        <Input label="Footer Description" value={formData.footerDescription || ''} onChange={e => handleChange('footerDescription', e.target.value)} />
                        <Input label="Copyright Text" value={formData.footerCopyright || ''} onChange={e => handleChange('footerCopyright', e.target.value)} />
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">About Page</h3>
                    <Input label="Title" value={formData.aboutTitle || ''} onChange={e => handleChange('aboutTitle', e.target.value)} className="mb-4" />
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <textarea className="w-full border p-2 rounded text-sm h-32" value={formData.aboutContent || ''} onChange={e => handleChange('aboutContent', e.target.value)}></textarea>
                </div>
            </div>
        </div>
    );
};

// --- Developer Settings (New) ---
export const AdminDeveloperSettings: React.FC = () => {
  const { config, updateConfig, logs, fetchLogs, blockedIps, blockIp, unblockIp } = useStore();
  const [activeTab, setActiveTab] = useState<'layout' | 'theme' | 'logs'>('layout');
  const [connectIp, setConnectIp] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Layout Builder State - Init from config
  const [layout, setLayout] = useState<LayoutSection[]>(config.homeLayout || DEFAULT_LAYOUT_RESET);
  const [selectedSection, setSelectedSection] = useState<LayoutSection | null>(null);

  // Theme State
  const [theme, setTheme] = useState(config.themeColors || DEFAULT_THEME_RESET);
  const [navbarLayout, setNavbarLayout] = useState<'left'|'center'|'right'>(config.navbarLayout || 'center');
  const [borderRadius, setBorderRadius] = useState<string>(config.borderRadius || '2px');
  
  // Footer Colors
  const [footerColors, setFooterColors] = useState(config.footerColors || DEFAULT_FOOTER_COLORS);

  // Ensure state is synced if config loads late (though usually handled by parent loader)
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

  const handleRefreshLogs = async () => {
      setRefreshing(true);
      await fetchLogs();
      setRefreshing(false);
  };

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

  const isIpBlocked = (ip: string) => {
      return blockedIps.some(blocked => blocked.ip === ip);
  };

  return (
    <div className="pb-20">
      {connectIp && (
          <ConnectionModal 
            ip={connectIp} 
            onClose={() => setConnectIp(null)} 
          />
      )}

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
                 <Button onClick={handleRefreshLogs} variant="outline" size="sm" isLoading={refreshing}>
                    Refresh Logs
                 </Button>
             </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                     <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                         <tr>
                             <th className="px-6 py-3">Time</th>
                             <th className="px-6 py-3">IP Address</th>
                             <th className="px-6 py-3">Path Visited</th>
                             <th className="px-6 py-3">Device / OS</th>
                             <th className="px-6 py-3">User Agent Detail</th>
                             <th className="px-6 py-3">Incoming Connection</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y">
                         {logs.map((log) => {
                             const blocked = isIpBlocked(log.ip);
                             return (
                             <tr key={log.id} className={`hover:bg-gray-50 ${blocked ? 'bg-red-50' : ''}`}>
                                 <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                     {new Date(log.accessTime).toLocaleString()}
                                 </td>
                                 <td className="px-6 py-4 font-mono text-xs">
                                     <div className="flex items-center gap-2">
                                        <Globe size={14} className="text-brand-900"/>
                                        {log.ip}
                                     </div>
                                 </td>
                                 <td className="px-6 py-4 font-mono text-xs text-blue-600 bg-blue-50/50">
                                     {log.path || '/'}
                                 </td>
                                 <td className="px-6 py-4 font-medium">
                                     <div className="flex items-center gap-2">
                                        <Monitor size={14} className="text-gray-400"/>
                                        {log.device}
                                     </div>
                                 </td>
                                 <td className="px-6 py-4 text-xs text-gray-400 max-w-xs truncate" title={log.userAgent}>
                                     {log.userAgent}
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="flex gap-2">
                                         {blocked ? (
                                             <button 
                                                onClick={() => unblockIp(log.ip)}
                                                className="flex items-center gap-1 text-xs font-bold text-red-600 border border-red-200 bg-red-100 px-3 py-1.5 rounded hover:bg-red-200 transition"
                                                title="Reject Connection (Block)"
                                             >
                                                <Ban size={14} /> Reject
                                             </button>
                                         ) : (
                                             <button 
                                                onClick={() => blockIp(log.ip)}
                                                className="flex items-center gap-1 text-xs font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 px-3 py-1.5 rounded hover:bg-emerald-100 transition"
                                                title="Accept Connection (Unblock)"
                                             >
                                                <CheckCircle size={14} /> Accept
                                             </button>
                                         )}
                                         
                                         <div className="w-px bg-gray-200 mx-1"></div>

                                         <button 
                                            onClick={() => setConnectIp(log.ip)}
                                            className="flex items-center gap-2 text-xs font-bold text-brand-900 border border-brand-900 bg-brand-50 px-3 py-1.5 rounded hover:bg-brand-900 hover:text-white transition"
                                            title="Get SSH Connection String"
                                         >
                                            <Terminal size={14} /> Connect
                                         </button>
                                     </div>
                                 </td>
                             </tr>
                         )})}
                         {logs.length === 0 && (
                             <tr>
                                 <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No logs found yet.</td>
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
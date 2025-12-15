const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
const MONGO_URI = "mongodb+srv://ayubazmi0_db_user:8bM4hZh01zQNrQ5w@cluster0.wwulon0.mongodb.net/lumier_shop?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- Schemas & Models ---
const toJSONConfig = {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
};

// 1. Product
const Product = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountPrice: Number,
  category: String,
  images: [String],
  sizes: [String],
  colors: [String],
  newArrival: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
}, { toJSON: toJSONConfig }));

// 2. Category
const Category = mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: true },
  image: String
}, { toJSON: toJSONConfig }));

// 3. Order
const Order = mongoose.model('Order', new mongoose.Schema({
  customerName: String,
  email: String,
  shippingAddress: Object,
  items: Array,
  total: Number,
  status: { type: String, default: 'Pending' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { toJSON: toJSONConfig }));

// 4. Site Config (Extended)
const Config = mongoose.model('Config', new mongoose.Schema({
  // Brand
  logo: String,

  // Developer Settings
  homeLayout: { type: Array, default: [] }, // Stores LayoutSection[]
  themeColors: { type: Object, default: {} }, // Stores ThemeColors
  navbarLayout: { type: String, default: 'center' },
  borderRadius: { type: String, default: '2px' },
  footerColors: { type: Object, default: {} },

  // Hero Section
  heroImage: String,
  heroVideo: String,
  heroTagline: { type: String, default: 'New Collection' }, 
  heroTitle: String,
  heroSubtitle: String,
  
  // Section Headers
  categoryTitle: { type: String, default: 'Shop by Category' },
  featuredTitle: { type: String, default: 'New Arrivals' },
  featuredSubtitle: { type: String, default: 'Fresh styles just added to our collection.' },

  // Promo Section
  promoTitle: String,
  promoText: String,
  promoImage: String,
  promoButtonText: { type: String, default: 'Explore Sale' },
  promoButtonLink: { type: String, default: '/shop' },

  // Content
  aboutTitle: String,
  aboutContent: String,
  contactEmail: String,
  contactPhone: String,
  contactAddress: String,

  // Socials
  socialInstagram: String,
  socialFacebook: String,
  socialWhatsapp: String,

  // Trust Badges
  trustBadge1Title: String,
  trustBadge1Text: String,
  trustBadge2Title: String,
  trustBadge2Text: String,
  trustBadge3Title: String,
  trustBadge3Text: String,
  
  // Settings
  currency: String,
  isDefault: { type: Boolean, default: true }
}, { toJSON: toJSONConfig }));

// 5. User
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, default: 'staff' },
  permissions: [String]
}, { toJSON: toJSONConfig }));

// 6. Access Logs (New for tracking)
const AccessLog = mongoose.model('AccessLog', new mongoose.Schema({
  ip: String,
  path: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
  method: String,
  device: String,
  openPorts: String // Simulated scan result
}, { toJSON: toJSONConfig }));

// --- Routes ---

app.get('/', (req, res) => res.send('API is running'));

// Products
app.get('/api/products', async (req, res) => {
  try { res.json(await Product.find().sort({ _id: -1 })); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/products', async (req, res) => {
  try { const { id, ...data } = req.body; res.json(await new Product(data).save()); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/products/:id', async (req, res) => {
  try { res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/products/:id/like', async (req, res) => {
  try {
    const { increment } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: increment ? 1 : -1 } },
      { new: true }
    );
    if (product.likes < 0) { product.likes = 0; await product.save(); }
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/products/:id', async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ success: true }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Categories
app.get('/api/categories', async (req, res) => {
  try { res.json(await Category.find()); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/categories', async (req, res) => {
  try { const { id, ...data } = req.body; res.json(await new Category(data).save()); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/categories/:id', async (req, res) => {
  try { res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/categories/:id', async (req, res) => {
  try { await Category.findByIdAndDelete(req.params.id); res.json({ success: true }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Orders
app.get('/api/orders', async (req, res) => {
  try { res.json(await Order.find().sort({ _id: -1 })); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/orders', async (req, res) => {
  try { const { id, ...data } = req.body; res.json(await new Order(data).save()); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/orders/:id', async (req, res) => {
  try { res.json(await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Config
app.get('/api/config', async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config({
        heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000',
        heroTagline: 'New Collection',
        heroTitle: 'Elegance in Every Stitch',
        heroSubtitle: 'Discover our latest arrivals designed for the modern woman.',
        categoryTitle: 'Shop by Category',
        featuredTitle: 'New Arrivals',
        featuredSubtitle: 'Fresh styles just added to our collection.',
        promoTitle: 'Summer Sale is Live',
        promoText: 'Get up to 50% off on selected dresses and kurtis. Limited time offer.',
        promoImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
        promoButtonText: 'Explore Sale',
        promoButtonLink: '/shop',
        aboutTitle: 'Our Story',
        aboutContent: 'LUMIÈRE was born from a desire to blend traditional craftsmanship with contemporary silhouettes.',
        contactEmail: 'support@lumiere.com',
        contactPhone: '+1 (555) 123-4567',
        contactAddress: '123 Fashion Ave, New York, NY',
        currency: '$'
      });
      await config.save();
    }
    res.json(config);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/config', async (req, res) => {
  try {
    let config = await Config.findOne();
    if (config) { config.set(req.body); await config.save(); } 
    else { config = new Config(req.body); await config.save(); }
    res.json(config);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Auth & Users
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password }); 
    if (user) {
      const { password, ...userData } = user.toObject();
      res.json(userData);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users', async (req, res) => {
  try { res.json(await User.find({}, '-password')); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/users', async (req, res) => {
  try {
    const { id, ...data } = req.body;
    res.json(await new User(data).save());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/users/:id', async (req, res) => {
  try { await User.findByIdAndDelete(req.params.id); res.json({ success: true }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/users/:id/password', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { password: req.body.password });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Logs Endpoint (Mocking detailed logs for the new feature)
app.get('/api/logs', async (req, res) => {
    // Return last 20 access logs
    // Mock data for demo purposes since we don't have real traffic
    const mockLogs = [
        { id: '1', ip: '192.168.1.42', path: '/admin', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', timestamp: new Date().toISOString(), method: 'GET', device: 'Desktop', openPorts: '80, 443' },
        { id: '2', ip: '10.0.0.5', path: '/shop', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)', timestamp: new Date(Date.now() - 50000).toISOString(), method: 'GET', device: 'Mobile', openPorts: 'None' },
        { id: '3', ip: '172.16.254.1', path: '/api/login', userAgent: 'Python-requests/2.26.0', timestamp: new Date(Date.now() - 120000).toISOString(), method: 'POST', device: 'Bot', openPorts: '8080' }
    ];
    res.json(mockLogs);
});

// Seed Default Admin
(async () => {
  try {
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      await new User({ 
        username: 'admin', 
        password: 'admin', 
        role: 'admin', 
        permissions: ['products', 'orders', 'categories', 'settings', 'users'] 
      }).save();
      console.log("✅ Default admin user created (admin/admin)");
    }
  } catch(e) { console.error("Error seeding admin", e); }
})();

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://0.0.0.0:${PORT}`));
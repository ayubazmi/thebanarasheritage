require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Production Security & Performance Middleware ---

// 1. Enable Trust Proxy
app.set('trust proxy', 1);

// 2. Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:", "https://images.unsplash.com", "https://files.catbox.moe"],
      connectSrc: ["'self'", "https:", "http://localhost:*"],
      mediaSrc: ["'self'", "https:", "data:", "blob:"], 
    },
  },
  crossOriginEmbedderPolicy: false
}));

// 3. Compression
app.use(compression());

// 4. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 5. Standard Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://ayubazmi0_db_user:8bM4hZh01zQNrQ5w@cluster0.wwulon0.mongodb.net/lumier_shop?appName=Cluster0";

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

const Category = mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: true },
  image: String
}, { toJSON: toJSONConfig }));

const Order = mongoose.model('Order', new mongoose.Schema({
  customerName: String,
  email: String,
  shippingAddress: Object,
  items: Array,
  total: Number,
  status: { type: String, default: 'Pending' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { toJSON: toJSONConfig }));

const LayoutSectionSchema = new mongoose.Schema({
  id: String,
  type: { type: String },
  isVisible: { type: Boolean, default: true },
  data: { type: mongoose.Schema.Types.Mixed } 
}, { _id: false }); 

const ConfigSchema = new mongoose.Schema({
  logo: String,
  themeColors: {
    background: { type: String, default: '#FFFFFF' },
    surface: { type: String, default: '#F3F4F6' },
    border: { type: String, default: '#E5E7EB' },
    primary: { type: String, default: '#111827' },
    secondary: { type: String, default: '#4B5563' }
  },
  footerColors: {
    background: { type: String, default: '#FFFFFF' },
    text: { type: String, default: '#111827' },
    border: { type: String, default: '#E5E7EB' }
  },
  navbarLayout: { type: String, default: 'center' },
  borderRadius: { type: String, default: '0px' },
  homeLayout: { type: [LayoutSectionSchema], default: [] },
  heroImage: String,
  heroVideo: String,
  heroTagline: { type: String, default: 'New Collection' }, 
  heroTitle: String,
  heroSubtitle: String,
  categoryTitle: { type: String, default: 'Shop by Category' },
  featuredTitle: { type: String, default: 'New Arrivals' },
  featuredSubtitle: { type: String, default: 'Fresh styles just added to our collection.' },
  promoTitle: String,
  promoText: String,
  promoImage: String,
  promoButtonText: { type: String, default: 'Explore Sale' },
  promoButtonLink: { type: String, default: '/shop' },
  aboutTitle: String,
  aboutContent: String,
  contactEmail: String,
  contactPhone: String,
  contactAddress: String,
  socialInstagram: String,
  socialFacebook: String,
  socialWhatsapp: String,
  footerLogo: String,
  footerDescription: { type: String, default: 'Timeless elegance for the modern muse.' },
  footerCopyright: { type: String, default: '© 2024 Lumière Fashion.' },
  trustBadge1Title: String,
  trustBadge1Text: String,
  trustBadge2Title: String,
  trustBadge2Text: String,
  trustBadge3Title: String,
  trustBadge3Text: String,
  currency: { type: String, default: '$' }
}, { toJSON: toJSONConfig });

const Config = mongoose.model('Config', ConfigSchema);

const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, default: 'staff' },
  permissions: [String]
}, { toJSON: toJSONConfig }));

const VisitorLog = mongoose.model('VisitorLog', new mongoose.Schema({
  ip: String,
  accessTime: { type: Date, default: Date.now },
  device: String,
  path: String,
  userAgent: String,
  openPorts: String
}, { toJSON: toJSONConfig }));

const BlockedIp = mongoose.model('BlockedIp', new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  blockedAt: { type: Date, default: Date.now }
}, { toJSON: toJSONConfig }));

// --- IP Block Middleware ---
app.use(async (req, res, next) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const blocked = await BlockedIp.findOne({ ip });
    
    if (blocked && !req.path.includes('/api/firewall/unblock')) {
       console.warn(`Blocked access attempt from ${ip}`);
       return res.status(403).json({ error: "Your IP has been blocked by the administrator." });
    }
    next();
  } catch (e) {
    next();
  }
});

// --- Routes ---
app.get('/health', (req, res) => res.send('API is running'));

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

// Logs & Firewall
app.get('/api/logs', async (req, res) => {
  try { res.json(await VisitorLog.find().sort({ accessTime: -1 }).limit(100)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/logs/track', async (req, res) => {
  try {
    const { path } = req.body;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    let device = 'Unknown Device';
    
    if (/mobile/i.test(userAgent)) device = 'Mobile';
    else if (/iPad|Android|Touch/i.test(userAgent)) device = 'Tablet';
    else device = 'Desktop';

    if (/Windows/i.test(userAgent)) device += ' (Windows)';
    else if (/Mac/i.test(userAgent)) device += ' (MacOS)';
    else if (/Linux/i.test(userAgent)) device += ' (Linux)';
    else if (/Android/i.test(userAgent)) device += ' (Android)';
    else if (/iPhone|iPad|iPod/i.test(userAgent)) device += ' (iOS)';

    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const port = req.socket.remotePort; 

    const log = new VisitorLog({
      ip: ip,
      device: device,
      path: path || '/',
      userAgent: userAgent,
      openPorts: port ? `Source: ${port}` : 'Unknown'
    });
    
    await log.save();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/firewall', async (req, res) => {
  try { res.json(await BlockedIp.find()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/firewall/block', async (req, res) => {
  try {
    const { ip } = req.body;
    if (!ip) return res.status(400).json({ error: "IP required" });
    if (ip === '::1' || ip === '127.0.0.1' || ip.includes('127.0.0.1')) {
        return res.status(400).json({ error: "Cannot block localhost" });
    }
    await BlockedIp.findOneAndUpdate({ ip }, { ip }, { upsert: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/firewall/unblock', async (req, res) => {
  try {
    const { ip } = req.body;
    await BlockedIp.findOneAndDelete({ ip });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Config
const DEFAULT_LAYOUT = [
  { id: '1', type: 'hero', isVisible: true, data: { title: 'Elegance in Every Stitch', subtitle: 'Discover our latest arrivals designed for the modern woman.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000', tagline: 'New Collection' } },
  { id: '2', type: 'categories', isVisible: true, data: { title: 'Shop by Category' } },
  { id: '3', type: 'featured', isVisible: true, data: { title: 'New Arrivals', subtitle: 'Fresh styles just added.' } },
  { id: '4', type: 'banner', isVisible: true, data: { title: 'Summer Sale', text: 'Up to 50% Off.', buttonText: 'Shop Now', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000' } },
  { id: '5', type: 'trust', isVisible: true, data: { badge1Title: 'Premium Quality', badge1Text: 'Hand-picked fabrics', badge2Title: 'Secure Payment', badge2Text: '100% secure', badge3Title: 'Fast Delivery', badge3Text: 'Ships in 3 days' } }
];

app.get('/api/config', async (req, res) => {
  try {
    let config = null;
    try {
        config = await Config.findOne();
    } catch (e) {
        console.warn("⚠️ Config corrupted (schema mismatch), resetting...", e.message);
        await Config.deleteMany({});
        config = null;
    }

    if (!config) {
      config = new Config({
        homeLayout: DEFAULT_LAYOUT,
        aboutTitle: 'Our Story',
        aboutContent: 'LUMIÈRE was born from a desire to blend traditional craftsmanship with contemporary silhouettes.',
        contactEmail: 'support@lumiere.com',
        contactPhone: '+1 (555) 123-4567',
        contactAddress: '123 Fashion Ave, New York, NY',
        currency: '$'
      });
      await config.save();
    }
    
    // Safety check for layout array
    if (config.homeLayout && !Array.isArray(config.homeLayout)) {
        config.homeLayout = DEFAULT_LAYOUT;
        await config.save();
    }

    if (!config.homeLayout || config.homeLayout.length === 0) {
      config.homeLayout = DEFAULT_LAYOUT;
      await config.save();
    }
    
    res.json(config);
  } catch (err) { 
      console.error("Config Error:", err);
      res.status(500).json({ error: err.message }); 
  }
});

app.post('/api/config', async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
        config = new Config(req.body);
    } else {
        if(req.body.homeLayout) config.homeLayout = req.body.homeLayout;
        if(req.body.themeColors) config.themeColors = req.body.themeColors;
        if(req.body.footerColors) config.footerColors = req.body.footerColors;
        if(req.body.logo !== undefined) config.logo = req.body.logo;
        
        const keys = ['heroImage', 'heroVideo', 'heroTagline', 'heroTitle', 'heroSubtitle', 
                      'categoryTitle', 'featuredTitle', 'featuredSubtitle',
                      'promoTitle', 'promoText', 'promoImage', 'promoButtonText', 'promoButtonLink',
                      'aboutTitle', 'aboutContent', 'contactEmail', 'contactPhone', 'contactAddress', 
                      'socialInstagram', 'socialFacebook', 'socialWhatsapp',
                      'trustBadge1Title', 'trustBadge1Text', 'trustBadge2Title', 'trustBadge2Text', 
                      'trustBadge3Title', 'trustBadge3Text', 'currency',
                      'navbarLayout', 'borderRadius',
                      'footerLogo', 'footerDescription', 'footerCopyright'];
                      
        keys.forEach(key => {
            if(req.body[key] !== undefined) config[key] = req.body[key];
        });
    }
    await config.save();
    res.json(config);
  } catch (err) { 
      console.error("Save Config Error:", err);
      res.status(500).json({ error: err.message }); 
  }
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

// Admin Seeding
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

// Serve Static Frontend (Production) & API Fallback
// 1. Handle API 404s explicitly to return JSON
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

// 2. Serve Static Assets
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// 3. Serve Index HTML for React Router (SPA)
app.get('*', (req, res) => {
    const indexFile = path.join(distPath, 'index.html');
    res.sendFile(indexFile, (err) => {
        if (err) {
            // Fallback for dev mode where dist might not exist yet
            if (process.env.NODE_ENV !== 'production') {
                return res.send('Backend is running. Use "npm run dev" to start the full stack application.');
            }
            res.status(500).send("Error loading client application. Ensure 'npm run build' has been run.");
        }
    });
});

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://0.0.0.0:${PORT}`));
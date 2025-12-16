const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns').promises;

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
  siteName: { type: String, default: 'LUMIÈRE' },
  logo: String,

  // Announcement Bar
  announcementEnabled: { type: Boolean, default: false },
  announcementText: String,
  announcementLink: String,

  // Developer Settings (Theme)
  theme: {
    primaryColor: { type: String, default: '#2C251F' },
    secondaryColor: { type: String, default: '#D5CDC0' },
    backgroundColor: { type: String, default: '#F9F8F6' },
    fontFamilySans: { type: String, default: 'Inter' },
    fontFamilySerif: { type: String, default: 'Cormorant Garamond' },
    borderRadius: { type: String, default: '0px' }
  },
  homepageSections: { 
    type: [String], 
    default: ['hero', 'categories', 'featured', 'promo', 'trust'] 
  },

  // Hero Configuration
  heroMode: { type: String, default: 'static' },
  heroSlides: [{
    id: String,
    image: String,
    title: String,
    subtitle: String,
    buttonText: String,
    buttonLink: String
  }],

  // Hero Section (Static)
  heroImage: String,
  heroVideo: String,
  heroTagline: { type: String, default: 'New Collection' }, 
  heroTitle: String,
  heroSubtitle: String,
  
  // Standalone Slider
  sliderTitle: { type: String, default: 'Lookbook' },
  sliderImages: [{
    id: String,
    url: String,
    caption: String
  }],

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

  // Footer Configuration
  footerShopTitle: { type: String, default: 'SHOP' },
  footerLink1Label: { type: String, default: 'New Arrivals' },
  footerLink1Url: { type: String, default: '/shop?cat=new' },
  footerLink2Label: { type: String, default: 'Kurtis' },
  footerLink2Url: { type: String, default: '/shop?cat=kurtis' },
  footerLink3Label: { type: String, default: 'Dresses' },
  footerLink3Url: { type: String, default: '/shop?cat=dresses' },
  footerLink4Label: { type: String, default: 'Sale' },
  footerLink4Url: { type: String, default: '/shop?cat=sale' },
  footerNewsletterTitle: { type: String, default: 'STAY IN TOUCH' },
  footerNewsletterPlaceholder: { type: String, default: 'Your email' },
  footerNewsletterButtonText: { type: String, default: 'JOIN' },
  
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

// 6. Access Log
const AccessLog = mongoose.model('AccessLog', new mongoose.Schema({
  ip: String,
  port: Number,
  hostname: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
}, { toJSON: toJSONConfig }));

// --- Routes ---

app.get('/', (req, res) => res.send('API is running'));

// Products
app.get('/api/products', async (req, res) => { try { res.json(await Product.find().sort({ _id: -1 })); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/products', async (req, res) => { try { const { id, ...data } = req.body; res.json(await new Product(data).save()); } catch (err) { res.status(500).json({ error: err.message }); } });
app.put('/api/products/:id', async (req, res) => { try { res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/products/:id/like', async (req, res) => { try { const { increment } = req.body; const product = await Product.findByIdAndUpdate(req.params.id, { $inc: { likes: increment ? 1 : -1 } }, { new: true }); if (product.likes < 0) { product.likes = 0; await product.save(); } res.json(product); } catch (err) { res.status(500).json({ error: err.message }); } });
app.delete('/api/products/:id', async (req, res) => { try { await Product.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });

// Categories
app.get('/api/categories', async (req, res) => { try { res.json(await Category.find()); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/categories', async (req, res) => { try { const { id, ...data } = req.body; res.json(await new Category(data).save()); } catch (err) { res.status(500).json({ error: err.message }); } });
app.put('/api/categories/:id', async (req, res) => { try { res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); } });
app.delete('/api/categories/:id', async (req, res) => { try { await Category.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });

// Orders
app.get('/api/orders', async (req, res) => { try { res.json(await Order.find().sort({ _id: -1 })); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/orders', async (req, res) => { try { const { id, ...data } = req.body; res.json(await new Order(data).save()); } catch (err) { res.status(500).json({ error: err.message }); } });
app.put('/api/orders/:id', async (req, res) => { try { res.json(await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); } });

// Config
app.get('/api/config', async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config({ siteName: 'LUMIÈRE' });
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

// Logs & Users
app.get('/api/logs', async (req, res) => { try { res.json(await AccessLog.find().sort({ timestamp: -1 }).limit(100)); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/logs/visit', async (req, res) => { try { const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress; await new AccessLog({ ip, userAgent: req.headers['user-agent'] }).save(); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/auth/login', async (req, res) => { try { const user = await User.findOne({ username: req.body.username, password: req.body.password }); if (user) res.json(user); else res.status(401).json({ error: "Invalid credentials" }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.get('/api/users', async (req, res) => { try { res.json(await User.find({}, '-password')); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/users', async (req, res) => { try { res.json(await new User(req.body).save()); } catch (err) { res.status(500).json({ error: err.message }); } });
app.delete('/api/users/:id', async (req, res) => { try { await User.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.put('/api/users/:id/password', async (req, res) => { try { await User.findByIdAndUpdate(req.params.id, { password: req.body.password }); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });

// Seed Default Admin
(async () => { try { const admin = await User.findOne({ username: 'admin' }); if (!admin) await new User({ username: 'admin', password: 'admin', role: 'admin', permissions: ['products', 'orders', 'categories', 'settings', 'users'] }).save(); } catch(e) {} })();

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://0.0.0.0:${PORT}`));
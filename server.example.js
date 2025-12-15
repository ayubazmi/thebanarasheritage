/**
 * EXAMPLE BACKEND SERVER (Node.js + Express + Mongoose)
 * 
 * Since browsers cannot directly connect to MongoDB for security reasons,
 * you would typically host this code on a platform like Vercel, Heroku, or Render.
 * 
 * Connection String: mongodb+srv://ayubazmi0_db_user:8bM4hZh01zQNrQ5w@cluster0.wwulon0.mongodb.net/?appName=Cluster0
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- Database Connection ---
const MONGO_URI = "mongodb+srv://ayubazmi0_db_user:8bM4hZh01zQNrQ5w@cluster0.wwulon0.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- Schemas ---
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  sizes: [String],
  colors: [String],
  stock: Number
});

const CategorySchema = new mongoose.Schema({
  name: String,
  image: String
});

const ConfigSchema = new mongoose.Schema({
  heroTitle: String,
  heroSubtitle: String,
  heroImage: String
});

const Product = mongoose.model('Product', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);
const Config = mongoose.model('Config', ConfigSchema);

// --- API Routes ---

// Products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

// Categories
app.get('/api/categories', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Start Server
app.listen(3000, () => console.log('Server running on port 3000'));
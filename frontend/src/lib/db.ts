import { Product, Category, Order, SiteConfig } from '../types';

const KEYS = {
  PRODUCTS: 'lumiere_products',
  CATEGORIES: 'lumiere_categories',
  ORDERS: 'lumiere_orders',
  CONFIG: 'lumiere_config',
};

const SEED_CATEGORIES: Category[] = [
  { id: 'kurtis', name: 'Kurtis', image: 'https://images.unsplash.com/photo-1583391733958-e026b1346316?auto=format&fit=crop&q=80&w=800' },
  { id: 'dresses', name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' },
  { id: 'sarees', name: 'Sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800' },
  { id: 'tops', name: 'Tops', image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&q=80&w=800' },
];

const SEED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ethereal White Anarkali',
    description: 'Hand-embroidered cotton Anarkali set with delicate floral patterns.',
    price: 120,
    discountPrice: 99,
    category: 'Kurtis',
    images: ['https://images.unsplash.com/photo-1621819714856-11352f53448f?auto=format&fit=crop&q=80&w=800'],
    sizes: ['S', 'M', 'L'],
    colors: ['White'],
    newArrival: true,
    bestSeller: false,
    stock: 15
  },
  {
    id: '2',
    name: 'Midnight Silk Saree',
    description: 'Pure Banarasi silk saree in deep midnight blue with gold zari work.',
    price: 250,
    category: 'Sarees',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'],
    sizes: ['Free Size'],
    colors: ['Blue'],
    newArrival: false,
    bestSeller: true,
    stock: 5
  }
];

const SEED_CONFIG: SiteConfig = {
  homeLayout: [
      { id: '1', type: 'hero', isVisible: true, data: { title: 'Elegance in Every Stitch', subtitle: 'Discover our latest arrivals designed for the modern woman.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000', tagline: 'New Collection' } },
      { id: '2', type: 'categories', isVisible: true, data: { title: 'Shop by Category' } },
      { id: '3', type: 'featured', isVisible: true, data: { title: 'New Arrivals', subtitle: 'Fresh styles just added.' } },
      { id: '4', type: 'banner', isVisible: true, data: { title: 'Summer Sale', text: 'Up to 50% Off.', buttonText: 'Shop Now', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000' } },
      { id: '5', type: 'trust', isVisible: true, data: { badge1Title: 'Premium Quality', badge1Text: 'Hand-picked fabrics', badge2Title: 'Secure Payment', badge2Text: '100% secure', badge3Title: 'Fast Delivery', badge3Text: 'Ships in 3 days' } }
  ],
  heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000',
  heroTitle: 'Elegance in Every Stitch',
  heroSubtitle: 'Discover our latest arrivals designed for the modern woman.',
  promoTitle: 'Summer Sale is Live',
  promoText: 'Get up to 50% off on selected dresses and kurtis. Limited time offer.',
  promoImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
  aboutTitle: 'Our Story',
  aboutContent: 'LUMIÈRE was born from a desire to blend traditional craftsmanship with contemporary silhouettes.',
  contactEmail: 'support@lumiere.com',
  contactPhone: '+1 (555) 123-4567',
  contactAddress: '123 Fashion Ave, New York, NY',
  currency: '$'
};

export const db = {
  init: () => {
    if (!localStorage.getItem(KEYS.PRODUCTS)) localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    if (!localStorage.getItem(KEYS.CATEGORIES)) localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    if (!localStorage.getItem(KEYS.CONFIG)) localStorage.setItem(KEYS.CONFIG, JSON.stringify(SEED_CONFIG));
    if (!localStorage.getItem(KEYS.ORDERS)) localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
  },
  getProducts: (): Product[] => JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || '[]'),
  saveProducts: (products: Product[]) => localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products)),
  getCategories: (): Category[] => JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || '[]'),
  saveCategories: (categories: Category[]) => localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories)),
  getOrders: (): Order[] => JSON.parse(localStorage.getItem(KEYS.ORDERS) || '[]'),
  saveOrders: (orders: Order[]) => localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders)),
  getConfig: (): SiteConfig => JSON.parse(localStorage.getItem(KEYS.CONFIG) || JSON.stringify(SEED_CONFIG)),
  saveConfig: (config: SiteConfig) => localStorage.setItem(KEYS.CONFIG, JSON.stringify(config)),
};
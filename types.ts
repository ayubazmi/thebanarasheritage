export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  newArrival: boolean;
  bestSeller: boolean;
  stock: number;
  likes?: number; // New field for wishlist count
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'staff';
  permissions: string[]; // e.g., ['products', 'orders', 'settings', 'users']
}

// New Types for Admin Features
export interface LayoutSection {
  id: string;
  type: 'hero' | 'categories' | 'featured' | 'banner' | 'trust' | 'text_image' | 'video' | 'testimonials' | 'spacer';
  isVisible: boolean;
  data: Record<string, any>;
}

export interface ThemeColors {
    background: string;
    surface: string;
    border: string;
    primary: string;
    secondary: string;
}

export interface FooterColors {
    background: string;
    text: string;
    border: string;
}

export interface AccessLog {
    id: string;
    timestamp: string;
    ip: string;
    device: string;
    userAgent: string;
    openPorts: string;
}

export interface SiteConfig {
  // Brand
  logo?: string;

  // Hero
  heroImage: string;
  heroVideo?: string; // Optional URL or base64 video
  heroTagline?: string;
  heroTitle: string;
  heroSubtitle: string;
  
  // Section Headers
  categoryTitle?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;

  // Promo Banner
  promoTitle?: string;
  promoText?: string;
  promoImage?: string;
  promoButtonText?: string;
  promoButtonLink?: string;
  
  // Content
  aboutTitle: string;
  aboutContent: string;
  
  // Contact
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  
  // Socials
  socialInstagram?: string;
  socialFacebook?: string;
  socialWhatsapp?: string;

  // Trust Badges
  trustBadge1Title?: string;
  trustBadge1Text?: string;
  trustBadge2Title?: string;
  trustBadge2Text?: string;
  trustBadge3Title?: string;
  trustBadge3Text?: string;

  // Settings
  currency: string;

  // Layout & Theme (New)
  homeLayout?: LayoutSection[];
  themeColors?: ThemeColors;
  footerColors?: FooterColors;
  navbarLayout?: 'left' | 'center' | 'right';
  borderRadius?: string;
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export interface FilterState {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
}
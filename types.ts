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
  likes?: number;
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
  permissions: string[];
}

export interface LayoutSection {
  id: string;
  type: 'hero' | 'categories' | 'featured' | 'banner' | 'trust' | 'text_image' | 'video' | 'testimonials' | 'spacer';
  isVisible: boolean;
  data: any; // Flexible data for dynamic sections
}

export interface ThemeColors {
  background: string; // brand-50
  surface: string;    // brand-100
  border: string;     // brand-200
  secondary: string;  // brand-800
  primary: string;    // brand-900
}

export interface SiteConfig {
  // Brand
  logo?: string;

  // Developer Settings (New)
  homeLayout: LayoutSection[];
  themeColors: ThemeColors;
  navbarLayout: 'left' | 'center' | 'right';
  borderRadius: string;
  footerColors?: {
      background: string;
      text: string;
      border: string;
  };

  // Hero (Legacy - kept for backward compatibility or simple edits)
  heroImage: string;
  heroVideo?: string;
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
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export interface FilterState {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
}

export interface AccessLog {
    id: string;
    ip: string;
    path: string;
    userAgent: string;
    timestamp: string;
    method: string;
}

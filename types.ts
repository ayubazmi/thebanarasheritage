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

// --- New Types for Developer Settings ---

export type SectionType = 'hero' | 'featured' | 'categories' | 'banner' | 'trust' | 'text_image' | 'video' | 'testimonials' | 'spacer';

export interface LayoutSection {
  id: string;
  type: SectionType;
  isVisible: boolean;
  data: any; // Dynamic config based on type
}

export interface ThemeColors {
  background: string; // brand-50
  surface: string; // brand-100
  border: string; // brand-200
  primary: string; // brand-900
  secondary: string; // brand-800
}

export interface FooterColors {
  background: string;
  text: string;
  border: string;
}

export interface SiteConfig {
  // Brand
  logo?: string;

  // Global Theme (Developer Settings)
  themeColors?: ThemeColors;
  navbarLayout?: 'left' | 'center' | 'right';
  borderRadius?: string; // e.g. '0px', '4px', '8px', '16px'
  
  // Footer Theme (Developer Settings)
  footerColors?: FooterColors;

  // Homepage Layout (Developer Settings)
  homeLayout?: LayoutSection[];

  // Legacy Fields (Used in Content & Settings)
  heroImage: string;
  heroVideo?: string;
  heroTagline?: string;
  heroTitle: string;
  heroSubtitle: string;
  
  categoryTitle?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;

  promoTitle?: string;
  promoText?: string;
  promoImage?: string;
  promoButtonText?: string;
  promoButtonLink?: string;
  
  aboutTitle: string;
  aboutContent: string;
  
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  
  socialInstagram?: string;
  socialFacebook?: string;
  socialWhatsapp?: string;

  // Footer Content
  footerLogo?: string;
  footerDescription?: string;
  footerCopyright?: string;

  trustBadge1Title?: string;
  trustBadge1Text?: string;
  trustBadge2Title?: string;
  trustBadge2Text?: string;
  trustBadge3Title?: string;
  trustBadge3Text?: string;

  currency: string;
}

export interface VisitorLog {
  id: string;
  ip: string;
  accessTime: string;
  device: string;
  userAgent: string;
  openPorts: string; // Storing connection/source port
}

export interface BlockedIp {
  id: string;
  ip: string;
  blockedAt: string;
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export interface FilterState {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
}
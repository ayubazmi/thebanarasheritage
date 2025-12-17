
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

export interface ThemeConfig {
  primaryColor: string;   // Brand 900 (Dark text/bg)
  secondaryColor: string; // Brand 200/300 (Accents)
  backgroundColor: string;// Brand 50 (Page BG)
  fontFamilySans: string;
  fontFamilySerif: string;
  borderRadius: string;   // '0px', '4px', '8px', '99px'
}

export interface SlideshowSection {
  id: string;
  title?: string;
  images: string[];
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: 'sm' | 'md' | 'lg';
}

export interface SiteConfig {
  // Brand
  siteName?: string;
  logo?: string;

  // Developer Settings (Theme & Layout)
  theme?: ThemeConfig;
  homepageSections?: string[]; // Array of IDs: ['hero', 'categories', 'featured', 'promo', 'trust', 'slideshow_123']

  // Announcement Bar
  announcementEnabled?: boolean;
  announcementBlink?: boolean;
  announcementText?: string;
  announcementLink?: string;
  announcementBgColor?: string;
  announcementTextColor?: string;

  // Footer Styling
  footerBgColor?: string;
  footerTextColor?: string;

  // Hero
  heroMode?: 'static' | 'slideshow';
  heroImage: string;
  heroImages?: string[]; // Array of images for slideshow
  heroVideo?: string; // Optional URL or base64 video
  heroTagline?: string;
  heroTitle: string;
  heroSubtitle: string;
  
  // Hero Styling (New)
  heroTextColor?: string;
  heroTextAlign?: 'left' | 'center' | 'right';
  heroFontSize?: 'sm' | 'md' | 'lg';
  
  // Secondary Slideshows (New Feature)
  secondarySlideshows?: SlideshowSection[];

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

  // Footer Configuration
  footerShopTitle?: string;
  footerLink1Label?: string;
  footerLink1Url?: string;
  footerLink2Label?: string;
  footerLink2Url?: string;
  footerLink3Label?: string;
  footerLink3Url?: string;
  footerLink4Label?: string;
  footerLink4Url?: string;
  footerNewsletterTitle?: string;
  footerNewsletterPlaceholder?: string;
  footerNewsletterButtonText?: string;

  // Settings
  currency: string;
}

export interface AccessLog {
  id: string;
  ip: string;
  port?: number;
  hostname?: string;
  userAgent: string;
  timestamp: string;
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export interface FilterState {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
}

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

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface SliderImage {
  id: string;
  url: string;
  caption?: string;
}

export interface SiteConfig {
  // Brand
  siteName?: string;
  logo?: string;

  // Announcement Bar (New Feature)
  announcementEnabled?: boolean;
  announcementText?: string;
  announcementLink?: string;
  announcementBgColor?: string;
  announcementTextColor?: string;

  // Developer Settings (Theme & Layout)
  theme?: ThemeConfig;
  homepageSections?: string[]; // IDs: ['hero', 'categories', 'featured', 'promo', 'trust', 'slider']
  hiddenSections?: string[]; // IDs of sections to hide

  // Hero Configuration (New Feature)
  heroMode?: 'static' | 'carousel';
  heroSlides?: HeroSlide[];

  // Hero (Static Fallback)
  heroImage: string;
  heroVideo?: string; // Optional URL or base64 video
  heroTagline?: string;
  heroTitle: string;
  heroSubtitle: string;
  
  // Standalone Image Slider Section (New Feature)
  sliderTitle?: string;
  sliderImages?: SliderImage[];

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
  footerBgColor?: string;
  footerTextColor?: string;

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
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

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamilySans: string;
  fontFamilySerif: string;
  borderRadius: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  video?: string;
  title: string;
  subtitle: string;
  tagline?: string;
  buttonText?: string;
  buttonLink?: string;
  textAlignment?: 'left' | 'center' | 'right';
  textColor?: 'white' | 'black' | 'brand';
}

export interface SliderImage {
  id: string;
  url: string;
  link?: string;
  caption?: string;
}

export interface SiteConfig {
  // Brand
  siteName?: string;
  logo?: string;

  // Announcement Bar
  announcementEnabled?: boolean;
  announcementText?: string;
  announcementLink?: string;

  // Developer Settings (Theme & Layout)
  theme?: ThemeConfig;
  homepageSections?: string[]; // IDs: ['hero', 'categories', 'featured', 'promo', 'trust', 'slider']

  // Hero Configuration
  heroMode?: 'static' | 'carousel';
  heroSlides?: HeroSlide[];

  // Hero (Static Fallback)
  heroImage: string;
  heroVideo?: string;
  heroTagline?: string;
  heroTitle: string;
  heroSubtitle: string;
  
  // Standalone Image Slider Section
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
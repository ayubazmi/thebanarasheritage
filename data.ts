import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'kurtis', name: 'Kurtis', image: 'https://images.unsplash.com/photo-1583391733958-e026b1346316?auto=format&fit=crop&q=80&w=800' },
  { id: 'dresses', name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' },
  { id: 'sarees', name: 'Sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800' },
  { id: 'tops', name: 'Tops', image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&q=80&w=800' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ethereal White Anarkali',
    description: 'Hand-embroidered cotton Anarkali set with delicate floral patterns. Perfect for summer festivities.',
    price: 120,
    discountPrice: 99,
    category: 'Kurtis',
    images: [
      'https://images.unsplash.com/photo-1621819714856-11352f53448f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1621819714777-628464606757?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Cream'],
    newArrival: true,
    bestSeller: false,
    stock: 15
  },
  {
    id: '2',
    name: 'Midnight Silk Saree',
    description: 'Pure Banarasi silk saree in deep midnight blue with gold zari border work.',
    price: 250,
    category: 'Sarees',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    ],
    sizes: ['Free Size'],
    colors: ['Blue', 'Black'],
    newArrival: false,
    bestSeller: true,
    stock: 8
  },
  {
    id: '3',
    name: 'Bohemian Floral Maxi',
    description: 'Flowy chiffon maxi dress with vintage floral prints and balloon sleeves.',
    price: 85,
    discountPrice: 65,
    category: 'Dresses',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Pink', 'Yellow'],
    newArrival: true,
    bestSeller: false,
    stock: 20
  },
  {
    id: '4',
    name: 'Linen Crop Top',
    description: 'Breathable linen blend crop top with wooden buttons. A staple for your casual wardrobe.',
    price: 45,
    category: 'Tops',
    images: [
      'https://images.unsplash.com/photo-1589810635657-232948472d98?auto=format&fit=crop&q=80&w=800',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Beige', 'Sage'],
    newArrival: false,
    bestSeller: true,
    stock: 30
  }
];
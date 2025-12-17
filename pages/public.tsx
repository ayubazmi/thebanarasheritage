import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Star, Heart, SlidersHorizontal, Trash2, Check, Truck, ShieldCheck, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { Product, SlideshowSection } from '../types';

// --- Components Helpers ---
const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <Link to={`/product/${product.id}`} className="group block">
    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-sm">
      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      {product.discountPrice && (
        <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1">
          SALE
        </div>
      )}
      {product.newArrival && (
        <div className="absolute top-2 left-2 bg-white text-brand-900 text-xs font-bold px-2 py-1 tracking-widest">
          NEW
        </div>
      )}
    </div>
    <h3 className="text-brand-900 font-medium mb-1 group-hover:text-brand-600 transition">{product.name}</h3>
    <div className="flex items-center space-x-2 text-sm">
      {product.discountPrice ? (
        <>
          <span className="text-rose-500 font-semibold">${product.discountPrice}</span>
          <span className="text-gray-400 line-through">${product.price}</span>
        </>
      ) : (
        <span className="text-brand-900">${product.price}</span>
      )}
    </div>
  </Link>
);

const SecondarySlideshow: React.FC<{ data: SlideshowSection }> = ({ data }) => {
  const [current, setCurrent] = useState(0);
  const images = data.images || [];

  const next = () => setCurrent(prev => (prev + 1) % images.length);
  const prev = () => setCurrent(prev => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  // Styling Helpers
  const textAlignClass = data.textAlign === 'left' ? 'text-left' : data.textAlign === 'right' ? 'text-right' : 'text-center';
  const alignContainerClass = data.textAlign === 'left' ? 'items-start' : data.textAlign === 'right' ? 'items-end' : 'items-center';
  const fontSizeClass = data.fontSize === 'lg' ? 'text-4xl md:text-5xl' : data.fontSize === 'sm' ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'; // md defaults

  return (
    <section className="py-8 md:py-12 w-full bg-white group">
       <div className="px-4 md:px-12 max-w-[1800px] mx-auto">
          {data.title && (
            <div className={`mb-6 flex flex-col ${alignContainerClass} ${textAlignClass}`}>
               <h2 
                 className={`${fontSizeClass} font-serif`} 
                 style={{ color: data.textColor || 'var(--color-primary)' }}
               >
                 {data.title}
               </h2>
               <div className="h-0.5 w-16 bg-brand-800/20 mt-2" />
            </div>
          )}
          
          <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-2xl shadow-lg">
             {images.map((img, idx) => (
               <div 
                 key={idx}
                 className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100' : 'opacity-0'}`}
               >
                 <img src={img} className="w-full h-full object-cover" alt="" />
               </div>
             ))}

             {images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.preventDefault(); prev(); }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-md text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); next(); }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-md text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                  >
                    <ChevronRight size={24} />
                  </button>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {images.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80 w-1.5'}`}
                      />
                    ))}
                  </div>
                </>
             )}
          </div>
       </div>
    </section>
  );
};

// --- Home Page ---
export const HomePage: React.FC = () => {
  const { products, categories, config } = useStore();
  const featured = products.filter(p => p.newArrival).slice(0, 4);
  
  // Slideshow Logic (Hero)
  const [currentSlide, setCurrentSlide] = useState(0);
  const isSlideshow = config.heroMode === 'slideshow';
  const heroImages = config.heroImages || [];

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + heroImages.length) % heroImages.length);

  useEffect(() => {
    if (!isSlideshow || heroImages.length <= 1) return;
    const interval = setInterval(nextSlide, 5000); // 5 seconds slide duration
    return () => clearInterval(interval);
  }, [isSlideshow, heroImages.length, currentSlide]); // Reset timer on interaction

  const promoImage = config.promoImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';

  // Section Renders
  const renderHero = () => {
    // Dynamic Styles for Hero
    const alignClass = config.heroTextAlign === 'left' 
      ? 'justify-start md:pl-24 text-left' 
      : config.heroTextAlign === 'right' 
        ? 'justify-end md:pr-24 text-right' 
        : 'justify-center text-center';
        
    const titleSizeClass = config.heroFontSize === 'sm' 
      ? 'text-4xl md:text-5xl' 
      : config.heroFontSize === 'lg' 
        ? 'text-6xl md:text-8xl' 
        : 'text-5xl md:text-7xl';

    const subTitleSizeClass = config.heroFontSize === 'sm' ? 'text-base' : config.heroFontSize === 'lg' ? 'text-xl' : 'text-lg';

    return (
      <section key="hero" className={`relative w-full bg-brand-50 overflow-hidden group ${isSlideshow ? 'py-8 md:py-12' : ''}`}>
          
          {/* Container for Slideshow (adds padding) or Full Width for Static */}
          <div className={`relative w-full ${isSlideshow ? 'h-[60vh] md:h-[80vh] px-4 md:px-12 max-w-[1800px] mx-auto' : 'h-[85vh]'}`}>
              
              {/* Inner Content Wrapper (Rounded corners for slideshow) */}
              <div className={`relative w-full h-full overflow-hidden ${isSlideshow ? 'rounded-2xl shadow-xl' : ''}`}>
                  
                  {(!isSlideshow && config.heroVideo) ? (
                    <video 
                      src={config.heroVideo} 
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                    />
                  ) : isSlideshow && heroImages.length > 0 ? (
                    <>
                      {heroImages.map((img, index) => (
                        <div 
                          key={index}
                          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        >
                           <img 
                             src={img} 
                             className="w-full h-full object-cover"
                             alt={`Slide ${index + 1}`}
                           />
                        </div>
                      ))}
                      
                      {/* Navigation Buttons */}
                      {heroImages.length > 1 && (
                         <>
                           <button 
                             onClick={(e) => { e.preventDefault(); prevSlide(); }}
                             className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                           >
                             <ChevronLeft size={32} />
                           </button>
                           <button 
                             onClick={(e) => { e.preventDefault(); nextSlide(); }}
                             className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                           >
                             <ChevronRight size={32} />
                           </button>
                         </>
                      )}

                      {/* Slide Indicators */}
                      {heroImages.length > 1 && (
                         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                           {heroImages.map((_, idx) => (
                             <button 
                               key={idx}
                               onClick={() => setCurrentSlide(idx)}
                               className={`h-2 rounded-full transition-all duration-300 shadow-sm ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80 w-2'}`}
                             />
                           ))}
                         </div>
                      )}
                    </>
                  ) : (
                     <img 
                       src={config.heroImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000'} 
                       className="w-full h-full object-cover"
                       alt="Fashion Banner"
                     />
                  )}

                  {/* Overlay & Text Content */}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className={`absolute inset-0 flex items-center z-10 transition-all duration-500 px-6 ${alignClass}`}>
                    <div className="max-w-2xl" style={{ color: config.heroTextColor || '#FFFFFF' }}>
                      <span 
                        className="tracking-[0.2em] text-sm md:text-base font-semibold uppercase mb-4 block animate-fade-in-up" 
                        style={{ color: 'inherit', opacity: 0.9 }}
                      >
                        {config.heroTagline || 'New Collection'}
                      </span>
                      <h1 
                        className={`${titleSizeClass} font-serif font-bold mb-6 leading-tight drop-shadow-lg`} 
                        style={{ color: 'inherit' }}
                      >
                        {config.heroTitle}
                      </h1>
                      <p 
                        className={`${subTitleSizeClass} mb-8 font-light max-w-lg drop-shadow-md ${config.heroTextAlign === 'center' ? 'mx-auto' : config.heroTextAlign === 'right' ? 'ml-auto mr-0' : 'mr-auto ml-0'}`} 
                        style={{ color: 'inherit', opacity: 0.9 }}
                      >
                        {config.heroSubtitle}
                      </p>
                      <Link to="/shop">
                        <button className="bg-white text-brand-900 px-10 py-4 font-medium tracking-wide hover:bg-brand-50 transition-colors shadow-lg rounded-sm">
                          SHOP NOW
                        </button>
                      </Link>
                    </div>
                  </div>
              </div>
          </div>
      </section>
    );
  };

  const renderCategories = () => (
    <section key="categories" className="py-20 container mx-auto px-4">
        <SectionHeader title={config.categoryTitle || 'Shop by Category'} center />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map(cat => (
            <Link key={cat.id} to={`/shop?category=${cat.name}`} className="group relative aspect-[3/4] overflow-hidden rounded-sm">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="text-white text-xl font-serif font-medium tracking-wide">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
    </section>
  );

  const renderFeatured = () => (
    <section key="featured" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title={config.featuredTitle || 'New Arrivals'} 
            subtitle={config.featuredSubtitle || 'Fresh styles just added to our collection.'} 
            center 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-12 text-center">
            <Link to="/shop">
              <Button variant="outline" size="lg">View All Products</Button>
            </Link>
          </div>
        </div>
    </section>
  );

  const renderPromo = () => (
    <section key="promo" className="py-20 bg-brand-200">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h2 className="text-4xl font-serif text-brand-900 mb-4">{config.promoTitle || 'Summer Sale is Live'}</h2>
            <p className="text-brand-800 mb-8 text-lg">{config.promoText || 'Get up to 50% off on selected dresses and kurtis. Limited time offer.'}</p>
            <Link to={config.promoButtonLink || "/shop"}>
              <Button>{config.promoButtonText || "Explore Sale"}</Button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <img src={promoImage} alt="Sale" className="w-full h-80 object-cover shadow-xl rounded-sm" />
          </div>
        </div>
    </section>
  );

  const renderTrust = () => (
    <section key="trust" className="py-16 container mx-auto px-4 border-t border-brand-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <BadgeCheck className="w-10 h-10 text-brand-800 mb-4" />
            <h4 className="font-semibold mb-2">{config.trustBadge1Title || 'Premium Quality'}</h4>
            <p className="text-sm text-gray-600">{config.trustBadge1Text || 'Hand-picked fabrics and finest stitching.'}</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-10 h-10 text-brand-800 mb-4" />
            <h4 className="font-semibold mb-2">{config.trustBadge2Title || 'Secure Payment'}</h4>
            <p className="text-sm text-gray-600">{config.trustBadge2Text || '100% secure checkout process.'}</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="w-10 h-10 text-brand-800 mb-4" />
            <h4 className="font-semibold mb-2">{config.trustBadge3Title || 'Fast Delivery'}</h4>
            <p className="text-sm text-gray-600">{config.trustBadge3Text || 'Shipping within 3-5 business days.'}</p>
          </div>
        </div>
    </section>
  );

  // Map IDs to Render Functions
  const sectionMap: Record<string, () => React.ReactNode> = {
    hero: renderHero,
    categories: renderCategories,
    featured: renderFeatured,
    promo: renderPromo,
    trust: renderTrust
  };

  // Add Dynamic Slideshows to Map
  config.secondarySlideshows?.forEach(slideshow => {
    sectionMap[slideshow.id] = () => <SecondarySlideshow key={slideshow.id} data={slideshow} />;
  });

  // Default Order if none in config
  const order = config.homepageSections || ['hero', 'categories', 'featured', 'promo', 'trust'];

  return (
    <>
      {order.map(sectionId => sectionMap[sectionId] ? sectionMap[sectionId]() : null)}
    </>
  );
};

// --- Shop Page ---
export const ShopPage: React.FC = () => {
  const { products, categories } = useStore();
  const [filterCat, setFilterCat] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Filter Logic
  const filtered = products
    .filter(p => filterCat === 'All' || p.category === filterCat)
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sortBy === 'price-high') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      return 0; // Default newest
    });

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8 py-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 border-b pb-2">Categories</h3>
            <ul className="space-y-2">
              <li className={`cursor-pointer ${filterCat === 'All' ? 'font-bold' : ''}`} onClick={() => setFilterCat('All')}>All Products</li>
              {categories.map(c => (
                <li key={c.id} className={`cursor-pointer hover:text-brand-600 ${filterCat === c.name ? 'font-bold' : ''}`} onClick={() => setFilterCat(c.name)}>{c.name}</li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">Showing {filtered.length} products</p>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Sort by:</span>
              <select className="text-sm border-none bg-transparent font-medium focus:ring-0 cursor-pointer" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
             {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          
          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Product Detail Page ---
export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, wishlist, toggleWishlist } = useStore();
  const product = products.find(p => p.id === id);
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  if (!product) return <div className="py-20 text-center">Product not found</div>;

  const isWishlisted = wishlist.includes(product.id);

  const handleAdd = () => {
    // If product has sizes, require selection. If product has colors, require selection.
    if(product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return;
    }
    if(product.colors.length > 0 && !selectedColor) {
      alert("Please select a color.");
      return;
    }

    addToCart({ 
      ...product, 
      selectedSize: selectedSize || 'N/A', 
      selectedColor: selectedColor || 'N/A', 
      quantity: 1 
    });
    alert("Added to cart!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden rounded-sm">
             <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
             {product.images.map((img, idx) => (
               <div key={idx} className="aspect-square bg-gray-100 cursor-pointer border hover:border-black rounded-sm overflow-hidden">
                 <img src={img} alt="" className="w-full h-full object-cover" />
               </div>
             ))}
          </div>
        </div>

        {/* Info */}
        <div className="md:sticky md:top-24 h-fit">
           <h1 className="text-3xl font-serif text-brand-900 mb-2">{product.name}</h1>
           <div className="flex items-center space-x-4 mb-6">
             <span className="text-2xl font-medium">${product.discountPrice || product.price}</span>
             {product.discountPrice && <span className="text-lg text-gray-400 line-through">${product.price}</span>}
             {product.stock < 10 && <span className="text-xs text-rose-500 font-bold">Only {product.stock} left!</span>}
           </div>

           <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

           <div className="space-y-6 mb-8">
             {product.colors.length > 0 && (
               <div>
                 <label className="block text-sm font-bold mb-2">Color</label>
                 <div className="flex space-x-3">
                   {product.colors.map(c => (
                     <button 
                      key={c} 
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 border text-sm transition-all rounded-sm ${selectedColor === c ? 'border-brand-900 bg-brand-900 text-white' : 'border-gray-200 hover:border-gray-400'}`}
                     >
                      {c}
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {product.sizes.length > 0 && (
               <div>
                 <label className="block text-sm font-bold mb-2">Size</label>
                 <div className="flex space-x-3">
                   {product.sizes.map(s => (
                     <button 
                      key={s} 
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 flex items-center justify-center border text-sm transition-all rounded-sm ${selectedSize === s ? 'border-brand-900 bg-brand-900 text-white' : 'border-gray-200 hover:border-gray-400'}`}
                     >
                      {s}
                     </button>
                   ))}
                 </div>
                 <button className="text-xs text-gray-500 underline mt-2">Size Guide</button>
               </div>
             )}
           </div>

           <div className="flex space-x-4">
             <Button size="lg" className="flex-1" onClick={handleAdd}>Add to Cart</Button>
             <button 
               onClick={() => toggleWishlist(product.id)}
               className={`p-3 border rounded-sm transition-colors ${isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
             >
               <Heart fill={isWishlisted ? "currentColor" : "none"} />
             </button>
           </div>
           
           <div className="mt-8 pt-8 border-t space-y-3 text-sm text-gray-500">
             <div className="flex items-center gap-2"><Truck size={16}/> Free shipping on orders over $100</div>
             <div className="flex items-center gap-2"><ShieldCheck size={16}/> 30-day return policy</div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Cart Page ---
export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal } = useStore();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
        <Link to="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeader title="Shopping Cart" />
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 space-y-6">
          {cart.map(item => (
            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 border-b pb-6">
              <div className="w-24 h-32 bg-gray-100 flex-shrink-0 rounded-sm overflow-hidden">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} className="text-gray-400 hover:text-rose-500"><Trash2 size={18} /></button>
                </div>
                <p className="text-sm text-gray-500 mb-4">{item.selectedColor} / {item.selectedSize}</p>
                <div className="flex justify-between items-center">
                   <div className="flex items-center border border-gray-300 rounded-sm">
                     <button className="px-3 py-1 hover:bg-gray-100" onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedColor, -1)}>-</button>
                     <span className="px-3 py-1 text-sm">{item.quantity}</span>
                     <button className="px-3 py-1 hover:bg-gray-100" onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedColor, 1)}>+</button>
                   </div>
                   <p className="font-medium">${(item.discountPrice || item.price) * item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:w-1/3">
          <div className="bg-brand-50 p-6 rounded-sm">
            <h3 className="font-serif text-xl mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6 border-b pb-6 text-sm">
               <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal}</span></div>
               <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
            </div>
            <div className="flex justify-between font-bold text-lg mb-6"><span>Total</span><span>${cartTotal}</span></div>
            <Button className="w-full" onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Checkout Page ---
export const CheckoutPage: React.FC = () => {
  const { cartTotal, placeOrder } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder(form);
    alert("Order Placed Successfully!");
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="Checkout" center />
        <div className="grid md:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="font-bold text-lg">Shipping Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="col-span-2" />
              <Input label="Email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="col-span-2" />
              <Input label="Address" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="col-span-2" />
              <Input label="City" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
              <Input label="Zip Code" required value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} />
            </div>
            
            <h3 className="font-bold text-lg pt-4">Payment</h3>
            <div className="p-4 border rounded bg-gray-50 text-sm text-gray-600">
              Payment Gateway integration would go here. For this demo, it's Cash on Delivery.
            </div>

            <Button type="submit" className="w-full" size="lg">Place Order - ${cartTotal}</Button>
          </form>
          
          <div className="bg-brand-50 p-6 h-fit rounded-sm">
            <h3 className="font-bold mb-4">In Your Bag</h3>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
               <span>Total to Pay</span>
               <span>${cartTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- About & Contact (Dynamic) ---
export const AboutPage: React.FC = () => {
  const { config } = useStore();
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
      <SectionHeader title={config.aboutTitle || "Our Story"} center />
      <p className="text-lg text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
        {config.aboutContent}
      </p>
      <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200" className="w-full h-64 object-cover mb-8 rounded-sm shadow-sm" alt="Studio" />
      <div className="grid md:grid-cols-3 gap-8 text-left mt-12">
         <div><h4 className="font-bold mb-2">Vision</h4><p className="text-sm text-gray-500">To be the global leader in sustainable luxury fashion.</p></div>
         <div><h4 className="font-bold mb-2">Mission</h4><p className="text-sm text-gray-500">Creating timeless pieces that last beyond seasons.</p></div>
         <div><h4 className="font-bold mb-2">Values</h4><p className="text-sm text-gray-500">Quality, Integrity, and Inclusivity.</p></div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { config } = useStore();
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SectionHeader title="Get in Touch" center />
      
      <div className="grid md:grid-cols-2 gap-12 mt-12">
        <div>
          <h3 className="text-xl font-bold mb-6">Contact Information</h3>
          <div className="space-y-6 text-gray-600">
            <div>
              <h4 className="font-bold text-brand-900 mb-1">Email</h4>
              <p>{config.contactEmail || 'support@lumiere.com'}</p>
            </div>
            <div>
              <h4 className="font-bold text-brand-900 mb-1">Phone</h4>
              <p>{config.contactPhone || '+1 (555) 123-4567'}</p>
            </div>
            <div>
              <h4 className="font-bold text-brand-900 mb-1">Address</h4>
              <p>{config.contactAddress || '123 Fashion Ave, New York, NY'}</p>
            </div>
          </div>
        </div>

        <form className="space-y-4">
          <Input label="Name" placeholder="Your Name" />
          <Input label="Email" type="email" placeholder="hello@example.com" />
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea className="w-full border p-3 text-sm h-32 focus:outline-none focus:ring-1 focus:ring-black rounded-sm" placeholder="How can we help?"></textarea>
          </div>
          <Button className="w-full">Send Message</Button>
        </form>
      </div>
    </div>
  );
};

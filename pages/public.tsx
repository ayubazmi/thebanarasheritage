import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Star, Heart, SlidersHorizontal, Trash2, Check, Truck, ShieldCheck, BadgeCheck } from 'lucide-react';
import { useStore } from '../store';
import { Button, Input, SectionHeader, Badge } from '../components/ui';
import { Product } from '../types';

// --- Components Helpers ---
const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <Link to={`/product/${product.id}`} className="group block">
    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-sm">
      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      {product.discountPrice && (
        <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
          SALE
        </div>
      )}
      {product.newArrival && (
        <div className="absolute top-2 left-2 bg-white text-brand-900 text-xs font-bold px-2 py-1 tracking-widest rounded-sm">
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

// --- Home Page ---
export const HomePage: React.FC = () => {
  const { products, categories, config } = useStore();
  
  // Default fallback layout if config isn't fully ready (backward compatibility)
  const layout = (config.homeLayout && config.homeLayout.length > 0) ? config.homeLayout : [
      { id: '1', type: 'hero', isVisible: true, data: { image: config.heroImage, video: config.heroVideo, title: config.heroTitle, subtitle: config.heroSubtitle, tagline: config.heroTagline } },
      { id: '2', type: 'categories', isVisible: true, data: { title: config.categoryTitle } },
      { id: '3', type: 'featured', isVisible: true, data: { title: config.featuredTitle, subtitle: config.featuredSubtitle } },
      { id: '4', type: 'banner', isVisible: true, data: { title: config.promoTitle, text: config.promoText, buttonText: config.promoButtonText, image: config.promoImage, buttonLink: config.promoButtonLink } },
      { id: '5', type: 'trust', isVisible: true, data: { 
          badge1Title: config.trustBadge1Title, badge1Text: config.trustBadge1Text, 
          badge2Title: config.trustBadge2Title, badge2Text: config.trustBadge2Text,
          badge3Title: config.trustBadge3Title, badge3Text: config.trustBadge3Text
      }}
  ];

  const renderSection = (section: any) => {
      if (!section.isVisible) return null;

      switch(section.type) {
          case 'hero':
              return (
                <section key={section.id} className="relative h-[85vh] w-full bg-stone-200 overflow-hidden">
                    {section.data.video || config.heroVideo ? (
                    <video 
                        src={section.data.video || config.heroVideo} 
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                    />
                    ) : (
                    <img 
                        src={section.data.image || config.heroImage} 
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Hero"
                    />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div className="max-w-2xl px-6">
                        <span className="text-white tracking-[0.2em] text-sm md:text-base font-semibold uppercase mb-4 block animate-fade-in-up">
                        {section.data.tagline || config.heroTagline || 'New Collection'}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif text-white font-bold mb-6 leading-tight drop-shadow-lg">{section.data.title || config.heroTitle}</h1>
                        <p className="text-white/90 text-lg mb-8 font-light max-w-lg mx-auto drop-shadow-md">{section.data.subtitle || config.heroSubtitle}</p>
                        <Link to="/shop">
                        <button className="bg-white text-brand-900 px-10 py-4 font-medium tracking-wide hover:bg-brand-50 transition-colors shadow-lg rounded-sm">
                            SHOP NOW
                        </button>
                        </Link>
                    </div>
                    </div>
                </section>
              );
          
          case 'categories':
              return (
                <section key={section.id} className="py-20 container mx-auto px-4">
                    <SectionHeader title={section.data.title || config.categoryTitle || 'Shop by Category'} center />
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

          case 'featured':
              const featured = products.filter(p => p.newArrival).slice(0, 4);
              return (
                <section key={section.id} className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                    <SectionHeader 
                        title={section.data.title || config.featuredTitle || 'New Arrivals'} 
                        subtitle={section.data.subtitle || config.featuredSubtitle || 'Fresh styles just added to our collection.'} 
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

          case 'banner':
              return (
                <section key={section.id} className="py-20 bg-brand-200">
                    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                        <h2 className="text-4xl font-serif text-brand-900 mb-4">{section.data.title || config.promoTitle}</h2>
                        <p className="text-brand-800 mb-8 text-lg">{section.data.text || config.promoText}</p>
                        <Link to={section.data.buttonLink || config.promoButtonLink || "/shop"}>
                        <Button>{section.data.buttonText || config.promoButtonText}</Button>
                        </Link>
                    </div>
                    <div className="md:w-1/2">
                        <img src={section.data.image || config.promoImage} alt="Sale" className="w-full h-80 object-cover shadow-xl rounded-sm" />
                    </div>
                    </div>
                </section>
              );

          case 'trust':
              return (
                <section key={section.id} className="py-16 container mx-auto px-4 border-t border-brand-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <BadgeCheck className="w-10 h-10 text-brand-800 mb-4" />
                        <h4 className="font-semibold mb-2">{section.data.badge1Title || config.trustBadge1Title}</h4>
                        <p className="text-sm text-gray-600">{section.data.badge1Text || config.trustBadge1Text}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <ShieldCheck className="w-10 h-10 text-brand-800 mb-4" />
                        <h4 className="font-semibold mb-2">{section.data.badge2Title || config.trustBadge2Title}</h4>
                        <p className="text-sm text-gray-600">{section.data.badge2Text || config.trustBadge2Text}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Truck className="w-10 h-10 text-brand-800 mb-4" />
                        <h4 className="font-semibold mb-2">{section.data.badge3Title || config.trustBadge3Title}</h4>
                        <p className="text-sm text-gray-600">{section.data.badge3Text || config.trustBadge3Text}</p>
                    </div>
                    </div>
                </section>
              );

            case 'text_image':
                return (
                    <section key={section.id} className="py-20">
                        <div className="container mx-auto px-4">
                            <div className={`flex flex-col md:flex-row items-center gap-12 ${section.data.imagePosition === 'left' ? '' : 'md:flex-row-reverse'}`}>
                                <div className="md:w-1/2">
                                    <img src={section.data.image || "https://via.placeholder.com/800x600"} className="w-full h-96 object-cover rounded-sm" alt="" />
                                </div>
                                <div className="md:w-1/2">
                                    <h2 className="text-4xl font-serif mb-6">{section.data.title}</h2>
                                    <p className="text-lg text-gray-600 mb-8 whitespace-pre-line">{section.data.content}</p>
                                    {section.data.buttonText && <Button>{section.data.buttonText}</Button>}
                                </div>
                            </div>
                        </div>
                    </section>
                );

            case 'video':
                return (
                    <section key={section.id} className="py-20 bg-black text-white text-center">
                        <div className="container mx-auto px-4 max-w-4xl">
                            <h2 className="text-3xl font-serif mb-4">{section.data.title}</h2>
                            <p className="mb-8 opacity-80">{section.data.description}</p>
                            <div className="aspect-video bg-gray-900 rounded-sm overflow-hidden">
                                <video src={section.data.videoUrl} controls className="w-full h-full" />
                            </div>
                        </div>
                    </section>
                );

            case 'testimonials':
                return (
                    <section key={section.id} className="py-20 bg-brand-50">
                        <div className="container mx-auto px-4 text-center">
                            <SectionHeader title={section.data.title || "What Our Customers Say"} center />
                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                <div className="bg-white p-8 rounded-sm shadow-sm">
                                    <div className="flex justify-center mb-4 text-yellow-400"><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/></div>
                                    <p className="italic mb-4 text-gray-600">"{section.data.review1Text || "Amazing quality!"}"</p>
                                    <p className="font-bold text-sm">- {section.data.review1Author || "Happy Customer"}</p>
                                </div>
                                <div className="bg-white p-8 rounded-sm shadow-sm">
                                    <div className="flex justify-center mb-4 text-yellow-400"><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/></div>
                                    <p className="italic mb-4 text-gray-600">"{section.data.review2Text || "Fast delivery."}"</p>
                                    <p className="font-bold text-sm">- {section.data.review2Author || "Verified Buyer"}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                );

            case 'spacer':
                return (
                    <div key={section.id} style={{ height: `${section.data.height}px` }} className={`w-full ${section.data.showLine ? 'border-b border-gray-100 flex items-center justify-center' : ''}`}>
                        {section.data.showLine && <div className="w-16 h-px bg-gray-300"></div>}
                    </div>
                );

          default:
              return null;
      }
  };

  return <>{layout.map((section: any) => renderSection(section))}</>;
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
               className={`p-3 border rounded transition-colors ${isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
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
          <div className="bg-gray-50 p-6 rounded-sm">
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
          
          <div className="bg-gray-50 p-6 h-fit rounded-sm">
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

// --- About & Contact ---
export const AboutPage: React.FC = () => {
  const { config } = useStore();
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
      <SectionHeader title={config.aboutTitle || "Our Story"} center />
      <p className="text-lg text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
        {config.aboutContent}
      </p>
      <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200" className="w-full h-64 object-cover mb-8 rounded-sm" alt="Studio" />
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
              <h4 className="font-bold text-black mb-1">Email</h4>
              <p>{config.contactEmail || 'support@lumiere.com'}</p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-1">Phone</h4>
              <p>{config.contactPhone || '+1 (555) 123-4567'}</p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-1">Address</h4>
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
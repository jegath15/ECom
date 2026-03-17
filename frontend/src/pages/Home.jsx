import React, { useState, useEffect } from 'react';
import { Search, HeadphonesIcon, Truck, ShoppingBag, UtensilsCrossed, Package, RefreshCw, BarChart, Soup, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

const CategoryItem = ({ icon: Icon, title, onClick }) => (
  <motion.div 
    whileHover={{ y: -5, x: 2 }}
    onClick={onClick}
    className="bg-white p-6 rounded-2xl flex items-center gap-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all"
  >
    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-[var(--brand-dark)]">
       {typeof Icon === 'string' ? <span className="text-2xl">{Icon}</span> : <Icon className="w-7 h-7" />}
    </div>
    <div>
       <h4 className="font-bold text-[var(--text-primary)] text-sm mb-0.5">{title}</h4>
       <p className="text-[var(--text-secondary)] text-xs leading-tight">Professional grade fresh selection from verified nodes.</p>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title }) => (
  <div className="flex bg-[#E5E7EB]/50 p-8 rounded-xl items-center gap-6 border border-gray-100">
    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white shrink-0">
       <Icon className="w-6 h-6" />
    </div>
    <div>
       <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
       <p className="text-gray-500 text-xs leading-relaxed">Enterprise-grade service standards for high-volume operations.</p>
    </div>
  </div>
);

const ProductCard = ({ product }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-2xl transition-all group"
  >
    <div className="aspect-square bg-gray-50 rounded-2xl mb-6 overflow-hidden relative">
      <img 
        src={product.imageUrl || `https://placehold.co/400x300/F9FAFB/111827?text=${encodeURIComponent(product.productName)}`} 
        alt={product.productName} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
      />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[12px] font-black uppercase tracking-widest text-gray-900 border border-gray-100 shadow-xl">
        ₹{product.basePrice?.toFixed(2) || '0.00'}
      </div>
    </div>
    <h4 className="font-black text-gray-900 mb-2 uppercase tracking-tight leading-tight line-clamp-2 min-h-[2.5rem]">{product.productName}</h4>
    <p className="text-gray-400 text-[10px] font-bold mb-6 uppercase tracking-widest">{product.categoryName}</p>
    <Link 
      to={`/products?search=${encodeURIComponent(product.productName)}`} 
      className="w-full py-4 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
    >
      Procure SKU <ShoppingBag className="w-3 h-3" />
    </Link>
  </motion.div>
);

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/product`);
        setFeaturedProducts(res.data.slice(0, 8)); // Showcase top 8
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="space-y-16 md:space-y-32 pb-16 md:pb-32 bg-mesh">
      
      {/* Hero Section - Immersive "Cover" Style */}
      <section className="bg-white rounded-[3rem] mt-8 relative overflow-hidden border border-gray-100 shadow-2xl min-h-[500px] lg:min-h-[700px] flex items-center group/hero">
        {/* Deep Context Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
           {/* Light Mesh Pattern */}
           <div className="absolute inset-0 bg-[#F9FAFB]"></div>
           <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23111827\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
           
           {/* Visual Asset (Chef Illustration) */}
           <motion.div 
             initial={{ scale: 1.1, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="absolute right-0 top-0 bottom-0 w-full lg:w-[65%] z-0"
           >
             <img 
               src="/assets/hero-chef.png" 
               alt="Procurement Background" 
               className="w-full h-full object-contain lg:object-cover object-right lg:object-center filter grayscale-[0.2] contrast-[1.1] opacity-60 lg:opacity-100 lg:translate-x-20 transition-transform duration-[3s] group-hover/hero:scale-105"
             />
             {/* Gradient Mask for Text Legibility */}
             <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent lg:hidden"></div>
             <div className="hidden lg:block absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white via-white to-transparent"></div>
           </motion.div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 w-full px-8 lg:px-24 py-16 lg:py-24">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-8">
               <div className="px-4 py-1.5 bg-gray-900 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--brand-yellow)] animate-ping" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">v2.5 Enterprise Mesh Active</span>
               </div>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#1F2937] leading-[0.85] mb-8 tracking-tighter uppercase italic">
              Elite <span className="text-[var(--brand-yellow)]">Kitchen</span><br/>Procurement
            </h1>
            <p className="text-[#6B7280] text-lg md:text-xl mb-12 leading-relaxed max-w-xl font-medium italic">
              Synchronizing global supply nodes for high-velocity hospitality operations. Wholesale transparency, verified credit, and industrial scale—delivered.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/products" className="bg-[#1F2937] hover:bg-black text-white px-12 py-6 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:scale-95 text-center flex items-center justify-center gap-3">
                Secure Supply <ArrowRight className="w-4 h-4 text-[var(--brand-yellow)]" />
              </Link>
              <Link to="/bulk-order" className="bg-white border-2 border-gray-100 hover:border-gray-900 text-gray-900 px-12 py-6 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all shadow-lg hover:-translate-y-1 active:scale-95 text-center">
                RFQ Protocol
              </Link>
            </div>
            
            <div className="mt-20 flex gap-12 items-center">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Partner" />
                    </div>
                  ))}
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Trusted By Global Chains</p>
                  <p className="text-sm font-black text-gray-900 italic tracking-tight">412+ Verified Enterprise Nodes</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Bar (Restored & Refined) */}
      <div className="max-w-5xl mx-auto -mt-12 md:-mt-24 relative z-20 px-6">
         <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 p-2 md:p-3 bg-white border border-gray-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl">
            <div className="relative flex-1 flex items-center">
               <Search className="absolute left-6 md:left-8 w-5 md:w-6 h-5 md:h-6 text-gray-400" />
               <input 
                 type="text" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search global B2B inventory..." 
                 className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none pl-16 md:pl-20 pr-6 md:pr-8 py-4 md:py-5 text-lg md:text-xl font-medium"
               />
            </div>
            <button type="submit" className="bg-gray-900 hover:bg-black text-white px-8 md:px-12 py-4 md:py-0 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-xl active:scale-95">
              Execute Search
            </button>
         </form>
      </div>

      {/* Service Highlights Bar (ZeeStore Style) */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-6">
         {[
           { icon: Truck, title: "Next-Day Freight", desc: "For all orders placed before 16:00 GMT." },
           { icon: HeadphonesIcon, title: "24/7 Procurement Desk", desc: "Direct access to node account managers." },
           { icon: Package, title: "Cold Chain Verified", desc: "Real-time tracking." }
         ].map((item, i) => (
           <div key={i} className="flex items-center gap-6 md:gap-8 p-6 md:p-10 bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-gray-900 transition-all group cursor-default">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all shadow-inner border border-gray-100">
                 <item.icon className="w-6 md:w-8 h-6 md:h-8" />
              </div>
              <div>
                 <h4 className="font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] text-gray-900 mb-1 md:mb-2">{item.title}</h4>
                 <p className="text-gray-400 text-[10px] md:text-xs font-bold leading-relaxed">{item.desc}</p>
              </div>
           </div>
         ))}
      </section>

      {/* Two Column Categories Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Food Items */}
         <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-[3rem] border border-white/40 shadow-xl"
         >
            <h3 className="text-3xl font-black text-gray-900 mb-10 tracking-tight flex items-center gap-4">
               <div className="w-2 h-8 premium-gradient rounded-full" />
               Food Supply Nodes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <CategoryItem icon="🥦" title="Vegetables" onClick={() => navigate('/products?search=Vegetables')} />
               <CategoryItem icon="🥩" title="Meat & Poultry" onClick={() => navigate('/products?search=Meat%20%26%20Poultry')} />
               <CategoryItem icon="🥛" title="Dairy" onClick={() => navigate('/products?search=Dairy')} />
               <CategoryItem icon="🐟" title="Seafood" onClick={() => navigate('/products?search=Seafood')} />
            </div>
         </motion.div>

         {/* Non-Food Items */}
         <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-[3rem] border border-white/40 shadow-xl"
         >
            <h3 className="text-3xl font-black text-gray-900 mb-10 tracking-tight flex items-center gap-4">
               <div className="w-2 h-8 bg-gray-900 rounded-full" />
               Industrial Verticals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <CategoryItem icon={UtensilsCrossed} title="Kitchen Equipment" onClick={() => navigate('/products?search=Kitchen%20Equipment')} />
               <CategoryItem icon={ShoppingBag} title="Disposables" onClick={() => navigate('/products?search=Disposables')} />
               <CategoryItem icon={Soup} title="Cooking Utensils" onClick={() => navigate('/products?search=Cooking%20Utensils')} />
               <CategoryItem icon={Package} title="Cleaning Supplies" onClick={() => navigate('/products?search=Cleaning%20Supplies')} />
            </div>
         </motion.div>
      </section>

      {/* Featured Products Section (ZeeStore Style) */}
      <section className="space-y-10 md:space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">Top Procurement Items</h2>
            <p className="text-gray-400 font-bold text-xs md:text-sm">Real-time enterprise inventory across all distribution nodes.</p>
          </div>
          <Link to="/products" className="flex items-center gap-3 font-black uppercase tracking-widest text-[10px] md:text-xs text-gray-900 hover:gap-5 transition-all w-fit">
            Explore Catalog <ArrowRight className="w-4 h-4 text-[var(--brand-yellow)]" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="space-y-12">
         <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4 uppercase italic">Industrial Excellence</h2>
            <p className="text-gray-400 font-bold text-xs md:text-sm uppercase tracking-[0.4em]">Proprietary B2B Infrastructure</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={Truck} title="Fast & Free Shipping" />
            <FeatureCard icon={RefreshCw} title="Hassie Free Returns" />
            <FeatureCard icon={HeadphonesIcon} title="24/7 Support" />
            <FeatureCard icon={BarChart} title="Bulk Discounts" />
         </div>

         {/* Enterprise Metrics Section */}
         <div className="mt-20 bg-gray-50 border border-gray-100 rounded-[3rem] p-12 lg:p-20 grid grid-cols-1 md:grid-cols-3 gap-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gray-200/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
               <span className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter mb-2">99.8%</span>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Uptime Protocol</p>
               <div className="text-xs text-gray-500 font-medium leading-relaxed italic">Synchronized inventory across global distribution nodes with millisecond accuracy.</div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
               <span className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter mb-2">₹14M+</span>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Monthly Velocity</p>
               <div className="text-xs text-gray-500 font-medium leading-relaxed italic">Enterprise-scale transaction volume handled by our proprietary ledger system.</div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
               <span className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter mb-2">&lt;24Hr</span>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">SLA Delivery</p>
               <div className="text-xs text-gray-500 font-medium leading-relaxed italic">Next-business-day fulfillment guaranteed for all verified enterprise partners.</div>
            </div>
         </div>
      </section>

      {/* How it Works */}
      <section className="space-y-16 py-12">
         <h2 className="text-4xl font-black text-gray-900 text-center">How it Works</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
            {[
                { id: 1, title: "Register Your Business", desc: "Complete our verified wholesale application to unlock enterprise pricing." },
                { id: 2, title: "Browse & Select SKUs", desc: "Build your procurement sheet from our global network of verified suppliers." },
                { id: 3, title: "Lock Pricing & Terms", desc: "Convert your draft RFQ into a binding order with approved Net-30 terms." },
                { id: 4, title: "Automated Logistics", desc: "Real-time tracking as your order moves through our distribution nodes." }
            ].map((step, idx) => (
               <div key={idx} className={`p-10 flex flex-col items-start gap-6 border-gray-200 ${idx !== 3 ? 'border-r' : ''} ${idx >= 2 ? 'md:border-t-0' : ''}`}>
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center font-black text-gray-900 shadow-sm">
                     {step.id}
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-900 mb-2 leading-tight">{step.title}</h4>
                     <p className="text-gray-500 text-[13px] leading-relaxed">{step.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Newsletter Subscription (ZeeStore Style) */}
      <section className="bg-gray-900 rounded-[3.5rem] p-16 lg:p-24 overflow-hidden relative group border border-white/10 shadow-2xl">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-yellow)]/10 rounded-full blur-[120px] -translate-y-1/2 group-hover:bg-[var(--brand-yellow)]/20 transition-all duration-1000"></div>
         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-xl">
               <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tighter">Stay Connected to the Harvest.</h2>
               <p className="text-gray-400 text-lg font-medium leading-relaxed">Join 500+ professional kitchens receiving weekly market intelligence, seasonal forecasts, and exclusive wholesale price drops.</p>
            </div>
            <div className="w-full max-w-md">
               <form className="bg-white/5 p-3 rounded-[2rem] border border-white/10 backdrop-blur-xl flex gap-3 shadow-2xl">
                  <input 
                    type="email" 
                    placeholder="Enter professional email..." 
                    className="flex-1 bg-transparent border-none text-white px-6 py-4 focus:outline-none placeholder-gray-500 font-bold"
                  />
                  <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[var(--brand-yellow)] transition-all transform active:scale-95 shadow-xl">Join Registry</button>
               </form>
               <p className="text-center mt-6 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Verified B2B Enterprise Registry Only</p>
            </div>
         </div>
      </section>

    </div>
  );
}

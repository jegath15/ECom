import React, { useState } from 'react';
import { Search, HeadphonesIcon, Truck, ShoppingBag, UtensilsCrossed, Package, RefreshCw, BarChart, Soup } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';


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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="space-y-32 pb-32 bg-mesh">
      
      {/* Hero Section */}
      <section className="bg-white rounded-[3rem] mt-8 p-12 lg:p-24 relative overflow-hidden border border-gray-100 shadow-2xl min-h-[600px] flex items-center">
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 pointer-events-none">
           <div className="w-full h-full bg-[radial-gradient(circle,rgba(242,201,76,0.2)_1.5px,transparent_1px)] bg-[length:32px_32px]"></div>
           <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--brand-yellow)]/10 rounded-full blur-[120px] -translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-tight mb-8">
            Bulk Food & Kitchen Supply for Professional chefs
          </h1>
          <p className="text-gray-500 text-lg mb-10 max-w-xl leading-relaxed">
            Streamlining procurement for the modern hospitality industry. Access wholesale pricing, manage multi-location logistics, and secure flexible Net-30 credit terms in one unified startup ecosystem.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link to="/products" className="btn-primary px-10">Browse Products</Link>
            <Link to="/bulk-order" className="btn-secondary px-10">Request Quote</Link>
          </div>
        </div>

        {/* Hero Image Illustration Placeholder */}
        <div className="hidden lg:block absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-center p-8">
           <div className="relative w-full h-full">
              <img 
                src="/assets/hero-chef.png" 
                alt="Professional Chef Procurement" 
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
           </div>
        </div>
      </section>

      {/* Modern Search Bar Below Hero */}
      <div className="max-w-5xl mx-auto -mt-10 relative z-20">
         <form onSubmit={handleSearch} className="flex gap-2 p-3 bg-white border border-gray-200 rounded-2xl shadow-xl">
            <div className="relative flex-1 flex items-center">
               <Search className="absolute left-6 w-5 h-5 text-gray-400" />
               <input 
                 type="text" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="What are you looking for?" 
                 className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none pl-16 pr-6 py-4 text-lg"
               />
            </div>
            <button type="submit" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-10 rounded-xl font-bold transition-all">
              Search
            </button>
         </form>
      </div>

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

      {/* Why Choose Us */}
      <section className="space-y-12 text-center">
         <h2 className="text-4xl font-black text-gray-900">Why Choose Us</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={Truck} title="Fast & Free Shipping" />
            <FeatureCard icon={RefreshCw} title="Hassie Free Returns" />
            <FeatureCard icon={HeadphonesIcon} title="24/7 Support" />
            <FeatureCard icon={BarChart} title="Bulk Discounts" />
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

      {/* Trusted By Brands */}
      <section className="space-y-10 pt-12 text-center">
         <div className="flex items-center gap-4 justify-center">
            <div className="h-px bg-gray-200 w-24"></div>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Trusted by</span>
            <div className="h-px bg-gray-200 w-24"></div>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
               { name: "McDonald's London", color: "#FFBC0D" },
               { name: "Papa Johns", color: "#C41230" },
               { name: "KFC West London", color: "#E4002B" },
               { name: "Texas Chicken", color: "#FF9900" },
               { name: "Burger King", color: "#F5EBDC" }
            ].map((brand, i) => (
               <div key={i} className="flex flex-col rounded-xl overflow-hidden shadow-md transform hover:scale-105 transition-all cursor-pointer">
                  <div className="h-28 bg-[#94A3B8] flex items-center justify-center p-4">
                     {/* Mock Logo Text */}
                     <span className="text-white font-black text-xl italic tracking-tighter drop-shadow-md">{brand.name.split(' ')[0]}</span>
                  </div>
                  <div className="bg-[var(--brand-yellow)] py-3 px-4">
                     <span className="text-[var(--brand-dark)] font-bold text-xs uppercase tracking-tight truncate block">{brand.name}</span>
                  </div>
               </div>
            ))}
         </div>
      </section>

    </div>
  );
}

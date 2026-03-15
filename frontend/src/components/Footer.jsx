import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 mt-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              ECom<span className="text-primary">.</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              The premier B2B marketplace connecting professional kitchens with verified wholesale suppliers globally. Optimized for procurement workflows and bulk distribution.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Marketplace</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-slate-400 hover:text-primary transition-colors text-sm">Browse Catalog</Link></li>
              <li><Link to="/suppliers" className="text-slate-400 hover:text-primary transition-colors text-sm">Verified Suppliers</Link></li>
              <li><Link to="/bulk-order" className="text-slate-400 hover:text-primary transition-colors text-sm">Bulk Ordering</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 hover:text-primary transition-colors text-sm">Contract Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Legal & Privacy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact Support</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                 <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                 <span className="text-slate-400 text-sm">1200 Tech Blvd, Suite 400<br/>San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center gap-3">
                 <Phone className="w-5 h-5 text-primary shrink-0" />
                 <span className="text-slate-400 text-sm">1 (800) 555-ECOM</span>
              </li>
              <li className="flex items-center gap-3">
                 <Mail className="w-5 h-5 text-primary shrink-0" />
                 <span className="text-slate-400 text-sm">support@ecom-b2b.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} ECom B2B Marketplace. All rights reserved. Professional procurement only.
          </p>
        </div>
      </div>
    </footer>
  );
}

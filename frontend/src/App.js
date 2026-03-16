import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PageWrapper from './components/PageWrapper';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import BulkOrder from './pages/BulkOrder';
import Suppliers from './pages/Suppliers';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

import AboutUs from './pages/AboutUs';
import Wishlist from './pages/Wishlist';
import OrderTracking from './pages/OrderTracking';
import Cart from './pages/Cart';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
              <Route path="/bulk-order" element={<PageWrapper><BulkOrder /></PageWrapper>} />
              <Route path="/suppliers" element={<PageWrapper><Suppliers /></PageWrapper>} />
              <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><PageWrapper><Admin /></PageWrapper></ProtectedRoute>} />
              
              {/* Functional Pages */}
              <Route path="/about" element={<PageWrapper><AboutUs /></PageWrapper>} />
              <Route path="/wishlist" element={<ProtectedRoute><PageWrapper><Wishlist /></PageWrapper></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><PageWrapper><OrderTracking /></PageWrapper></ProtectedRoute>} />
              <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

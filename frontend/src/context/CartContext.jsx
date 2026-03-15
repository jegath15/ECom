import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.productId);
      if (existing) {
        return prev.map(item => 
          item.productId === product.productId 
            ? { ...item, qty: item.qty + quantity } 
            : item
        );
      }
      return [...prev, { ...product, qty: quantity }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        return { ...item, qty: Math.max(1, item.qty + delta) };
      }
      return item;
    }));
  };

  const updateBidPrice = (productId, price) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        return { ...item, bidPrice: price };
      }
      return item;
    }));
  };

  const removeCartItem = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const isItemInCart = (productId) => cart.some(item => item.productId === productId);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, updateBidPrice, removeCartItem, clearCart, isItemInCart }}>
      {children}
    </CartContext.Provider>
  );
};

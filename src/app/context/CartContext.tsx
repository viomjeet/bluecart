'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface CartContextType {
  cartCount: number;
  addToCart: (id: number) => Promise<void>;
  fetchCartCount: () => Promise<void>; // Blueprint bilkul sahi hai
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState<number>(0);

  // Initial load par DB se total count lekar aao
  const fetchCartCount = async () => {
    try {
      const response = await axios.get('/api/cart');
      // Secure check: Agar direct totalCount mile toh thik, nahi toh fallback
      if (response.data && typeof response.data.totalCount === 'number') {
        setCartCount(response.data.totalCount);
      } else if (response.data && response.data.items) {
        const count = response.data.items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCartCount(count);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const addToCart = async (productId: number) => {
    try {
      await axios.post('/api/cart', { productId, quantity: 1 });
      await fetchCartCount(); 
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    // FIX: Yahan value ke andar fetchCartCount ko add kar diya hai
    <CartContext.Provider value={{ cartCount, addToCart, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
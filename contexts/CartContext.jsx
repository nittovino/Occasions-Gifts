import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DeliveryService } from '@/services/DeliveryService';
import { CartService } from '@/services/CartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { getItem, setItem } = useLocalStorage();
  const [cart, setCart] = useState([]);
  
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [deliveryFee, setDeliveryFee] = useState(5);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    const savedCart = getItem('cart') || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    setItem('cart', cart);
  }, [cart]);

  useEffect(() => {
    setDeliveryFee(DeliveryService.getDeliveryFee(deliveryMethod, 'EUR'));
  }, [deliveryMethod]);

  const addToCart = (product, quantity = 1, method = 'standard', date = null, timeWindow = 'anytime', city = '', postalCode = '') => {
    try {
      // In case old code calls this without the new parameters, provide defaults that bypass strict validation 
      // or just handle it gracefully. The prompt asks to update the signature to accept these.
      const safeDate = date || new Date().toISOString();
      const cartItem = CartService.createCartItem(product, quantity, method, safeDate, timeWindow, city, postalCode);

      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        
        return [...prevCart, cartItem];
      });
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      throw error;
    }
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setItem('cart', []);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price_eur * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getDeliveryFeeFn = (method) => {
    return DeliveryService.getDeliveryFee(method, 'EUR');
  };

  const getTotal = () => {
    return getCartTotal() + deliveryFee;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      deliveryMethod,
      setDeliveryMethod,
      deliveryFee,
      setDeliveryFee,
      deliveryAddress,
      setDeliveryAddress,
      getDeliveryFee: getDeliveryFeeFn,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
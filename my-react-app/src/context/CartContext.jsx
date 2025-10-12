import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import api from '../lib/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch cart on mount or when user changes
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (cropId, quantity) => {
    setLoading(true);
    try {
      const { data } = await api.post('/cart/add', { cropId, quantity });
      setCart(data.cart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Error adding to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/cart/update/${itemId}`, { quantity });
      setCart(data.cart);
    } catch (error) {
      console.error('Error updating cart:', error);
      alert(error.response?.data?.message || 'Error updating cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/cart/remove/${itemId}`);
      setCart(data.cart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert(error.response?.data?.message || 'Error removing from cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  const getItemCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      getItemCount,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

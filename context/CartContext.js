import { createContext, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

const initialState = [];

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'ADD':
      const exists = state.find((item) => item._id === action.payload._id);
      if (exists) {
        return state.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter((item) => item._id !== action.payload);
    case 'UPDATE':
      return state.map((item) =>
        item._id === action.payload._id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const { data: session, status } = useSession();

  // Load from localStorage (initial)
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      dispatch({ type: 'INIT', payload: JSON.parse(stored) });
    }
  }, []);

  // Load from DB after login
  useEffect(() => {
    const loadUserCart = async () => {
      if (session?.user?.email) {
        const res = await fetch(`/api/user-cart?email=${session.user.email}`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.cart)) {
          dispatch({ type: 'INIT', payload: data.cart });
        }
      }
    };
    loadUserCart();
  }, [session]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save to DB after login
  useEffect(() => {
    if (session?.user?.email && cart.length > 0) {
      fetch('/api/user-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          cart,
        }),
      });
    }
  }, [cart, session]);

  // Clear cart after logout
  useEffect(() => {
    if (status === 'unauthenticated') {
      dispatch({ type: 'CLEAR' });
      localStorage.removeItem('cart');
    }
  }, [status]);

  const addToCart = (item) => dispatch({ type: 'ADD', payload: item });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE', payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: 'UPDATE', payload: { _id: id, quantity } });
  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
    localStorage.removeItem('cart');
  };

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
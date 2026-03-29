'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Book } from '@/lib/books';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('literaryLaneCart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
      setCartItems([]);
    }
  }, []);

  const updateLocalStorage = (items: CartItem[]) => {
    try {
      localStorage.setItem('literaryLaneCart', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
    }
  };

  const addToCart = useCallback((book: Book, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.book.id === book.id);
      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.book.stock) }
            : item
        );
      } else {
        newItems = [...prevItems, { book, quantity }];
      }
      updateLocalStorage(newItems);
      return newItems;
    });
    toast({
      title: 'Added to Cart',
      description: `${book.title} has been added to your cart.`,
    });
  }, [toast]);

  const removeFromCart = useCallback((bookId: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.book.id !== bookId);
      updateLocalStorage(newItems);
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((bookId: string, quantity: number) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        const newItems = prevItems.filter(item => item.book.id !== bookId);
        updateLocalStorage(newItems);
        return newItems;
      }
      const newItems = prevItems.map(item =>
        item.book.id === bookId ? { ...item, quantity: Math.min(quantity, item.book.stock) } : item
      );
      updateLocalStorage(newItems);
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    updateLocalStorage([]);
  }, []);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

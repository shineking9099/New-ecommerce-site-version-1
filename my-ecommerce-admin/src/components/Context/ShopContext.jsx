import React, { createContext, useState } from "react";
import all_products from "../../assets/all_products";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to cart function
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove from cart function (missing in your original code)
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Increment quantity
  const incrementQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrement quantity
  const decrementQuantity = (productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get cart count
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.quantity * (item.new_price || 0),
      0
    );
  };

  // Get product by ID
  const getProductById = (id) => {
    return all_products.find((product) => product.id.toString() === id.toString());
  };

  const contextValue = {
    allProducts: all_products,
    cartItems,
    addToCart,
    removeFromCart, // Now properly included
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    getProductById,
    setCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
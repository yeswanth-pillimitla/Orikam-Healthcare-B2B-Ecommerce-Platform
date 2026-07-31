import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { mockCategories, mockBrands, mockProducts } from '../data/mockData';

export const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation / View state
  const [currentView, setCurrentView] = useState('home'); // 'home', 'listing', 'details', 'cart', 'checkout', 'orders', 'profile'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Profile Active Tab State
  const [activeProfileTab, setActiveProfileTab] = useState('profile'); // 'profile', 'orders', ...

  // Live Database States
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Categories & Brands fetched from MongoDB (with static seed fallback)
  const [categories, setCategories] = useState(mockCategories);
  const [brands, setBrands] = useState(mockBrands);
  const [productsList, setProductsList] = useState(mockProducts); // Live product list
  const [loading, setLoading] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceFilter, setPriceFilter] = useState(400000); 
  const [ratingFilter, setRatingFilter] = useState(0); 
  const [sortOption, setSortOption] = useState('Popularity'); 
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Global Categories, Brands, and Products on Mount/Filter Changes
  const fetchGlobalData = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        api.get('/products/categories'),
        api.get('/products/brands')
      ]);
      setCategories(catRes.data);
      setBrands(brandRes.data);
    } catch (err) {
      console.error("Error loading categories or brands:", err);
    }
  };

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;
      if (priceFilter) params.maxPrice = priceFilter;
      if (ratingFilter) params.rating = ratingFilter;
      if (sortOption) params.sort = sortOption;

      const prodRes = await api.get('/products', { params });
      setProductsList(prodRes.data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Synchronize User session details, addresses, cart, etc.
  const syncUserSession = async () => {
    const token = localStorage.getItem('orikam_token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await api.get('/auth/profile');
      setUser(res.data.user);
      setSavedAddresses(res.data.addresses);
      setPaymentMethods(res.data.paymentMethods);
      setNotifications(res.data.notifications);
      setWishlist(res.data.wishlist);
      setCart(res.data.cart);

      // Fetch user's orders
      const orderRes = await api.get('/orders/my-orders');
      setOrders(orderRes.data);
    } catch (err) {
      console.error("Session sync failed:", err);
      logout();
    }
  };

  useEffect(() => {
    fetchGlobalData();
    syncUserSession();
  }, []);

  useEffect(() => {
    fetchFilteredProducts();
  }, [searchQuery, selectedCategory, selectedBrand, priceFilter, ratingFilter, sortOption]);

  // Page navigation helper
  const navigateTo = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login action
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('orikam_token', res.data.token);
      await syncUserSession();
      navigateTo('home');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Incorrect email or password details." 
      };
    }
  };

  // Registration action
  const register = async (name, email, phone, password, role, clinicName, gstin) => {
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role: role || 'Customer',
        clinicName: clinicName || '',
        gstin: gstin || ''
      });
      localStorage.setItem('orikam_token', res.data.token);
      await syncUserSession();
      navigateTo('home');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed. Try again."
      };
    }
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('orikam_token');
    setUser(null);
    setCart([]);
    setWishlist([]);
    setSavedAddresses([]);
    setPaymentMethods([]);
    setNotifications([]);
    setOrders([]);
    navigateTo('home');
  };

  // Profile operations
  const updateProfile = async (newDetails) => {
    try {
      const res = await api.put('/user/update', newDetails);
      setUser(res.data);
      // Re-fetch profile details to sync
      await syncUserSession();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Failed to update profile." };
    }
  };

  // Cart operations (synced with DB)
  const addToCart = async (product, qty = 1) => {
    if (!user) {
      navigateTo('auth');
      return;
    }
    try {
      const res = await api.post('/cart/add', { productId: product._id, quantity: qty });
      setCart(res.data);
    } catch (err) {
      console.error("Cart addition failed:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      setCart(res.data);
    } catch (err) {
      console.error("Cart removal failed:", err);
    }
  };

  const updateCartQuantity = async (productId, amount) => {
    const item = cart.find(i => i.product._id === productId);
    if (!item) return;

    const newQty = item.quantity + amount;
    try {
      const res = await api.put('/cart/update', { productId, quantity: newQty });
      setCart(res.data);
    } catch (err) {
      console.error("Cart update failed:", err);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = async (productId) => {
    if (!user) {
      navigateTo('auth');
      return;
    }
    try {
      const res = await api.post('/wishlist/toggle', { productId });
      setWishlist(res.data);
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    }
  };

  // Address operations
  const addAddress = async (newAddr) => {
    try {
      const res = await api.post('/address', newAddr);
      setSavedAddresses(res.data);
      const def = res.data.find(a => a.isDefault);
      if (def) setActiveAddressId(def._id);
    } catch (err) {
      console.error("Add address failed:", err);
    }
  };

  const editAddress = async (id, updatedAddr) => {
    try {
      const res = await api.put(`/address/${id}`, updatedAddr);
      setSavedAddresses(res.data);
    } catch (err) {
      console.error("Edit address failed:", err);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await api.delete(`/address/${id}`);
      setSavedAddresses(res.data);
    } catch (err) {
      console.error("Delete address failed:", err);
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      const res = await api.put(`/address/${id}/default`);
      setSavedAddresses(res.data);
      setActiveAddressId(id);
    } catch (err) {
      console.error("Set default address failed:", err);
    }
  };

  // Checkout address states
  const [activeAddressId, setActiveAddressId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Card');

  useEffect(() => {
    if (savedAddresses.length > 0 && !activeAddressId) {
      const def = savedAddresses.find(a => a.isDefault);
      if (def) {
        setActiveAddressId(def._id);
      } else {
        setActiveAddressId(savedAddresses[0]._id);
      }
    }
  }, [savedAddresses]);

  // Payment operations
  const addPaymentMethod = async (newMethod) => {
    try {
      const res = await api.post('/payment', newMethod);
      setPaymentMethods(res.data);
    } catch (err) {
      console.error("Add payment failed:", err);
    }
  };

  const removePaymentMethod = async (id) => {
    try {
      const res = await api.delete(`/payment/${id}`);
      setPaymentMethods(res.data);
    } catch (err) {
      console.error("Remove payment failed:", err);
    }
  };

  const setDefaultPaymentMethod = async (id) => {
    try {
      const res = await api.put(`/payment/${id}/default`);
      setPaymentMethods(res.data);
    } catch (err) {
      console.error("Set default payment failed:", err);
    }
  };

  // Notification actions
  const markNotificationRead = async (id) => {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Mark notification read failed:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await api.delete(`/notifications/${id}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Delete notification failed:", err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const res = await api.put('/notifications/read-all');
      setNotifications(res.data);
    } catch (err) {
      console.error("Mark all read failed:", err);
    }
  };

  // Order placement helper
  const placeOrder = async () => {
    if (cart.length === 0) return null;

    const summary = getCartSummary();
    const activeAddress = savedAddresses.find(a => a._id === activeAddressId) || savedAddresses[0];

    // Build the items list snapshot
    const items = cart.map(i => ({
      product: i.product._id,
      quantity: i.quantity,
      price: i.product.price,
      name: i.product.name,
      image: i.product.images[0]
    }));

    const orderPayload = {
      products: items,
      shippingAddress: {
        name: activeAddress.name,
        phone: activeAddress.phone,
        addressLine: activeAddress.addressLine,
        city: activeAddress.city,
        pincode: activeAddress.pincode
      },
      paymentMethod: selectedPaymentMethod,
      paymentDetails: selectedPaymentMethod === 'Card' ? "Card ending in 4242" : "Online Instant Payment",
      subtotal: summary.subtotal,
      discount: summary.discount,
      delivery: summary.delivery,
      tax: summary.tax,
      totalAmount: summary.total
    };

    try {
      const res = await api.post('/orders/create', orderPayload);
      
      // Update orders list and clear local cart state
      setOrders(prev => [res.data, ...prev]);
      clearCart();

      // Sync profile/notifications
      await syncUserSession();

      return res.data;
    } catch (err) {
      console.error("Order placement failed:", err);
      return null;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await api.put(`/orders/${orderId}/cancel`);
      setOrders(prev => prev.map(o => (o._id === res.data._id || o.orderId === res.data.orderId || o.id === res.data.id ? res.data : o)));
      return { success: true, data: res.data };
    } catch (err) {
      console.warn("API cancel order error, handling fallback:", err);
      if (err.response && err.response.data && err.response.data.error) {
        return { success: false, error: err.response.data.error };
      }
      setOrders(prev => prev.map(o => (o._id === orderId || o.id === orderId || o.orderId === orderId ? { ...o, orderStatus: 'Cancelled' } : o)));
      return { success: true };
    }
  };

  // Cart Calculations
  const getCartSummary = () => {
    const subtotal = cart.reduce((acc, item) => {
      const price = item.product?.price || 0;
      return acc + price * item.quantity;
    }, 0);
    
    // 10% Gold Member / Super Admin discount for active users
    const discount = user ? subtotal * 0.10 : 0;
    
    // Free delivery on orders above ₹5000, otherwise ₹250
    const delivery = subtotal > 5000 || subtotal === 0 ? 0 : 250;
    
    // 18% GST
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.18;
    const total = taxableAmount + delivery + tax;

    return {
      subtotal,
      discount,
      delivery,
      tax,
      total,
      totalCount: cart.reduce((acc, item) => acc + item.quantity, 0)
    };
  };

  // Category & Brand browsing helper
  const selectCategoryAndBrowse = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedBrand('');
    setSearchQuery('');
    navigateTo('listing');
  };

  const selectBrandAndBrowse = (brandName) => {
    setSelectedBrand(brandName);
    setSelectedCategory('');
    setSearchQuery('');
    navigateTo('listing');
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setSelectedCategory('');
    setSelectedBrand('');
    navigateTo('listing');
  };

  // Admin Operations
  const adminCreateProduct = async (productData) => {
    try {
      const res = await api.post('/products', productData);
      await fetchFilteredProducts();
      await fetchGlobalData();
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Admin create product failed:", err);
      return { success: false, error: err.response?.data?.error || "Failed to create product" };
    }
  };

  const adminUpdateProduct = async (productId, productData) => {
    try {
      const res = await api.put(`/products/${productId}`, productData);
      await fetchFilteredProducts();
      await fetchGlobalData();
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Admin update product failed:", err);
      return { success: false, error: err.response?.data?.error || "Failed to update product" };
    }
  };

  const adminDeleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      await fetchFilteredProducts();
      await fetchGlobalData();
      return { success: true };
    } catch (err) {
      console.error("Admin delete product failed:", err);
      return { success: false, error: err.response?.data?.error || "Failed to delete product" };
    }
  };

  const adminGetAllOrders = async () => {
    try {
      const res = await api.get('/orders/all');
      return res.data;
    } catch (err) {
      console.error("Admin fetch orders failed:", err);
      return [];
    }
  };

  const adminUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status });
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Admin update order status failed:", err);
      return { success: false, error: err.response?.data?.error || "Failed to update order status" };
    }
  };

  const adminGetAllUsers = async () => {
    try {
      const res = await api.get('/user/all');
      return res.data;
    } catch (err) {
      console.error("Admin fetch users failed:", err);
      return [];
    }
  };

  const adminUpdateUserRole = async (userId, role) => {
    try {
      const res = await api.put(`/user/${userId}/role`, { role });
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Admin update user role failed:", err);
      return { success: false, error: err.response?.data?.error || "Failed to update user role" };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        navigateTo,
        selectedProduct,
        setSelectedProduct,
        searchQuery,
        setSearchQuery,
        handleSearchSubmit,
        selectedCategory,
        setSelectedCategory,
        selectedBrand,
        setSelectedBrand,
        selectCategoryAndBrowse,
        selectBrandAndBrowse,
        priceFilter,
        setPriceFilter,
        ratingFilter,
        setRatingFilter,
        sortOption,
        setSortOption,
        currentPage,
        setCurrentPage,
        
        // MongoDB collections
        productsList,
        categories,
        brands,
        loading,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        orders,
        placeOrder,
        cancelOrder,
        savedAddresses,
        activeAddressId,
        setActiveAddressId,
        addAddress,
        editAddress,
        deleteAddress,
        setDefaultAddress,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        getCartSummary,
        user,
        updateProfile,
        activeProfileTab,
        setActiveProfileTab,
        notifications,
        markNotificationRead,
        deleteNotification,
        markAllNotificationsRead,
        paymentMethods,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        logout,
        login,
        register,

        // Admin actions
        adminCreateProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        adminGetAllOrders,
        adminUpdateOrderStatus,
        adminGetAllUsers,
        adminUpdateUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

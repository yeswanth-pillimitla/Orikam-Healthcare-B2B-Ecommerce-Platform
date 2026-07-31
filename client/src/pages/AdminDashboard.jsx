import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSettings, 
  FiUser, 
  FiShoppingBag, 
  FiPackage, 
  FiUsers, 
  FiTrendingUp, 
  FiDollarSign, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiArrowLeft, 
  FiSearch, 
  FiFilter, 
  FiCheckCircle, 
  FiX, 
  FiChevronRight, 
  FiInfo, 
  FiGift,
  FiMenu
} from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import UserAvatar from '../components/UserAvatar';

export default function AdminDashboard() {
  const { 
    user, 
    navigateTo, 
    productsList, 
    categories, 
    brands, 
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminGetAllOrders,
    adminUpdateOrderStatus,
    adminGetAllUsers,
    adminUpdateUserRole
  } = useContext(AppContext);

  // Security Redirect
  useEffect(() => {
    if (!user || (user.role !== 'Admin' && user.role !== 'Super Admin')) {
      navigateTo('home');
    }
  }, [user, navigateTo]);

  // Dashboard Tabs & Responsive Drawer Sidebar state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders', 'users'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  // Admin Data lists
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Alert/Toast states
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch admin-only collections
  const loadAdminData = async () => {
    if (!user || (user.role !== 'Admin' && user.role !== 'Super Admin')) return;
    setLoadingData(true);
    try {
      const [fetchedOrders, fetchedUsers] = await Promise.all([
        adminGetAllOrders(),
        adminGetAllUsers()
      ]);
      setOrders(fetchedOrders || []);
      setUsers(fetchedUsers || []);
    } catch (err) {
      console.error("Error loading admin collections:", err);
      showToast("Failed to fetch administrative data", "error");
    } finally {
      showToast("Sync completed successfully!");
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

 
  // PRODUCT MANAGEMENT STATES & FUNCTIONS
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const [productBrandFilter, setProductBrandFilter] = useState('');
  
  // Create / Edit modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding
  
  // Product Form fields
  const [prodName, setProdName] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  
  // Specifications
  const [prodModelCode, setProdModelCode] = useState('');
  const [prodWarranty, setProdWarranty] = useState('1 Year Manufacturer Warranty');
  const [prodCertification, setProdCertification] = useState('CE / ISO Certified');

  // Open Add modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDescription('');
    setProdBrand(brands[0]?.name || 'Waldent');
    setProdCategory(categories[0]?.name || 'Dental Chair');
    setProdPrice('');
    setProdOriginalPrice('');
    setProdStock('20');
    setProdImageUrl('');
    setProdModelCode('');
    setProdWarranty('1 Year Manufacturer Warranty');
    setProdCertification('CE / ISO Certified');
    setIsProductModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdDescription(product.description || '');
    setProdBrand(product.brand);
    setProdCategory(product.category);
    setProdPrice(product.price.toString());
    setProdOriginalPrice(product.originalPrice ? product.originalPrice.toString() : '');
    setProdStock(product.stock ? product.stock.toString() : '20');
    setProdImageUrl(product.images ? product.images[0] || '' : '');
    
    // Find specs
    const model = product.specifications?.find(s => s.label === "Model Code")?.value || '';
    const warranty = product.specifications?.find(s => s.label === "Warranty")?.value || '1 Year Manufacturer Warranty';
    const cert = product.specifications?.find(s => s.label === "Certification")?.value || 'CE / ISO Certified';
    setProdModelCode(model);
    setProdWarranty(warranty);
    setProdCertification(cert);
    
    setIsProductModalOpen(true);
  };

  // Submit product Form
  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodBrand || !prodCategory) {
      showToast("Please enter all required product details.", "error");
      return;
    }

    const priceNum = parseFloat(prodPrice);
    const origPriceNum = prodOriginalPrice ? parseFloat(prodOriginalPrice) : Math.round(priceNum * 1.2);
    
    // Default image if empty
    let imagePath = prodImageUrl;
    if (!imagePath) {
      const categoryImages = {
        "Dental Chair": "/assets/category_chair.png",
        "Composite": "/assets/category_composite.png",
        "Handpieces": "/assets/category_handpiece.png",
        "Endodontics": "/assets/category_endomotor.png",
        "Imaging": "/assets/category_diagnostics.png",
        "Surgical": "/assets/suction_prod.png",
        "Orthodontics": "/assets/category_brackets.png",
        "X-Ray": "/assets/category_diagnostics.png",
        "Polishers": "/assets/category_scaler.png",
        "Diagnostics": "/assets/category_diagnostics.png"
      };
      imagePath = categoryImages[prodCategory] || "/assets/category_chair.png";
    }

    const payload = {
      name: prodName,
      description: prodDescription,
      brand: prodBrand,
      category: prodCategory,
      price: priceNum,
      originalPrice: origPriceNum,
      stock: parseInt(prodStock) || 0,
      images: [imagePath],
      specifications: [
        { label: "Model Code", value: prodModelCode || `${prodBrand.slice(0,3).toUpperCase()}-${prodCategory.slice(0,3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}` },
        { label: "Warranty", value: prodWarranty },
        { label: "Certification", value: prodCertification }
      ]
    };

    if (editingProduct) {
      // Edit mode
      const res = await adminUpdateProduct(editingProduct._id || editingProduct.id, payload);
      if (res.success) {
        showToast("Product updated successfully!");
        setIsProductModalOpen(false);
      } else {
        showToast(res.error || "Failed to update product details", "error");
      }
    } else {
      // Create mode
      const res = await adminCreateProduct(payload);
      if (res.success) {
        showToast("Product created successfully!");
        setIsProductModalOpen(false);
      } else {
        showToast(res.error || "Failed to create new product", "error");
      }
    }
  };

  // Delete product action
  const [deletingProductId, setDeletingProductId] = useState(null);

  const handleConfirmDeleteProduct = async () => {
    if (!deletingProductId) return;
    const res = await adminDeleteProduct(deletingProductId);
    if (res.success) {
      showToast("Product removed successfully!");
      setDeletingProductId(null);
    } else {
      showToast(res.error || "Failed to delete product", "error");
    }
  };

  // ORDER STATUS UPDATE FUNCTION
  const handleOrderStatusChange = async (orderId, newStatus) => {
    const res = await adminUpdateOrderStatus(orderId, newStatus);
    if (res.success) {
      showToast(`Order advanced to status: ${newStatus}`);
      // Refresh local order state
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } else {
      showToast(res.error || "Failed to update order status", "error");
    }
  };

  // USER ROLE UPDATE FUNCTION (SUPER ADMIN ONLY)
  const handleUserRoleChange = async (userId, newRole) => {
    if (user.role !== 'Super Admin') {
      showToast("Elevated roles can only be adjusted by Super Admins.", "error");
      return;
    }

    const res = await adminUpdateUserRole(userId, newRole);
    if (res.success) {
      showToast(`User role successfully changed to: ${newRole}`);
      // Refresh local user state
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } else {
      showToast(res.error || "Failed to update user role", "error");
    }
  };

  // ANALYTICS / OVERVIEW CALCULATIONS
  const totalSales = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = productsList.length;
  const totalCustomersCount = users.filter(u => u.role === 'Customer').length;

  const filteredProducts = productsList.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          prod.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter ? prod.category === productCategoryFilter : true;
    const matchesBrand = productBrandFilter ? prod.brand === productBrandFilter : true;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] flex text-left font-sans overflow-hidden">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4.5 py-3 rounded-xl shadow-lg flex items-center gap-2 font-bold text-xs ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'
            }`}
          >
            {toast.type !== 'error' && <FiCheckCircle size={15} className="text-emerald-400" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Backdrop Overlay on Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-35 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* LEFT: Dashboard Sidebar (Responsive drawer on mobile) */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        
        {/* Console Header logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex flex-col text-left">
            <span className="font-black text-lg tracking-tight font-outfit">ORIKAM B2B PLATFORM</span>
            <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest mt-0.5 flex items-center justify-center">Control Center</span>
          </div>
          {/* Close button - visible on mobile only */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <FiX size={15} />
          </button>
        </div>

        {/* Console Navigation Links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-3">
          
          <button
            onClick={() => handleTabClick('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold font-outfit cursor-pointer transition-all ${
              activeTab === 'overview' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <FiTrendingUp size={15} />
            <span className='text-sm'>Dashboard Overview</span>
          </button>

          <button
            onClick={() => handleTabClick('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold font-outfit cursor-pointer transition-all ${
              activeTab === 'products' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <FiPackage size={15} />
            <span className='text-sm'>Products Inventory</span>
          </button>

          <button
            onClick={() => handleTabClick('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold font-outfit cursor-pointer transition-all ${
              activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <FiShoppingBag size={15} />
            <span className='text-sm'>Orders</span>
          </button>

          <button
            onClick={() => handleTabClick('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold font-outfit cursor-pointer transition-all ${
              activeTab === 'users' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <FiUsers size={15} />
            <span className='text-sm'>User Accounts</span>
          </button>

        </nav>

        {/* Current representative card at the footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex items-center gap-3">
          <UserAvatar
            user={user}
            sizeClass="w-9 h-9"
            className="border border-slate-700"
          />
          <div className="min-w-0 flex-1 text-left leading-tight">
            <span className="block text-xs font-extrabold truncate font-outfit text-white">{user?.name}</span>
            <span className="text-[9px] font-black text-amber-400 tracking-wide uppercase">{user?.role}</span>
          </div>
        </div>

      </aside>

      {/* RIGHT: Console Main Panel */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header bar */}
        <header className="h-16 bg-white border-b border-slate-100 px-4 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger menu button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              <FiMenu size={22} />
            </button>
            <h2 className="text-base md:text-xl font-bold font-outfit text-slate-900 capitalize tracking-tight whitespace-nowrap">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab === 'products' ? 'Products Inventory' : activeTab === 'orders' ? 'Total Orders' : 'Registered User Accounts'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigateTo('home')}
              className="text-xs md:text-sm font-bold font-outfit text-brand-red hover:text-brand-red-hover flex items-center gap-1 cursor-pointer transition-colors"
            >
              Back <FiChevronRight size={16} className="md:size-[25px]" />
            </button>
          </div>
        </header>

        {/* Panel Content Body */}
        <div className="flex-1 p-8 overflow-y-auto">
          {loadingData ? (
            <div className="h-full flex items-center justify-center flex-col gap-3 py-16">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-gray-500 font-bold tracking-wide">Syncing administrative records...</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* TAB 1: OVERVIEW/ANALYTICS PANEL */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  
                  {/* Stats Count Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    
                    {/* KPI 1 */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
                      <div className="text-left leading-none">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-2">Total Sales Revenue</span>
                        <span className="text-2xl font-black font-outfit text-slate-950">₹{Math.round(totalSales || 0).toLocaleString('en-IN')}.00</span>
                      </div>
                      <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                        <FiDollarSign size={20} />
                      </div>
                    </div>

                    {/* KPI 2 */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
                      <div className="text-left leading-none">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-2">Sales Requests Placed</span>
                        <span className="text-2xl font-black font-outfit text-slate-950">{totalOrdersCount}</span>
                      </div>
                      <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                        <FiShoppingBag size={20} />
                      </div>
                    </div>

                    {/* KPI 3 */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
                      <div className="text-left leading-none">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-2">Products in Catalog</span>
                        <span className="text-2xl font-black font-outfit text-slate-950">{totalProductsCount}</span>
                      </div>
                      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <FiPackage size={20} />
                      </div>
                    </div>

                    {/* KPI 4 */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
                      <div className="text-left leading-none">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-2">Registered B2B Clients</span>
                        <span className="text-2xl font-black font-outfit text-slate-950">{totalCustomersCount}</span>
                      </div>
                      <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                        <FiUsers size={20} />
                      </div>
                    </div>

                  </div>

                  {/* Dashboard Info Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
                    
                    {/* Left: Recent Orders Feed */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-5 lg:col-span-2">
                      <div className="flex items-center justify-between mb-4.5">
                        <h3 className="font-bold text-slate-950 font-outfit text-sm">Recent Order Submissions</h3>
                        <button 
                          onClick={() => setActiveTab('orders')}
                          className="text-[11px] font-bold text-amber-500 hover:text-amber-600 cursor-pointer"
                        >
                          View all dispatches
                        </button>
                      </div>

                      <div className="flex flex-col divide-y divide-slate-100 text-left">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order._id || order.id} className="py-3 flex items-center justify-between gap-4 text-xs font-semibold text-gray-600">
                            <div className="flex flex-col text-left">
                              <span className="font-extrabold text-slate-900">{order.orderId}</span>
                              <span className="text-[10px] text-gray-400 font-bold mt-1">
                                {order.user?.name || "Anonymous User"} • {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-black text-slate-900">₹{Math.round(order.totalAmount || 0).toLocaleString('en-IN')}.00</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                order.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                                order.orderStatus === 'Packed' ? 'bg-amber-50 text-amber-600' :
                                order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {order.orderStatus}
                              </span>
                            </div>
                          </div>
                        ))}
                        {orders.length === 0 && (
                          <div className="text-center py-6 text-xs text-gray-400 font-bold">No orders processed yet.</div>
                        )}
                      </div>
                    </div>

                    {/* Right: Category Sales Statistics */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-950 font-outfit text-sm mb-4">Top Equipment Sectors</h3>
                        <div className="flex flex-col gap-3">
                          {categories.slice(0, 5).map((cat, idx) => {
                            const percent = Math.min(100, Math.round(((cat.productCount || 10) / 100) * 100 * 10));
                            return (
                              <div key={idx} className="text-xs">
                                <div className="flex items-center justify-between text-gray-600 font-bold mb-1">
                                  <span className="truncate">{cat.name}</span>
                                  <span className="text-slate-950 font-black">{cat.productCount} items</span>
                                </div>
                                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-purple-500' : idx === 3 ? 'bg-emerald-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex items-center gap-3 text-left">
                        <FiInfo size={16} className="text-amber-600 shrink-0" />
                        <p className="text-[10px] text-amber-900 leading-normal font-semibold">
                          Super Admins hold authority to override accounts, customize global prices, and perform physical audit logs.
                        </p>
                      </div>
                    </div>

                  </div>

                </motion.div>
              )}

              {/* TAB 2: PRODUCTS CATALOG INVENTORY */}
              {activeTab === 'products' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6"
                >
                  
                  {/* Table Actions Header */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-1 flex-wrap items-center gap-3">
                      
                      {/* Search */}
                      <div className="relative max-w-xs w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FiSearch size={14} />
                        </span>
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Search product inventory..."
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-gray-200"
                        />
                      </div>

                      {/* Filter category */}
                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 text-xs font-bold text-gray-600 focus:outline-none cursor-pointer"
                      >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                          <option key={c._id || c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>

                      {/* Filter brand */}
                      <select
                        value={productBrandFilter}
                        onChange={(e) => setProductBrandFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 text-xs font-bold text-gray-600 focus:outline-none cursor-pointer"
                      >
                        <option value="">All Brands</option>
                        {brands.map(b => (
                          <option key={b._id || b.name} value={b.name}>{b.name}</option>
                        ))}
                      </select>

                    </div>

                    {/* Add Product Button */}
                    <button
                      onClick={handleOpenAddProduct}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs font-outfit"
                    >
                      <FiPlus size={14} /> Add New Product
                    </button>
                  </div>

                  {/* Inventory Grid Table */}
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                          <th className="py-3 px-4">Item</th>
                          <th className="py-3 px-4">Brand</th>
                          <th className="py-3 px-4">Sector</th>
                          <th className="py-3 px-4">Pricing</th>
                          <th className="py-3 px-4">Stock Status</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold text-gray-700">
                        {filteredProducts.map((prod) => (
                          <tr key={prod._id || prod.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100/60 p-1 shrink-0 flex items-center justify-center">
                                <img src={prod.images ? prod.images[0] : prod.image} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                              </div>
                              <span className="font-extrabold text-slate-950 truncate max-w-xs block leading-tight">{prod.name}</span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-gray-500 uppercase">{prod.brand}</td>
                            <td className="py-3.5 px-4">{prod.category}</td>
                            <td className="py-3.5 px-4 text-slate-950 font-black">₹{Math.round(prod.price || 0).toLocaleString('en-IN')}.00</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                prod.stock > 10 ? 'bg-emerald-50 text-emerald-600' :
                                prod.stock > 0 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                              }`}>
                                {prod.stock > 0 ? `${prod.stock} In Stock` : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button 
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="w-7 h-7 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 flex items-center justify-center text-gray-600 cursor-pointer"
                                  title="Edit details"
                                >
                                  <FiEdit2 size={12} />
                                </button>
                                <button 
                                  onClick={() => setDeletingProductId(prod._id || prod.id)}
                                  className="w-7 h-7 bg-red-50 rounded-lg border border-red-100/50 hover:bg-red-100 flex items-center justify-center text-brand-red cursor-pointer"
                                  title="Delete item"
                                >
                                  <FiTrash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center py-8 text-xs text-gray-400 font-bold">No product matches your filters.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </motion.div>
              )}

              {/* TAB 3: ORDERS DISPATCH PANEL */}
              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6"
                >
                  
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Representative</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Items Count</th>
                          <th className="py-3 px-4">Sales Amount</th>
                          <th className="py-3 px-4 text-center">Dispatch Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold text-gray-700">
                        {orders.map((order) => (
                          <tr key={order._id || order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-4 font-black text-slate-950">{order.orderId}</td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col text-left">
                                <span className="font-extrabold text-slate-900">{order.user?.name || "Guest Account"}</span>
                                <span className="text-[10px] text-gray-400 mt-0.5">{order.user?.clinicName || "clinic not specified"}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-3.5 px-4">{order.products?.length || 0} items</td>
                            <td className="py-3.5 px-4 text-slate-950 font-black">₹{Math.round(order.totalAmount || 0).toLocaleString('en-IN')}.00</td>
                            <td className="py-3.5 px-4 text-center">
                              
                              {/* Status Select selector */}
                              <select
                                value={order.orderStatus}
                                onChange={(e) => handleOrderStatusChange(order._id || order.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase cursor-pointer focus:outline-none ${
                                  order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                  order.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                  order.orderStatus === 'Packed' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                                  order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                                  'bg-gray-50 text-gray-600 border border-gray-150'
                                }`}
                              >
                                <option value="Ordered">Ordered</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>

                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center py-8 text-xs text-gray-400 font-bold">No orders processed yet on this platform.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </motion.div>
              )}

              {/* TAB 4: PLATFORM USER AUDIT */}
              {activeTab === 'users' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6"
                >
                  
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                          <th className="py-3 px-4">Representative</th>
                          <th className="py-3 px-4">Coordinates</th>
                          <th className="py-3 px-4">Enterprise Clinic</th>
                          <th className="py-3 px-4">GSTIN ID</th>
                          <th className="py-3 px-4 text-center">Privilege Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold text-gray-700">
                        {users.map((item) => (
                          <tr key={item._id || item.id} className="hover:bg-slate-50/55 transition-colors">
                            <td className="py-3.5 px-4 flex items-center gap-3">
                              <UserAvatar user={item} sizeClass="w-9 h-9" className="border border-slate-100" />
                              <span className="font-extrabold text-slate-950">{item.name}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col text-left">
                                <span>{item.email}</span>
                                <span className="text-[10px] text-gray-400 font-bold mt-0.5">{item.phone}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-gray-600 font-bold">{item.clinicName || '—'}</td>
                            <td className="py-3.5 px-4 text-slate-900 font-bold uppercase">{item.gstin || '—'}</td>
                            <td className="py-3.5 px-4 text-center">
                              
                              {/* Role Selector dropdown: edit enabled ONLY for Super Admins */}
                              {user.role === 'Super Admin' ? (
                                <select
                                  value={item.role}
                                  onChange={(e) => handleUserRoleChange(item._id || item.id, e.target.value)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase cursor-pointer focus:outline-none ${
                                    item.role === 'Super Admin' ? 'bg-red-50 text-brand-red border border-red-150' :
                                    item.role === 'Admin' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                    'bg-slate-50 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  <option value="Customer">Customer</option>
                                  <option value="Admin">Admin</option>
                                  <option value="Super Admin">Super Admin</option>
                                </select>
                              ) : (
                                <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase ${
                                  item.role === 'Super Admin' ? 'bg-red-50 text-brand-red border border-red-150' :
                                  item.role === 'Admin' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                  'bg-slate-50 text-slate-700 border border-slate-200'
                                }`}>
                                  {item.role}
                                </span>
                              )}

                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center py-8 text-xs text-gray-400 font-bold">No user accounts found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>

      </main>

      {/* MODAL 1: ADD & EDIT PRODUCT FORM */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 relative text-left"
            >
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 text-gray-400 hover:text-gray-600 flex items-center justify-center rounded-full hover:bg-gray-50 cursor-pointer"
              >
                <FiX size={16} />
              </button>

              <h3 className="text-base font-bold font-outfit text-slate-900 mb-4 tracking-tight">
                {editingProduct ? 'Modify Product Specifications' : 'Upload New Product Listing'}
              </h3>

              <form onSubmit={handleProductFormSubmit} className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-1 text-xs">
                
                {/* Product Name */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="font-extrabold text-gray-500 uppercase tracking-wide text-[10px]">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Waldent Premium Portable Dental Chair"
                    className="px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 placeholder-gray-400 font-bold focus:outline-none focus:bg-white focus:border-gray-200"
                  />
                </div>

                {/* Two Col fields */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Brand */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="font-extrabold text-gray-500 uppercase tracking-wide text-[10px]">Brand *</label>
                    <select
                      value={prodBrand}
                      onChange={(e) => setProdBrand(e.target.value)}
                      className="px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 font-bold focus:outline-none focus:bg-white focus:border-gray-200 cursor-pointer"
                    >
                      {brands.map(b => (
                        <option key={b._id || b.name} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="font-extrabold text-gray-500 uppercase tracking-wide text-[10px]">Category *</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 font-bold focus:outline-none focus:bg-white focus:border-gray-200 cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c._id || c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Description */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="font-extrabold text-gray-500 uppercase tracking-wide text-[10px]">Description</label>
                  <textarea
                    rows={2.5}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    placeholder="Enter key technical specifications, clinical applications, and ergonomic descriptions..."
                    className="px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 placeholder-gray-400 font-bold focus:outline-none focus:bg-white focus:border-gray-200"
                  />
                </div>

                {/* Grid 3 col: Price, Original Price, Stock */}
                <div className="grid grid-cols-3 gap-4">
                  
                  {/* Price */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="font-extrabold text-gray-500 uppercase tracking-wide text-[10px]">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="8500"
                      className="px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 placeholder-gray-400 font-bold focus:outline-none focus:bg-white focus:border-gray-200"
                    />
                  </div>

                  {/* Original Price */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="font-extrabold text-gray-500 uppercase tracking-wide text-[10px]">MSRP Price (₹)</label>
                    <input
                      type="number"
                      value={prodOriginalPrice}
                      onChange={(e) => setProdOriginalPrice(e.target.value)}
                      placeholder="10000"
                      className="px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 placeholder-gray-400 font-bold focus:outline-none focus:bg-white focus:border-gray-200"
                    />
                  </div>

                  {/* Stock */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="font-extrabold text-gray-500 uppercase tracking-wide text-[10px]">Stock Count</label>
                    <input
                      type="number"
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      placeholder="20"
                      className="px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 placeholder-gray-400 font-bold focus:outline-none focus:bg-white focus:border-gray-200"
                    />
                  </div>

                </div>

                {/* Image URL */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="font-extrabold text-gray-500 uppercase tracking-wide text-[10px]">Image Path / URL (Optional)</label>
                  <input
                    type="text"
                    value={prodImageUrl}
                    onChange={(e) => setProdImageUrl(e.target.value)}
                    placeholder="Leave empty for category-linked image defaults..."
                    className="px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 placeholder-gray-400 font-bold focus:outline-none focus:bg-white focus:border-gray-200"
                  />
                </div>

                {/* Specs: Model, Warranty, Cert */}
                <div className="p-4 border border-slate-100 bg-slate-50/40 rounded-xl flex flex-col gap-3">
                  <span className="font-extrabold text-[10px] text-gray-400 uppercase block mb-1">Clinic Specifications</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[10px] text-gray-400 font-bold">Model Code</label>
                      <input 
                        type="text" 
                        value={prodModelCode} 
                        onChange={(e) => setProdModelCode(e.target.value)} 
                        placeholder="e.g. WAL-CHA-102"
                        className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg font-bold placeholder-gray-305 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[10px] text-gray-400 font-bold">Warranty Details</label>
                      <input 
                        type="text" 
                        value={prodWarranty} 
                        onChange={(e) => setProdWarranty(e.target.value)} 
                        className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-gray-400 font-bold">Certifications</label>
                    <input 
                      type="text" 
                      value={prodCertification} 
                      onChange={(e) => setProdCertification(e.target.value)} 
                      className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg font-bold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-lg mt-2 cursor-pointer font-outfit shadow-2xs text-xs tracking-wide uppercase transition-colors"
                >
                  {editingProduct ? 'Save Inventory Changes' : 'Publish Product Listing'}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: DELETE CONFIRMATION */}
      <AnimatePresence>
        {deletingProductId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 text-center"
            >
              <h4 className="font-extrabold text-sm text-slate-950 font-outfit mb-2">Remove Product Listing?</h4>
              <p className="text-xs text-gray-500 leading-normal mb-5">
                This action is irreversible. The product details will be wiped and its category count decremented.
              </p>
              
              <div className="flex items-center gap-3.5 justify-center text-xs">
                <button
                  onClick={() => setDeletingProductId(null)}
                  className="px-5 py-2.5 border border-slate-100 hover:bg-slate-50 text-gray-500 font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteProduct}
                  className="px-5 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  Remove Listing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

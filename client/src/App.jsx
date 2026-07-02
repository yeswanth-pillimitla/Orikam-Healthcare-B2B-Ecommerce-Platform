import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, AppContext } from './context/AppContext';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import ProfileDashboard from './pages/ProfileDashboard';
import Auth from './pages/Auth';
import CompanyPages from './pages/CompanyPages';

function AppContent() {
  const { currentView } = useContext(AppContext);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'listing':
        return <ProductListing />;
      case 'details':
        return <ProductDetails />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'orders':
        return <MyOrders />;
      case 'profile':
        return <ProfileDashboard />;
      case 'auth':
        return <Auth />;
      case 'about':
      case 'careers':
      case 'blog':
      case 'contact':
      case 'help':
      case 'shipping':
      case 'returns':
      case 'terms':
        return <CompanyPages type={currentView} />;
      default:
        return <Home />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="min-h-screen flex flex-col"
      >
        {renderView()}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

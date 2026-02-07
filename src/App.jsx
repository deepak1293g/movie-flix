
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WatchPage from './pages/WatchPage';
import CategoryPage from './pages/CategoryPage';
import ProfilePage from './pages/ProfilePage';
import BrowsePage from './pages/BrowsePage';
import MyListPage from './pages/MyListPage';
import ContactPage from './pages/ContactPage';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-red selection:text-white px-4 sm:px-6 lg:px-8">
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/watch/:id/:slug?" element={<PageWrapper><WatchPage /></PageWrapper>} />
          <Route path="/category/:genre" element={<PageWrapper><CategoryPage /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
          <Route path="/browse/:type" element={<PageWrapper><BrowsePage /></PageWrapper>} />
          <Route path="/mylist" element={<PageWrapper><MyListPage /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      {!isAuthPage && <Footer />}
      <Toaster position="bottom-center" toastOptions={{
        style: {
          background: 'rgba(18, 18, 18, 0.9)',
          color: '#fff',
          border: '1px solid rgba(229, 9, 20, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '12px 24px',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        },
      }} />
    </div>
  );
}

export default App;

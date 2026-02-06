import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Download, User, LogOut, ChevronDown, Film, Tv, Menu, X, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Movies', path: '/browse/movies', icon: Film },
        { name: 'Series', path: '/browse/series', icon: Tv }
    ];

    const mobileUserLinks = [
        { name: 'My List', path: '/mylist', icon: List },
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Downloads', path: '/downloads', icon: Download }
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${mobileMenuOpen
            ? 'bg-black py-4'
            : isScrolled
                ? 'bg-black/95 py-4 shadow-[0_10px_50px_rgba(0,0,0,0.9)] backdrop-blur-lg'
                : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-7'
            }`}>
            <div className="max-w-[1800px] mx-auto px-6 md:px-20 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 z-50 group">
                    <span className="text-2xl sm:text-3xl font-black tracking-tighter text-brand-red drop-shadow-[0_0_15px_rgba(229,9,20,0.5)] group-hover:scale-105 transition-transform duration-300">
                        MOVIEFLIX
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-4 lg:gap-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative group font-black tracking-widest text-[15px] transition-all duration-300 flex items-center gap-2 ${isActive(link.path) ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            {link.icon && <link.icon className={`w-4 h-4 transition-colors ${isActive(link.path) ? 'text-brand-red' : 'group-hover:text-brand-red'}`} />}
                            {link.name}
                            <div className={`absolute -bottom-2 left-0 h-0.5 bg-brand-red transition-all duration-500 shadow-[0_0_10px_#E50914] ${isActive(link.path) ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50'}`} />
                        </Link>
                    ))}
                </div>

                {/* Right Section: Desktop Search & User */}
                <div className="flex items-center gap-4 sm:gap-8">
                    <div className="hidden lg:block">
                        <SearchBar />
                    </div>


                    {user ? (
                        <div className="relative group/user">
                            <div className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-10 h-10 rounded-full premium-gradient-red flex items-center justify-center text-lg font-black text-white shadow-xl shadow-brand-red/10 group-hover:shadow-brand-red/40 group-hover:scale-105 transition-all duration-500 ring-2 ring-white/5 group-hover:ring-brand-red/30">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
                            </div>

                            <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-500 transform translate-y-4 group-hover/user:translate-y-0">
                                <div className="glass-dark border border-white/10 rounded-[24px] shadow-2xl p-2 w-64 overflow-hidden">
                                    <div className="px-4 py-4 border-b border-white/10 mb-2">
                                        <p className="text-base text-white font-bold">{user.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    {mobileUserLinks.map((item) => (
                                        <Link key={item.path} to={item.path} className="flex items-center gap-3 w-full px-4 py-3 text-base text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all text-left">
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    ))}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-base text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden lg:flex items-center">
                            <Link to="/login" className="text-sm sm:text-base lg:text-base font-bold hover:text-brand-red transition-all hover:scale-110 duration-300">Login</Link>
                        </div>
                    )}
                </div>

                <div className="hidden md:flex lg:hidden flex-1 justify-center px-8">
                    <SearchBar />
                </div>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all z-50 relative w-10 h-10 flex flex-col justify-center items-center gap-1.5"
                >
                    <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                    <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>
            {/* Mobile Menu Overlay with Staggered Animations */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black z-40 lg:hidden pt-24 px-6 overflow-y-auto"
                    >
                        <div className="flex flex-col gap-4">
                            {navLinks.map((item, index) => (
                                <motion.div
                                    key={item.path}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 + 0.1 }}
                                >
                                    <Link
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-4 text-2xl font-bold text-white hover:text-brand-red transition-colors py-4 border-b border-white/10"
                                    >
                                        {item.icon && <item.icon className="w-6 h-6 text-brand-red" />}
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}

                            {user ? (
                                <>
                                    {mobileUserLinks.map((item, index) => (
                                        <motion.div
                                            key={item.path}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: (navLinks.length + index) * 0.05 + 0.1 }}
                                        >
                                            <Link
                                                to={item.path}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-4 text-xl font-bold text-gray-400 hover:text-white transition-colors py-3"
                                            >
                                                <item.icon className="w-5 h-5" />
                                                {item.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (navLinks.length + mobileUserLinks.length) * 0.05 + 0.1 }}
                                    >
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-4 text-xl font-bold text-red-500 hover:text-red-400 transition-colors py-3 text-left w-full mt-4"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col gap-4 pt-6"
                                >
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-center bg-brand-red text-white px-8 py-4 rounded-full text-lg font-black transition-all hover:bg-red-700 shadow-lg shadow-brand-red/40"
                                    >
                                        Sign In
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;

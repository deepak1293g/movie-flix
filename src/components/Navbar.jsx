import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Download, User, LogOut, ChevronDown, Film, Tv, Menu, X, List } from 'lucide-react';
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
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled
            ? 'bg-black/95 py-4 shadow-[0_10px_50px_rgba(0,0,0,0.9)] backdrop-blur-lg'
            : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-7'
            }`}>
            <div className="max-w-[1800px] mx-auto px-6 md:px-20 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group z-50">
                    <span className="text-2xl sm:text-3xl font-black tracking-tighter text-brand-red group-hover:scale-105 transition-transform duration-300">
                        MOVIEFLIX
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-12">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Movies', path: '/browse/movies', icon: Film },
                        { name: 'Series', path: '/browse/series', icon: Tv }
                    ].map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative group font-black tracking-widest text-[15px] transition-all duration-300 flex items-center gap-2 ${isActive(link.path) ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            {link.icon && <link.icon className={`w-4 h-4 transition-colors ${isActive(link.path) ? 'text-brand-red' : 'group-hover:text-brand-red'}`} />}
                            {link.name}

                            {/* Active Indicator */}
                            <div className={`absolute -bottom-2 left-0 h-0.5 bg-brand-red transition-all duration-500 shadow-[0_0_10px_#E50914] ${isActive(link.path) ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50'}`} />
                        </Link>
                    ))}
                </div>

                {/* Right Section: Search & User */}
                <div className="flex items-center gap-4 sm:gap-8">
                    <SearchBar />

                    {/* Desktop: Downloads + User Menu */}
                    <div className="hidden md:flex items-center gap-6 text-gray-300">
                        <Link to="/downloads" className="hover:text-brand-red transition-all hover:scale-110 duration-300 relative group/icon">
                            <Download className="w-6 h-6" />
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-red rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                        </Link>

                        {user ? (
                            <div className="relative group/user">
                                <div className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full premium-gradient-red flex items-center justify-center text-lg font-black text-white shadow-xl shadow-brand-red/10 group-hover:shadow-brand-red/40 group-hover:scale-105 transition-all duration-500 ring-2 ring-white/5 group-hover:ring-brand-red/30">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
                                </div>

                                {/* Dropdown */}
                                <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-500 transform translate-y-4 group-hover/user:translate-y-0">
                                    <div className="glass-dark border border-white/10 rounded-[24px] shadow-2xl p-2 w-64 overflow-hidden">
                                        <div className="px-4 py-4 border-b border-white/10 mb-2">
                                            <p className="text-base text-white font-bold">{user.name}</p>
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <Link to="/mylist" className="flex items-center gap-3 w-full px-4 py-3 text-base text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all text-left">
                                            <List className="w-5 h-5" />
                                            My List
                                        </Link>
                                        <Link to="/profile" className="flex items-center gap-3 w-full px-4 py-3 text-base text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all text-left">
                                            <User className="w-5 h-5" />
                                            Profile
                                        </Link>

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
                            <div className="flex items-center gap-2 sm:gap-4">
                                <Link to="/login" className="text-sm sm:text-base font-bold hover:text-brand-red transition-all hover:scale-110 duration-300">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-gradient-to-r from-brand-red to-red-700 text-white hover:from-red-700 hover:to-brand-red px-4 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-black transition-all duration-300 transform hover:scale-110 shadow-lg shadow-brand-red/40 hover:shadow-brand-red/60">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile: Hamburger Menu */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all z-50"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 md:hidden pt-24 px-6">
                    <div className="flex flex-col gap-6">
                        {/* Navigation Links */}
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-2xl font-bold text-white hover:text-brand-red transition-colors py-3 border-b border-white/10"
                        >
                            Home
                        </Link>
                        <Link
                            to="/browse/movies"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 text-2xl font-bold text-white hover:text-brand-red transition-colors py-3 border-b border-white/10"
                        >
                            <Film className="w-6 h-6" />
                            Movies
                        </Link>
                        <Link
                            to="/browse/series"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 text-2xl font-bold text-white hover:text-brand-red transition-colors py-3 border-b border-white/10"
                        >
                            <Tv className="w-6 h-6" />
                            Series
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/mylist"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 text-xl font-bold text-white hover:text-brand-red transition-colors py-3 border-b border-white/10"
                                >
                                    <List className="w-5 h-5" />
                                    My List
                                </Link>
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 text-xl font-bold text-white hover:text-brand-red transition-colors py-3 border-b border-white/10"
                                >
                                    <User className="w-5 h-5" />
                                    Profile
                                </Link>
                                <Link
                                    to="/downloads"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 text-xl font-bold text-white hover:text-brand-red transition-colors py-3 border-b border-white/10"
                                >
                                    <Download className="w-5 h-5" />
                                    Downloads
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 text-xl font-bold text-red-400 hover:text-red-300 transition-colors py-3 text-left"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-4 pt-4">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-center bg-white/10 text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover:bg-white/20"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-center bg-gradient-to-r from-brand-red to-red-700 text-white px-8 py-4 rounded-full text-lg font-black transition-all hover:from-red-700 hover:to-brand-red shadow-lg shadow-brand-red/40"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

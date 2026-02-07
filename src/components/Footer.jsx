import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0f1014] border-t border-white/10 pt-20 pb-10 mt-auto">
            <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <span className="text-3xl font-black tracking-tighter text-brand-red group-hover:scale-110 transition-transform duration-300">
                                MOVIEFLIX
                            </span>
                        </Link>
                        <p className="text-gray-400 text-[15px] leading-relaxed max-w-xs">
                            Step into the future of entertainment. Experience premium cinematic production with state-of-the-art streaming technology.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { Icon: Twitter, href: 'https://twitter.com/dflix' },
                                { Icon: Instagram, href: 'https://instagram.com/dflix' },
                                { Icon: Youtube, href: 'https://youtube.com/dflix' },
                                { Icon: Github, href: 'https://github.com/dflix' }
                            ].map(({ Icon, href }, index) => (
                                <a
                                    key={index}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-brand-red hover:bg-brand-red/10 hover:border-brand-red/50 transition-all duration-300 group"
                                >
                                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-white font-bold tracking-widest text-sm mb-8">Navigation</h3>
                        <ul className="space-y-4">
                            {['Home', 'Movies', 'Series', 'My List'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={
                                            item === 'Home' ? '/' :
                                                item === 'Movies' ? '/browse/movies' :
                                                    item === 'Series' ? '/browse/series' :
                                                        item === 'My List' ? '/mylist' : '/'
                                        }
                                        className="text-gray-400 hover:text-brand-red text-[15px] transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-brand-red scale-0 group-hover:scale-100 transition-transform"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold tracking-widest text-sm mb-8">Support</h3>
                        <ul className="space-y-4">
                            <li><Link to="/contact" className="text-gray-400 hover:text-white text-[15px] transition-colors duration-200">Help Center</Link></li>
                            {[
                                { name: 'Terms of Use', path: '/terms' },
                                { name: 'Privacy Policy', path: '/privacy' },
                                { name: 'Cookie Preferences', path: '/cookies' },
                                { name: 'Corporate Info', path: '/corporate' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.path} className="text-gray-400 hover:text-white text-[15px] transition-colors duration-200">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold tracking-widest text-sm mb-8">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 text-[15px]">
                                <MapPin className="w-5 h-5 text-brand-red flex-shrink-0" />
                                <span>123 Streaming Way, Cinematic Valley, CA 90210</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-[15px]">
                                <Phone className="w-5 h-5 text-brand-red flex-shrink-0" />
                                <span>+1 (555) 000-3549</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-[15px]">
                                <Mail className="w-5 h-5 text-brand-red flex-shrink-0" />
                                <span>support@dflix.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} MOVIEFLIX ENTERTAINMENT. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link to="/profile" className="text-gray-500 hover:text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors">Account</Link>
                        <Link to="/mylist" className="text-gray-500 hover:text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors">Watchlist</Link>
                        <span className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-50">v2.4.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

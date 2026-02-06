import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        const res = await register(formData.name, formData.email, formData.password);
        if (res.success) {
            toast.success("Welcome to Movieflix! Account created.");
            navigate('/');
        } else {
            toast.error(res.message);
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 pt-36 pb-20 md:pt-0 overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop")',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-xl">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black tracking-tighter text-brand-red mb-2 drop-shadow-2xl">MOVIEFLIX</h1>
                    <p className="text-gray-400 uppercase tracking-[0.3em] text-xs font-bold">Start Your Cinematic Journey</p>
                </div>

                <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl">
                    <h2 className="text-3xl font-display font-black text-white mb-8">Create Account</h2>

                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-red transition-colors" />
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="John Wick"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-brand-red/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-600"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-red transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="wick@highstable.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-brand-red/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-600"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-red transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-brand-red/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-600"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-red transition-colors" />
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-brand-red/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-600"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-2">
                            <input type="checkbox" required className="accent-brand-red w-4 h-4" />
                            <span className="text-xs text-gray-400">I agree to the <a href="#" className="text-white hover:text-brand-red underline">Terms of Service</a></span>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="group w-full bg-brand-red hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-brand-red/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8 text-center text-gray-600">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <span className="relative bg-[#0f1014]/0 px-4 text-xs font-bold uppercase tracking-[0.3em]">Quick Sign Up</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-all group">
                            <Chrome className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-all group">
                            <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">Github</span>
                        </button>
                    </div>

                    <p className="mt-10 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Already Have One? <Link to="/login" className="text-white hover:text-brand-red transition-colors ml-1 underline decoration-brand-red underline-offset-4">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

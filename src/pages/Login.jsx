import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await login(email, password);
        if (res.success) {
            toast.success("Welcome back to Movieflix!");
            navigate('/');
        } else {
            toast.error(res.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center pt-32 md:pt-0 px-4 overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop")',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md">

                <div className="bg-[#0f1014]/40 backdrop-blur-[40px] border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group/card transition-all duration-700 hover:border-brand-red/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red/50 to-transparent"></div>
                    <h2 className="text-4xl font-display font-black text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400 text-sm mb-10">Sign in to continue your journey</p>

                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-red transition-colors" />
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all text-white placeholder:text-gray-600 focus:ring-4 focus:ring-brand-red/10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-red transition-colors" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all text-white placeholder:text-gray-600 focus:ring-4 focus:ring-brand-red/10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <a href="#" className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Forgot Password?</a>
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
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <span className="relative bg-[#0f1014]/0 px-4 text-xs font-bold text-gray-500 uppercase tracking-[0.3em] backdrop-blur-md">Or Continue With</span>
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

                    <p className="mt-8 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                        New to Movieflix? <Link to="/register" className="text-white hover:text-brand-red transition-colors ml-1 underline decoration-brand-red underline-offset-4">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

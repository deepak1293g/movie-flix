import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, Instagram, Twitter, Facebook } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast.success("Message sent! We'll get back to you soon.", {
                style: {
                    background: '#1a1b21',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                },
                icon: '🚀'
            });
            setFormData({ name: '', email: '', subject: '', message: '' });
            setIsSubmitting(false);
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[#0f1014] text-white pt-24 pb-20 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase">
                        Get In <span className="text-brand-red">Touch</span>
                    </h1>
                    <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto font-light">
                        Have questions, feedback, or just want to talk about movies? Our team is here to help you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side: Contact Info */}
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: Mail, title: "Email Us", info: "support@dflix.com", color: "text-blue-400" },
                                { icon: Phone, title: "Call Us", info: "+1 (555) 000-0000", color: "text-green-400" },
                                { icon: MapPin, title: "Visit Us", info: "Cinema Walk, Los Angeles, CA", color: "text-red-400" },
                                { icon: Globe, title: "Website", info: "www.dflix.com", color: "text-purple-400" }
                            ].map((item, idx) => (
                                <div key={idx} className="group p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all hover:translate-y-[-4px]">
                                    <item.icon className={`w-8 h-8 ${item.color} mb-4`} />
                                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                                    <p className="text-gray-400 text-sm">{item.info}</p>
                                </div>
                            ))}
                        </div>

                        {/* Social Presence */}
                        <div className="p-8 bg-gradient-to-br from-brand-red/20 to-transparent border border-brand-red/20 rounded-3xl space-y-6">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <MessageSquare className="text-brand-red" /> Follow Our Journey
                            </h3>
                            <div className="flex gap-4">
                                {[Instagram, Twitter, Facebook].map((Icon, idx) => (
                                    <button key={idx} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-brand-red hover:border-brand-red transition-all transform hover:scale-110">
                                        <Icon className="w-5 h-5" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-red to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-8 sm:p-10 bg-[#16171d] border border-white/10 rounded-3xl backdrop-blur-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest pl-1 mb-3">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest pl-1 mb-3">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest pl-1 mb-3">Subject</label>
                                    <input
                                        required
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest pl-1 mb-3">Message</label>
                                    <textarea
                                        required
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder="Type your message here..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full bg-brand-red hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-xl shadow-brand-red/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isSubmitting ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;

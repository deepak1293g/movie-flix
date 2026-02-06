import React, { useState, useEffect, useContext } from 'react';
import { User, Mail, Save } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, updateProfile } = useContext(AuthContext);

    // Check if user exists (guard)
    if (!user) return <div className="text-white pt-24 text-center">Please login to view profile</div>;

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        const res = await updateProfile({ id: user._id, name, email, password });
        setLoading(false);

        if (res.success) {
            toast.success('Profile Updated Successfully');
            setPassword('');
            setConfirmPassword('');
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1014] text-white pt-40 md:pt-24 px-4 sm:px-8 flex justify-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-display font-bold mb-8 border-l-4 border-brand-red pl-4">My Profile</h1>

                <div className="bg-[#1f2024] p-8 rounded-xl border border-white/5">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-2 border-brand-red/50">
                            <span className="text-3xl font-bold text-white">{name.charAt(0)}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{name}</h2>
                            <p className="text-gray-400 text-sm">{user.isAdmin ? 'Admin User' : 'Standard Member'}</p>
                        </div>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-brand-red transition-colors"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-brand-red transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-6 mt-6">
                            <h3 className="text-lg font-bold mb-4">Change Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">New Password  <span className="text-xs text-gray-600">(leave blank to keep)</span></label>
                                    <input
                                        type="password"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-brand-red transition-colors"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-brand-red transition-colors"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70"
                        >
                            {loading ? 'Updating...' : <><Save className="w-5 h-5" /> Save Changes</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

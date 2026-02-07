import React, { useState, useEffect } from 'react';
import { Download, Trash2, Play, Pause, HardDrive, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const DownloadsPage = () => {
    const [downloads, setDownloads] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('downloads');
        if (stored) {
            setDownloads(JSON.parse(stored));
        }
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    // Progress Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setDownloads(prev => {
                const needsUpdate = prev.some(d => d.progress < 100);
                if (!needsUpdate) return prev;

                const next = prev.map(d => {
                    if (d.progress < 100 && !d.isPaused) {
                        const increment = Math.floor(Math.random() * 5) + 2;
                        return { ...d, progress: Math.min(100, d.progress + increment) };
                    }
                    return d;
                });

                localStorage.setItem('downloads', JSON.stringify(next));
                return next;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const removeDownload = (id) => {
        const updated = downloads.filter(d => d.id !== id);
        setDownloads(updated);
        localStorage.setItem('downloads', JSON.stringify(updated));
    };

    const togglePause = (id) => {
        const updated = downloads.map(d => {
            if (d.id === id) {
                return { ...d, isPaused: !d.isPaused };
            }
            return d;
        });
        setDownloads(updated);
        localStorage.setItem('downloads', JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-[#0f1014] text-white pt-44 sm:pt-40 md:pt-32 pb-20 px-4 sm:px-8">
            <div className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

                <header className="mb-12 sm:mb-16">
                    <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">My Downloads</h1>
                    <div className="flex items-center gap-2 text-gray-500">
                        <HardDrive size={16} />
                        <p className="text-sm font-medium tracking-wide">Manage your offline streaming content</p>
                    </div>
                </header>

                {downloads.length > 0 ? (
                    <div className="flex flex-col gap-10">
                        {/* Completed Downloads */}
                        {downloads.some(d => d.progress === 100) && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-1">
                                    <div className="w-1.5 h-6 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                    <h2 className="text-xl font-bold uppercase tracking-wider">Ready to Watch</h2>
                                </div>
                                <div className="grid gap-4">
                                    {downloads.filter(d => d.progress === 100).map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-[#16171d]/60 backdrop-blur-2xl p-5 sm:p-6 rounded-[32px] flex flex-col sm:flex-row items-center gap-6 border border-white/5 hover:border-brand-red/30 hover:bg-white/[0.05] transition-all duration-500 group/card shadow-2xl relative overflow-hidden"
                                        >
                                            {/* Item Image */}
                                            <div className="w-full sm:w-56 md:w-64 aspect-video flex-shrink-0 rounded-2xl overflow-hidden relative bg-gray-900 shadow-2xl group-hover/card:scale-[1.02] transition-transform duration-500">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover transform scale-105 group-hover/card:scale-100 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center text-white">
                                                        <Play size={20} fill="currentColor" className="ml-1" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Item Info */}
                                            <div className="flex-1 flex flex-col justify-center min-w-0 w-full">
                                                <h3 className="text-xl font-bold truncate tracking-tight text-white mb-2">{item.title}</h3>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{item.type}</span>
                                                    <span>•</span>
                                                    <span>{item.date || 'Recent'}</span>
                                                    <span>•</span>
                                                    <span className="text-brand-red font-black">{item.size}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex sm:flex-col lg:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 sm:border-l lg:border-l-0 border-white/10 sm:pl-6 lg:pl-0">
                                                <Link
                                                    to={`/offline-watch/${item.id}/${item.slug}`}
                                                    className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-brand-red text-white px-8 py-3.5 rounded-2xl font-bold text-xs hover:bg-red-700 transition-all shadow-xl shadow-brand-red/20 whitespace-nowrap group"
                                                >
                                                    Watch Now <Play size={16} fill="currentColor" className="transition-transform group-hover:scale-110" />
                                                </Link>
                                                <button
                                                    onClick={() => removeDownload(item.id)}
                                                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-red-600/10 text-gray-400 hover:text-red-500 px-8 py-3.5 rounded-2xl font-bold text-xs transition-all border border-white/10 hover:border-red-500/30 whitespace-nowrap"
                                                >
                                                    <Trash2 size={16} /> <span className="sm:hidden lg:inline">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Active Downloads */}
                        {downloads.some(d => d.progress < 100) && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-1">
                                    <div className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                                    <h2 className="text-xl font-bold uppercase tracking-wider">Downloading Content...</h2>
                                </div>
                                <div className="grid gap-4">
                                    {downloads.filter(d => d.progress < 100).map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-[#16171d]/60 backdrop-blur-2xl p-5 sm:p-6 rounded-[32px] flex flex-col sm:flex-row items-center gap-6 border border-white/5 hover:border-brand-red/30 hover:bg-white/[0.05] transition-all duration-500 group/card shadow-2xl relative overflow-hidden"
                                        >
                                            {/* Item Image & Mini Progress */}
                                            <div className="w-full sm:w-56 md:w-64 aspect-video flex-shrink-0 rounded-2xl overflow-hidden relative bg-gray-900 shadow-2xl group-hover/card:scale-[1.02] transition-transform duration-500">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover transform scale-105 group-hover/card:scale-100 transition-transform duration-700" />
                                                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/10">
                                                    <div
                                                        className="h-full bg-brand-red transition-all duration-300 shadow-[0_0_15px_#E50914]"
                                                        style={{ width: `${item.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Item Info & Main Progress */}
                                            <div className="flex-1 flex flex-col justify-center min-w-0 w-full">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xl font-bold truncate tracking-tight text-white">{item.title}</h3>
                                                    <span className="text-xs font-black text-brand-red bg-brand-red/10 px-2 py-0.5 rounded border border-brand-red/20">{item.progress}%</span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{item.type}</span>
                                                    <span>•</span>
                                                    <span>{item.date || 'Recent'}</span>
                                                </div>

                                                <div className="w-full space-y-3">
                                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                                                        <div
                                                            className={`h-full transition-all duration-700 shadow-[0_0_20px_rgba(229,9,20,0.5)] ${item.isPaused ? 'bg-gray-600' : 'bg-brand-red'}`}
                                                            style={{ width: `${item.progress}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                                                        <span>{item.isPaused ? 'Paused' : 'Downloading...'}</span>
                                                        <span className="text-gray-400">{item.size || '3.2 GB'} total</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex sm:flex-col lg:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 sm:border-l lg:border-l-0 border-white/10 sm:pl-6 lg:pl-0">
                                                <button
                                                    onClick={() => togglePause(item.id)}
                                                    className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-xs transition-all whitespace-nowrap shadow-xl ${item.isPaused ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
                                                >
                                                    {item.isPaused ? <><Play size={16} fill="currentColor" /> Resume</> : <><Pause size={16} /> Pause</>}
                                                </button>
                                                <button
                                                    onClick={() => removeDownload(item.id)}
                                                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-red-600/10 text-gray-400 hover:text-red-500 px-8 py-3.5 rounded-2xl font-bold text-xs transition-all border border-white/10 hover:border-red-500/30 whitespace-nowrap"
                                                >
                                                    <Trash2 size={16} /> <span className="sm:hidden lg:inline">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 flex flex-col items-center px-6">
                        <Download className="w-16 h-16 text-gray-600 mb-6" />
                        <h2 className="text-2xl font-bold mb-2">No downloads found</h2>
                        <p className="text-gray-400 mb-8 max-w-xs">Items you download will appear here for offline viewing.</p>
                        <Link to="/" className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20">
                            Find something to watch
                        </Link>
                    </div>
                )}


            </div>
        </div>
    );
};

export default DownloadsPage;

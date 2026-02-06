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
        <div className="min-h-screen bg-[#0f1014] text-white pt-36 md:pt-32 pb-20 px-4 sm:px-6">
            <div className={`max-w-6xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

                <header className="mb-16">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">My Downloads</h1>
                    <p className="text-gray-400 text-sm">Manage your offline content</p>
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
                                            className="bg-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-white/10 hover:bg-white/[0.07] transition-all"
                                        >
                                            {/* Item Image */}
                                            <div className="w-full sm:w-52 aspect-video flex-shrink-0 rounded-xl overflow-hidden relative bg-gray-900 group">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>

                                            {/* Item Info */}
                                            <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0 w-full">
                                                <h3 className="text-xl font-bold truncate tracking-tight">{item.title}</h3>
                                                <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{item.type}</span>
                                                    <span>•</span>
                                                    <span>{item.date || 'Recent'}</span>
                                                    <span>•</span>
                                                    <span className="text-gray-400">{item.size}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex sm:flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 sm:border-l border-white/5 sm:pl-8">
                                                <Link
                                                    to={`/offline-watch/${item.id}/${item.slug}`}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-white text-black px-8 py-3.5 rounded-xl font-bold text-xs hover:bg-gray-200 transition-all shadow-xl"
                                                >
                                                    Watch Now <Play size={14} fill="currentColor" />
                                                </Link>
                                                <button
                                                    onClick={() => removeDownload(item.id)}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-white/5 hover:bg-red-600/10 text-gray-500 hover:text-red-500 px-8 py-3.5 rounded-xl font-bold text-xs transition-all border border-white/10 hover:border-red-500/30"
                                                >
                                                    <Trash2 size={14} /> Remove
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
                                            className="bg-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-white/10 hover:bg-white/[0.07] transition-all"
                                        >
                                            {/* Item Image */}
                                            <div className="w-full sm:w-52 aspect-video flex-shrink-0 rounded-xl overflow-hidden relative bg-gray-900 group">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                                                    <div
                                                        className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                                                        style={{ width: `${item.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Item Info */}
                                            <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0 w-full">
                                                <h3 className="text-xl font-bold truncate tracking-tight">{item.title}</h3>
                                                <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{item.type}</span>
                                                    <span>•</span>
                                                    <span>{item.date || 'Recent'}</span>
                                                </div>

                                                <div className="mt-4 w-full">
                                                    <div className="flex justify-between items-center mb-1.5 px-0.5">
                                                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                                            {item.isPaused ? 'Download Paused' : 'Downloading Content...'}
                                                        </span>
                                                        <span className="text-xs font-black text-white">{item.progress}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                                        <div
                                                            className={`h-full transition-all duration-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] ${item.isPaused ? 'bg-gray-600' : 'bg-red-600'}`}
                                                            style={{ width: `${item.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex sm:flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 sm:border-l border-white/5 sm:pl-8">
                                                <button
                                                    onClick={() => togglePause(item.id)}
                                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-xs transition-all ${item.isPaused ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
                                                >
                                                    {item.isPaused ? <><Play size={14} fill="currentColor" /> Resume</> : <><Pause size={14} /> Pause</>}
                                                </button>
                                                <button
                                                    onClick={() => removeDownload(item.id)}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-white/5 hover:bg-red-600/10 text-gray-500 hover:text-red-500 px-8 py-3.5 rounded-xl font-bold text-xs transition-all border border-white/10 hover:border-red-500/30"
                                                >
                                                    <Trash2 size={14} /> Remove
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

                <div className="mt-12 flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 max-w-2xl">
                    <Info className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <p className="text-gray-400 text-sm">
                        Downloaded content is stored on your device. Clearing browser cache may remove these downloads.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DownloadsPage;

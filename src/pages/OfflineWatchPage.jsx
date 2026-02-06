import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Maximize, Volume2, VolumeX, ChevronLeft, Star, Download, PlayCircle, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const OfflineWatchPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState(null);
    const [otherDownloads, setOtherDownloads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Video Player State
    const videoRef = useRef(null);
    const playerContainerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isManualLandscape, setIsManualLandscape] = useState(false);
    const [suppressClick, setSuppressClick] = useState(false);
    const [initialResumeTime, setInitialResumeTime] = useState(0);
    const [historyLoaded, setHistoryLoaded] = useState(false);

    useEffect(() => {
        setHistoryLoaded(false);
    }, [id]);

    const [previewTime, setPreviewTime] = useState(null);
    const [previewPos, setPreviewPos] = useState(0);
    const previewVideoRef = useRef(null);
    const clickTimeoutRef = useRef(null);

    useEffect(() => {
        const loadOfflineContent = () => {
            setLoading(true);
            const stored = JSON.parse(localStorage.getItem('downloads') || '[]');
            const item = stored.find(d => d.id.toString() === id.toString());

            if (item) {
                setContent(item);
                setOtherDownloads(stored.filter(d => d.id.toString() !== id.toString()));

                // Load progress
                const progress = JSON.parse(localStorage.getItem('offline_progress') || '{}');
                if (progress[id] && !historyLoaded) {
                    setInitialResumeTime(progress[id]);
                    setHistoryLoaded(true);
                }
            }
            setLoading(false);
        };
        loadOfflineContent();
    }, [id, historyLoaded]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'f':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'm':
                    e.preventDefault();
                    toggleMute();
                    break;
                case 'arrowright':
                case 'l':
                    e.preventDefault();
                    handleSkip(10);
                    break;
                case 'arrowleft':
                case 'j':
                    e.preventDefault();
                    handleSkip(-10);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, isMuted, showControls]);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    };

    const toggleFullscreen = () => {
        if (!playerContainerRef.current) return;

        setSuppressClick(true);
        setTimeout(() => setSuppressClick(false), 400);

        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen().catch(err => {
                toast.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleSkip = (amount) => {
        if (videoRef.current) {
            videoRef.current.currentTime += amount;
        }
    };

    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
        if (initialResumeTime > 0 && initialResumeTime < e.target.duration - 5) {
            e.target.currentTime = initialResumeTime;
        }
        setInitialResumeTime(0);
    };

    // Auto-save offline progress
    useEffect(() => {
        if (!content || !isPlaying || !videoRef.current) return;

        const interval = setInterval(() => {
            const video = videoRef.current;
            if (!video) return;

            const time = video.currentTime;
            const dur = video.duration;
            if (dur === 0) return;

            const progress = JSON.parse(localStorage.getItem('offline_progress') || '{}');
            const percent = (time / dur) * 100;

            if (percent > 95) {
                delete progress[id];
            } else if (percent > 5) {
                progress[id] = time;
            }
            localStorage.setItem('offline_progress', JSON.stringify(progress));
        }, 5000);

        return () => clearInterval(interval);
    }, [isPlaying, id, content]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleProgressChange = (e) => {
        if (!videoRef.current) return;
        const time = e.target.value;
        videoRef.current.currentTime = time;
        setCurrentTime(time);
        videoRef.current.play();
        setIsPlaying(true);
    };

    const handleMouseMoveAction = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const time = percentage * duration;
        setPreviewTime(time);
        setPreviewPos(x);

        if (previewVideoRef.current) {
            previewVideoRef.current.currentTime = time;
        }
    };


    if (loading) return <div className="min-h-screen bg-[#0f1014] flex items-center justify-center text-white font-display font-black uppercase tracking-widest animate-pulse">Initializing Offline Stream...</div>;
    if (!content) return (
        <div className="min-h-screen bg-[#0f1014] flex flex-col items-center justify-center text-center p-6 text-white">
            <h1 className="text-4xl font-display font-black uppercase text-brand-red mb-4">Asset Not Found</h1>
            <p className="text-gray-400 mb-8">The requested offline asset is no longer available in your local storage.</p>
            <Link to="/downloads" className="bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl">Back to Library</Link>
        </div>
    );

    return (
        <div className="pt-36 md:pt-20 min-h-screen bg-[#0f1014] text-white">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-4 sm:gap-8 pb-20">

                {/* Main Video Section */}
                <div className="w-full">
                    <div
                        ref={playerContainerRef}
                        className="relative aspect-video w-full max-w-[1200px] mx-auto bg-black sm:rounded-2xl overflow-hidden shadow-2xl sm:border border-white/10 group"
                        onMouseEnter={() => setShowControls(true)}
                        onMouseLeave={() => {
                            if (!isQualityMenuOpen) {
                                setShowControls(false);
                                clearTimeout(window.controlsTimeout);
                            }
                        }}
                        onMouseMove={() => {
                            setShowControls(true);
                            clearTimeout(window.controlsTimeout);
                            window.controlsTimeout = setTimeout(() => {
                                if (!isQualityMenuOpen) setShowControls(false);
                            }, 3000);
                        }}
                    >
                        <video
                            ref={videoRef}
                            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                            autoPlay
                            onLoadedMetadata={handleLoadedMetadata}
                            onTimeUpdate={() => {
                                if (videoRef.current) {
                                    setCurrentTime(videoRef.current.currentTime);
                                }
                            }}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            className="w-full h-full object-contain cursor-pointer"
                            onClick={(e) => {
                                if (suppressClick) return;
                                if (e.detail === 1) {
                                    clickTimeoutRef.current = setTimeout(() => {
                                        togglePlay();
                                    }, 250);
                                }
                            }}
                            onDoubleClick={(e) => {
                                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
                                toggleFullscreen();
                            }}
                        />

                        {/* Controls Overlay */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 flex flex-col justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                            onClick={(e) => {
                                if (suppressClick) return;
                                if (e.detail === 1) {
                                    clickTimeoutRef.current = setTimeout(() => {
                                        togglePlay();
                                        setIsQualityMenuOpen(false);
                                    }, 250);
                                }
                            }}
                            onDoubleClick={(e) => {
                                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
                                toggleFullscreen();
                            }}
                        >
                            <div className="p-6"></div>

                            {/* Center Controls */}
                            <div className="flex items-center justify-center gap-8 sm:gap-20 text-white" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => handleSkip(-10)} className="hover:scale-110 transition-all p-2 text-white/80 hover:text-white touch-manipulation drop-shadow-lg">
                                    <SkipBack className="w-8 h-8 sm:w-12 sm:h-12 fill-current" />
                                </button>
                                <button onClick={togglePlay} className="hover:scale-125 transition-all p-2 text-white touch-manipulation drop-shadow-2xl">
                                    {isPlaying ? <Pause className="w-12 h-12 sm:w-20 sm:h-20 fill-current" /> : <Play className="w-12 h-12 sm:w-20 sm:h-20 fill-current translate-x-1" />}
                                </button>
                                <button onClick={() => handleSkip(10)} className="hover:scale-110 transition-all p-2 text-white/80 hover:text-white touch-manipulation drop-shadow-lg">
                                    <SkipForward className="w-8 h-8 sm:w-12 sm:h-12 fill-current" />
                                </button>
                            </div>

                            {/* Bottom Bar */}
                            <div className="px-3 pb-3 sm:px-6 sm:pb-6" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-gray-300 flex-shrink-0">
                                        <span className="text-white font-bold">{formatTime(currentTime)}</span>
                                        <span className="opacity-50">/</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>

                                    <div className="flex-1 relative h-8 flex items-center group/seek">
                                        {previewTime !== null && (
                                            <div className="absolute bottom-full mb-4 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none" style={{ left: `${previewPos}px` }}>
                                                <div className="w-32 sm:w-48 aspect-video bg-black rounded-lg border-2 border-brand-red overflow-hidden shadow-2xl mb-2 relative">
                                                    <video ref={previewVideoRef} src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" muted className="w-full h-full object-cover" />
                                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/80 px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-bold font-mono">
                                                        {formatTime(previewTime)}
                                                    </div>
                                                </div>
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-brand-red rotate-45 -translate-y-1.5 shadow-xl"></div>
                                            </div>
                                        )}
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration || 0}
                                            value={currentTime}
                                            onChange={handleProgressChange}
                                            onMouseMove={handleMouseMoveAction}
                                            onMouseLeave={() => setPreviewTime(null)}
                                            className="w-full h-1 cursor-pointer rounded-lg appearance-none hover:h-1.5 transition-all accent-brand-red"
                                            style={{ background: `linear-gradient(to right, #E50914 ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / (duration || 1)) * 100}%)` }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                        <button onClick={toggleMute} className="text-white hover:text-brand-red transition-colors">
                                            {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
                                        </button>


                                        <button onClick={toggleFullscreen} className="text-white hover:text-brand-red transition-all">
                                            <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 sm:px-6 flex flex-col gap-8">
                    {/* Metadata & Actions Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mt-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight">{content.title}</h1>
                                <span className="bg-brand-red px-3 py-1 rounded text-xs sm:text-sm font-bold shadow-lg shadow-brand-red/10">Downloaded</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">
                                <span className="flex items-center gap-1.5 text-yellow-500 font-bold">
                                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> 8.5
                                </span>
                                <span className="font-bold sm:border-l border-white/10 sm:pl-4">{content.size}</span>
                                <span className="uppercase tracking-widest text-[#9ca3af] font-black text-[9px] sm:text-[10px] border border-[#374151] px-2 py-0.5 rounded-sm">{content.type}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                to="/downloads"
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-white/10 border border-white/20 px-4 sm:px-8 py-3.5 rounded-full transition-all font-bold text-white hover:bg-white/20"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span className="whitespace-nowrap">My Library</span>
                            </Link>
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-brand-red hover:bg-red-700 px-4 sm:px-8 py-3.5 rounded-full transition-all font-bold text-white shadow-xl shadow-brand-red/20"
                            >
                                <PlayCircle className="w-5 h-5" />
                                <span className="whitespace-nowrap">Online Home</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content Sections */}
                    <div className="space-y-12 mt-4">
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold uppercase tracking-wider underline decoration-brand-red decoration-4 underline-offset-8">Offline Metadata</h2>
                            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl pt-2">
                                This title has been successfully saved to your local library. You are currently viewing the offline-optimized version. Enjoy unlimited playback without data usage or network connection. All data for this title is stored locally on this device.
                            </p>
                        </div>

                        {/* Other Downloads Section (Full Width Horizontal Scroll) */}
                        <div className="space-y-8 pt-8 border-t border-white/5 px-4 sm:px-0">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-brand-red rounded-full shadow-[0_0_15px_rgba(229,9,20,0.5)]"></div>
                                <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white/90">Other Downloads</h2>
                            </div>

                            <div className="relative group/scroll">
                                <div className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-8 px-4 sm:px-0 -mx-4 sm:mx-0">
                                    {otherDownloads.length > 0 ? (
                                        otherDownloads.map((rec) => (
                                            <Link
                                                key={rec.id}
                                                to={`/offline-watch/${rec.id}/${rec.slug}`}
                                                className="flex-shrink-0 w-[280px] sm:w-[340px] group/card relative flex flex-col gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-red/5"
                                            >
                                                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover/card:ring-brand-red/50 transition-all duration-700">
                                                    <img src={rec.image} alt={rec.title} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000 ease-out" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover/card:opacity-40 transition-opacity"></div>

                                                    {/* Hover Overlay */}
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-500 scale-125 group-hover/card:scale-100">
                                                        <div className="w-14 h-14 rounded-full bg-brand-red shadow-2xl shadow-brand-red/50 flex items-center justify-center transform group-hover/card:rotate-[360deg] transition-transform duration-700">
                                                            <Play className="w-7 h-7 fill-current text-white translate-x-0.5" />
                                                        </div>
                                                    </div>

                                                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-black tracking-tighter text-white border border-white/10 shadow-xl">
                                                        LOCAL
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 px-1">
                                                    <h3 className="font-bold text-lg text-gray-100 group-hover/card:text-brand-red transition-colors line-clamp-1 leading-tight">{rec.title}</h3>
                                                    <div className="flex items-center gap-4 text-xs">
                                                        <div className="flex items-center gap-1.5 bg-brand-red/10 px-2 py-1 rounded-lg text-brand-red font-black border border-brand-red/20">
                                                            <Download className="w-3.5 h-3.5" />
                                                            <span>{rec.size}</span>
                                                        </div>
                                                        <span className="text-gray-600 font-bold">•</span>
                                                        <span className="text-gray-400 font-black tracking-widest uppercase">{rec.type}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="w-full py-20 text-center bg-white/[0.02] rounded-[40px] border-2 border-dashed border-white/5 px-6">
                                            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed">No other assets currently in your library.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfflineWatchPage;

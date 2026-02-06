import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Download, Star, PlayCircle, Play, Pause, SkipBack, SkipForward, Maximize, Volume2, VolumeX, Settings, Plus, Check, RotateCcw } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ContentContext from '../context/ContentContext';
import { fetchDetails, fetchSeasonDetails, fetchMovies } from '../services/tmdb';
import * as userService from '../services/userService';
import toast from 'react-hot-toast';

const WatchPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'movie';
    const { user } = useContext(AuthContext);
    const { isInWatchlist: isAlreadyInList, isDownloaded: isAlreadyDownloaded, toggleWatchlist, addDownload } = useContext(ContentContext);

    const [content, setContent] = useState(null);
    const [currentVideoUrl, setCurrentVideoUrl] = useState('');
    const [recommendations, setRecommendations] = useState([]);

    // Video Player State
    const videoRef = React.useRef(null);
    const playerContainerRef = React.useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [currentQuality, setCurrentQuality] = useState('1080p');
    const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false);
    const [isQualityLoading, setIsQualityLoading] = useState(false);
    const [suppressClick, setSuppressClick] = useState(false);
    const [initialResumeTime, setInitialResumeTime] = useState(0);
    const [tapCue, setTapCue] = useState(null); // { type: 'forward' | 'backward' }
    const [isManualLandscape, setIsManualLandscape] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isF = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
            if (isF && window.innerWidth < 1024) {
                setTimeout(() => {
                    if (window.screen?.orientation?.lock) {
                        window.screen.orientation.lock('landscape').catch(() => { });
                    } else if (window.screen?.webkitLockOrientation) {
                        window.screen.webkitLockOrientation('landscape');
                    }
                }, 200);
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        setHistoryLoaded(false);
    }, [id]);

    const [previewTime, setPreviewTime] = useState(null);
    const [previewPos, setPreviewPos] = useState(0);
    const previewVideoRef = React.useRef(null);
    const clickTimeoutRef = React.useRef(null);
    const lastTapTimeRef = React.useRef(0);

    // Series State
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const [episodesList, setEpisodesList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            const data = await fetchDetails(id, type);
            const allContent = await fetchMovies('trending');
            setRecommendations(allContent.filter(item => item._id != id));

            if (data) {
                setContent(data);
                if (type === 'tv') {
                    const eps = await fetchSeasonDetails(id, 1);
                    setEpisodesList(eps);
                    if (eps.length > 0) setCurrentVideoUrl(eps[0].videoUrl);
                } else {
                    setCurrentVideoUrl(data.videoUrl);
                }

                // Check for timestamp in URL first
                const urlTime = searchParams.get('t');
                if (urlTime) {
                    setInitialResumeTime(parseFloat(urlTime));
                    setHistoryLoaded(true);
                } else if (user) {
                    // Fallback to Watch History if user is logged in
                    try {
                        const history = await userService.getWatchHistory();
                        const savedItem = history.find(item => item.id === id);
                        if (savedItem && !historyLoaded) {
                            const resumeTime = savedItem.lastTime;
                            // Resume if progress is between 0 and near-end
                            if (resumeTime > 0 && resumeTime < savedItem.duration - 5) {
                                setInitialResumeTime(resumeTime);
                            }
                            setHistoryLoaded(true);
                        }
                    } catch (err) {
                        console.error("Error loading user data:", err);
                    }
                }
            }
            setLoading(false);
        };
        loadContent();
    }, [id, type]);


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

    const toggleFullscreen = async () => {
        if (!playerContainerRef.current) return;

        setSuppressClick(true);
        setTimeout(() => setSuppressClick(false), 400);

        try {
            if (!document.fullscreenElement &&
                !document.webkitFullscreenElement &&
                !document.mozFullScreenElement &&
                !document.msFullscreenElement) {

                const element = playerContainerRef.current;
                const requestFS = element.requestFullscreen ||
                    element.webkitRequestFullscreen ||
                    element.mozRequestFullScreen ||
                    element.msRequestFullscreen;

                if (requestFS) {
                    await requestFS.call(element);

                    // Try to lock landscape on mobile after entering fullscreen
                    if (window.innerWidth < 1024) {
                        try {
                            if (window.screen?.orientation?.lock) {
                                await window.screen.orientation.lock('landscape');
                            } else if (window.screen?.lockOrientation) {
                                window.screen.lockOrientation('landscape');
                            } else if (window.screen?.webkitLockOrientation) {
                                window.screen.webkitLockOrientation('landscape');
                            }
                        } catch (lockError) {
                            console.warn("Orientation lock failed:", lockError);
                        }
                    }
                }
            } else {
                const exitFS = document.exitFullscreen ||
                    document.webkitExitFullscreen ||
                    document.mozCancelFullScreen ||
                    document.msExitFullscreen;
                if (exitFS) {
                    await exitFS.call(document);
                    // Unlock orientation when exiting
                    if (window.screen?.orientation?.unlock) {
                        window.screen.orientation.unlock();
                    }
                }
            }
        } catch (err) {
            toast.error(`Fullscreen error: ${err.message}`);
        }
    };

    const handleSkip = (amount) => {
        if (videoRef.current) {
            videoRef.current.currentTime += amount;
            setTapCue(amount > 0 ? 'forward' : 'backward');
            setTimeout(() => setTapCue(null), 600);
        }
    };

    // Reliable Save Position Helper
    const savePosition = async () => {
        if (!user || !content || !videoRef.current) return;
        const video = videoRef.current;
        const currentPos = video.currentTime;
        const totalDuration = video.duration || duration;

        if (totalDuration === 0) return;
        const progress = (currentPos / totalDuration) * 100;

        try {
            if (progress > 95) {
                await userService.removeFromWatchHistory(id);
            } else if (currentPos > 10) { // Save if watched for more than 10 seconds
                await userService.updateWatchHistory({
                    id: id,
                    type: type,
                    title: content.title,
                    posterUrl: content.posterUrl || content.thumbnailUrl,
                    lastTime: currentPos,
                    duration: totalDuration
                });
            }
        } catch (err) {
            console.error("Error saving watch position:", err);
        }
    };

    // Auto-save history every 5 seconds
    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(savePosition, 5000);
        return () => clearInterval(interval);
    }, [isPlaying, id, type, content, user]);

    // Save on Unmount and Page Leave
    useEffect(() => {
        const handleUnload = () => {
            savePosition();
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            savePosition(); // Save on component unmount
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [id, type, content, user]);

    const onTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration);
        }
    };

    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
        if (initialResumeTime > 0) {
            e.target.currentTime = initialResumeTime;
            setInitialResumeTime(0);
        }
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

    const handleQualityChange = (quality) => {
        if (quality === currentQuality) {
            setIsQualityMenuOpen(false);
            return;
        }

        const currentTimeSave = videoRef.current ? videoRef.current.currentTime : currentTime;
        setIsQualityLoading(true);
        setIsQualityMenuOpen(false);
        setCurrentQuality(quality);

        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.currentTime = currentTimeSave;
                if (isPlaying) videoRef.current.play();
            }
            setIsQualityLoading(false);
            toast.success(`Switched to ${quality}`, {
                style: { background: '#1a1b21', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
        }, 1200);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleEpisodeSelect = (ep) => {
        setEpisode(ep.episode_number);
        setCurrentVideoUrl(ep.videoUrl);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleWatchlist = () => {
        toggleWatchlist(content);
    };

    const handleDownloadClick = () => {
        addDownload(content);
    };

    const handleTouchInteraction = (e) => {
        const now = Date.now();
        const rect = playerContainerRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const width = rect.width;

        if (now - lastTapTimeRef.current < 300) {
            // Double Tap Detected
            if (x < width * 0.4) {
                handleSkip(-10);
                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
            } else if (x > width * 0.6) {
                handleSkip(10);
                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
            }
        }
        lastTapTimeRef.current = now;
    };

    if (loading) return <div className="min-h-screen bg-[#0f1014] flex items-center justify-center text-white">Loading Content...</div>;
    if (!content) return <div className="text-white text-center pt-24">Content Not Found</div>;

    return (
        <div className="pt-36 md:pt-20 min-h-screen bg-[#0f1014] text-white">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-4 sm:gap-8 pb-20">

                {/* Main Video Section */}
                <div className="w-full">
                    <div
                        ref={playerContainerRef}
                        className={`relative aspect-video w-full max-w-[1200px] mx-auto bg-black sm:rounded-2xl overflow-hidden shadow-2xl sm:border border-white/10 group transition-all duration-500 ${isManualLandscape ? 'fixed inset-0 z-[9999] !max-w-none h-screen w-screen' : ''}`}
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
                        onTouchStart={(e) => {
                            setShowControls(true);
                            handleTouchInteraction(e);
                            clearTimeout(window.controlsTimeout);
                            window.controlsTimeout = setTimeout(() => {
                                if (!isQualityMenuOpen) setShowControls(false);
                            }, 3000);
                        }}
                    >
                        <video
                            ref={videoRef}
                            src={currentVideoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                            autoPlay
                            onTimeUpdate={onTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            poster={content.backdropUrl || content.thumbnailUrl}
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
                                // Disable double tap to fullscreen on mobile
                                if (window.innerWidth < 768) return;

                                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
                                toggleFullscreen();
                            }}
                        />

                        {/* Tap Cues (Mobile) */}
                        {tapCue && (
                            <div className={`absolute top-1/2 -translate-y-1/2 ${tapCue === 'forward' ? 'right-10' : 'left-10'} flex flex-col items-center gap-2 animate-ping`}>
                                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                    {tapCue === 'forward' ? <SkipForward className="w-8 h-8" /> : <SkipBack className="w-8 h-8" />}
                                </div>
                                <span className="font-bold text-sm tracking-widest">{tapCue === 'forward' ? "+10s" : "-10s"}</span>
                            </div>
                        )}

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
                                if (window.innerWidth < 768) return;
                                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
                                toggleFullscreen();
                            }}
                        >
                            <div className="p-6"></div>

                            {/* Center Controls */}
                            <div className="flex items-center justify-center gap-8 sm:gap-20 text-white" onClick={(e) => e.stopPropagation()}>
                                {isQualityLoading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-40">
                                        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-white font-bold animate-pulse">Switching to {currentQuality}...</p>
                                    </div>
                                )}
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
                            {/* Bottom Bar: Single Line Controls */}
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
                                                    <video ref={previewVideoRef} src={currentVideoUrl} muted className="w-full h-full object-cover" />
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

                                        <div className="relative group/quality">
                                            <button onClick={() => setIsQualityMenuOpen(!isQualityMenuOpen)} className="text-white hover:text-brand-red transition-colors flex items-center gap-1 font-bold text-[10px] sm:text-xs">
                                                <Settings className="w-5 h-5 sm:w-5 sm:h-5" />
                                                <span className="hidden md:inline">{currentQuality}</span>
                                            </button>
                                            {isQualityMenuOpen && (
                                                <div className="absolute bottom-full right-0 mb-4 w-28 bg-[#1a1b21]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                                                    {['1080p', '720p', '480p'].map((q) => (
                                                        <button
                                                            key={q}
                                                            onClick={() => handleQualityChange(q)}
                                                            className={`w-full px-3 py-2 text-left text-[10px] transition-colors border-l-2 ${currentQuality === q ? 'text-brand-red bg-brand-red/10 border-brand-red' : 'text-gray-300 hover:bg-white/5 border-transparent'}`}
                                                        >
                                                            {q}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <button onClick={toggleFullscreen} className="text-white hover:text-brand-red transition-all">
                                            <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </button>

                                        {/* Mobile Rotation Fallback */}
                                        <button
                                            onClick={() => setIsManualLandscape(!isManualLandscape)}
                                            className="md:hidden text-white hover:text-brand-red transition-all"
                                            title="Rotate Player"
                                        >
                                            <RotateCcw className={`w-5 h-5 ${isManualLandscape ? 'rotate-90 text-brand-red' : ''}`} />
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
                                <span className="bg-white/10 px-3 py-1 rounded text-xs sm:text-sm font-bold text-gray-300">{content.year}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">
                                <span className="flex items-center gap-1.5 text-yellow-500 font-bold">
                                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> {content.rating}
                                </span>
                                <span className="font-bold sm:border-l border-white/10 sm:pl-4">{content.duration}</span>
                                <span className="uppercase tracking-widest text-[#9ca3af] font-black text-[9px] sm:text-[10px] border border-[#374151] px-2 py-0.5 rounded-sm">{content.category}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={handleToggleWatchlist}
                                className={`flex items-center gap-3 px-8 py-3.5 rounded-xl transition-all font-bold ${isAlreadyInList(id) ? 'bg-white/10 text-white' : 'bg-white text-black hover:bg-gray-200 shadow-lg'}`}
                            >
                                {isAlreadyInList(id) ? <Check className="w-5 h-5 text-red-600" /> : <Plus className="w-5 h-5" />}
                                <span>{isAlreadyInList(id) ? 'In My List' : 'Add to List'}</span>
                            </button>
                            <button
                                onClick={handleDownloadClick}
                                className={`flex items-center gap-3 px-8 py-3.5 rounded-xl transition-all font-bold ${isAlreadyDownloaded(id) ? 'bg-green-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20'}`}
                            >
                                <Download className="w-5 h-5" />
                                <span>{isAlreadyDownloaded(id) ? 'Downloaded' : 'Download'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-12 mt-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-12">
                                {type === 'tv' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-bold uppercase tracking-wider underline decoration-brand-red decoration-4 underline-offset-8">Episodes</h2>
                                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-bold">Season {season}</div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto no-scrollbar pr-2 pt-2">
                                            {episodesList.map(ep => (
                                                <div
                                                    key={ep.id}
                                                    onClick={() => handleEpisodeSelect(ep)}
                                                    className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 border group ${episode === ep.episode_number ? 'bg-white/5 border-white/20 shadow-xl' : 'bg-transparent border-transparent hover:bg-white/[0.03]'}`}
                                                >
                                                    <div className="relative w-10 flex-shrink-0 text-center">
                                                        <span className={`text-lg font-black font-mono transition-colors ${episode === ep.episode_number ? 'text-brand-red' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                                            {ep.episode_number < 10 ? `0${ep.episode_number}` : ep.episode_number}
                                                        </span>
                                                    </div>

                                                    <div className="relative w-32 sm:w-40 aspect-video flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                                                        <img src={ep.still_path || content.backdropUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${episode === ep.episode_number ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                            {episode === ep.episode_number ? (
                                                                <div className="flex gap-1 items-end h-4">
                                                                    <div className="w-1 bg-brand-red animate-[bounce_1s_infinite]"></div>
                                                                    <div className="w-1 bg-brand-red animate-[bounce_1.2s_infinite]"></div>
                                                                    <div className="w-1 bg-brand-red animate-[bounce_0.8s_infinite]"></div>
                                                                </div>
                                                            ) : (
                                                                <Play className="w-6 h-6 fill-white text-white opacity-80" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0 pr-4">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <h3 className={`font-bold text-sm sm:text-base truncate transition-colors ${episode === ep.episode_number ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                                {ep.name}
                                                            </h3>
                                                            {ep.runtime && <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{ep.runtime}m</span>}
                                                        </div>
                                                        <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1 leading-relaxed font-medium">
                                                            {ep.overview || "No description available for this episode."}
                                                        </p>
                                                    </div>

                                                    {episode === ep.episode_number && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-red shadow-[0_0_10px_#E50914] mr-2"></div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold uppercase tracking-wider underline decoration-brand-red decoration-4 underline-offset-8">Storyline</h2>
                                    <p className="text-gray-300 text-lg leading-relaxed max-w-4xl pt-2">{content.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations Section (Full Width Horizontal Scroll) */}
                        <div className="space-y-8 pt-8 border-t border-white/5">
                            <div className="flex items-center justify-between px-4 sm:px-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-8 bg-brand-red rounded-full shadow-[0_0_15px_rgba(229,9,20,0.5)]"></div>
                                    <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white/90">More Like This</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5">Curated Recommendations</span>
                                </div>
                            </div>

                            <div className="relative group/scroll">
                                <div className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-8 px-4 sm:px-0 -mx-4 sm:mx-0">
                                    {recommendations.slice(0, 20).map((rec) => (
                                        <Link
                                            key={rec._id}
                                            to={`/watch/${rec._id}/${rec.title.toLowerCase().replace(/ /g, '-')}?type=${type}`}
                                            className="flex-shrink-0 w-[280px] sm:w-[340px] group/card relative flex flex-col gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-red/5"
                                        >
                                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover/card:ring-brand-red/50 transition-all duration-700">
                                                <img
                                                    src={rec.backdropUrl || rec.thumbnailUrl}
                                                    alt={rec.title}
                                                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000 ease-out"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover/card:opacity-40 transition-opacity"></div>

                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-500 scale-125 group-hover/card:scale-100">
                                                    <div className="w-14 h-14 rounded-full bg-brand-red shadow-2xl shadow-brand-red/50 flex items-center justify-center transform group-hover/card:rotate-[360deg] transition-transform duration-700">
                                                        <Play className="w-7 h-7 fill-current text-white translate-x-0.5" />
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-black tracking-tighter text-white border border-white/10 shadow-xl">
                                                    PREMIUM HD
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 px-1">
                                                <h3 className="font-bold text-lg text-gray-100 group-hover/card:text-brand-red transition-colors line-clamp-1 leading-tight">{rec.title}</h3>
                                                <div className="flex items-center gap-4 text-xs">
                                                    <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2 py-1 rounded-lg text-yellow-500 font-black border border-yellow-500/20">
                                                        <Star className="w-3.5 h-3.5 fill-current" />
                                                        <span>{rec.rating}</span>
                                                    </div>
                                                    <span className="text-gray-600 font-bold">•</span>
                                                    <span className="text-gray-400 font-black tracking-widest">{rec.year}</span>
                                                    <span className="text-gray-600 font-bold">•</span>
                                                    <span className="text-gray-400 font-black tracking-widest uppercase">{type === 'tv' ? 'Series' : 'Movie'}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchPage;

import React, { useState, useEffect, useContext } from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import MovieCard from '../components/MovieCard';
import QuickInfoModal from '../components/QuickInfoModal';
import { MovieCardSkeleton } from '../components/Skeleton';
import { requests, fetchMovies } from '../services/tmdb';
import AuthContext from '../context/AuthContext';
import * as userService from '../services/userService';
import toast from 'react-hot-toast';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [trending, setTrending] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [netflixOriginals, setNetflixOriginals] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);
    const [userWatchlist, setUserWatchlist] = useState([]);
    const [userHistory, setUserHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const trendingData = await fetchMovies(requests.fetchTrending);
                const topRatedData = await fetchMovies(requests.fetchTopRated);
                const netflixData = await fetchMovies(requests.fetchNetflixOriginals);
                const actionData = await fetchMovies(requests.fetchActionMovies);

                setTrending(trendingData);
                setTopRated(topRatedData);
                setNetflixOriginals(netflixData);
                setActionMovies(actionData);

                if (user) {
                    const watchlistData = await userService.getWatchlist();
                    const historyData = await userService.getWatchHistory();
                    setUserWatchlist(watchlistData);
                    setUserHistory(historyData);
                }
            } catch (err) {
                console.error("Error loading home data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user]);

    const handleOpenModal = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const handleRemoveHistory = async (id) => {
        try {
            await userService.removeFromWatchHistory(id);
            setUserHistory(prev => prev.filter(item => item.id !== id));
            toast.success("Removed from history");
        } catch (err) {
            toast.error("Failed to remove from history");
            console.error(err);
        }
    };


    return (
        <>
            <Hero />

            {/* Personalized Content (only for logged in users) */}
            <div className="relative z-20 -mt-12 md:-mt-24">
                {loading ? (
                    <Section title="Continue Watching">
                        {[...Array(6)].map((_, i) => <MovieCardSkeleton key={i} variant="landscape" />)}
                    </Section>
                ) : userHistory.length > 0 && (
                    <Section title="Continue Watching">
                        {userHistory.map(item => (
                            <MovieCard
                                key={`hist-${item.id}`}
                                _id={item.id}
                                title={item.title}
                                posterUrl={item.posterUrl}
                                type={item.type}
                                variant="landscape"
                                subtitle={`${Math.floor((item.lastTime / item.duration) * 100)}% Complete`}
                                resumeTime={item.lastTime}
                                onRemove={() => handleRemoveHistory(item.id)}
                                onInfo={() => handleOpenModal(item)}
                            />
                        ))}
                    </Section>
                )}

                {/* Trending */}
                <Section title="Trending Now">
                    {loading ? (
                        [...Array(6)].map((_, i) => <MovieCardSkeleton key={i} />)
                    ) : (
                        trending.map(movie => (
                            <MovieCard key={movie._id} {...movie} onInfo={() => handleOpenModal(movie)} />
                        ))
                    )}
                </Section>
            </div>

            {/* Top Rated */}
            <Section title="Top Rated Movies">
                {loading ? (
                    [...Array(6)].map((_, i) => <MovieCardSkeleton key={i} variant="landscape" />)
                ) : (
                    topRated.map(movie => (
                        <MovieCard key={movie._id} {...movie} variant="landscape" onInfo={() => handleOpenModal(movie)} />
                    ))
                )}
            </Section>

            {/* TV Series (Netflix Originals) */}
            <Section title="Popular Series">
                {loading ? (
                    [...Array(6)].map((_, i) => <MovieCardSkeleton key={i} />)
                ) : (
                    netflixOriginals.map(movie => (
                        <MovieCard key={movie._id} {...movie} onInfo={() => handleOpenModal(movie)} />
                    ))
                )}
            </Section>

            {/* Action Movies */}
            <Section title="Action Hits">
                {loading ? (
                    [...Array(6)].map((_, i) => <MovieCardSkeleton key={i} />)
                ) : (
                    actionMovies.map(movie => (
                        <MovieCard key={movie._id} {...movie} onInfo={() => handleOpenModal(movie)} />
                    ))
                )}
            </Section>

            <QuickInfoModal
                movie={selectedMovie}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

        </>
    );
};

export default Home;

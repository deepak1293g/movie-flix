import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const genreMap = {
    'action': 28,
    'adventure': 12,
    'animation': 16,
    'comedy': 35,
    'crime': 80,
    'documentary': 99,
    'drama': 18,
    'family': 10751,
    'fantasy': 14,
    'history': 36,
    'horror': 27,
    'music': 10402,
    'mystery': 9648,
    'romance': 10749,
    'scifi': 878,
    'science fiction': 878,
    'tv movie': 10770,
    'thriller': 53,
    'war': 10752,
    'western': 37
};

const CategoryPage = () => {
    const { genre } = useParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            try {
                const genreId = genreMap[genre.toLowerCase()];
                if (genreId) {
                    const url = `/discover/movie?with_genres=${genreId}`;
                    const data = await fetchMovies(url);
                    setMovies(data);
                } else {
                    // Fallback or empty if genre not found
                    setMovies([]);
                }
            } catch (error) {
                console.error("Error fetching category:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, [genre]);

    return (
        <div className="min-h-screen bg-[#0f1014] text-white pt-32 px-8 sm:px-16">
            <h1 className="text-3xl font-display font-bold mb-16 uppercase border-l-4 border-brand-red pl-4">
                {genre} Movies
            </h1>

            {loading ? (
                <div className="text-gray-400">Loading...</div>
            ) : movies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {movies.map(movie => (
                        <MovieCard key={movie._id} {...movie} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-40 bg-white/5 rounded-[48px] border border-dashed border-white/10 max-w-4xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 mb-8 border border-white/10">
                        <Film className="w-12 h-12 text-gray-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">No Movies Found</h2>
                    <p className="text-gray-500 max-w-sm mx-auto text-lg leading-relaxed mb-10">We couldn't find any content for this category. Try exploring our trending hits instead.</p>
                    <Link to="/" className="bg-brand-red hover:bg-red-700 transition-all px-12 py-4 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-brand-red/30 transform active:scale-95">
                        Discover Content
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;

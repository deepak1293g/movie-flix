import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchContent } from '../services/tmdb';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Debounce search
    useEffect(() => {
        const fetchSearch = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }
            try {
                const data = await searchContent(query);
                setResults(data.slice(0, 5));
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSearch();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const clearSearch = () => {
        setQuery('');
        setResults([]);
    };

    return (
        <div className="relative group z-50">
            <div className={`flex items-center gap-2 bg-white/5 backdrop-blur-md border transition-all duration-300 rounded-full overflow-hidden ${isFocused
                    ? 'border-brand-red shadow-lg shadow-brand-red/20 bg-white/10'
                    : 'border-white/10 hover:border-white/20'
                }`}>
                <Search className={`w-4 h-4 sm:w-5 sm:h-5 ml-3 sm:ml-4 transition-colors duration-300 ${isFocused ? 'text-brand-red' : 'text-gray-400'
                    }`} />

                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        setIsFocused(true);
                        setShowResults(true);
                    }}
                    onBlur={() => {
                        setIsFocused(false);
                        setTimeout(() => setShowResults(false), 200);
                    }}
                    className="bg-transparent text-white placeholder-gray-500 outline-none py-2 sm:py-2.5 pr-2 text-sm sm:text-base w-32 sm:w-48 md:w-56 transition-all duration-300"
                />

                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="mr-2 p-1 hover:bg-white/10 rounded-full transition-all"
                    >
                        <X className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1b21]/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 min-w-[300px]">
                    {results.map(item => {
                        const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        return (
                            <Link
                                key={item._id}
                                to={`/watch/${item._id}/${slug}?type=${item.type}`}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                                onClick={() => {
                                    setShowResults(false);
                                    setQuery('');
                                }}
                            >
                                <img
                                    src={item.thumbnailUrl}
                                    alt={item.title}
                                    className="w-12 h-16 object-cover rounded bg-gray-800"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white line-clamp-1">{item.title}</p>
                                    <div className="flex gap-2 text-xs text-gray-400 mt-1">
                                        <span className="text-brand-red capitalize">{item.type}</span>
                                        <span>•</span>
                                        <span>{item.year}</span>
                                        <span>•</span>
                                        <span className="text-yellow-500">★ {item.rating}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Search Hint */}
            {showResults && query.length > 0 && results.length === 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-[#1a1b21]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl min-w-[300px]">
                    <p className="text-gray-400 text-sm">No results found for "{query}"</p>
                </div>
            )}

            {/* Initial Hint */}
            {isFocused && !query && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-[#1a1b21]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl min-w-[300px]">
                    <p className="text-gray-400 text-xs sm:text-sm">
                        Try: <span className="text-brand-red font-bold">Sintel</span>, <span className="text-brand-red font-bold">Bunny</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchBar;

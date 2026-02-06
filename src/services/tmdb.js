import axios from 'axios';

// --- RICH DEMO DATA ---
// High-quality public domain/creative commons content with working MP4 links.
const DEMO_CONTENT = [
    {
        id: 1,
        _id: 1,
        title: "Sintel",
        description: "A lonely young woman, Sintel, helps and befriends a dragon, only to have it taken from her. In her search for the dragon, she learns that this world is not as simple as it seems.",
        thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
        posterUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
        backdropUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        year: "2010",
        rating: 4.5,
        category: "Fantasy",
        type: "movie",
        duration: "15m",
        isPopular: true,
        genres: "Animation, Fantasy, Adventure"
    },
    {
        id: 2,
        _id: 2,
        title: "Big Buck Bunny",
        description: "A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.",
        thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
        posterUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
        backdropUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        year: "2008",
        rating: 4.2,
        category: "Comedy",
        type: "movie",
        duration: "10m",
        isPopular: true,
        genres: "Animation, Comedy"
    },
    {
        id: 3,
        _id: 3,
        title: "Elephant Dream",
        description: "An experimental short film about two strangers who meet in a strange world. A journey through a mechanical labyrinth.",
        thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
        posterUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
        backdropUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        year: "2006",
        rating: 4.0,
        category: "Sci-Fi",
        type: "movie",
        duration: "12m",
        isPopular: true,
        genres: "Sci-Fi, Action"
    },
    {
        id: 4,
        _id: 4,
        title: "For Bigger Blazes",
        description: "A stunning visual demonstration of fire and nature, showcasing the raw power and beauty of flames.",
        thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
        posterUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
        backdropUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        year: "2015",
        rating: 3.8,
        category: "Documentary",
        type: "movie",
        duration: "11m",
        isPopular: false,
        genres: "Sci-Fi, Experimental"
    },
    {
        id: 5,
        _id: 5,
        title: "Tears of Steel",
        description: "A group of warriors and scientists battle to save their city and reality itself from destruction in this sci-fi epic.",
        thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
        posterUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
        backdropUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        year: "2012",
        rating: 4.3,
        category: "Sci-Fi",
        type: "movie",
        duration: "12m",
        isPopular: true,
        genres: "Animation, Drama"
    },
    {
        id: 6,
        _id: 6,
        title: "The Adventures of Proog and Emo",
        description: "Follow the thrilling TV series as Proog and Emo navigate through surreal mechanical landscapes.",
        thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
        posterUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
        backdropUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        year: "2023",
        rating: 4.6,
        category: "Sci-Fi",
        type: "tv",
        duration: "45m per episode",
        isPopular: true,
        genres: "Sci-Fi, Adventure",
        seasons: [
            {
                season_number: 1,
                episode_count: 3,
                name: "Season 1"
            }
        ]
    },
    {
        id: 7,
        _id: 7,
        title: "Bunny Tales",
        description: "An animated comedy series following the adventures of a lovable bunny and his forest friends.",
        thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
        posterUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
        backdropUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        year: "2022",
        rating: 4.4,
        category: "Comedy",
        type: "tv",
        duration: "30m per episode",
        isPopular: true,
        genres: "Animation, Comedy, Family",
        seasons: [
            {
                season_number: 1,
                episode_count: 2,
                name: "Season 1"
            }
        ]
    }
];

// Mock Episodes for the Series
const MOCK_EPISODES = [
    {
        id: 1001,
        episode_number: 1,
        name: "Ep 1: The Ocean",
        overview: "Dive deep into the blue abyss.",
        videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        still_path: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Clouds_over_the_Atlantic_Ocean.jpg"
    },
    {
        id: 1002,
        episode_number: 2,
        name: "Ep 2: The Forest",
        overview: "Secrets of the ancient woods.",
        videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        still_path: "https://upload.wikimedia.org/wikipedia/commons/4/42/Redwood_National_Park%2C_fog_in_the_forest.jpg"
    },
    {
        id: 1003,
        episode_number: 3,
        name: "Ep 3: The Mountains",
        overview: "High altitude survival.",
        videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        still_path: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"
    }
];

// --- API LIKE EXPORTS ---
export const requests = {
    fetchTrending: 'trending',
    fetchTopRated: 'top-rated',
    fetchNetflixOriginals: 'series',
    fetchActionMovies: 'action',
};

// Search Content
export const searchContent = async (query) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const lowerQuery = query.toLowerCase();
    return DEMO_CONTENT.filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );
};

export const fetchMovies = async (type) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (type === 'trending' || type === 'top-rated') return DEMO_CONTENT;
    if (type === 'series') return DEMO_CONTENT.filter(i => i.type === 'tv');
    if (type === 'action') return DEMO_CONTENT.filter(i => i.genres.includes('Action'));

    // Genre Filtering (Mocking IDs or Names)
    if (typeof type === 'string' && type.includes('with_genres')) {
        // Simple mapping for demo
        if (type.includes('28')) return DEMO_CONTENT.filter(i => i.genres.includes('Action'));
        if (type.includes('99')) return DEMO_CONTENT.filter(i => i.genres.includes('Documentary'));
    }

    // Default return all shuffled
    return [...DEMO_CONTENT].sort(() => 0.5 - Math.random());
};

// Normalize Helper (Already normalized in our data, but keeping signature)
export const normalizeData = (data) => data;

// Fetch Details
export const fetchDetails = async (id, type) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return DEMO_CONTENT.find(i => i.id == id || i._id == id);
};

// Fetch Season Details
export const fetchSeasonDetails = async (tvId, seasonNumber) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // For demo, return the same mock episodes for any series
    return MOCK_EPISODES;
};

export default {
    get: async () => ({ data: { results: DEMO_CONTENT } }) // Mock axios instance
};

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
    },
    {
        id: 8,
        _id: 8,
        title: "Stranger Components",
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
        thumbnailUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
        posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
        backdropUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        year: "2016",
        rating: 4.8,
        category: "Sci-Fi",
        type: "tv",
        duration: "50m per episode",
        isPopular: true,
        genres: "Sci-Fi, Horror, Drama",
        seasons: [{ season_number: 1, episode_count: 8, name: "Season 1" }]
    },
    {
        id: 9,
        _id: 9,
        title: "Breaking Bugs",
        description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
        thumbnailUrl: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=2069&auto=format&fit=crop",
        posterUrl: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=2069&auto=format&fit=crop",
        backdropUrl: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=2069&auto=format&fit=crop",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        year: "2008",
        rating: 4.9,
        category: "Crime",
        type: "tv",
        duration: "47m per episode",
        isPopular: true,
        genres: "Crime, Drama, Thriller",
        seasons: [{ season_number: 1, episode_count: 7, name: "Season 1" }]
    },
    {
        id: 10,
        _id: 10,
        title: "The Cache",
        description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
        thumbnailUrl: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2070&auto=format&fit=crop",
        posterUrl: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2070&auto=format&fit=crop",
        backdropUrl: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2070&auto=format&fit=crop",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        year: "2016",
        rating: 4.7,
        category: "Drama",
        type: "tv",
        duration: "58m per episode",
        isPopular: true,
        genres: "Drama, History",
        seasons: [{ season_number: 1, episode_count: 10, name: "Season 1" }]
    },
    {
        id: 11,
        _id: 11,
        title: "Money Heist: React Edition",
        description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
        thumbnailUrl: "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?q=80&w=2070&auto=format&fit=crop",
        posterUrl: "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?q=80&w=2070&auto=format&fit=crop",
        backdropUrl: "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?q=80&w=2070&auto=format&fit=crop",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        year: "2017",
        rating: 4.6,
        category: "Action",
        type: "tv",
        duration: "70m per episode",
        isPopular: true,
        genres: "Action, Crime, Mystery",
        seasons: [{ season_number: 1, episode_count: 5, name: "Part 1" }]
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
        still_path: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg"
    },
    {
        id: 1002,
        episode_number: 2,
        name: "Ep 2: The Forest",
        overview: "Secrets of the ancient woods.",
        videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        still_path: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg"
    },
    {
        id: 1003,
        episode_number: 3,
        season_number: 1,
        name: "Ep 3: The Mountains",
        overview: "High altitude survival.",
        videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        still_path: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg"
    },
    // Stranger Components Episodes
    { id: 2001, episode_number: 1, name: "Chapter One: The Vanishing", overview: "On his way home from a friend's house, young Will sees something terrifying.", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", still_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" },
    { id: 2002, episode_number: 2, name: "Chapter Two: The Weirdo", overview: "Lucas, Mike and Dustin try to talk to the girl they found in the woods.", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", still_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" },
    { id: 2003, episode_number: 3, name: "Chapter Three: Holly, Jolly", overview: "An increasingly concerned Nancy looks for Barb and finds out what Jonathan's been up to.", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", still_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" },

    // Breaking Bugs Episodes
    { id: 3001, episode_number: 1, name: "Pilot", overview: "Diagnosed with terminal lung cancer, chemistry teacher Walter White teams up with his former student.", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", still_path: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=2069&auto=format&fit=crop" },
    { id: 3002, episode_number: 2, name: "Cat's in the Bag...", overview: "Walt and Jesse attempt to dispose of the bodies in the RV.", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", still_path: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=2069&auto=format&fit=crop" },

    // The Cache Episodes
    { id: 4001, episode_number: 1, name: "Wolferton Splash", overview: "Princess Elizabeth and Prince Philip marry; King George VI's health worsens.", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", still_path: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2070&auto=format&fit=crop" },
    { id: 4002, episode_number: 2, name: "Hyde Park Corner", overview: "With King George too ill to travel, Elizabeth and Philip embark on a four-continent commonwealth tour.", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", still_path: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2070&auto=format&fit=crop" },

    // Money Heist
    { id: 5001, episode_number: 1, name: "Episode 1", overview: " The Professor recruits a young female robber and seven other criminals for a grand heist.", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", still_path: "https://images.unsplash.com/photo-1565520651265-724bc247c74c?q=80&w=1974&auto=format&fit=crop" }
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

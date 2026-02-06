import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => {
    const sectionRef = useRef(null);
    const scrollRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    // Determine browse link based on section title
    const getBrowseLink = () => {
        if (title.toLowerCase().includes('series')) return '/browse/series';
        return '/browse/movies';
    };

    return (
        <section
            ref={sectionRef}
            className={`px-4 sm:px-8 py-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="max-w-[1600px] mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
                        {title}
                    </h2>
                    <Link
                        to={getBrowseLink()}
                        className="flex items-center gap-2 text-brand-red hover:text-red-400 font-bold text-lg transition-all hover:scale-110 duration-300 group"
                    >
                        See All
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="relative group/scroll">
                    {/* Scroll Buttons */}
                    <button
                        onClick={() => {
                            if (scrollRef.current) {
                                scrollRef.current.scrollBy({ left: -window.innerWidth * 0.8, behavior: 'smooth' });
                            }
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/40 hover:bg-red-600 text-white opacity-0 group-hover/scroll:opacity-100 transition-all duration-300 hidden sm:flex items-center justify-center backdrop-blur-md rounded-full border border-white/10 shadow-2xl -ml-6 hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6 rotate-180" />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth relative pb-4"
                    >
                        {React.Children.map(children, (child, index) => (
                            <div
                                className={`flex-shrink-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                {child}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            if (scrollRef.current) {
                                scrollRef.current.scrollBy({ left: window.innerWidth * 0.8, behavior: 'smooth' });
                            }
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/40 hover:bg-red-600 text-white opacity-0 group-hover/scroll:opacity-100 transition-all duration-300 hidden sm:flex items-center justify-center backdrop-blur-md rounded-full border border-white/10 shadow-2xl -mr-6 hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Gradient Fade Masks */}
                    <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[#0f1014] to-transparent z-10 pointer-events-none opacity-0 group-hover/scroll:opacity-100 transition-opacity"></div>
                    <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#0f1014] to-transparent z-10 pointer-events-none opacity-0 group-hover/scroll:opacity-100 transition-opacity"></div>
                </div>
            </div>
        </section>
    );
};

export default Section;

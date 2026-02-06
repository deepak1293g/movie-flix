/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    red: '#E50914', // Netflix-like red, closer to the 'Watch Now' button
                    dark: '#0f1014', // Deep background
                    gray: '#1f2937',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}

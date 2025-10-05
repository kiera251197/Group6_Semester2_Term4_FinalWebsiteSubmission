const libraryCards = document.querySelectorAll('#libraryCard'); 
const libraryApiUrl = 'https://api.themoviedb.org/3/movie/top_rated';

const genreMap = 
{
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
    53: "Thriller", 10752: "War", 37: "Western"
};

async function fetchLibraryMovies() {
    try {
        const response = await fetch(libraryApiUrl, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        libraryCards.forEach((card, index) => {
            const movie = data.results[index];
            if (!movie) return;

            const title = movie.title || movie.name;
            const synopsis = movie.overview || "No synopsis available";
            const poster = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : '../assets/img/tangled placeholder image.jpg';
            const link = `https://www.themoviedb.org/movie/${movie.id}`;

            const imgEl = card.querySelector('img');
            if (imgEl) {
                imgEl.src = poster;
                imgEl.alt = `${title} Poster`;
            }

            const titleEl = card.querySelector('.movieTitle');
            if (titleEl) titleEl.textContent = title;

            const synopsisEl = card.querySelector('.cardText');
            if (synopsisEl) synopsisEl.textContent = synopsis;

            const linkEl = card.querySelector('a.btn-primary[href*="individual"]') || card.querySelector('a.btn-primary');
            if (linkEl) linkEl.href = link;

            const genreEl = card.querySelector('.genreText');
            if (genreEl) {
                const firstGenreId = movie.genre_ids[0];
                genreEl.textContent = genreMap[firstGenreId] || "Unknown";
            }

            const yearEl = card.querySelector('.yearText');
            if (yearEl) {
                yearEl.textContent = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
            }
        });

    } catch (error) {
        console.error("Error fetching library movies:", error);
    }
}

fetchLibraryMovies();

function sortByGenre()
{
 console.log("hi");
}


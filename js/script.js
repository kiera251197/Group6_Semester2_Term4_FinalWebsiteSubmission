

const apiUrl = 'https://api.themoviedb.org/3/movie/popular';
const recCards = document.querySelectorAll('#recsCard');

async function fetchMovies() {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

       

        recCards.forEach((card, index) => {
            const movie = data.results[index];
            if (!movie) return;

            const title = movie.title || movie.name;
            const synopsis = movie.overview || "No synopsis available";
            const poster = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : 'assets/img/tangled placeholder image.jpg';
            const link = `https://www.themoviedb.org/movie/${movie.id}`;


            // Populate card
            const imgEl = card.querySelector('img');
            imgEl.src = poster;
            imgEl.alt = `${title} Poster`;

            const textEl = card.querySelector('.card-text');
            textEl.textContent = synopsis;

            // Remove old link if exists
            const cardBody = card.querySelector('.card-body');
            const oldLink = cardBody.querySelector('a');
            if (oldLink) oldLink.remove();

            // Add "More Info" button
            const linkEl = document.createElement('a');
            linkEl.href = link;
            linkEl.target = '_blank';
            linkEl.textContent = 'More Info';
            linkEl.classList.add('btn', 'btn-primary', 'mt-2');
            cardBody.appendChild(linkEl);
        });

    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}


fetchMovies();


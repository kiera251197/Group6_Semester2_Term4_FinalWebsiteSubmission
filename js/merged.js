const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTI2MGExNWJjNjQ1ZWU4ZTE4Mzk4ZGQ0ZjFhNTk3MSIsIm5iZiI6MTc1ODE5OTc1Ni42ODk5OTk4LCJzdWIiOiI2OGNiZmZjYzRlMzU5NzJhYTMxNDkxNTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.64Z_V_s-8zgoalnB_-D2jKs1kK2vAji8AISaP6SSxmk";
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

//genre map
const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western"
};

function populateGenreDropdown() {
    const genreDropdown = document.getElementById('dropdownGenre');
    if (!genreDropdown) return;

    genreDropdown.innerHTML = '';

    const allOption = document.createElement('option');
    allOption.value = 0;
    allOption.textContent = 'All';
    genreDropdown.appendChild(allOption);

    for (const [id, name] of Object.entries(genreMap)) {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        genreDropdown.appendChild(option);
    }
}


const page = window.location.pathname.split('/').pop();

// watchlist handling
function getWatchlist() {
    return JSON.parse(localStorage.getItem('watchlist')) || [];
}

function addToWatchlist(movie) {
    const watchlist = getWatchlist();
    if (!watchlist.find(m => m.id === movie.id)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert(`${movie.title} added to watchlist!`);
        if (page === 'watchlist.html') loadWatchlist();
    }
}

function removeFromWatchlist(movieId) {
    let watchlist = getWatchlist();
    watchlist = watchlist.filter(m => m.id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    if (page === 'watchlist.html') loadWatchlist();
}

// creating cards
function createCard(movie, isWatchlistPage = false) {
    const card = document.createElement('div');
    card.classList.add('col', 'col-lg-3', 'col-md-6', 'col-sm-12', 'mb-4', 'libraryCard'); 

    card.dataset.genres = movie.genre_ids ? movie.genre_ids.join(',') : '';
    card.dataset.year = movie.release_date ? movie.release_date.split('-')[0] : '';
    card.dataset.vote = movie.vote_average || 0;

    card.innerHTML = `
        <div class="card h-100"> <!-- ensures same height for all cards -->
            <img src="${movie.poster_path ? IMG_URL + movie.poster_path : '../assets/img/tangled placeholder image.jpg'}" class="card-img-top" alt="${movie.title}" style="border-top-left-radius: 25px; border-top-right-radius: 25px;">
            <div class="card-body libraryCardBody d-flex flex-column">
                <h3 class="movieTitle">${movie.title}</h3>
                <h6 class="genreAndYear mb-2">
                    <i class="fa-solid fa-film"></i>
                    <span>${movie.genre_names ? movie.genre_names.join(', ') : 'N/A'}</span>
                    <i class="fa-solid fa-calendar" style="margin-left: 30px;"></i>
                    <span>${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                </h6>
                <p class="cardText flex-grow-1">${movie.overview || 'No synopsis available.'}</p> <!-- flex-grow pushes buttons down -->
                <div class="libraryCardButtons mt-auto">
                    <a href="#" class="btn btn-primary holographicCard watchlistButton mb-1" data-movie-id="${movie.id}">
                        <i class="fa-solid fa-${isWatchlistPage ? 'minus' : 'plus'}"></i>
                        ${isWatchlistPage ? 'Remove' : 'Watchlist'}
                    </a>
                    <a href="../pages/individual.html?id=${movie.id}" class="btn btn-primary holographicCard">More Info</a>
                </div>
            </div>
        </div>
    `;

    return card;
}


//loading watchlist page
function loadWatchlist() {
    const container = document.getElementById('movieContainer') || document.querySelector('.libraryCards .row');
    if (!container) return;

    container.innerHTML = '';
    const watchlist = getWatchlist();

    if (watchlist.length === 0) {
        container.innerHTML = '<p>Your watchlist is empty.</p>';
        return;
    }

    watchlist.forEach(movie => {
        const card = createCard(movie, true);
        container.appendChild(card);
    });

    attachWatchlistButtons();
}

//loading library page
async function loadLibrary() {
    const container = document.getElementById('movieContainer');
    if (!container) return;

    try {
        
        const response = await fetch(`${BASE_URL}/movie/top_rated?language=en-US&page=1`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json;charset=utf-8'
            }
        });
        const data = await response.json();


        
        container.innerHTML = '';

        data.results.forEach(movie => {
            movie.genre_names = movie.genre_ids ? movie.genre_ids.map(id => genreMap[id]) : [];
            const card = createCard(movie);

            card.classList.add('col', 'col-lg-3', 'col-md-6', 'col-sm-12', 'mb-4');
            container.appendChild(card);
        });

        attachWatchlistButtons();
    } catch (err) {
        console.error('Error fetching movies:', err);
        container.innerHTML = '<p>Failed to load movies.</p>';
    }
}

// loading recommendations for the home page
async function loadRecommendations() {
    const container = document.getElementById('recommendationsContainer');
    if (!container) return;

    try {
        const response = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=1`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json;charset=utf-8'
            }
        });

        const data = await response.json();

        const genreResponse = await fetch(`${BASE_URL}/genre/movie/list?language=en-US`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json;charset=utf-8'
            }
        });
        const genreData = await genreResponse.json();

        container.innerHTML = '';

        data.results.slice(0, 8).forEach(movie => {
            movie.genre_names = movie.genre_ids ? movie.genre_ids.map(id => genreMap[id]) : [];
            const card = createCard(movie);
            card.classList.add('col', 'col-lg-3', 'col-md-6', 'col-sm-12', 'mb-4');
            container.appendChild(card);
        });

        attachWatchlistButtons();
    } catch (err) {
        console.error('Error fetching recommendations:', err);
        container.innerHTML = '<p>Failed to load recommendations.</p>';
    }
}

// Run it automatically on the home page
if (document.body.contains(document.getElementById('recommendationsContainer'))) {
    loadRecommendations();
}

// loading watchlist 
function loadWatchlist() {
    const container = document.getElementById('movieContainer');
    if (!container) return;

    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    container.innerHTML = ''; 

    if (watchlist.length === 0) {
        container.innerHTML = '<p>Your watchlist is empty.</p>';
        return;
    }

    watchlist.forEach(movie => {
        
        if (movie.poster_path && movie.poster_path.startsWith('http')) {
            movie.poster_path_full = movie.poster_path;
            movie.poster_path = null;
        }

        const card = createCard(movie, true); 
        card.classList.add('col', 'col-lg-3', 'col-md-6', 'col-sm-12', 'mb-4'); 
        container.appendChild(card);
    });

    attachWatchlistButtons();
}



// watchlist buttons 
function attachWatchlistButtons() {
    const buttons = document.querySelectorAll('.watchlistButton');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const movieId = parseInt(btn.dataset.movieId);
            const isWatchlistPage = page === 'watchlist.html';
            const card = btn.closest('.libraryCard');

            if (isWatchlistPage) {
                removeFromWatchlist(movieId);
            } else {
                const [genreP, yearP] = card.querySelectorAll('h6.genreAndYear p');
                const movie = {
                    id: movieId,
                    title: card.querySelector('.movieTitle').textContent,
                    overview: card.querySelector('.cardText').textContent,
                    poster_path: card.querySelector('img').src.includes('tangled placeholder') ? null : card.querySelector('img').src.replace(IMG_URL, ''),
                    release_date: yearP?.textContent || '',
                    genre_names: genreP?.textContent.split(', ') || []
                };
                addToWatchlist(movie);
            }
        });
    });
}

//library page filters
function attachFilters() {
    const typeDropdown = document.getElementById('dropdownType');
    const genreDropdown = document.getElementById('dropdownGenre');

    if (!typeDropdown || !genreDropdown) return;

    typeDropdown.addEventListener('change', () => {
        const val = typeDropdown.value;
        if (val === '1') sortByRating();
        else if (val === '2') sortByYear();
        else genreDropdown.style.display = 'inline-block';
    });

    genreDropdown.addEventListener('change', () => {
        const genreId = parseInt(genreDropdown.value);
        filterByGenre(genreId);
    });
}

function sortByRating() {
    const container = document.getElementById('movieContainer');
    const cards = Array.from(container.querySelectorAll('.card'));
    cards.sort((a, b) => parseFloat(b.dataset.vote) - parseFloat(a.dataset.vote));
    cards.forEach(c => container.appendChild(c));
}

function sortByYear() {
    const container = document.getElementById('movieContainer');
    const cards = Array.from(container.querySelectorAll('.card'));
    cards.sort((a, b) => parseInt(b.dataset.year) - parseInt(a.dataset.year));
    cards.forEach(c => container.appendChild(c));
}

function filterByGenre(genreId) {
    const cards = Array.from(document.querySelectorAll('.libraryCard'));
    cards.forEach(card => {
        const genres = card.dataset.genres ? card.dataset.genres.split(',') : [];
        card.style.display = genreId === 0 || genres.includes(String(genreId)) ? '' : 'none';
    });
}



document.addEventListener('DOMContentLoaded', () => {
    if (page === 'watchlist.html') loadWatchlist();
    else if (page === 'library.html') {
        loadLibrary();
        populateGenreDropdown();
        attachFilters();
    } else if (page === 'index.html') loadLibrary();
});

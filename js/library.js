//Movie class + array 
class Movies
{
  constructor( title , synopsis , poster, link ,genreId)
  {
      this.title = title;
        this. synopsis =  synopsis;
        this.poster =poster;
        this.link = link;
        this.genreId= genreId;
      
      
   }
}
let movieList= [];

//genre map for refrencing 

const genreMap = 
{
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
    53: "Thriller", 10752: "War", 37: "Western"
};

const libraryCards = document.querySelectorAll('#libraryCard'); 
//API
const libraryApiUrl = 'https://api.themoviedb.org/3/movie/top_rated';

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
        console.log(data);
        libraryCards.forEach((card, index) => {
            const movie = data.results[index];
            if (!movie) return;
            // get info from api and full array
            let title = movie.title || movie.name;
            let synopsis = movie.overview || "No synopsis available";
            let poster = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : '../assets/img/tangled placeholder image.jpg';
            let link = `https://www.themoviedb.org/movie/${movie.id}`;
            let genreId = movie.genre_ids[0];

            const imgEl = card.querySelector('img');
            if (imgEl) {
                imgEl.src = poster;
                imgEl.alt = `${title} Poster`;
            }

            //full card
            const titleEl = card.querySelector('.movieTitle');
            if (titleEl) titleEl.textContent = title;

            const synopsisEl = card.querySelector('.cardText');
            if (synopsisEl) synopsisEl.textContent = synopsis;

            const linkEl = card.querySelector('a.btn-primary[href*="individual"]') || card.querySelector('a.btn-primary');
            if (linkEl) linkEl.href = link;

            const genreEl = card.querySelector('.genreText');
            if (genreEl) {
                genreEl.textContent = genreMap[genreId] || "Unknown";
            }

            const yearEl = card.querySelector('.yearText');
            if (yearEl) {
                yearEl.textContent = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
            }
              movieList.push(window["movie_"+index] = new Movies(title , synopsis , poster, link ,genreId));
                
        });
                console.log(movieList);

    } catch (error) {
        console.error("Error fetching library movies:", error);
    }
}

fetchLibraryMovies();


//filter movie dropdown 
function sortByGenre()
{
 const selectedGenre = document.getElementById("dropdownGenre").value;
 const byGenre = movieList.filter(movies => movies.genreId==selectedGenre);
 console.log(byGenre);

  const container = document.getElementById("movieContainer");
  container.innerHTML = "";

  byGenre.forEach((Movies) => {
    container.innerHTML += `<div class="col col-lg-3 col-md-6 align-items-stretch h-100" id="libraryCard">
                    <img src="https://image.tmdb.org/t/p/w500${Movies.poster}" class="card-img-top" alt="${Movies.title} poster"  style="border-top-left-radius: 25px; border-top-right-radius: 25px;">
                    <div class="card-body libraryCardBody">
                        <!-- Movie Title -->
                        <h3 class="movieTitle">${Movies.title}</h3>

                        <!-- Genre & Release Year -->
                        <h6 class="genreAndYear">
                            <i class="fa-solid fa-film"></i>
                            <p class="genreText">${Movies.genre}</p>

                            <i class="fa-solid fa-calendar" style="margin-left: 30px;"></i>
                            <p class="yearText"> ${Movies.year} </p>
                        </h6>

                        <!-- Sypnopsis Text -->
                        <p class="cardText">${Movies.synopsis}</p>

                        <!-- Make Watchlist add button work & put movie into user's watchlist por favor -->
                        <div class="libraryCardButtons">
                            <a href="#######" class="btn btn-primary holographicCard" id="watchlistButton" style="margin: 0;"><i class="fa-solid fa-plus"></i>Watchlist</a>
                            <a href="../pages/individual.html" class="btn btn-primary holographicCard" id="watchlistButton" style="margin: 0;">More Info</a>
                        </div>
                    </div>
                </div>
      
    `;
    
  });

 }


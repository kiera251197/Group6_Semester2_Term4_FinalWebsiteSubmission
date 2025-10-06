class Movies {
  constructor(title, synopsis, poster, link, genreId, year) {
    this.title = title;
    this.synopsis = synopsis;
    this.poster = poster;
    this.link = link;
    this.genreId = genreId;
    this.year = year;
  }
}

let movieList = [];


const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western"
};

const libraryApiUrl = "https://api.themoviedb.org/3/movie/top_rated";
const minMovies = 40; 

function buildMovieCard(movieObj) {
  return `
    <div class="col col-lg-3 col-md-6 align-items-stretch h-100 libraryCard">
      <img src="${movieObj.poster}" class="card-img-top" alt="${movieObj.title} poster" style="border-top-left-radius: 25px; border-top-right-radius: 25px;">
      <div class="card-body libraryCardBody">
        <h3 class="movieTitle">${movieObj.title}</h3>
        <h6 class="genreAndYear">
          <i class="fa-solid fa-film"></i>
          <p class="genreText">${genreMap[movieObj.genreId] || "Unknown"}</p>
          <i class="fa-solid fa-calendar" style="margin-left: 30px;"></i>
          <p class="yearText">${movieObj.year}</p>
        </h6>
        <p class="cardText">${movieObj.synopsis}</p>
        <div class="libraryCardButtons">
          <a href="#######" class="btn btn-primary holographicCard" style="margin: 0;"><i class="fa-solid fa-plus"></i> Watchlist</a>
          <a href="../pages/individual.html" class="btn btn-primary holographicCard" style="margin: 0;">More Info</a>
        </div>
      </div>
    </div>
  `;
}


async function fetchLibraryMovies() {
  const container = document.getElementById("movieContainer");
  container.innerHTML = "<p>Loading movies...</p>";
  movieList = [];

  try {
    let page = 1;
    let totalPages = 1;

    while (movieList.length < minMovies && page <= totalPages) {
      const response = await fetch(`${libraryApiUrl}?language=en-US&page=${page}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      totalPages = data.total_pages;

      data.results.forEach((movie) => {
        if (movieList.length >= minMovies) return;

        let title = movie.title || movie.name;
        let synopsis = movie.overview || "No synopsis available";
        let poster = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
          : "../assets/img/tangled.jpg";
        let link = `https://www.themoviedb.org/movie/${movie.id}`;
        let genreId = movie.genre_ids && movie.genre_ids.length > 0 ? movie.genre_ids[0] : null;
        let year = movie.release_date ? movie.release_date.split("-")[0] : "Unknown";

        movieList.push(new Movies(title, synopsis, poster, link, genreId, year));
      });

      page++;
    }

    container.innerHTML = movieList.map(buildMovieCard).join("");

  } catch (error) {
    console.error("Error fetching movies:", error);
    container.innerHTML = `<p>Error loading movies: ${error.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", fetchLibraryMovies);

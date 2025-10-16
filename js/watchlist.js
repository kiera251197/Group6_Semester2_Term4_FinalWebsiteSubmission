const watchlistApiUrl = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1`;

const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western"
};

class WatchlistMovie {
  constructor(title, synopsis, poster, link, genreId, year) {
    this.title = title;
    this.synopsis = synopsis;
    this.poster = poster;
    this.link = link;
    this.genreId = genreId;
    this.year = year;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const cardsContainer = document.querySelector(".libraryCards .row");
  if (!cardsContainer) {
    console.error("Watchlist container not found!");
    return;
  }

  try {
    const response = await fetch(watchlistApiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      console.error("No results returned from TMDB:", data);
      return;
    }

    cardsContainer.innerHTML = ""; 

    data.results.slice(0, 12).forEach(movie => {
      const posterPath = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "../assets/img/tangled placeholder image.jpg";

      const newMovie = new WatchlistMovie(
        movie.title,
        movie.overview || "No synopsis available.",
        posterPath,
        `https://www.themoviedb.org/movie/${movie.id}`,
        movie.genre_ids[0],
        movie.release_date ? movie.release_date.slice(0, 4) : "N/A"
      );

      const cardHTML = `
        <div class="col col-lg-3 col-md-6 align-items-stretch h-100" id="libraryCard">
                    <img src="${newMovie.poster}" class="card-img-top" alt="${newMovie.title} poster"  style="border-top-left-radius: 25px; border-top-right-radius: 25px;">
                    <div class="card-body libraryCardBody">
                        <!-- Movie Title -->
                        <h3 class="movieTitle">${newMovie.title}</h3>

                        <!-- Genre & Release Year -->
                        <h6 class="genreAndYear">
                            <i class="fa-solid fa-film"></i>
                            <p class="genreText">${genreMap[newMovie.genreId]}</p>

                            <i class="fa-solid fa-calendar" style="margin-left: 30px;"></i>
                            <p class="yearText"> ${newMovie.year} </p>
                        </h6>

                        <!-- Sypnopsis Text -->
                        <p class="cardText">${newMovie.synopsis}</p>

                        <!-- Make Watchlist add button work & put movie into user's watchlist por favor -->
                        <div class="libraryCardButtons">
                            <a href="#######" class="btn btn-primary holographicCard" id="watchlistButton" style="margin: 0;"><i class="fa-solid fa-plus"></i>Watchlist</a>
                            <a href="../pages/individual.html" class="btn btn-primary holographicCard" id="watchlistButton" style="margin: 0;">More Info</a>
                        </div>
                    </div>
                </div>
      `;

      cardsContainer.insertAdjacentHTML("beforeend", cardHTML);
    });

  } catch (err) {
    console.error("Error fetching watchlist movies:", err);
  }
});

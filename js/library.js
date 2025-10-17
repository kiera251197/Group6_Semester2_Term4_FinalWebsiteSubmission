// Movie class + array 
class Movies {
  constructor(title, synopsis, poster, link, genreId, year, id , lang ) {
    this.title = title;
    this.synopsis = synopsis;
    this.poster = poster;
    this.link = link;
    this.genreId = genreId;
    this.year = year;
    this.id = id;
    this.year =lang;
    
  }
}


let movieList = [];

// genre map for referencing
const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western"
};

const libraryApiUrl = "https://api.themoviedb.org/3/movie/top_rated";


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
          <a href="../pages/individual.html" class="btn btn-primary holographicCard" id="watchlistButton" style="margin: 0;" onclick="saveClass('${movieObj.title}' , '${movieObj.year}','${movieObj.synopsis}','${genreMap[movieObj.genreId] || "Unknown"}' ,${movieObj.poster} ,'${movieObj.link}','${movieObj.lang}' ) ">More Info</a>
        </div>
      </div>
    </div>
  `;
}



function saveClass(individualTitle,individualYear,individualSynopsis,individualGenre,individualPoster,individualID,individualLang)
{
  localStorage.setItem('savedMovieTitle', individualTitle);
  localStorage.setItem('savedMovieYear', individualYear);
  localStorage.setItem('savedSynopsis', individualSynopsis);
  localStorage.setItem('savedGenre', individualGenre);
  localStorage.setItem('savedMoviePoster', individualPoster);
  localStorage.setItem('savedMovieID', individualID);
  localStorage.setItem('savedMovieLang', individualLang);
}





async function fetchLibraryMovies() {
  const container = document.getElementById("movieContainer");
  container.innerHTML = "<p>Loading movies...</p>";

  try {
    const response = await fetch(`${libraryApiUrl}?language=en-US&page=1`, {
      headers: {
        Authorization: `Bearer ${apiKey}`, 
        "Content-Type": "application/json"
      }
    });

    console.log("Response status:", response.status);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log(data);
    console.log("Fetched data:", data);

    container.innerHTML = ""; 
    movieList = [];
    data.results.forEach((movie) => {
      let title = movie.title || movie.name;
      let synopsis = movie.overview || "No synopsis available";
      let poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        : "../assets/img/tangled.jpg";
      let link = `https://www.themoviedb.org/movie/${movie.id}`;
      let genreId = movie.genre_ids && movie.genre_ids.length > 0 ? movie.genre_ids[0] : null;
      let year = movie.release_date ? movie.release_date.split("-")[0] : "Unknown";
      let id = movie.id
      let lang = movie.original_language
      const newMovie = new Movies(title, synopsis, poster, link, genreId, year ,lang);
      movieList.push(newMovie);
      

      container.innerHTML += buildMovieCard(newMovie);
    });

  } catch (error) {
    console.error("Error fetching movies:", error);
    container.innerHTML = `<p>Error loading movies: ${error.message}</p>`;
  }
}

//drop down filter
function sortByGenre()
{
 const selectedGenre = document.getElementById("dropdownGenre").value;
 let byGenre;
 if(selectedGenre>0)
  {
     byGenre = movieList.filter(movies => movies.genreId==selectedGenre);
    
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
                            <p class="genreText">${genreMap[Movies.genreId]}</p>

                            <i class="fa-solid fa-calendar" style="margin-left: 30px;"></i>
                            <p class="yearText"> ${Movies.year} </p>
                        </h6>

                        <!-- Sypnopsis Text -->
                        <p class="cardText">${Movies.synopsis}</p>

                        <!-- Make Watchlist add button work & put movie into user's watchlist por favor -->
                        <div class="libraryCardButtons">
                            <a href="#######" class="btn btn-primary holographicCard" id="watchlistButton" style="margin: 0;"><i class="fa-solid fa-plus"></i>Watchlist</a>
                            <a href="../pages/individual.html" class="btn btn-primary holographicCard" id="watchlistButton" style="margin: 0;" onclick="fullIndividual()  ">More Info</a>
                        </div>
                    </div>
                </div>
    `;
  });
  }
  else
  {
      fetchLibraryMovies();
  }
 }
//get libary movies

function fullIndividual()
{

  const container = document.getElementById("individualContainer");
     container.innerHTML = "";
      container.innerHTML += ` <div class="row individualMovieRow">
                <div class="col-12 col-lg-4">
                    <div class="moviePosterDiv">
                        <img src="${localStorage.getItem('savedMoviePoster')}" class="img-fluid moviePoster" alt="Movie Poster">
                    </div>

                </div>
                
                <div class="col-12 col-lg-8">
                    <div class="indivMovInfoText">
                        <!-- Movie Name -->
                        <h2 id="movieNameMovIndiv">${localStorage.getItem('savedMovieTitle')} </h2>

                        <!-- Rating -->
                        <div class="ratingMovIndivDiv alignItemsHorizontal">
                            <i class="fa-solid fa-star ratingMovIndiv"></i>
                            <i class="fa-solid fa-star ratingMovIndiv"></i>
                            <i class="fa-solid fa-star ratingMovIndiv"></i>
                            <i class="fa-solid fa-star-half ratingMovIndiv"></i>
                            <h5 id="textH5">Rating Here</h5>
                        </div>    

                        <!-- Release Year -->
                        <div class="releaseYearMovIndivDiv alignItemsHorizontal">
                            <i class="fa-solid fa-calendar"></i>
                            <h5 id="textH5">${localStorage.getItem('savedMovieYear')}</h5>
                        </div> 
                        
                        <!-- Genre -->
                        <div class="genreMovIndivDiv alignItemsHorizontal">
                            <i class="fa-solid fa-film genreMovIndiv"></i>
                            <h5 id="textH5">${localStorage.getItem('savedGenre')}</h5>
                        </div>  
                        
                        <!-- Sypnopsis -->
                        <div class="sypnopsisMovIndivDiv alignItemsHorizontal">
                            <h5 id="textH5">Synopsis:</h5>
                            <p>${localStorage.getItem('savedSynopsis')}</p>
                        </div>
                        
                        <!-- Trailer Link -->
                        <div class="trailorLinkMovIndivDiv alignItemsHorizontal">
                            <h5 id="textH5">Trailer:</h5>
                            <a href="#" id="trailerLinkMovIndiv"> Watch Trailer</a>
                        </div> 
                        

                        <!--Language-->
                        <div class="actorsMovIndivDiv alignItemsHorizontal">
                            <h5 id="textH5">Language:</h5>
                            <p id="actorsMovIndiv">${localStorage.getItem('savedMovieLang')}</p>
                        </div>
                        
                        <!-- Buttons -->
                        <div class="buttonsMovIndivDiv">
                            <div class="holographicContainer">
                                <div class="holographicCard">
                                    <a href="#####" id="viewMoreButton"><i class="fa-solid fa-plus"></i>Watchlist</a>
                                </div>
                            </div>

                            <div class="holographicContainer">
                                <div class="holographicCard">
                                    <a href="${localStorage.getItem('savedMovieTitle')}" id="viewMoreButton"><i class="fa-solid fa-play"></i>Watch Now</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
    `;
}


document.addEventListener("DOMContentLoaded", fetchLibraryMovies);
document.addEventListener("DOMContentLoaded", fullIndividual );


let apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTI2MGExNWJjNjQ1ZWU4ZTE4Mzk4ZGQ0ZjFhNTk3MSIsIm5iZiI6MTc1ODE5OTc1Ni42ODk5OTk4LCJzdWIiOiI2OGNiZmZjYzRlMzU5NzJhYTMxNDkxNTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.64Z_V_s-8zgoalnB_-D2jKs1kK2vAji8AISaP6SSxmk";
let BASE_URL = 'https://api.themoviedb.org/3';
let IMG_URL = 'https://image.tmdb.org/t/p/w500';

class libraryMovies 
{
  constructor(title, synopsis, poster, link, genreId, year,Movieid,rate) {
    this.title = title;
    this.synopsis = synopsis;
    this.poster = poster;
    this.link = link;
    this.genreId = genreId;
    this.year = year;
    this.Movieid = Movieid;
    this.rate= rate;
  }
}
let movieList = [];


//genre map
const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western"
};



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
function createCard(movie, isWatchlistPage = false) 
{
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
                    <button onclick="saveClass('${movie.id}')"  class="btn btn-primary holographicCard">More Info</button>
                </div>
            </div>
        </div>
    `;

    return card;
}

//href="../pages/individual.html"


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
        movieList = [];
        data.results.forEach(movie => {
            movie.genre_names = movie.genre_ids ? movie.genre_ids.map(id => genreMap[id]) : [];
            const card = createCard(movie);
             let title = movie.title || movie.name;
             let synopsis = movie.overview || "No synopsis available";
             let poster = movie.poster_path
             ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
             : "../assets/img/tangled.jpg";
             let link = `https://www.themoviedb.org/movie/${movie.id}`;
             let genreId = movie.genre_ids && movie.genre_ids.length > 0 ? movie.genre_ids[0] : null;
             let year = movie.release_date ? movie.release_date.split("-")[0] : "Unknown";
             let Movieid = movie.id;
             let rate = movie.vote_average;
             const newMovie = new  libraryMovies (title, synopsis, poster, link, genreId, year,Movieid,rate);
             movieList.push(newMovie);

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
             let title = movie.title || movie.name;
             let synopsis = movie.overview || "No synopsis available";
             let poster = movie.poster_path
             ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
             : "../assets/img/tangled.jpg";
             let link = `https://www.themoviedb.org/movie/${movie.id}`;
             let genreId = movie.genre_ids && movie.genre_ids.length > 0 ? movie.genre_ids[0] : null;
             let year = movie.release_date ? movie.release_date.split("-")[0] : "Unknown";
             let Movieid = movie.id;
             let rate = movie.vote_average;
             const newMovie = new  libraryMovies (title, synopsis, poster, link, genreId, year,Movieid,rate);
             movieList.push(newMovie);

            movie.genre_names = movie.genre_ids ? movie.genre_ids.map(id => genreMap[id]) : [];
            const card = createCard(movie);
            card.classList.add('col', 'col-lg-3', 'col-md-6', 'col-sm-12', 'mb-4');
            container.appendChild(card);
        });
        console.log("movie", movieList);
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
    movieList = [];
    watchlist.forEach(movie => 
        {
        
        if (movie.poster_path && movie.poster_path.startsWith('http')) {
            movie.poster_path_full = movie.poster_path;
            movie.poster_path = null;
        }
        const card = createCard(movie, true); 
        card.classList.add('col', 'col-lg-3', 'col-md-6', 'col-sm-12', 'mb-4'); 
        container.appendChild(card);
        
    });
    console.log(watchlist);
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
                const movie = 
                {
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

document.addEventListener('DOMContentLoaded', () => {
    if (page === 'watchlist.html') loadWatchlist();
    else if (page === 'library.html') {
        loadLibrary();
        populateGenreDropdown();
        attachFilters();
    } else if (page === 'index.html') loadLibrary();
});






//Luka's section 


//Home Page
!async function()
{
  const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTI2MGExNWJjNjQ1ZWU4ZTE4Mzk4ZGQ0ZjFhNTk3MSIsIm5iZiI6MTc1ODE5OTc1Ni42ODk5OTk4LCJzdWIiOiI2OGNiZmZjYzRlMzU5NzJhYTMxNDkxNTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.64Z_V_s-8zgoalnB_-D2jKs1kK2vAji8AISaP6SSxmk'
  }
};

let data= await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
.then((response)=> response.json())
.then((results)=> {return results})
.catch((error)=> console.log(error));
console.log(data);


//get and set slider images using Api
let sliderImage1 = `https://image.tmdb.org/t/p/original${data.results[0].backdrop_path}`;
let sliderImage2 = `https://image.tmdb.org/t/p/original${data.results[1].backdrop_path}`;
let sliderImage3 = `https://image.tmdb.org/t/p/original${data.results[2].backdrop_path}`;
          
document.getElementById('sliderImg1').innerHTML = `<img src="${sliderImage1}" class="d-block w-100">`;
document.getElementById('sliderImg2').innerHTML = `<img src="${sliderImage2}" class="d-block w-100">`;
document.getElementById('sliderImg3').innerHTML = `<img src="${sliderImage3}" class="d-block w-100">`;
           
!async function()
{
 const options = 
 {
  method: 'GET',
  headers: 
  {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTI2MGExNWJjNjQ1ZWU4ZTE4Mzk4ZGQ0ZjFhNTk3MSIsIm5iZiI6MTc1ODE5OTc1Ni42ODk5OTk4LCJzdWIiOiI2OGNiZmZjYzRlMzU5NzJhYTMxNDkxNTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.64Z_V_s-8zgoalnB_-D2jKs1kK2vAji8AISaP6SSxmk'
  }
  };

        let data= await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
            .then((response)=> response.json())
            .then((results)=> {return results})
            .catch((error)=> console.log(error));
            console.log(data);


            //get and set slider images using Api
              let sliderImage1 = `https://image.tmdb.org/t/p/original${data.results[0].backdrop_path}`;
              let sliderImage2 = `https://image.tmdb.org/t/p/original${data.results[1].backdrop_path}`;
              let sliderImage3 = `https://image.tmdb.org/t/p/original${data.results[2].backdrop_path}`;
          
              document.getElementById('sliderImg1').innerHTML = `<img src="${sliderImage1}" class="d-block w-100">`;
              document.getElementById('sliderImg2').innerHTML = `<img src="${sliderImage2}" class="d-block w-100">`;
              document.getElementById('sliderImg3').innerHTML = `<img src="${sliderImage3}" class="d-block w-100">`;
           
              //get and set movie of the month using Api
              let image = `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
              let title = data.results[0].original_title;
              let description = data.results[0].overview;

              document.getElementById('movieMonth').innerHTML = `${title} : ${description}`;
              document.getElementById('movieMonthImg').innerHTML = `<img src="${image}" style="width: 9
            0%; border-radius: 50px;" alt="Movie Poster">`;        
}();   
}();






//Libary
//drop down filter
//change the filter type
function sortByFilterType()
{
 const container = document.getElementById("DropdownChange");
 
 const selectedGenre = document.getElementById("dropdownType").value;
 console.log(selectedGenre);
 if (selectedGenre==1)
  {
    container.innerHTML = "";
    console.log("rateing");
    container.innerHTML =`<select class="formSelect" aria-label="Default select example" onchange="sortByRateing()"  id="dropdownGenre">
                        <option selected value="0">All</option>
                        <option value="10" >5 stars </option>
                        <option value="8" >4 stars </option>
                        <option value="6" >3 stars </option>
                        <option value="4" >2 stars </option>
                        <option value="2" >1 stars </option>
                        </select>`;
    loadLibrary(); 
  }
  else if (selectedGenre==2)
  {
    container.innerHTML = "";
    console.log("Year");
    container.innerHTML =`<select class="formSelect" aria-label="Default select example" onchange="sortByYear()"  id="dropdownGenre">
                        <option selected value="0">All</option>
                        <option value="2020">2020's</option>
                        <option value="2010" >2010's</option>
                        <option value="2000" >2000's</option>
                        <option value="1990" >1990's</option>
                        <option value="1980" >1980's</option>
                        </select>`;
     loadLibrary(); 
  }
  else
  {
    container.innerHTML = "";
    console.log("Genre");
    container.innerHTML =`<select class="formSelect" aria-label="Default select example" onchange="sortByGenre()"  id="dropdownGenre">
                        <option selected value="0">All</option>
                        <option value="28" >Action</option>
                        <option value="12" >Adventure</option>
                        <option  value="16" >Animation</option>
                        <option value="35" >Comedy</option>
                        <option value="80" >Crime</option>
                        <option value="99" >Documentary</option>
                        <option  value="18" >Drama</option>
                        <option  value="10751" >Family</option>
                        <option  value="14" >Fantasy</option>
                        <option  value="36" >History</option>
                        <option  value="27" >Horror</option>
                        <option  value="10770">Music</option>
                        </select>>`;
    loadLibrary(); 
  }
}

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
                            <a class="btn btn-primary holographicCard" id="watchlistButton" style="margin: 0;" onclick="saveClass('${Movies.Movieid}' ,'${Movies.rate}')  ">More Info</a>
                        </div>
                    </div>
                </div>
    `;
  });
  }
  else
  {
       loadLibrary(); 
  }
 }
function sortByRateing()
{
  const selectedRate = parseFloat(document.getElementById("dropdownGenre").value);
  console.log(selectedRate);
  
  let byRate;
   if(selectedRate>0)
  {
     byRate = movieList.filter(movie => movie.rate>=selectedRate);
     const container = document.getElementById("movieContainer");
     container.innerHTML = "";
      byRate.forEach((Movies) => {
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
                            <a href="../pages/individual.html" class="btn btn-primary holographicCard" id="watchlistButton" style="margin: 0;" onclick="saveClass('${Movies.Movieid}' ,'${Movies.rate}')  ">More Info</a>
                        </div>
                    </div>
                </div>
    `;
  });
  }else
  {
       loadLibrary(); 
  }
}

function sortByYear() {
   
  const selectedYear = document.getElementById("dropdownGenre").value;
  
  const yearMin = parseInt(selectedYear);
  const yearMax = yearMin+10;
  console.log(yearMax);
   if(selectedYear>0)
  {
     byYear = movieList.filter(movie => {return parseInt(movie.year) >= yearMin && parseInt(movie.year) <= yearMax;
     });
     console.log(byYear);
     const container = document.getElementById("movieContainer");
     container.innerHTML = "";
      byYear.forEach((Movies) => 
        {
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
                            <a href="../pages/individual.html" class="btn btn-primary holographicCard" id="watchlistButton" style="margin: 0;" onclick="saveClass('${Movies.Movieid}' ,'${Movies.rate}' )  ">More Info</a>
                        </div>
                    </div>
                </div>
       `;
     });
  }
  else
  {
       loadLibrary(); 
  }
}

// end of filter section code

//saved Data for indivial page
async function saveClass(indivialID)
{
  let byID = movieList.filter(movies => movies.Movieid==indivialID);
  console.log("newlist",byID);
  let rate= "3.342";
  let shortRate = rate.substring(0,3);

  localStorage.setItem('savedMovieTitle', byID[0].title);
  localStorage.setItem('savedMovieYear', byID[0].year);
  localStorage.setItem('savedSynopsis', byID[0].synopsis);
  localStorage.setItem('savedGenre', genreMap[byID[0].genreId]);
  localStorage.setItem('savedMoviePoster',byID[0].poster);
  localStorage.setItem('savedID', indivialID);
  

  console.log(localStorage.getItem('savedID'));
  console.log(localStorage.getItem('savedMovieTitle'));
  console.log(localStorage.getItem('savedMovieYear'));
  console.log(localStorage.getItem('savedRate'))
     fechTrailers(indivialID);
     fetchCredits(indivialID);
  window.location.href = "../pages/individual.html";
}

//Get Trailers from Api
async function fechTrailers(MovieID)
{
  let Trailers =[];
  let key="";
  let id="";
  let = trailerLink="";
  let TrailerApiLink = 'https://api.themoviedb.org/3/movie/'+MovieID+'/videos?language=en-US';
  const options = 
  {
  method: 'GET', 
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTI2MGExNWJjNjQ1ZWU4ZTE4Mzk4ZGQ0ZjFhNTk3MSIsIm5iZiI6MTc1ODE5OTc1Ni42ODk5OTk4LCJzdWIiOiI2OGNiZmZjYzRlMzU5NzJhYTMxNDkxNTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.64Z_V_s-8zgoalnB_-D2jKs1kK2vAji8AISaP6SSxmk'
   }
  };
  const TrailerData= await fetch(TrailerApiLink, options)
            .then((response)=> response.json())
            .then((results)=> {return results})
            .catch((error)=> console.log(error));
 console.log("Fetched Trailer:",TrailerData);
  
  TrailerData.results.forEach((trailer) => 
   {
   let type = trailer.type;

   if (type=="Trailer") 
    {
       Trailers.push(trailer); 
    }
   });

   key=Trailers[0].key;
   id=Trailers[0].id;
   trailerLink = "https://www.youtube.com/watch?v="+key+"="+id;
  
  localStorage.setItem('savedTrailer', trailerLink);
}


//get Actors and director from Api
async function fetchCredits(MovieID)
{
   const CreditsApiLink = 'https://api.themoviedb.org/3/movie/'+MovieID+'/credits?language=en-US';

 const options = 
  {
  method: 'GET', 
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTI2MGExNWJjNjQ1ZWU4ZTE4Mzk4ZGQ0ZjFhNTk3MSIsIm5iZiI6MTc1ODE5OTc1Ni42ODk5OTk4LCJzdWIiOiI2OGNiZmZjYzRlMzU5NzJhYTMxNDkxNTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.64Z_V_s-8zgoalnB_-D2jKs1kK2vAji8AISaP6SSxmk'
   }
  };
  const Data= await fetch(CreditsApiLink, options)
            .then((response)=> response.json())
            .then((results)=> {return results})
            .catch((error)=> console.log(error));
 console.log("Fetched Credits:", Data);
 let director="";
 let crew =  Data.crew;
  crew.forEach((CrewType) => 
   {
   let type = CrewType.job;

   if (type=="Director") 
    {
      director = CrewType.name;
      localStorage.setItem('savedDirector', director);
    }
   });

  let cast = Data.cast;
  let castList = cast[0].original_name;
 for (let i = 1; i < 4; i++) 
  {
    castList= castList+", " + cast[i].original_name;
  }
  console.log(castList);
  localStorage.setItem('savedCast', castList);
}

//full indivial page
function fullIndividual()
{
    console.log("hi");
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
                            <h5 style="margin-right: 20px;" id="textH5"> Rating :  </h5>
                            <i class="fa-solid fa-star ratingMovIndiv"></i>
                            <p style="font-size: 20px;">${localStorage.getItem('savedRate')} </p>
                            
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
                            <a href=${localStorage.getItem('savedTrailer')} id="trailerLinkMovIndiv"> Watch Trailer</a>
                        </div> 
                        

                       <!-- Director(s) & Actor(s) -->
                        <div class="directorsMovIndivDiv alignItemsHorizontal">
                            <h5 id="textH5">Director(s): </h5>
                            <p id="directorsMovIndiv">${localStorage.getItem('savedDirector')}</p>
                        </div>
                        
                        <div class="actorsMovIndivDiv alignItemsHorizontal">
                            <h5 id="textH5">Actor(s):</h5>
                            <p id="actorsMovIndiv">${localStorage.getItem('savedCast')}</p>
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
                                    <a href="${localStorage.getItem('savedTrailer')}" id="viewMoreButton"><i class="fa-solid fa-play"></i>Watch Now</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
    `;
}

document.addEventListener("DOMContentLoaded", fullIndividual);

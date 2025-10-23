// Movie class + array 
class Movies 
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

// genre map for referencing
const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western"
};



const libraryApiUrl = "https://api.themoviedb.org/3/movie/upcoming?";


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
          <a href="../pages/individual.html" class="btn btn-primary holographicCard" id="watchlistButton" style="margin: 0;" onclick="saveClass('${movieObj.Movieid}','${movieObj.rate}') ">More Info</a>
        </div>
      </div>
    </div>
  `;
}
//a href="../pages/individual.html"
//saved Data for indivial page
function saveClass(indivialID,rate)
{
 

  let byID = movieList.filter(movies => movies.Movieid==indivialID);
  console.log("newlist",byID);
  let shortRate = rate.substring(0,3);

  localStorage.setItem('savedMovieTitle', byID[0].title);
  localStorage.setItem('savedMovieYear', byID[0].year);
  localStorage.setItem('savedSynopsis', byID[0].synopsis);
  localStorage.setItem('savedGenre', genreMap[byID[0].genreId]);
  localStorage.setItem('savedMoviePoster',byID[0].poster);
  localStorage.setItem('savedID', indivialID);
  localStorage.setItem('savedRate', (shortRate/2));

  console.log(localStorage.getItem('savedID'));
  console.log(localStorage.getItem('savedMovieTitle'));
  console.log(localStorage.getItem('savedMovieYear'));
  console.log(localStorage.getItem('savedRate'))
  fechTrailers(indivialID);
  fetchCredits(indivialID);
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



//get movies from API
async function fetchLibraryMovies()
 {
  const container = document.getElementById("movieContainer");
  container.innerHTML = "<p>Loading movies...</p>";
 
  try {
  
      const response = await fetch(`${libraryApiUrl}?language=en-US&page=2`, 
      {
      headers: 
      {
        Authorization: `Bearer ${apiKey}`, 
        "Content-Type": "application/json"
       }
      });
    
     console.log("Response status:", response.status);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
    

      container.innerHTML = ""; 
      movieList = [];
      data.results.forEach((movie) =>
         {
    
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
         const newMovie = new Movies(title, synopsis, poster, link, genreId, year,Movieid,rate);
         movieList.push(newMovie);
         container.innerHTML += buildMovieCard(newMovie);
       }); 
      }
      catch (error) 
     {
       console.error("Error fetching movies:", error);
       container.innerHTML = `<p>Error loading movies: ${error.message}</p>`;
     }
   
   
 }

//filter section code

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
    fetchLibraryMovies(); 
  }
  else if (selectedGenre==2)
  {
    container.innerHTML = "";
    console.log("rateing");
    container.innerHTML =`<select class="formSelect" aria-label="Default select example" onchange="sortByYear()"  id="dropdownGenre">
                        <option selected value="0">All</option>
                        <option value="2020">2020's</option>
                        <option value="2010" >2010's</option>
                        <option value="2000" >2000's</option>
                        <option value="1990" >1990's</option>
                        <option value="1980" >1980's</option>
                        </select>`;
    fetchLibraryMovies(); 
  }
  else
  {
    container.innerHTML = "";
    console.log("rateing");
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
    fetchLibraryMovies(); 
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
                            <a href="../pages/individual.html" class="btn btn-primary holographicCard" id="watchlistButton" style="margin: 0;" onclick="saveClass('${Movies.Movieid}' ,'${Movies.rate}')  ">More Info</a>
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
      fetchLibraryMovies();
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
      fetchLibraryMovies();
  }
}


// end of filter section code




//full indivial page
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


document.addEventListener("DOMContentLoaded", fetchLibraryMovies);
document.addEventListener("DOMContentLoaded", fullIndividual );
document.addEventListener("DOMContentLoaded", fullIndividual );


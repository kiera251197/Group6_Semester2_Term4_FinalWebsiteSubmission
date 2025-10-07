class Movie{
        constructor(image , title ,description){
        this.image = image;
        this.title = title;
        this.description = description;
    }
}



!async function(){
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
              let sliderImage1 = `https://image.tmdb.org/t/p/w500${data.results[0].backdrop_path}`;
              let sliderImage2 = `https://image.tmdb.org/t/p/w500${data.results[1].backdrop_path}`;
              let sliderImage3 = `https://image.tmdb.org/t/p/w500${data.results[2].backdrop_path}`;
          
              document.getElementById('sliderImg1').innerHTML = `<img src="${sliderImage1}" class="d-block w-100">`;
              document.getElementById('sliderImg2').innerHTML = `<img src="${sliderImage2}" class="d-block w-100">`;
              document.getElementById('sliderImg3').innerHTML = `<img src="${sliderImage3}" class="d-block w-100">`;
            //get and set movie of the month using Api
              let image = `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
              let title = data.results[0].original_title;
              let description = data.results[0].overview;

              let newMovie = new Movie(image,title,description);

              console.log(newMovie);

              
              document.getElementById('movieMonth').innerHTML = `${title} : ${description}`;
              document.getElementById('movieMonthImg').innerHTML = `<img src="${image}" style="width: 9
            0%; border-radius: 50px;" alt="Movie Poster">`;

              
          
}();






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


            
            const imgEl = card.querySelector('img');
            imgEl.src = poster;
            imgEl.alt = `${title} Poster`;

            const textEl = card.querySelector('.card-text');
            textEl.textContent = synopsis;

            
            const cardBody = card.querySelector('.card-body');
            const oldLink = cardBody.querySelector('a');
            if (oldLink) oldLink.remove();

            
            const linkEl = document.createElement('a');
            linkEl.href = link;
            linkEl.target = '_blank';
            linkEl.textContent = 'More Info';
            linkEl.classList.add('btn', 'btn-primary', 'mt-2', 'more-info-btn');
            cardBody.appendChild(linkEl);
        });

    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}


fetchMovies();

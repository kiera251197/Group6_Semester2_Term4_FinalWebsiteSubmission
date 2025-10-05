class Movie
{
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

              let image = `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
              let title = data.results[0].original_title;
              let description = data.results[0].overview;

              let newMovie = new Movie(image,title,description);

              console.log(newMovie);

              
              document.getElementById('movieMonth').innerHTML = `${title} : ${description}`;
              document.getElementById('movieMonthImg').innerHTML = `<img src="${image}" style="width: 9
            0%; border-radius: 50px;" alt="Movie Poster">`;

              
             
              



}();





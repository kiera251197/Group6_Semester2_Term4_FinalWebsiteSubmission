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
            const oldLink = cardBody.querySelector('a');z
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

//Login/Signup form toggle
// Animation is its own selector so animation can be toggled on or off if needed.
const animationContainer = document.querySelector('.background-gradient--animated');
const computedAnimationStyles = window.getComputedStyle(animationContainer);
let cycleIndex = 1;
let lastCycle = 1;
let mouseX;
let mouseY;
let lastMousePositionX;
let lastMousePositionY;
let countdown = false;
let animationInterval = setInterval(ambientAnimation, 120);

function calculateLocationChange(property, optionalModifier, previousLocation) {
   let newLocationValue;
 
   if (optionalModifier) {
      const locationValueAsNum2 = parseFloat(computedAnimationStyles.getPropertyValue(property).replace('%', ''), 10);
      // TODO: Figure out how to move the gradient backwards
      // when mouse aware.
      // if (previousLocation < optionalModifier) {
      //    console.log('working?');
      //    newLocationValue = `${locationValueAsNum2 - optionalModifier}%`;
      // }
      newLocationValue = `${locationValueAsNum2 + optionalModifier}%`;
   } else {
      let styleByIncrement = 1 + (cycleIndex / 1000);
      const locationValueAsNum = parseFloat(computedAnimationStyles.getPropertyValue(property).replace('%', ''), 10);
      if (countdown) {
         newLocationValue = `${locationValueAsNum - styleByIncrement}%`;
      } else {
         newLocationValue = `${locationValueAsNum + styleByIncrement}%`;
      }
   }
     return newLocationValue;
};

function ambientAnimation() {
   animationContainer.style.setProperty("--radial-position-1", calculateLocationChange("--radial-position-1"));
   animationContainer.style.setProperty("--radial-position-2", calculateLocationChange("--radial-position-2"));
   animationContainer.style.setProperty("--radial-position-3", calculateLocationChange("--radial-position-3"));
   animationContainer.style.setProperty("--radial-position-4", calculateLocationChange("--radial-position-4"));
   animationContainer.style.setProperty("--radial-position-5", calculateLocationChange("--radial-position-5"));
   animationContainer.style.setProperty("--radial-position-6", calculateLocationChange("--radial-position-6"));
   animationContainer.style.setProperty("--radial-position-7", calculateLocationChange("--radial-position-7"));
   animationContainer.style.setProperty("--radial-position-8", calculateLocationChange("--radial-position-8"));

   lastCycle = cycleIndex;

   if (cycleIndex === 30) {
      countdown = true;
   };
   
   // Handles pulse animation.
   if (countdown) {
      if (lastCycle - cycleIndex >= 0) {
         // Checks to see if this value is returning
         // a negative number and reverses animation.
         if (lastCycle + cycleIndex < 0) {
            countdown = false;
         } 
         cycleIndex--;
      }
   } else {
      cycleIndex++;
   }
}

// 
animationContainer.addEventListener('mouseleave', (e)=> {
   animationContainer.style.setProperty("--radial-position-1", '120%');
   animationContainer.style.setProperty("--radial-position-2", '-20%');
   animationContainer.style.setProperty("--radial-position-3", '40%');
   animationContainer.style.setProperty("--radial-position-4", '-30%');
   animationContainer.style.setProperty("--radial-position-5", '60%');
   animationContainer.style.setProperty("--radial-position-6", '20%');
   animationContainer.style.setProperty("--radial-position-7", '0%');
   animationContainer.style.setProperty("--radial-position-8", '60%');
});

// TODO: Probably wanna add some debounce here.
animationContainer.addEventListener('mousemove', (e)=> {
   // Ambient animation is ended, otherwise the interval
   // and mouse movement events clash with each other.
   clearInterval(animationInterval);
   
   // Just some stuff here that is/was part of trying
   // to have the gradient follow the cursor when
   // you are moving behind it.
   lastMousePositionX = mouseX;
   lastMousePositionY = mouseY;
 
   let x = e.clientX / 1000;
   let y = e.clientY / 1000;
   
   mouseY = y;
   mouseX = x;
   //    animationContainer.style.setProperty("--radial-position-1", calculateLocationChange("--radial-position-1", y));
   // animationContainer.style.setProperty("--radial-position-2", calculateLocationChange("--radial-position-2", x));
   animationContainer.style.setProperty("--radial-position-3", calculateLocationChange("--radial-position-3", y, lastMousePositionY));
   animationContainer.style.setProperty("--radial-position-4", calculateLocationChange("--radial-position-4", x, lastMousePositionX));
   // animationContainer.style.setProperty("--radial-position-5", calculateLocationChange("--radial-position-5", y));
   // animationContainer.style.setProperty("--radial-position-6", calculateLocationChange("--radial-position-6", x));
   // animationContainer.style.setProperty("--radial-position-7", calculateLocationChange("--radial-position-7", y));
   // animationContainer.style.setProperty("--radial-position-8", calculateLocationChange("--radial-position-8", x));
});

//Login/Signup form
function formChange(button) {
  const signUpForm = document.getElementById("sign-up-form");
  signUpForm.classList.toggle("display-none");

  const login = document.getElementById("login");
  login.classList.toggle("display-none");

  const signUp = document.getElementById("sign-up");
  signUp.classList.toggle("display-flex");

  const loginForm = document.getElementById("login-form");
  loginForm.classList.toggle("display-flex");

  const col1 = document.getElementById("col-1");
  const col2 = document.getElementById("col-2");
  col1.classList.toggle("order");

  if (button === "login") {
    col1.classList.add("bounce-left");
    col1.classList.remove("bounce-right");

    col2.classList.add("bounce-right");
    col2.classList.remove("bounce-left");
  } else {
    col1.classList.add("bounce-right");
    col1.classList.remove("bounce-left");

    col2.classList.add("bounce-left");
    col2.classList.remove("bounce-right");
  }
}

const email1 = document.getElementById("email-1");
const emailSpan1 = document.getElementById("span-email-1");
const email2 = document.getElementById("email-2");
const emailSpan2 = document.getElementById("span-email-2");
const password1 = document.getElementById("password-1");
const passwordSpan1 = document.getElementById("span-password-1");
const password2 = document.getElementById("password-2");
const passwordSpan2 = document.getElementById("span-password-2");

email1.addEventListener("input", () => {
  if (email1.value) {
    emailSpan1.classList.add("focus-span");
  } else {
    emailSpan1.classList.remove("focus-span");
  }
});

email2.addEventListener("input", () => {
  if (email2.value) {
    emailSpan2.classList.add("focus-span");
  } else {
    emailSpan2.classList.remove("focus-span");
  }
});

password1.addEventListener("input", () => {
  if (password1.value) {
    passwordSpan1.classList.add("focus-span");
  } else {
    passwordSpan1.classList.remove("focus-span");
  }
});

password2.addEventListener("input", () => {
  if (password2.value) {
    passwordSpan2.classList.add("focus-span");
  } else {
    passwordSpan2.classList.remove("focus-span");
  }
});

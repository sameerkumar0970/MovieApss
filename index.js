
const carousalImages=[
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOtDaTtvC7sNNai0NeninDNfR21zIFgtObdw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW_crIjek4rPOuuO0n42wdB4uNUyiZH9N0vg&s",
    "https://i.ytimg.com/vi/hTCfn_Bq-B0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBMrm78wxh3Fn-a7OhGJCI8B7jDXA",
    
]

let currentSlide=0;
let allMovies=[];

const carousalContainer=document.getElementById("carousal-container");
const moviesContainer=document.getElementById("movies-container")
function initCarousal(){
    carousalContainer.innerHTML="";
    carousalImages.forEach((imageUrl,index)=>{
        const slide=document.createElement("div");
        slide.className="carousal-slide";
        if(index===0){
            slide.classList.add("active")
           
        }
         const img=document.createElement("img");
            img.className="carousal-image"
            img.src=imageUrl;
            img.alt=`Slide ${index+1}`
            slide.appendChild(img)
            carousalContainer.appendChild(slide);
    })
}

function updateCarousel(){
    const slides =document.querySelectorAll(".carousal-slide");
    slides.forEach((slide,index)=>{
        if(index===currentSlide){
            slide.classList.add("active");
        }else{
            slide.classList.remove("active");
        }
    })
}
function autoNext(){
    currentSlide=(currentSlide+1)%carousalImages.length;
    updateCarousel()
}
function changeSlide(direction){
  currentSlide=(currentSlide+direction+carousalImages.length)%carousalImages.length;
  updateCarousel()
}


async function loadMovies(){
    try{
    const response=await fetch("http://localhost:3000/movies");
    if(!response){
        Error("Failed to fetch movies")
    }
     allMovies=await response.json();
     console.log("data",allMovies);
     displayMovies();

    }catch(err){
     console.log(err)
    }
}

function displayMovies(){
   if(!moviesContainer){
    console.log("Movies container is not found");
    return
   }
   if(!allMovies|| allMovies.length===0){
    moviesContainer.innerHTML=`<p style='color:white;text-align:center'>No Movies available</p>`
    return
   }

   allMovies.forEach(movie=>{
    const card=document.createElement("div");
    card.className="movie-card";
    card.innerHTML=`
     <div class="movie-poster">
     <img src=${movie.poster} alt=${movie.title} class="movie-poster-img">
     </div>
     <div class="movie-info">
     <div class="movie-title">${movie.title}</div>
         <div class="movie-year">${movie.year}</div>
         <div class="movie-genre">${movie.Category}</div>
           <div class="movie-rating">⭐${movie.rating}</div>
           <div class="movie-buttons">
           <button class="btn btn-favourite">❤️Favourite</button>
           <button class="btn btn-cart">🛒Cart</button>
           </div>
     </div>
    `
    card.addEventListener("click",()=>{
      window.location.href="single.html"
    })
    const cartBtn=card.querySelector(".btn-cart");
    cartBtn.addEventListener("click",()=>handleCart(movie))
    moviesContainer.appendChild(card)
   })


}

async function handleCart(movie) {
 try{
  console.log(movie)
  const res=await fetch(`http://localhost:3000/cart?id=${movie.id}`);
  const existing=await res.json();
  if(existing.length>0){
   alert(`${movie.title} is already in your cart`);
  }
  await fetch("http://localhost:3000/cart",{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(movie)
  });
  alert(`${movie.title} added to cart`)

 }catch(err){
  console.log(err)
 }
}

setInterval(autoNext,2000);
loadMovies()
initCarousal()
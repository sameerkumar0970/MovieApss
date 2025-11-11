async function loadCart(){
   const res=await fetch("http://localhost:3000/cart");
   const cartItems=await res.json();
   const container=document.getElementById("cart-container");
   container.innerHTML="";
   if(cartItems.length===0){
    container.innerHTML=`<p>NO item in the cart.</p>`
    return
   }
   cartItems.forEach(item => {
     const div=document.createElement("div");
    div.className="cart-item";
    div.innerHTML=`
     <img src=${item.poster} alt=${item.title} class="movie-poster-img" width="100">
   
     <div class="movie-info">
     <div class="movie-title">${item.title}</div>
         <div class="movie-year">${item.year}</div>
         <div class="movie-genre">${item.Category}</div>
           <div class="movie-rating">⭐${item.rating}</div>
          <button onclick="removeFromCart(${item.id})">Remove</button>
     </div>
    `
    container.appendChild(div)
   });

}
async function removeFromCart(id) {
    await fetch(`http://localhost:3000/cart/${id}`,{
        method:"DELETE"
    });
    loadCart()
}



loadCart()
const productList = document.querySelector("#product-list");
const cartIcon = document.querySelector("#cart-icon");
const cartCount = document.querySelector("#cart-count");
const cartPanel = document.querySelector("#cart");
const checkoutBtn = document.querySelector("#checkout-btn");
const cartTotal = document.querySelector("#cart-total");
const cartBox = document.querySelector("#cart-box");
const popup = document.querySelector("#payment-popup");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cartIcon.addEventListener(("click"),()=>{
         cartPanel.classList.toggle("show");  
})

async function fetchProducts(){
     let res = await fetch("https://fakestoreapi.com/products");
     let products = await res.json();
     renderProducts(products); 
}

function renderProducts(products){
     productList.innerHTML = "";
     products.forEach((product)=>{
     let productBox = document.createElement("div");
     productBox.className = "product";
     productBox.innerHTML = `
     <img src = "${product.image}"/>
     <h4>${product.title}</h4> 
     <p><strong>$${product.price}</strong></p>
     <button onclick="addToCart(${product.id})">Add to Cart</button> 
     `
     productList.appendChild(productBox); 
     })     
}

function addToCart(productId){
     const existing = cart.find((item)=>{
       return item.id === productId;
     })
     if(existing){
          existing.quantity += 1;
     }
     else{
          cart.push({id : productId, quantity : 1});
     }
     localStorage.setItem("cart",JSON.stringify(cart));

     renderCart();
}

async function renderCart(){
     let res = await fetch("https://fakestoreapi.com/products");
     let allProducts = await res.json();


     cartBox.innerHTML = "";
     let total = 0; 
     cart.forEach((itemCart)=>{
     let product = allProducts.find((p)=> p.id === itemCart.id);  
     let div = document.createElement("div");
     div.className = "cart-item";
     div.innerHTML = `
     <img src = "${product.image}"/>
     <div>
     <p>${product.title}</p>
     <strong>$${product.price}</strong>
     <button onclick="decreaseCount(${product.id})">-</button>
     ${itemCart.quantity}
     <button onclick="increaseCount(${product.id})">+</button>
     <button onclick="deleteItem(${product.id})">Remove</button>
     </div>     
     ` 

     cartBox.appendChild(div);
     total += itemCart.quantity * product.price;
     }); 

     cartTotal.innerHTML = `<strong>Total : $${total.toFixed(2)}</strong>`
     let count = cart.reduce((sum,item)=>  sum + item.quantity, 0);
     cartCount.innerText = count; 
}

function deleteItem(productId){
    cart =  cart.filter((item)=> item.id !== productId)
    localStorage.setItem("cart",JSON.stringify(cart));
    renderCart();
}

function increaseCount(productId){
     let item = cart.find((item)=> item.id === productId)
     if(item){
          item.quantity += 1;
     }
     
     localStorage.setItem("cart",JSON.stringify(cart));
     renderCart();
}

function decreaseCount(productId){
    let item = cart.find((item)=> item.id === productId )
    if(item && item.quantity > 1){
     item.quantity -= 1;
    }   
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

checkoutBtn.addEventListener("click",()=>{
       if(cart.length === 0){
          alert("Cart is Empty");
          return;
       }  
 setTimeout(()=>{
      popup.style.display = "flex";
       cart = [];
       localStorage.setItem("cart",JSON.stringify(cart));
       renderCart();
 },500)
})

function closePopup(){
     popup.style.display = "none";
}



fetchProducts();
renderCart();

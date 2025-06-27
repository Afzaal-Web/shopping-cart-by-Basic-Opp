// get containers
const cartContainer = document.getElementById('cart-container');
const productsContainer = document.getElementById('products-container');
const dessertCards = document.getElementById('dessert-card-container');
//get buttons
const cartBtn = document.getElementById('cart-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
//get total
const totalNumberOfItems = document.getElementById('total-items');
const cartSubTotal = document.getElementById('subtotal');
const cartTaxes = document.getElementById('taxes');
const cartTotal = document.getElementById('total');
// get show hide carts 
const showHideCartSpan = document.getElementById('show-hide-cart');
// get confirm div and buttons
const confirmDiv = document.getElementById('confirm');
const yesButton = document.getElementById('yes');
const noButton = document.getElementById('no');

let isCartShowing = false;

// product arrays of object
const products = [
    {
        id: 1,
        name: "Vanilla Cupcakes (6 Pack)",
        price: 12.99,
        category: "Cupcake",
    },
    {
        id: 2,
        name: "French Macaron",
        price: 3.99,
        category: "Macaron"
    },
    {
        id: 3,
        name: "Pumpkin Cupcake",
        price: 3.99,
        category: "Cupcake"
    },
    {
        id: 4,
        name: "Chocolate Cupcake",
        price: 5.99,
        category: "Cupcake"
    },
    {
        id: 5,
        name: "Chocolate Pretzels (4 Pack)",
        price: 10.99,
        category: "Pretzel"
    },
    {
        id: 6,
        name: "Strawberry Ice Cream",
        price: 2.99,
        category: "Ice Cream"
    },
    {
        id: 7,
        name: "Chocolate Macarons (4 Pack)",
        price: 9.99,
        category: "Macaron"
    },
    {
        id: 8,
        name: "Strawberry Pretzel",
        price: 4.99,
        category: "Pretzel"
    },
    {
        id: 9,
        name: "Butter Pecan Ice Cream",
        price: 2.99,
        category: "Ice Cream"
    },
    {
        id: 10,
        name: "Rocky Road Ice Cream",
        price: 2.99,
        category: "Ice Cream"
    },
    {
        id: 11,
        name: "Vanilla Macarons (5 Pack)",
        price: 11.99,
        category: "Macaron"
    },
    {
        id: 12,
        name: "Lemon Cupcakes (4 Pack)",
        price: 12.99,
        category: "Cupcake"
    }
];
// inser into html
products.forEach(
    // object destructuring 
    ({ name, id, price, category }) => {
        dessertCards.innerHTML += `
       <div class = "dessert-card">
       <h2>${name}</h2>
       <p class="dessert-price">$${price}</p>
       <p class="product-category">Category: ${category}</p>
    <button  id="${id}" class="btn add-to-cart-btn">Add to cart</button>
       </div>
        `;
    }
);

/* 
TODO: class methods and instance methods.

Class syntax


1. A class is like a blueprint or template to create objects with the same
 structure and behavior.
2. The constructor() is a special function that runs automatically when you create
 a new object from the class using new.
3. this.items = [] creates an array to store cart items (like products added by the user). 
   this refers to the current object
4. Functions inside a class are called methods.
   They define what the object can do.
   You don't need the "function" keyword inside a class.
 */
class ShoppingCart { //Defining a class (blueprint) to make shopping cart objects.
    constructor() { //This runs automatically when you create a new cart.
        this.items = []; //	Initializes an empty list of cart items.
        this.total = 0; //	Starts the cart total at zero.
        this.taxRate = 8.25; //Sets the default tax rate to 8.25%
    }

    addItem(id, products) { // Method to add products in cart
        const product = products.find((item) => item.id === id); // find the product user wants to add
        const { name, price } = product; // destructuring to extract from product
        this.items.push(product); // push product to array
        const totalCountPerProduct = {}; //total count of each product

        this.items.forEach((dessert) => {
            totalCountPerProduct[dessert.id] = (totalCountPerProduct[dessert.id] || 0) + 1;
        }) // loop to add totla counts of each product

        // update the display with the new product the user added. 
        const currentProductCount = totalCountPerProduct[product.id];
        const currentProductCountSpan = document.getElementById(`product-count-for-id${id}`);

        currentProductCount > 1 ? currentProductCountSpan.textContent = `${currentProductCount}x` :
            productsContainer.innerHTML += `
       <div class="product" id= "dessert${id}">
          <p><span class="product-count" id ="product-count-for-id${id}"></span>${name}</p>
       <p >${price}</p>
       </div>
       `;
    }

    getCounts() {
        return this.items.length;
    }

    calculateTotal() {
        const subTotal = this.items.reduce((total, item) => total + item.price, 0);
        const tax = this.calculateTaxes(subTotal);
        this.total = subTotal + tax;
        cartSubTotal.textContent = `$${subTotal.toFixed(2)}`;
        cartTaxes.textContent = `$${tax.toFixed(2)}`;
        cartTotal.textContent = `$${this.total.toFixed(2)}`;
        return this.total;
    }
    calculateTaxes(amount) {
        return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
    }

clearCart() {
  if (!this.items.length) {
    alert("Your shopping cart is already empty");
    return;
  }

  confirmDiv.style.display = 'block';

  const handleYes = () => {
    this.items = [];
    this.total = 0;
    productsContainer.innerHTML = "";
    totalNumberOfItems.textContent = 0;
    cartSubTotal.textContent = 0;
    cartTaxes.textContent = 0;
    cartTotal.textContent = 0;
    confirmDiv.style.display = 'none';

    yesButton.removeEventListener('click', handleYes);
    noButton.removeEventListener('click', handleNo);
  };

  const handleNo = () => {
    confirmDiv.style.display = 'none';

  
    yesButton.removeEventListener('click', handleYes);
    noButton.removeEventListener('click', handleNo);
  };

  yesButton.addEventListener('click', handleYes);
  noButton.addEventListener('click', handleNo);
}


};

//instantiate a new shopping cart Object
const cart = new ShoppingCart();

// get all of the Add to cart 
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");

[...addToCartBtns].forEach(
    (btn) => {
        btn.addEventListener('click', (event) => {
            cart.addItem(parseInt(event.target.id), products);
            totalNumberOfItems.textContent = cart.getCounts();
            cart.calculateTotal();
        })
    });

cartBtn.addEventListener("click", () => {
    isCartShowing = !isCartShowing;
    showHideCartSpan.textContent = isCartShowing ? "Hide" : "Show";
    cartContainer.style.display = isCartShowing ? "block" : "none"

});

clearCartBtn.addEventListener('click', cart.clearCart.bind(cart));



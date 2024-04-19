let cart = [];

function changeAmongusSize() {
   let amongus = document.getElementById("amongus");
   amongus.width = Math.random();
   amongus.height = Math.random();
}

$(".AddToCartButton").each(function() {
   $(this).click(addItemToCart);
})

function updateCart(item) {
    let foodItems = $("#foodItems");
    foodItems.append(item);
}

function addItemToCart() {
    let foodItemValue = $(this).attr('value');
    cart.push(foodItemValue);
    console.log(foodItemValue);
    updateCart(foodItemValue)
}

function logVal() {
      console.log($(this).attr('value'));
}


//get the modal
let modal = document.getElementById("myModal");

//get the button
let btn = document.getElementById("viewCartButton");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    if (cart.length > 0) {
        modal.style.display = "block";
    }
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

changeAmongusSize()
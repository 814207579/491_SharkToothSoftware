$(document).ready(function() {

  // Function to retrieve cart items from local storage (adapt if using a different storage method)
  function getCartItems() {
    let cartItems = localStorage.getItem("cartItems");
    return cartItems ? JSON.parse(cartItems) : [];
  }

  // 1. Display Order Summary
  let cartItems = getCartItems();
  let totalPrice = 0;

  cartItems.forEach(item => {
    let itemElement = `
      
        
        
          ${item.name} 
          $${item.price} x ${item.quantity} 
        
      
    `;
    $("#cart-items").append(itemElement);
    totalPrice += item.price * item.quantity;
  });

  $("#total-price").text(totalPrice.toFixed(2));

  // 2. Form Validation (using jQuery Validation plugin - make sure to include the library)
  $("#checkout-form").validate({
    rules: {
      name: "required",
      email: {
        required: true,
        email: true
      },
      phone: {
        required: true,
        // Add phone number validation rules as needed
      },
      address: "required"
    },
    messages: {
      // ... add custom error messages if desired
    }
  });

  // 3. Order Submission
  $("#checkout-form").submit(function(event) {
    event.preventDefault();

    if ($(this).valid()) {
      let orderData = {
        name: $("#name").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        address: $("#address").val(),
        items: cartItems,
        totalPrice: totalPrice
      };

      $.ajax({
        url: "/process_order", // Replace with your backend endpoint
        method: "POST",
        data: JSON.stringify(orderData), // Send data as JSON
        contentType: "application/json",
        success: function(response) {
          // Handle successful order submission
          // e.g., clear cart, redirect to a confirmation page
          console.log("Order placed successfully:", response);
        },
        error: function(error) {
          // Handle errors
          console.error("Order submission error:", error);
        }
      });
    }
  });
});
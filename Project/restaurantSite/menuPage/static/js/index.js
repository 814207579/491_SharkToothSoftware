    let iconCart = document.querySelector('.icon-cart');
    let closeCart = document.querySelector('.close');
    let body = document.querySelector('body');
    let listCartHTML = document.querySelector('.listCart');
    let iconCartSpan = document.querySelector('.icon-cart span');
    let clearCart = document.querySelector('.clearCart');
    let navBarUl = document.getElementById("navBarUl");
    let checkOut = document.querySelector('.checkOut');
    let listProducts = [];
    let carts = [];

    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart')
    })
    closeCart.addEventListener('click', () => {
        body.classList.toggle('showCart')
    })
    clearCart.addEventListener('click', () => {
        clearItemsInCart();
    })
    // checkOut.addEventListener('click', () => {
    //     //CHeck if items are in cart
    //     if(carts.length <= 0){
    //         alert('No items in cart');
    //     } else {
    //         clearItemsInCart();
    //         alert('Thank you for your purchase');
    //     }
    // })

    document.addEventListener('DOMContentLoaded', function() {
        const cartTab = document.querySelector('.cartTab');
        const openCartButton = document.querySelector('.icon-cart');
        const closeCartButton = document.querySelector('.close');
        const body = document.querySelector('body');
    
        openCartButton.addEventListener('click', function() {
            body.classList.add('showCart');
        });
    
        closeCartButton.addEventListener('click', function() {
            body.classList.remove('showCart');
        });
    
        // Close the cart when clicking outside of it
        //FIXME: Have cart not close when adding items to cart or on checkout
        window.addEventListener('click', function(event) {
            if (!cartTab.contains(event.target) && !openCartButton.contains(event.target) && !checkOut.contains(event.target) && !clearCart.contains(event.target)) {
                body.classList.remove('showCart');
            }
        });
    });


    //init for filling listProduct objects based on database
    function fillProducts() {
        let productArr = [];
        //get all products from div
        let foodList = $(".listProduct").find("div.item");

        for (let i = 0; i < foodList.length; i++) {
            let currObject = {};
            //set ID
            currObject.id = $(foodList[i]).find(".idField").val().trim();
            //set name
            currObject.name = $(foodList[i]).find('.foodName').text().trim();
            //set price
            currObject.price = $(foodList[i]).find('.foodPrice').text().trim().replace("$","");
            //set description
            currObject.description = $(foodList[i]).find('.foodDescription').text().trim();
            //set image link
            currObject.image = $(foodList[i]).find('img.image.foodImage').attr('src');
            productArr.push(currObject);
        }

        return productArr;
    }

    //add To Cart Function
    $(".addCart").on("click", function() {
        let product_id = $(this).closest('.item').find('.idField').val().trim();
        addToCart(product_id);
    });

    function getProductByID(product_id) {
        //console.log("ID:", product_id);
        //console.log(listProducts)
        return listProducts.find(obj => obj.id === product_id);
    }

    function getTotalPrice() {
        let totalPrice = 0
        for (let i = 0; i < carts.length; i++) {
            totalPrice += carts[i].total;
        }

        return totalPrice;
    }

    const addToCart = (product_id) => {
        let positionThisProductInCart = carts.findIndex((value) => value.product_id === product_id);
        if(carts.length <= 0){
            carts = [{
                product_id: product_id,
                quantity: 1
            }]
        }else if(positionThisProductInCart < 0){
            carts.push({
                product_id: product_id,
                quantity: 1
            });
        }else{
            carts[positionThisProductInCart].quantity += 1;
        }
        addCartToHTML();
        addCartToMemory();
    }

    const addCartToMemory = () => {
        localStorage.setItem('cart', JSON.stringify(carts));
    }

    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        let totalPrice = 0;

        if(carts.length > 0){
            carts.forEach(cart => {
                totalQuantity = totalQuantity + cart.quantity;
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.dataset.id = cart.product_id;
                let positionProduct = listProducts.findIndex(value => value.id === cart.product_id);
                let info = listProducts[positionProduct];

                let itemTotalPrice = info.price * cart.quantity;
                totalPrice += itemTotalPrice;

                newCart.innerHTML =
                    `<div class="image">
                        <img src="${info.image}" alt="Error: Image Not Found">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    
                    <div class="quantity">
                        <span class="minus">-</span>
                        <input type="number" class="quantity-input" min="1" max="99" value="${cart.quantity}" />
                        <span class="plus">+</span>
                    </div>
                    <div class="totalPrice">$${itemTotalPrice.toLocaleString()}</div>
                `;
                listCartHTML.appendChild(newCart);
            })
        }
        iconCartSpan.textContent = totalQuantity;

        document.querySelector('.totalPriceAllItems').textContent = `Total: $${totalPrice.toLocaleString()}`;
        document.querySelector('.totalQuantityAllItems').textContent = `Items: ${totalQuantity}`;
    }

    listCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
            let product_id = positionClick.parentElement.parentElement.dataset.id;
            let type = 'minus';
            if(positionClick.classList.contains('plus')){
                type = 'plus';
            }
            changeQuantity(product_id, type);
        }
    })
    // Existing blur event listener
    listCartHTML.addEventListener('blur', (event) => {
        if (event.target.classList.contains('quantity-input')) {
            const product_id = event.target.parentElement.parentElement.dataset.id;
            let newQuantity = event.target.value.trim();

            // Validate the input: Only allow numbers
            if (!/^\d+$/.test(newQuantity)) {
                // If the input is not a valid number, reset to the previous quantity or default to 1
                const currentItem = carts.find(item => item.product_id === product_id);
                event.target.value = currentItem ? currentItem.quantity : 1;
                return;
            }

            newQuantity = parseInt(newQuantity, 10) || 0;

            // Update the quantity in the cart
            changeQuantity(product_id, 'input', newQuantity);
        }
    }, true);

    // New keydown event listener to handle "Enter" key
    listCartHTML.addEventListener('keydown', (event) => {
        if (event.target.classList.contains('quantity-input') && event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission or behavior
            const product_id = event.target.parentElement.parentElement.dataset.id;
            let newQuantity = event.target.value.trim();

            // Validate the input: Only allow numbers
            if (!/^\d+$/.test(newQuantity)) {
                // If the input is not a valid number, reset to the previous quantity or default to 1
                const currentItem = carts.find(item => item.product_id === product_id);
                event.target.value = currentItem ? currentItem.quantity : 1;
                return;
            }

            newQuantity = parseInt(newQuantity, 10) || 0;

            // Update the quantity in the cart
            changeQuantity(product_id, 'input', newQuantity);
        }
    })


    const changeQuantity = (product_id, type, newQuantity = 1) => {
        let positionItemInCart = carts.findIndex((value) => value.product_id === product_id);
        if (positionItemInCart >= 0) {
            switch (type) {
                case 'plus':
                    carts[positionItemInCart].quantity += 1;
                    break;
                case 'input':
                    if (newQuantity > 0) {
                        carts[positionItemInCart].quantity = newQuantity;
                    } else {
                        carts.splice(positionItemInCart, 1); // Remove item if quantity is 0
                    }
                    break;
                default:
                    let valueChange = carts[positionItemInCart].quantity - 1;
                    if (valueChange > 0) {
                        carts[positionItemInCart].quantity = valueChange;
                    } else {
                        carts.splice(positionItemInCart, 1);
                    }
                    break;
            }
        }
        addCartToMemory();
        addCartToHTML();
    }


    const clearItemsInCart = () => {
        carts = [];
        addCartToHTML();
        addCartToMemory()
    }

    function getCheckoutItems(event) {
        //console.log(carts);
        event.preventDefault()

        //loop over each cart item
        for(let i = 0; i < carts.length; i++) {
            carts[i].total = carts[i].quantity * getProductByID(carts[i].product_id).price;
        }

        //console.log(carts);
    }

    function clearFoodItemsFiler() {
        let foodList = $(".listProduct").find("div.item");
        for (let i = 0; i < foodList.length; i++) {
            $(foodList[i]).show()
        }
        for (let i = 0; i < $(navBarUl).children().children().length; i++) {
            $($(navBarUl).children().children()[i]).css("box-shadow", "none")
        }
    }

    //Navbar underline
    const navLinks = document.querySelectorAll('.navbar ul li a.navBarSort');
    const underline = document.querySelector('.underline');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 1. Remove 'active' class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // 2. Add 'active' class to the clicked link
            this.classList.add('active');

            // 3. Position underline
            const linkRect = this.getBoundingClientRect();
            underline.style.left = linkRect.left + 'px';
            underline.style.width = linkRect.width + 'px';

            filterItems(event);
        });
    });

    function filterItems(event) {
        // prevent default behavior of the anchor tag
        event.preventDefault();
        //Only do this if the <a> tags are clicked
        if (!$(event.target).hasClass("navBarSort") || !$(event.target).is("a")) {
            return
        }
        //Get clicked item
        let clickedItem = $(event.target).text();
        //Navbar sort items
        let navBarSortItems = $(".navBarSort");
        //If the clickedItem ends with s we need to remove it
        if (clickedItem.toLowerCase().endsWith("s")) {
            clickedItem = clickedItem.slice(0, -1)
        }
        //find all products
        let foodList = $(".listProduct").find("div.item");

        //Var to know if we need to show or hide them
        let show = false;
        //Fix the show
        if ($(event.target).hasClass("Selected")) {
            show = true;
            // Remove all selected
            navBarSortItems.removeClass("Selected")
            navBarSortItems.attr('style', '');
        }

        //Functionality of showing/hiding
        for (let i = 0; i < foodList.length; i++) {
            let foodType = $(foodList[i]).find('.foodType').val().trim()
            if (show) {
                $(foodList[i]).show()
            }
            else {
                if (foodType === clickedItem) {
                    $(foodList[i]).show()
                }
                else {
                    $(foodList[i]).hide()
                }
            }
        }
    }

    const initApp = () => {
        //fill productsList
        listProducts = fillProducts();

        // get cart from memory
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
        
        navBarUl.onclick = filterItems;
        document.getElementById("checkoutBtn").onclick = getCheckoutItems;

    }
    initApp();
    document.addEventListener("DOMContentLoaded", function () {
    // Get all item cards
    const items = document.querySelectorAll(".listProduct .item");

    // Get the modal and elements inside it
    const modal = document.getElementById("itemModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const closeModal = document.querySelector('.close-modal-popup');

    // Function to open the modal
    function openModal(itemName, itemDescription) {
        modalTitle.textContent = itemName;
        modalDescription.textContent = itemDescription;
        modal.style.display = "block";
    }

    // Add click event listener to each card item
    items.forEach(function (item) {
        item.addEventListener("click", function (e) {
            // Prevent the click event if it is on the "Add To Cart" button
            if (e.target.classList.contains("addCart")) {
                return;
            }

            const itemName = item.querySelector(".foodName").textContent;
            const itemDescription = item.querySelector(".foodDescription").textContent;

            openModal(itemName, itemDescription);
            document.body.classList.add('no-scroll'); // Disable scroll on body
            
        });
    });

    // Close the modal when clicking the 'x' button
    closeModal.onclick = function () {
        modal.style.display = "none";
        document.body.classList.remove('no-scroll'); // Enable scroll on body
    };

    // Close the modal when clicking anywhere outside the modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.classList.remove('no-scroll'); // Enable scroll on body
        }
    };

    // Modal Elements
    const checkoutModal = document.getElementById('checkoutModal');
    const closeModalButton = document.querySelector('.close-modal');
    const zebraListContainer = document.querySelector('.zebra-list');
    const totalPriceElement = document.getElementById('totalPrice');
    const payNowButton = document.querySelector('.pay-now');
    const splitCardButton = document.getElementById("splitCartButton");
    const splitCartConfirmButton = document.getElementById("splitCartConfirm");
    const goBackButton = document.querySelector('.go-back');

    // Checkout Button Click Event
    checkOut.addEventListener('click', () => {
        if (carts.length <= 0) {
            alert('No items in cart');
        } else {
            populateCheckoutModal();
            checkoutModal.style.display = 'block';
            document.body.classList.add('no-scroll'); // Disable scroll on body
        }
    });

    // Close Modal Button Click Event
    closeModalButton.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
        document.body.classList.remove('no-scroll'); // Re-enable scroll on body
    });

    // Close Modal When Clicking Outside the Modal
    window.addEventListener('click', (event) => {
        if (event.target == checkoutModal) {
            checkoutModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    });

    // Function to Populate the Modal with Cart Items
    function populateCheckoutModal() {
        zebraListContainer.innerHTML = ''; // Clear previous content
        let totalPrice = 0;
        totalQuantity = 0;

        carts.forEach(cart => {
            const product = getProductByID(cart.product_id);
            const itemTotalPrice = product.price * cart.quantity;
            totalPrice += itemTotalPrice;
            totalQuantity += cart.quantity;

            // Create item element for the zebra list
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                <span>${product.name}</span>
                <span>$${product.price} x ${cart.quantity}</span>
            `;
            zebraListContainer.appendChild(itemElement);
        });

        // Update total price in the modal
        totalPriceElement.textContent = `$${totalPrice.toLocaleString()}`;
        document.getElementById('totalItemsCheckout').textContent = totalQuantity;
    }

    // Helper function to get CSRF token from cookie
    function getCSRFToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 10) === 'csrftoken=') {
                    cookieValue = cookie.substring(10);
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Pay Now Button Click Event
    payNowButton.addEventListener('click', () => {
        // for(let i = 0; i < carts.length; i++) {
        //     console.log(carts[i])
        // }

        const orderData = {
            table_number: 2,
            restaurant_id: "507f191e810c19729de860ee",
            items: carts
        };

        console.log(JSON.stringify(orderData))

        // Send order to backend
        fetch('place_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                    alert('Payment successful! Order ID: ' + data.order_id);
                checkoutModal.style.display = 'none';
                clearItemsInCart();
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            alert('Failed to create order: ' + error.message);
        });
    });

    // Go Back Button Click Event
    goBackButton.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });

    // Function that modifies the checkout modal to be used as the split cart function
    splitCardButton.addEventListener("click", event => {
        event.preventDefault();
        // Hyjacking the modal to be used by
        checkoutModal.innerHTML =
        '<div class="modal-checkout-content"> ' +
            '<span class="close-modal">&times;</span>' +
            '<h2>Checkout</h2>' +
            '<div class="split-cart-selection">' +
                '<span>How many times would you like to split the cart? </span>' +
                '<select id="splitCartSelect" class="split-modal-select">' +
                    '<option value="1">1</option>' +
                    '<option value="2">2</option>' +
                    '<option value="3">3</option>' +
                    '<option value="4">4</option>' +
                '</select>' +
                '<div class="modal-footer">' +
                    '<button id="splitCartConfirm" class="confirm button">Confirm</button>' +
                '</div>' +
            '</div>' +
        '</div>';
        document.getElementById("splitCartConfirm").onclick = splitCartModalUpdate
    })

    // Function that changes the button as well as moves back to the main checkout
    function updateSplitPayButtonText(event) {
        let totalPayments = document.getElementById("totalNumberOfPayments").value;
        let payButton = document.getElementById("payButtonValue");
        alert("Thank you for paying Person " + payButton.value);
        console.log(totalPayments)
        if (payButton.value < totalPayments) {
            payButton.value = Number(payButton.value) + 1;
            document.getElementById("payButtonClick").innerHTML = "Person " + payButton.value + " Pay";
            document.getElementById("payButtonValue").value = payButton.value
        }
        // Change the modal back to normal
        else {
            alert("Thank you for your purchase.");
            clearItemsInCart();
            location.reload();
        }
    }

    // Updates the cart to be the split up cart
    function splitCartModalUpdate() {
        let selectionBoxElement = document.getElementById("splitCartSelect");
        let selectionBoxVal = Number($(selectionBoxElement).val());
        // Starts at 1 because there's no "person 0"
        let currentPerson = 1;
        //keeps track of if everyone has paid
        let buildString =
            '<div class="modal-checkout-content"> ' +
                '<span class="close-modal">&times;</span>' +
                '<h2>Checkout</h2>' +
                '<div class="zebra-list">';

        for(let i = 0; i < selectionBoxVal; i++) {
            buildString += '<div>'+
                                '<span>' +
                                    'Person ' + Number(i + 1) +
                                '</span>' +
                                '<span>' +
                                    'Cost' + ': $' + (getTotalPrice() / selectionBoxVal).toLocaleString() +
                                '</span>' +
                           '</div>';
        }

        buildString += '</div>' +
                '<div class="total-footer">' +
                    '<span id="totalItems" class="totalQuantityAllItems">Items: 0</span> '+
                    '<span id="totalPrice" class="totalPriceAllItems">Total: $0</span> '+
                '</div>' +
                '<div class="modal-footer">' +
                    '<input id="payButtonValue" type="hidden" value="' + currentPerson + '"/>' +
                    '<input id="totalNumberOfPayments" type="hidden" value="' + selectionBoxVal + '"/>' +
                    '<button id="payButtonClick" class="pay-now">Person ' + currentPerson + ' Pay</button>' +
                '</div>' +
            '</div>';

        checkoutModal.innerHTML = buildString;
        document.getElementById("totalPrice").innerHTML = `$${getTotalPrice().toLocaleString()}`;
        let tempItems = 0;
        for (let i = 0; i < carts.length; i++) {
            tempItems += carts[i].quantity;
        }
        document.getElementById("totalItems").innerHTML = "Items: " + tempItems;
        document.getElementById("payButtonClick").onclick = updateSplitPayButtonText;
    }
});

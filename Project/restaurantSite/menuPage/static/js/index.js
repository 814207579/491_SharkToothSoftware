    let iconCart = document.querySelector('.icon-cart');
    let closeCart = document.querySelector('.close');
    let body = document.querySelector('body');
    let listCartHTML = document.querySelector('.listCart');
    let iconCartSpan = document.querySelector('.icon-cart span');
    let clearCart = document.querySelector('.clearCart');
    let navBarUl = document.getElementById("navBarUl");
    let checkOut = document.querySelector('.checkOut');
    let checkoutModal = document.getElementById('checkoutModal');
    // Modal Elements
    const zebraListContainer = document.querySelector('.zebra-list');
    const totalPriceElement = document.getElementById('totalPrice');
    //Navbar underline
    const navLinks = document.querySelectorAll('.navbar ul li a.navBarSort');
    const underline = document.querySelector('.underline');
    let listProducts = [];
    let carts = [];
    let storedModel = "";


    // Credit Card Checking methods
    // Used from: https://www.geeksforgeeks.org/program-credit-card-number-validation/

    // card is valid or not.

    // Return this number if it is a single digit, otherwise,
    // return the sum of the two digits
    function getDigit(number) {
        if (number < 9) {
            return number;
        }
        return Math.floor(number / 10) + number % 10;
    }

    // Return the number of digits in d
    function getSize(d) {
        let num = d.toString();
        return num.length;
    }

    // Return the first k number of digits from
    // number. If the number of digits in number
    // is less than k, return number.
    function getPrefix(number,k) {
        if (getSize(number) > k) {
            let num = number.toString();
            return parseInt(num.substring(0, k));
        }
        return number;
    }

    // Return true if the digit d is a prefix for number
    function prefixMatched(number,d) {
        return getPrefix(number, getSize(d)) === d;
    }

    // Get the result from Step 2
    function sumOfDoubleEvenPlace(number) {
        let sum = 0;
        let num = number.toString() ;
        for (let i = getSize(number) - 2; i >= 0; i -= 2){
            sum += getDigit((num.charCodeAt(i) - '0'.charCodeAt(0)) * 2);
        }
        return sum;
    }

    // Return sum of odd-place digits in number
    function sumOfOddPlace(number) {
        let sum = 0;
        let num = number.toString();
        for (let i = getSize(number) - 1; i >= 0; i -= 2) {
            sum += num.charCodeAt(i) - '0'.charCodeAt(0);
        }
        return sum;
    }

    // Return true if the card number is valid
    function isValid(number) {
    return (getSize(number) >= 13 && getSize(number) <= 16) &&
        (prefixMatched(number, 4) ||
         prefixMatched(number, 5) ||
         prefixMatched(number, 37) ||
         prefixMatched(number, 6)) &&
        ((sumOfDoubleEvenPlace(number) + sumOfOddPlace(number)) % 10 === 0);
    }

    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart')
    })
    closeCart.addEventListener('click', () => {
        body.classList.remove('showCart')
    })
    clearCart.addEventListener('click', () => {
        clearItemsInCart();
    })

    //FIXME: Create an animation where the card would slide in and out the side of the window
    //FIXME: Substitue instances of toggle('showCart') with a custom function that would slide the card in and out

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
        if(carts.length <= 0) {
            carts = [{
                product_id: product_id,
                quantity: 1
            }]
        }
        else if(positionThisProductInCart < 0){
            carts.push({
                product_id: product_id,
                quantity: 1
            });
        }
        else {
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
				let quantityButtonsHTML = '';
                if (cart.quantity > 1) {
                    quantityButtonsHTML = `
                        <span class="minus">-</span>
                        <input type="number" class="quantity-input" min="1" value="${cart.quantity}" />
                        <span class="plus">+</span>
                    `;
                }
				else {
                    quantityButtonsHTML = `
                        <span class="delete">🗑️</span>
                        <input type="number" class="quantity-input" min="1" value="${cart.quantity}" />
                        <span class="plus">+</span>
                    `;
                }


                newCart.innerHTML =
                    `<div class="image">
                        <img src="${info.image}" alt="Error: Image Not Found">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    
                    <div class="quantity">
                         ${quantityButtonsHTML}
                    </div>
                    <div class="totalPrice">$${itemTotalPrice.toLocaleString()}</div>
                `;
                listCartHTML.appendChild(newCart);
            })
        }
        iconCartSpan.textContent = totalQuantity;

		 // validation for the manual input of items in the text box
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('input', function() {
                let value = parseInt(this.value);
                // default to 99 if the user tries to add more
                if (value > 99) {
                    this.value = 99;
                }
            });
        });


        document.querySelector('.totalPriceAllItems').textContent = `Total: $${totalPrice.toLocaleString()}`;
        document.querySelector('.totalQuantityAllItems').textContent = `Items: ${totalQuantity}`;
    }

    listCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
            let product_id = positionClick.parentElement.parentElement.dataset.id;
            let type = 'minus';
            if (positionClick.classList.contains('plus')){
                type = 'plus';
            }
            changeQuantity(product_id, type);
        }
		else if (positionClick.classList.contains('delete')) {
				let product_id = positionClick.parentElement.parentElement.dataset.id;
				removeItemFromCart(product_id);
			}
		});
		const removeItemFromCart = (product_id) => {
			let positionItemInCart = carts.findIndex((value) => value.product_id === product_id);
			if (positionItemInCart >= 0) {
				carts.splice(positionItemInCart, 1); // Remove the item
				addCartToMemory();
				addCartToHTML();
			}
		};
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
                    newQuantity = carts[positionItemInCart].quantity + 1;
                    if (newQuantity < 100) {
                        carts[positionItemInCart].quantity = newQuantity;
                    } else {
                        carts[positionItemInCart].quantity = 99;
                    }
                    break;
                case 'input':
                    if (newQuantity > 0) {
                        carts[positionItemInCart].quantity = newQuantity;
                    }
                    else {
                        carts.splice(positionItemInCart, 1); // Remove item if quantity is 0
                    }
                    break;
                default:
                    let valueChange = carts[positionItemInCart].quantity - 1;
                    if (valueChange > 0) {
                        carts[positionItemInCart].quantity = valueChange;
                    }
                    else {
                        carts.splice(positionItemInCart, 1);
                    }
                    break;
            }
        }
        addCartToMemory();
        addCartToHTML();
    }


    function clearItemsInCart() {
        carts = [];
        addCartToHTML();
        addCartToMemory()
    }

    function getCheckoutItems(event) {
        event.preventDefault()

        //loop over each cart item
        for(let i = 0; i < carts.length; i++) {
            carts[i].total = carts[i].quantity * getProductByID(carts[i].product_id).price;
        }
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

    function sendOrderToDB(tableNumber) {
        const orderData = {
            table_number: tableNumber,
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

    // GENERATING QR CODES AND TABLE NUMBERS
    function generateQRCode(tableNumber) {
        const qrCodeDiv = document.getElementById('qrcode');
        qrCodeDiv.innerHTML=""; // clear any existing QR code
        new QRCode(qrCodeDiv, {
            text: `http://127.0.0.1:8000/menuPage?table=${tableNumber}`,
            width: 128,
            height: 128,
        });
    }

    // Generate QR code for Table 1
    generateQRCode(1);

    function getTableNumberFromURL(){
        const urlParams = new URLSearchParams(window.location.search);
        const tableNumber = urlParams.get('table');  // get 'table' parameter from URL
        return tableNumber ? parseInt(tableNumber) : null; // return as integer or null 
    }

    function updateTableNumberDisplay(){
        const tableNumber = getTableNumberFromURL();
        if (tableNumber) {
            const tableNumberDisplay = document.getElementById('table-number-display');
            tableNumberDisplay.textContent = tableNumber;
        }
    }

    function initButtons() {
        const payNowButton = document.querySelector('.pay-now');
        const splitCardButton = document.getElementById("splitCartButton");
        const goBackButton = document.querySelector('.go-back');
        const closeModalButton = document.querySelector('.close-modal');


        // Pay Now Button Click Event
        payNowButton.addEventListener('click', () => {
            const tableNumber = getTableNumberFromURL();
            if (tableNumber) {
                sendOrderToDB(tableNumber);
            } else {
                alert("Table number not found!");
            }
            // sendOrderToDB(2);
        });

        // Close Modal Button Click Event
        closeModalButton.addEventListener('click', () => {
            console.log("test");
            checkoutModal.style.display = 'none';
            document.body.classList.remove('no-scroll'); // Re-enable scroll on body
        });

        // Go Back Button Click Event
        goBackButton.addEventListener('click', () => {
            checkoutModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        });

        // Function that modifies the checkout modal to be used as the split cart function
        splitCardButton.addEventListener("click", event => {
            event.preventDefault();
            // Hijacking the modal to be used by
            checkoutModal.innerHTML =
            '<div class="modal-checkout-content"> ' +
                '<span id="closeModal" class="close-modal">&times;</span>' +
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
            const closeModalButton = document.getElementById('closeModal');
            // Close Modal Button Click Event
            closeModalButton.addEventListener('click', () => {
                checkoutModal.style.display = 'none';
                document.body.classList.remove('no-scroll'); // Re-enable scroll on body
            });
        })
    }

    // Function that changes the button as well as moves back to the main checkout
    function updateSplitPayButtonText(event) {
        let totalPayments = document.getElementById("totalNumberOfPayments").value;
        let payButton = document.getElementById("payButtonValue");
        alert("Thank you for paying Person " + payButton.value);
        if (payButton.value < totalPayments) {
            payButton.value = Number(payButton.value) + 1;
            document.getElementById("payButtonClick").innerHTML = "Person " + payButton.value + " Pay";
            document.getElementById("payButtonValue").value = payButton.value
        }
        // Change the modal back to normal
        else {
            sendOrderToDB(2);
            alert("Thank you for your purchase.");
            clearItemsInCart();
        }
    }

    const initApp = () => {

        // update table number displau when the page loads
        document.addEventListener('DOMContentLoaded', updateTableNumberDisplay);

        //fill productsList
        listProducts = fillProducts();

        // get cart from memory
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
        navBarUl.onclick = filterItems;
        document.getElementById("checkoutBtn").onclick = getCheckoutItems;

        // Get the modal and elements inside it
        const items = document.querySelectorAll(".listProduct .item");
        const modal = document.getElementById("itemModal");
        const modalTitle = document.getElementById("modalTitle");
        const modalDescription = document.getElementById("modalDescription");
        const closeModal = document.querySelector('.close-modal-popup');

        // Close the modal when clicking the 'x' button
        closeModal.onclick = function () {
            modal.style.display = "none";
            document.body.classList.remove('no-scroll'); // Enable scroll on body
        };
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
                document.body.classList.remove('no-scroll'); // Enable scroll on body
            }
        }
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


        // Checkout Button Click Event
        checkOut.addEventListener('click', () => {
            if (carts.length <= 0) {
                alert('No items in cart');
            }
            else {
                if (storedModel !== "") {
                    $(document.getElementById("checkoutModal")).replaceWith(storedModel);
                }
                populateCheckoutModal();
                initButtons()
                checkoutModal.style.display = 'block';
                checkoutModal = document.getElementById('checkoutModal');
                document.body.classList.add('no-scroll'); // Disable scroll on body
                storedModel = $(document.getElementById("checkoutModal")).clone(true)
            }
        });

        // Function to Populate the Modal with Cart Items
        function populateCheckoutModal() {
            zebraListContainer.innerHTML = ''; // Clear previous content
            let totalPrice = 0;
            let totalQuantity = 0;

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

        // Close the cart when clicking outside of it
        window.addEventListener('click', function(event) {
            // Closes modal
            if (event.target === checkoutModal) {
                checkoutModal.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
            const body = document.querySelector('body');
            // Checking to make sure outside the cart is clicked
            if (!$(iconCart).find("*").toArray().includes(event.target) &&
                !$(document.getElementById("cartModal")).find("*").toArray().includes(event.target) &&
                // These are the plus/minus since they don't want to work
                !event.target.classList.contains("plus") && !event.target.classList.contains("minus")) {
                    body.classList.remove('showCart')
            }
        });
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
                '<span id="closeModal" class="close-modal">&times;</span>' +
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
        const closeModalButton = document.getElementById('closeModal');
        // Close Modal Button Click Event
        closeModalButton.addEventListener('click', () => {
            checkoutModal.style.display = 'none';
            document.body.classList.remove('no-scroll'); // Re-enable scroll on body
        });
        document.getElementById("totalPrice").innerHTML = `$${getTotalPrice().toLocaleString()}`;
        let tempItems = 0;
        for (let i = 0; i < carts.length; i++) {
            tempItems += carts[i].quantity;
        }
        document.getElementById("totalItems").innerHTML = "Items: " + tempItems;
        document.getElementById("payButtonClick").onclick = updateSplitPayButtonText;
    }

    document.addEventListener("DOMContentLoaded", function () {
        initApp();
    });


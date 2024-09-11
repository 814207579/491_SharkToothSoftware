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
    checkOut.addEventListener('click', () => {
        //CHeck if items are in cart
        if(carts.length <= 0){
            alert('No items in cart');
        } else {
            clearItemsInCart();
            alert('Thank you for your purchase');
        }
    })


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
                    <div class="totalPrice">$${itemTotalPrice}</div>
                    <div class="quantity">
                        <span class="minus">-</span>
                        <span>${cart.quantity}</span>
                        <span class="plus">+</span>
                    </div>`;
                listCartHTML.appendChild(newCart);
            })
        }
        iconCartSpan.textContent = totalQuantity;

        document.querySelector('.totalPriceAllItems').textContent = `$${totalPrice}`;
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

    const changeQuantity = (product_id, type) => {
        let positionItemInCart = carts.findIndex((value) => value.product_id === product_id)
        if(positionItemInCart >= 0){
            switch(type){
                case 'plus':
                    carts[positionItemInCart].quantity += 1;
                    break;

                default:
                    let valueChange = carts[positionItemInCart].quantity - 1;
                    if(valueChange > 0){
                        carts[positionItemInCart].quantity = valueChange;
                    } else{
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

        console.log(carts);
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

    function filterItems(event) {
        // prevent default behavior of the anchor tag
        event.preventDefault();
        //Only do this if the <a> tags are clicked
        if (!$(event.target).is("a")) {
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
        if (!show) {
            navBarSortItems.removeClass("Selected")
            navBarSortItems.attr('style', '');
            $(event.target).addClass("Selected")
            $(event.target).css("box-shadow", "0px 10px 0px green");
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
    const closeModal = document.getElementsByClassName("close")[0];

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
        });
    });

    // Close the modal when clicking the 'x' button
    closeModal.onclick = function () {
        modal.style.display = "none";
    };

    // Close the modal when clicking anywhere outside the modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});

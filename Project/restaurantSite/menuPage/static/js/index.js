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
        //Add your checkout link here
        clearItemsInCart();
        alert('Thank you for your purchase');
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
                    <div class="totalPrice">$
                        ${info.price * cart.quantity}
                    </div>
                    <div class="totalPrice">$${itemTotalPrice}</div>
                    <div class="quantity">
                        <span class="minus"><</span>
                        <span>${cart.quantity}</span>
                        <span class="plus">></span>
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

    function filterItems(event) {
        // prevent default behavior of the anchor tag
        event.preventDefault();
        // get clicked item
        let clickedItem = $(event.target).text();
        //find all products
        let foodList = $(".listProduct").find("div.item");
        for (let i = 0; i < foodList.length; i++) {
            let foodType = $(foodList[i]).find('.foodType').val().trim()
            if (clickedItem === "Drinks") {
                if (foodType !== "Drink") {
                    $(foodList[i]).hide();
                }
                else {
                    $(foodList[i]).show()
                }
            }
            else if (clickedItem === "Dessert") {
                if (foodType !== "Dessert") {
                    $(foodList[i]).hide();
                }
                else {
                    $(foodList[i]).show()
                }
            }
            else if (clickedItem === "Food"){
                if (foodType !== "Food") {
                    $(foodList[i]).hide();
                }
                else {
                    $(foodList[i]).show();
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

    }
    initApp();
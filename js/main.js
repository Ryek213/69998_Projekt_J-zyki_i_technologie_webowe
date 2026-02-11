const cartName = "cart"

localStorage.setItem(cartName, undefined);

function getCart() {
        const cart = localStorage.getItem(cartName);
        return cart && cart !== 'undefined' ? JSON.parse(cart) : [];
}

function saveCart(cart) {
        localStorage.setItem(cartName, JSON.stringify(cart));
}

function addToCartById(product_id) {
        console.log("cart")
        const cart = getCart();
        console.log(cart)

        const item = cart.find(x => x.id === product_id);
        if (item) {
                item.quantity += 1;
        } else {
                cart.push({ id: product_id, quantity: 1 });
        }

        saveCart(cart);
}

function removeFromCartById(product_id) {
        const cart = getCart();
        const updatedCart = cart.filter(item => item.id !== product_id);
        saveCart(updatedCart);
}

function updateQuantity(product_id, quantity) {
        const cart = getCart();
        const item = cart.find(x => x.id === product_id);
        if (item) {
                item.quantity = quantity;
                saveCart(cart)
        }
}
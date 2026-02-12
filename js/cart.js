const container = document.getElementById('products-container');

async function renderCart() {
        container.innerHTML = '';

        products = currentUser ? await getCart(currentUser.id) : [];

        console.log(products)
        if (products.length === 0) {
                container.innerHTML = '<p>Koszyk jest pusty</p>';
                return;
        }

        let totalPrice = 0;

        products.forEach(product => {
                const card = document.createElement("div");
                card.classList.add("product-card");

                const img_wrapper = card.appendChild(
                        Object.assign(document.createElement('div'), {
                                id: 'img-wrapper'
                        })
                )
                img_wrapper.appendChild(
                        Object.assign(document.createElement('img'), {
                                src: product.image,
                                alt: product.title
                        })
                )
                const content = card.appendChild(
                        Object.assign(document.createElement('div'), {
                                id: 'content'
                        })
                )
                content.appendChild(
                        Object.assign(document.createElement('h3'), {
                                textContent: product.title
                        })
                )
                content.appendChild(
                        Object.assign(document.createElement('p'), {
                                textContent: `${product.quantity}x, ${product.price} zł`
                        })
                )
                const remove_button = content.appendChild(
                        Object.assign(document.createElement('button'), {
                                textContent: 'Usuń'
                        })
                )

                remove_button.classList.add('default-button');

                remove_button.addEventListener('click', async () => {
                        await removeFromCart(currentUser.id, product.id);
                        renderCart();
                })

                container.appendChild(card);

                totalPrice += product.price * product.quantity;
        })

        const summary = container.appendChild(
                Object.assign(document.createElement('div'), {
                        textContent: `Łączna cena: ${totalPrice.toFixed(2)} zł`
                })
        )
        summary.classList.add('cart-summary');
}

async function init() {
        renderCart();
}

init();
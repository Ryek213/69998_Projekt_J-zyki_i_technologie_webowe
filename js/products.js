const container = document.getElementById('products-container');
const searchBar = document.getElementById('search');
const categoriesFilter = document.getElementById("categories");

const allCategory = "all"

const products = {
        url: 'https://fakestoreapi.com/products',
        options: {
                method: 'GET'
        }
}

let allProducts
async function getData() {
        try {
                const response = await fetch(products.url, products.options);
                allProducts = await response.json();
        } catch (error) {
                console.error(error);
        }
}

async function fillCategories() {
        const categories = new Set();
        categories.add(allCategory)
        console.log(allProducts);
        allProducts.forEach(product => {
                categories.add(product.category)
        })

        for (const category of categories) {
                categoriesFilter.appendChild(
                        Object.assign(
                                document.createElement("option"),
                                {
                                        value: category,
                                        textContent: category
                                }
                        )
                );
        }
}

const filters = {
        search: "",
        category: allCategory
}

async function renderProducts() {
        const filtered = allProducts.filter((p) => {
                const matchSearch = p.title.toLowerCase().includes(filters.search);

                const matchFilter = 
                        filters.category === 'all' ||
                        p.category === filters.category

                return matchSearch && matchFilter
        } )

        container.innerHTML = "";
        filtered.forEach(product => {
                const card = document.createElement("div");
                card.classList.add("product-card");

                // console.log(product.image, product.title, product.price)
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
                                textContent: `$${product.price}`
                        })
                )
                const add_button = content.appendChild(
                        Object.assign(document.createElement('button'), {
                                textContent: 'Dodaj do koszyka'
                        })
                )

                add_button.addEventListener('click', () => {
                        addToCartById(product.id);
                });

                container.appendChild(card);
        });
}

async function init() {
        await getData();
        fillCategories();
        renderProducts();
}

init();

searchBar.addEventListener('input', e => {
        const value = e.target.value.toLowerCase();
        filters.search = value;
        renderProducts();
})

categoriesFilter.addEventListener('change', (e) => {
        const value = e.target.value;
        filters.category = value;
        renderProducts();
})
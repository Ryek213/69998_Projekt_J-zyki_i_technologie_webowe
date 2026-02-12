const supabase = {
        url: 'https://qrgrnvmhkwsyonhadyva.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ3Judm1oa3dzeW9uaGFkeXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NTQ1OTAsImV4cCI6MjA4NjQzMDU5MH0.Ulbh8gYv_z6VPB6sgN4bYVjEfhbMHGo-ZFSfpNly_38'
}

const cartName = 'cart';
const currentUserName = 'currentUser';

let currentUser = null;

async function getCart(userId) {
        console.log(userId)
        const response = await fetch(
                `${supabase.url}/rest/v1/user_product?user_id=eq.${userId}&select=*,products(*)`, 
                {
                        headers: {
                                "apikey": supabase.key,
                                "Authorization": `Bearer ${supabase.key}`
                        }
                }
        );
        if (!response.ok) throw new Error('Nie udało się pobrać koszyka');

        const data = await response.json();
        console.log(data)
        return data.map(item => ({
                id: item.products.id,
                title: item.products.title,
                price: item.products.price,
                image: item.products.image,
                quantity: item.quantity
        }));
}

async function addToCart(userId, productId, quantity = 1) {
        const response = await fetch(
                `${supabase.url}/rest/v1/user_product?user_id=eq.${userId}&product_id=eq.${productId}`, 
                {
                        headers: {
                                "apikey": supabase.key,
                                "Authorization": `Bearer ${supabase.key}`
                        }
                }
        );
        const data = await response.json();

        if (data.length > 0) {
                const quantityToSet = data[0].quantity + quantity;

                if (quantityToSet > 0) {
                        await fetch(
                                `${supabase.url}/rest/v1/user_product?user_id=eq.${userId}&product_id=eq.${productId}`, 
                                {
                                        method: 'PATCH',
                                        headers: {
                                                "apikey": supabase.key,
                                                "Authorization": `Bearer ${supabase.key}`,
                                                'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ quantity: data[0].quantity + quantity })
                                }
                        );
                } else {
                        removeFromCart(userId, productId);
                }
        } else {
                await fetch(
                        `${supabase.url}/rest/v1/user_product`, 
                        {
                                method: 'POST',
                                headers: {
                                        "apikey": supabase.key,
                                        "Authorization": `Bearer ${supabase.key}`,
                                        'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ user_id: userId, product_id: productId, quantity })
                        }
                );
        }
}

async function removeFromCart(userId, productId) {
        await fetch(
                `${supabase.url}/rest/v1/user_product?user_id=eq.${userId}&product_id=eq.${productId}`, 
                {
                        method: 'DELETE',
                        headers: {
                                "apikey": supabase.key,
                                "Authorization": `Bearer ${supabase.key}`
                        }
                }
        );
}

function getSavedUser() {
        const user = localStorage.getItem(currentUserName);
        return user && user !== 'undefined' ? JSON.parse(user) : null;
}

function setSavedUser(user) {
        localStorage.setItem(currentUserName, JSON.stringify(user));
}

function init() {
        currentUser = getSavedUser();
}

init()
const BASE_URL = 'https://shopify-app-express-server.vercel.app';

function getProductsFromPayload(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.products)) {
        return payload.products;
    }

    if (Array.isArray(payload?.data?.data?.products?.edges)) {
        return payload.data.data.products.edges
            .map((edge) => edge?.node)
            .filter(Boolean);
    }

    if (Array.isArray(payload?.data?.products?.edges)) {
        return payload.data.products.edges
            .map((edge) => edge?.node)
            .filter(Boolean);
    }

    return [];
}

function renderProducts(products) {
    const existingList = document.querySelector('ul[data-products-list]');
    if (existingList) {
        existingList.remove();
    }

    const ul = document.createElement('ul');
    ul.dataset.productsList = 'true';

    products.forEach((product) => {
        const li = document.createElement('li');
        li.textContent = product?.title || product?.name || 'Untitled product';
        ul.appendChild(li);
    });

    if (products.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No products found';
        ul.appendChild(li);
    }

    document.body.appendChild(ul);
}

function renderError(error) {
    const message = document.createElement('p');
    message.textContent = error.message;
    document.body.appendChild(message);
}

async function fetchProducts() {
    const headers = {};
    const url = new URL(window.location.href);
    const tokenFromQuery = url.searchParams.get('id_token');

    // In embedded contexts App Bridge exposes `shopify.idToken()`.
    if (window.shopify?.idToken) {
        const sessionToken = await window.shopify.idToken();
        headers.Authorization = `Bearer ${sessionToken}`;
    } else if (tokenFromQuery) {
        headers.Authorization = `Bearer ${tokenFromQuery}`;
    }

    const response = await fetch(`${BASE_URL}/products`, { headers });
    const payload = await response.json();

    if (!response.ok) {
        if (response.status === 401 && !headers.Authorization) {
            throw new Error('Unauthorized: no session token found. Open the app inside Shopify Admin or provide an id_token in the URL.');
        }
        throw new Error(payload.error || 'Failed to fetch products');
    }

    return payload;
}

fetchProducts()
    .then((payload) => {
        const products = getProductsFromPayload(payload);
        renderProducts(products);
    })
    .catch((error) => {
        console.error(error);
        renderError(error);
    });
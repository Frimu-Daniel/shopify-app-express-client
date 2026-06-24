const BASE_URL = 'https://shopify-app-express-server.vercel.app';

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
    .then(console.log)
    .catch(console.error);
const BASE_URL = 'https://shopify-app-express-server.vercel.app';

fetch(`${BASE_URL}/products`)
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);
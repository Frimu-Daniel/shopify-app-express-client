const BASE_URL = 'https://shopify-app-express-server.vercel.app';

const button = document.querySelector('button');

button.addEventListener('click', () => {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            document.body.insertAdjacentHTML('beforeend', `<pre>${JSON.stringify(data, null, 2)}</pre>`)
        })
        .catch(error => {
            console.error(error);
            document.body.insertAdjacentHTML('beforeend', `<pre>${JSON.stringify(error, null, 2)}</pre>`)
        });
});
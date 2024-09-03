const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
let favorites = [];

document.addEventListener("DOMContentLoaded", () => {
    loadHome();

    document.getElementById('homeBtn').addEventListener('click', loadHome);
    document.getElementById('favoritesBtn').addEventListener('click', loadFavorites);
});

function loadHome() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = '<h2>Principais Criptomoedas</h2>';
            const ul = document.createElement('ul');
            ul.className = 'crypto-list';

            data.forEach(coin => {
                const li = document.createElement('li');
                li.innerHTML = 
                    <><span>${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price}</span><button onclick="viewDetails('${coin.id}')">Ver Detalhes</button><button onclick="toggleFavorite('${coin.id}', '${coin.name}', '${coin.symbol}', ${coin.current_price})">★</button></>
                ;
                ul.appendChild(li);
            });

            content.appendChild(ul);
        })
        .catch(error => console.error('Erro ao carregar criptomoedas:', error));
}
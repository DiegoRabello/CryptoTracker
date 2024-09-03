const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
let favorites = [];

document.addEventListener("DOMContentLoaded", () => {
    loadHome();

    document.getElementById('homeBtn').addEventListener('click', loadHome);
    document.getElementById('favoritesBtn').addEventListener('click', loadFavorites);
});

function loadHome() {
    axios.get(API_URL)
        .then(response => {
            const data = response.data;
            const content = document.getElementById('content');
            content.innerHTML = '<h2>Principais Criptomoedas</h2>';
            const ul = document.createElement('ul');
            ul.className = 'crypto-list';


            data.forEach(coin => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price}</span>
                    <button onclick="viewDetails('${coin.id}')">Ver Detalhes</button>
                    <button onclick="toggleFavorite('${coin.id}', '${coin.name}', '${coin.symbol}', '${coin.current_price}')">★</button>`
;
                ul.appendChild(li);
            });

            content.appendChild(ul);
        })
        .catch(error => console.error('Erro ao carregar criptomoedas:', error));
}

function viewDetails(coinId) {
    const url = "https://api.coingecko.com/api/v3/coins/$%7BcoinId%7D/market_chart?vs_currency=usd&days=7";

    axios.get(url)
        .then(response => {
            const data = response.data;
            const content = document.getElementById('content');
            content.innerHTML = 
                `<h2>Detalhes da Criptomoeda</h2>
                <canvas id="priceChart" width="400" height="200"></canvas>
                <button onclick="loadHome()">Voltar</button>`
            ;
// Preparando os dados para o gráfico
            const labels = data.prices.map(price => {
                const date = new Date(price[0]);
                return `${date.getDate()}/${date.getMonth() + 1}`;
            });

            const prices = data.prices.map(price => price[1]);

            // Renderizando o gráfico com Chart.js
            const ctx = document.getElementById('priceChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Preço (USD)',
                        data: prices,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Erro ao carregar detalhes da criptomoeda:', error));
}

function toggleFavorite(id, name, symbol, price) {
    const favoriteIndex = favorites.findIndex(coin => coin.id === id);

    if (favoriteIndex > -1) {
        favorites.splice(favoriteIndex, 1); // Remove dos favoritos
    } else {
        favorites.push({ id, name, symbol, price }); // Adiciona aos favoritos
    }
}

function loadFavorites() {
    const content = document.getElementById('content');
    content.innerHTML = '<h2>Favoritos</h2>';

    if (favorites.length === 0) {
        content.innerHTML += '<p>Nenhuma criptomoeda favorita.</p>';
        return;
    }
const ul = document.createElement('ul');
    ul.className = 'crypto-list';

    favorites.forEach(coin => {
        const li = document.createElement('li');
        li.innerHTML = 
           `<span>${coin.name} (${coin.symbol.toUpperCase()}): $${coin.price}</span>
            <button onclick="viewDetails('${coin.id}')">Ver Detalhes</button>
            <button onclick="toggleFavorite('${coin.id}', '${coin.name}', '${coin.symbol}', ${coin.price})">★</button>`
        ;
        ul.appendChild(li);
    });

    content.appendChild(ul);
}


const ctx = document.getElementById('myChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Preço (USD)',
                        data: [30, 50, 60, 45, 70, 90, 100, 80, 60, 70, 110, 120],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false
                    }]
                }
            });
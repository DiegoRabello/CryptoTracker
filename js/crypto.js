
console.log("application started")
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
var favorites = [];
const DB_KEY = "@favorites"
document.addEventListener("DOMContentLoaded", () => {
    loadHome();
    loadFavorites();

    console.log()
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
                li.innerHTML = `
                    <span>${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price}</span>
                    <button onclick="viewDetails('${coin.id}')">Ver Detalhes</button>
                    <button onclick="toggleFavorite('${coin.id}', '${coin.name}', '${coin.symbol}', ${coin.current_price})">★</button>`;
                ul.appendChild(li);
            });

            content.appendChild(ul);
        })
        .catch(error => console.error('Erro ao carregar criptomoedas:', error));
}

function viewDetails(coinId) {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = `
                <h2>${data.name} (${data.symbol.toUpperCase()})</h2>
                <p>Preço Atual: $${data.market_data.current_price.usd}</p>
                <p>Maior preço de todos os tempos: $${data.market_data.ath.usd}</p>
                <p>Menor preço de todos os tempos: $${data.market_data.atl.usd}</p>
                <canvas id="priceChart" width="1400" height="500"></canvas>
                <button class = "button-voltar" onclick="loadHome()">Voltar</button>
            `;

            const ctx = document.getElementById('priceChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Preço (USD)',
                        data: [30, 50, 60, 45, 50, 70, 90, 100, 80, 60, 70, 110, 120],
                        borderColor: 'rgba(0, 186, 56, 1)',

                        fill: {
                            target: 'origin',
                            above: 'rgba(0, 186, 56, 0.02)'  // Area will be red above the origin
                        }
                    }]
                }
            });
            console.log(coin)
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
    localStorage.setItem(DB_KEY, JSON.stringify(favorites))

    loadFavorites()
}

function loadFavorites() {


    //     const criptofavorites = document.getElementById('criptofavorites');
    //     criptofavorites.innerHTML = '<h2>Favoritos</h2>';

    //     if (favorites.length === 0) {
    //         criptofavorites.innerHTML += '<p>Nenhuma criptomoeda favorita.</p>';
    //         return;
    //     }
    //     if (storage) {
    //     favorites = JSON.parse(storage); // Recupera favoritos do localStorage
    //     } else {
    //     favorites = []; // Caso contrário, inicializa com uma lista vazia
    //     }


    // const ul = document.createElement('ul');
    // ul.className = 'crypto-favorites'; 

    // favorites.forEach(coin => {
    //     const li = document.createElement('li');
    //     li.innerHTML = `
    //         <span>${coin.name} (${coin.symbol.toUpperCase()}): $${coin.price}</span>`;
    //     ul.appendChild(li);
    // });

    // document.getElementById('criptofavorites').appendChild(ul);

    // // Salva os favoritos atualizados no localStorage
    // localStorage.setItem(DB_KEY, JSON.stringify(favorites));
    // Obtém o contêiner onde os favoritos serão exibidos
    const ul = document.querySelector('.crypto-favorites');

    ul.innerHTML = ''
    // Recupera favoritos do localStorage ou inicializa uma lista vazia
    const storage = localStorage.getItem(DB_KEY);
    let favorites = storage ? JSON.parse(storage) : [];

    // Verifica se há favoritos
    if (favorites.length === 0) {
        ul.innerHTML = '<p>Nenhuma criptomoeda favorita.</p>';
        return; // Encerra a função se não houver favoritos
    }

    // Cria uma lista de favoritos

    // Adiciona cada criptomoeda favorita à lista
    favorites.forEach(coin => {
        const li = document.createElement('li');
        li.innerHTML = `
        <span>${coin.name} (${coin.symbol.toUpperCase()}): $${coin.price}</span>`;
        ul.appendChild(li);
    });


    // Atualiza o localStorage com a lista de favoritos (se necessário)
    localStorage.setItem(DB_KEY, JSON.stringify(favorites));

}

loadFavorites()


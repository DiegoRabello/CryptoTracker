
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
    // URL para obter dados de mercado
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Obtém o histórico de preços separadamente
            const chartUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30&interval=daily`;

            fetch(chartUrl)
                .then(response => response.json())
                .then(chartData => {
                    // Obtendo o histórico de preços
                    const prices = chartData.prices;
                    const labels = prices.map(price => new Date(price[0]).toLocaleDateString());
                    const chartPrices = prices.map(price => price[1]);

                    // Atualizando o conteúdo da sidebar com os detalhes da moeda e o logo
                    const sidebarNav = document.querySelector('.sidebar-nav .content');
                    sidebarNav.innerHTML = `
                        <div class="crypto-sidebar-details">
                            <h2>${data.name.toUpperCase()}</h2>
                        </div>
                        <p>Preço Atual: $${data.market_data.current_price.usd}</p>
                        <p>Maior preço de todos os tempos: $${data.market_data.ath.usd}</p>
                        <p>Menor preço de todos os tempos: $${data.market_data.atl.usd}</p>
                        <button class="side-button" onclick="loadHome()">Voltar</button>
                    `;

                    // Atualizando o conteúdo principal da página com o gráfico e o logo
                    const content = document.getElementById('content');
                    content.innerHTML = `
                        <div class="crypto-main-details">
                            <img src="${data.image.large}" alt="${data.name} logo" class="crypto-logo-main" />
                            <h2>${data.name.toUpperCase()}</h2>
                        </div>
                        <canvas id="priceChart" width="1400" height="500"></canvas>
                        <button class="button-voltar" onclick="loadHome()">Voltar</button>
                    `;

                    // Configurando o gráfico com os dados obtidos
                    const ctx = document.getElementById('priceChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: `Preço de ${data.name.toUpperCase()} (USD)`,
                                data: chartPrices,
                                borderColor: 'rgba(0, 186, 56, 1)',
                                fill: {
                                    target: 'origin',
                                    above: 'rgba(0, 186, 56, 0.1)' // Área abaixo da linha
                                }
                            }]
                        },
                        options: {
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Data'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Preço (USD)'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => console.error('Erro ao carregar histórico de preços:', error));
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

    // Adiciona cada criptomoeda favorita à lista
    favorites.forEach(coin => {
        const li = document.createElement('li');
        li.innerHTML = `
        <span>${coin.name} (${coin.symbol.toUpperCase()}): $${coin.price}</span>
        <button onclick="viewDetails('${coin.id}')">Ver Detalhes</button>
        <button onclick="toggleFavorite('${coin.id}', '${coin.name}', '${coin.symbol}', ${coin.current_price})">★</button>`;  
        ul.appendChild(li);
    });


    // Atualiza o localStorage com a lista de favoritos (se necessário)
    localStorage.setItem(DB_KEY, JSON.stringify(favorites));
    

}

loadFavorites()


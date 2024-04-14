/* 
Imagina que el 1 de marzo de 2024, en el lapso de una hora, de 12:00 a 13:00, Buda.com lanzó una oferta especial llamada BlackBuda. 
Durante este período, ¡todos los usuarios que operaran en el mercado BTC-CLP disfrutaron de un asombroso 100% de descuento en las comisiones de transacción! 

Fue una oportunidad increíble para comprar y vender bitcoin  y ahora necesitamos de tu ayuda para evaluar el desempeño del BlackBuda.

Utilizando nuestra API pública, necesitamos que recopiles la información necesaria para analizar las siguientes situaciones. 

Supuestos:
Las comisiones se cobran en CLP.
Para todos los cálculos utilizar el horario entre 12:00 y 13:00, ambos inclusive, considera la zona horaria GMT -03:00.
Para todas las respuestas truncar en 2 decimales, ocupando un punto como separador de decimales.
Recuerda que en un mercado del tipo Moneda_1-Moneda_2, la cantidad transada está en Moneda_1 y el precio en Moneda_2.*/

const recentDate2024 = Math.floor(new Date('2024-03-01T13:00:00-03:00').getTime());
const oldDate2024 = Math.floor(new Date('2024-03-01T12:00:00-03:00').getTime());
const recentDate2023 = Math.floor(new Date('2023-03-01T13:00:00-03:00').getTime());
const oldDate2023 = Math.floor(new Date('2023-03-01T12:00:00-03:00').getTime());

const market_id = 'BTC-CLP';

let arrayTrades = [];

const fetchTrades = (recentDate, arrayTrades, oldDate, year) => {
    return fetch(`https://www.buda.com/api/v2/markets/${market_id}/trades?timestamp=${recentDate}&limit=100`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {
            arrayTrades.push(...data.trades.entries);
            if (data.trades.last_timestamp > oldDate) {
                return fetchTrades(data.trades.last_timestamp, arrayTrades, oldDate, year);
            } else {
                if (year === '2024') {
                    const trades = tradesInOneHour(arrayTrades, oldDate, recentDate2024)
                    totalTrades(trades);
                } else if (year === '2023') {
                    const trades = tradesInOneHour(arrayTrades, oldDate, recentDate2023)
                    totalTrades(trades);
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
}

const totalTrades = (trades) => {
    let total = 0;
    for (let trade of trades) {
        let amount = parseFloat(trade[1]);
        let price = parseFloat(trade[2]);
        total += amount * price;
    }
    total = Math.floor(total * 100) / 100;
    console.log(`El total transado durante el evento "Black Buda" BTC-CLP fue de ${total} CLP.`);
}

const tradesInOneHour = (totalTrades, oldDate, recentDate) => {
    return totalTrades.filter(trade => trade[0] >= oldDate && trade[0] <= recentDate);
}

const volumeDifferenceBetween2023and2024 = (trades2024, trades2023) => {
    let total2023 = 0;
    let total2024 = 0;
    for (let trade of trades2023) {
        let amount = parseFloat(trade[1]);
        total2023 += amount;
    }
    for (let trade of trades2024) {
        let amount = parseFloat(trade[1]);
        total2024 += amount;
    }

    total2023 = Math.floor(total2023 * 100) / 100;
    total2024 = Math.floor(total2024 * 100) / 100;
    let percentageChange = ((total2024 - total2023) / total2023) * 100;
    percentageChange = Math.floor(percentageChange * 100) / 100;
    console.log(`El volumen transado durante el evento "Black Buda" BTC-CLP fue un ${percentageChange}% mayor que en el evento del año anterior.`);
}

const lossDueToReleaseOfCommissions = (trades) => {
    let total = 0;
    for (let trade of trades) {
        let amount = parseFloat(trade[1]);
        let price = parseFloat(trade[2]);
        total += amount * price;
    }
    total = Math.floor(total * 100) / 100;
    total *= 0.008;
    total = Math.floor(total * 100) / 100;
    console.log(`El total de comisiones que Buda.com dejó de percibir durante el evento "Black Buda" BTC-CLP fue de ${total} CLP.`);
}

const calculateGains = (commissionPercentage) => {
    const volumeIncreasePerCommissionDecrease = 5;
    const initialVolume = 100;
    let totalGains = 0;
    let volume = initialVolume;

    while (commissionPercentage >= 0.1) {
        const increasedVolume = volume * (volumeIncreasePerCommissionDecrease / 100);
        console.log(increasedVolume)
        const gains = volume * (1 - (commissionPercentage / 100));
        totalGains += gains;
        volume += increasedVolume;
        commissionPercentage -= 0.1;
    }

    return totalGains;
};

const recommendedPercentageOfCommission = () => {
    let maxCommission = 0;
    let maxGains = 0;
    for (let commission = 1; commission <= 8; commission++) {
        const gains = calculateGains(commission);
        console.log(gains)
        if (gains > maxGains) {
            maxGains = gains;
            maxCommission = commission / 10;
        }
    }
    console.log(`Para tener mejores ganancias, se recomienda una comisión del ${maxCommission}%`);
}

const technicalTestBlackBuda = () => {
    let arrayTrades2024 = [];
    let arrayTrades2023 = [];
    let trades2024 = [];
    Promise.all([
        fetchTrades(recentDate2024, arrayTrades2024, oldDate2024, '2024'),
        fetchTrades(recentDate2023, arrayTrades2023, oldDate2023, '2023'),
    ]).then(() => {
        trades2024 = tradesInOneHour(arrayTrades2024, oldDate2024, recentDate2024);
        volumeDifferenceBetween2023and2024(arrayTrades2024, arrayTrades2023);
        lossDueToReleaseOfCommissions(trades2024);
        recommendedPercentageOfCommission();
    });
}

technicalTestBlackBuda();
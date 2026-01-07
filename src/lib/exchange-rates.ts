
const exchangeRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1485.0,
  JPY: 157.0,
  CAD: 1.37,
  AUD: 1.5,
  CHF: 0.9,
  CNY: 7.25,
  INR: 83.5,
};

export const getExchangeRate = (from: string, to: string): number => {
    const fromRate = exchangeRates[from];
    const toRate = exchangeRates[to];

    if (!fromRate || !toRate) {
        console.warn(`Exchange rate not found for ${from} or ${to}`);
        return 1; // Default to 1 if currency not found
    }
    
    // Convert 'from' currency to USD first, then from USD to 'to' currency
    const rateInUsd = 1 / fromRate;
    return rateInUsd * toRate;
};

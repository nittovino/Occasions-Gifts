import { useLocalStorage } from './useLocalStorage';

export const useExchangeRate = () => {
  const { getItem } = useLocalStorage();

  const getRate = (currency) => {
    const rates = getItem('exchange_rates') || [];
    const rate = rates.find(r => r.currency === currency);
    return rate ? rate.rate : 1;
  };

  const convertToLocal = (eurAmount, country) => {
    const currencyMap = {
      'Albania': 'ALL',
      'Kosovo': 'EUR',
      'North Macedonia': 'MKD'
    };
    const currency = currencyMap[country] || 'EUR';
    const rate = getRate(currency);
    return {
      amount: eurAmount * rate,
      currency: currency
    };
  };

  const formatCurrency = (amount, currency) => {
    const symbols = {
      'EUR': '€',
      'ALL': 'ALL',
      'MKD': 'MKD'
    };
    return `${symbols[currency] || '€'}${amount.toFixed(2)}`;
  };

  return { getRate, convertToLocal, formatCurrency };
};
import axios from "axios";

const BinanceApi = () => {
  const api = axios.create({
    baseURL: "https://api.binance.com/api/v3",
  });

  const getExchangeInfo = async () => {
    return api(`/exchangeInfo`)
      .then((response) => {
        return response.data.symbols.slice(0, 10);
      })
      .catch((error) => console.error(error));
  };

  return {
    getExchangeInfo,
  };
};

export default BinanceApi;

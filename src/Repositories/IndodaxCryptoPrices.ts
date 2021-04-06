import CryptoPricesRepository, {CoinInfo} from "./CryptoPrices";
import fetch from "node-fetch";

const coinListUrl = "https://indodax.com/api/ticker_all";
// coin list response parser goes here
const responseParser = (response: any): CoinInfo[] => {
    return Object.keys(response.tickers).map(code => {
        return {
            name: "N/A", // todo: since i make this part when /api/pairs down
            code,
            active: true,
        }
    });
}

class IndodaxCryptoPrices implements CryptoPricesRepository{
    async getCoinList(): Promise<CoinInfo[]> {
        const response = await fetch(coinListUrl);
        if (!response.ok) {
            throw new Error(`Request error: ${coinListUrl}: ${response.statusText}`);
        }
        return responseParser(await response.json());
    }
}

export default IndodaxCryptoPrices;

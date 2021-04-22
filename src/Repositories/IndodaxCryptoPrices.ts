import CryptoPricesRepository from "./CryptoPrices";
import {CoinInfo} from "../Entities/CoinInfo";
import PriceKlineTick from "../Entities/PriceKlineTick";
import CoinDetail from "../Entities/CoinDetail";
import _ from "lodash";
import {inject, injectable} from "tsyringe";
import IndodaxApi from "../Contracts/IndodaxApi";
import IndodaxKlineWebsocket from "../Contracts/IndodaxKlineWebsocket";
import {Observable} from "rxjs";

// coin list response parser goes here
const responseParser = (response: any): CoinInfo[] => {
    return response.map((pair: any) => {
        return {
            name: pair.description, // todo: since i make this part when /api/pairs down
            code: pair.id,
            active: pair.is_maintenance === 0,
        }
    });
}

@injectable()
class IndodaxCryptoPrices implements CryptoPricesRepository {
    constructor(
        @inject("IndodaxApi") private indodaxApi: IndodaxApi,
        @inject("IndodaxKlineWebsocket") private indodaxKlineWebsocket: IndodaxKlineWebsocket,
    ) {
    }

    async getCoinList(): Promise<CoinInfo[]> {
        const response = await this.indodaxApi.getPairs();
        return responseParser(response);
    }

    async getCoinDetail(coinId: string): Promise<CoinDetail> {
        const [coinListResponse, tickerResponse] = await Promise.all([
            this.indodaxApi.getPairs(),
            this.indodaxApi.getTicker(coinId)
        ]);
        const coinDetail = _.find(coinListResponse, (coin) => coin.id === coinId);
        if (!coinDetail) {
            throw new Error("Coin not found in pairs list");
        }
        return {
            active: coinDetail.is_maintenance === 0,
            code: coinDetail.id,
            logo: coinDetail.url_logo_png,
            name: coinDetail.description,
            price: {

                h: parseInt(tickerResponse.ticker.high, 10),
                l: parseInt(tickerResponse.ticker.low, 10),
                vol: parseInt(tickerResponse.ticker.vol_idr || tickerResponse.ticker.vol_usdt || "", 10),
                last: parseInt(tickerResponse.ticker.last, 10),
                buy: parseInt(tickerResponse.ticker.buy, 10),
                sell: parseInt(tickerResponse.ticker.sell, 10),
                t: tickerResponse.ticker.server_time * 1000,
            }
        }
    }

    getKlineTickEvent(coinId: string): Observable<PriceKlineTick> {
        return this.indodaxKlineWebsocket.getKlineObserver(coinId);
    }
}

export default IndodaxCryptoPrices;

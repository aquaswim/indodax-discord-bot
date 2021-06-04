import {Observable, Subject} from "rxjs";
import PriceKlineTick from "../Entities/PriceKlineTick";
import Dict = NodeJS.Dict;
import fetchJson from "../Helpers/jsonFetch";
import IndodaxKlineWebsocket from "../Contracts/IndodaxKlineWebsocket";
import {inject} from "tsyringe";
import Logger from "../Contracts/Logger";

const TICKERURL = "https://indodax.com/api/ticker_all";

interface ITicker {
    high: string;
    low: string;
    last: string;
    buy: string;
    sell: string;
    server_time: number;
}

interface ITickerResponse {
    tickers: {[coinId: string]: ITicker}
}

/**
 * Kline but with pooling instead of websocket
 */
class IndodaxKlinePooling implements IndodaxKlineWebsocket{
    private readonly subjectDict: Dict<Subject<PriceKlineTick>>;
    private timer: NodeJS.Timeout | number;
    constructor(
        @inject("Logger") private logger: Logger,
        intervalMs = 600000
    ) {
        this.subjectDict = {};
        this.priceUpdate().catch(err => this.logger.error(err))
        this.timer = setInterval(()=>this.priceUpdate().catch(err => this.logger.error(err)), intervalMs);
    }

    private async priceUpdate(){
        const response = await fetchJson<ITickerResponse>(TICKERURL);
        for (let coinId in response.tickers) {
            const ticker: ITicker = response.tickers[coinId]
            // since ticker coin id have underscore
            const parsedCoinId = coinId.replace("_", "");
            if (!this.subjectDict[parsedCoinId]) {
                this.subjectDict[parsedCoinId] = new Subject<PriceKlineTick>();
            }
            this.subjectDict[parsedCoinId]?.next({
                h: parseInt(ticker.high, 10),
                l: parseInt(ticker.low, 10),
                c: parseInt(ticker.last, 10),
                o: parseInt(ticker.last, 10),
                t: ticker.server_time * 1000,
                v: 0
            })
        }
    }

    getKlineObserver(coinId: string): Observable<PriceKlineTick> {
        if (this.subjectDict.hasOwnProperty(coinId)) {
            return this.subjectDict[coinId]!;
        }
        throw new Error("Coin not found!");
    }

    isReady(): boolean {
        return true;
    }
}

export default IndodaxKlinePooling;

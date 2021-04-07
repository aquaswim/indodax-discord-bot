import CryptoPricesRepository from "./CryptoPrices";
import fetch from "node-fetch";
import Websocket from "ws";
import {CoinInfo} from "../Entities/CoinInfo";
import PriceKlineTick from "../Entities/PriceKlineTick";
import {Subject} from "rxjs";
import Dict = NodeJS.Dict;

const coinListUrl = "https://indodax.com/api/pairs/";
const kLineUrl = "wss://kline.indodax.com/ws/";

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

interface IWSTick {
    pair: string;
    type: string;
    c: number;
    h: number;
    l: number;
    o: number;
    t: number;
    v: number;
}

class IndodaxCryptoPrices implements CryptoPricesRepository{
    private ws: Websocket;
    private wsReady = false;
    private readonly subjectDict: Dict<{lastUpdate: number, subject: Subject<PriceKlineTick>}>;
    constructor() {
        this.subjectDict = {};
        this.ws = new Websocket(kLineUrl);
        this.ws.on("open", ()=>{
            console.log("Websocket connection to", kLineUrl, "opened");
            this.wsReady = true;
        });
        this.ws.on("message", data => {
            const parsedData = JSON.parse(data.toString());
            if (parsedData.tick) {
                const tickData = parsedData.tick as IWSTick;
                if (this.subjectDict[tickData.pair]!.lastUpdate >= tickData.t) {
                    return;
                }
                this.subjectDict[tickData.pair]!.lastUpdate = tickData.t;
                if (this.subjectDict[tickData.pair]) {
                    const subject = this.subjectDict[tickData.pair]!.subject;
                    if (subject.observers.length > 0) {
                        // tick data is in second and need to be converted to ms
                        tickData.t *= 1000;
                        subject.next(tickData);
                    } else {
                        console.log("price detected in", tickData.pair, "but no observer found!");
                        subject.complete();
                        delete this.subjectDict[tickData.pair];
                        this._sendUnsubscribeCommand(tickData.pair);
                    }
                } else {
                    console.warn("Receiving message from", kLineUrl, "that unavailable in subject list");
                    this._sendUnsubscribeCommand(parsedData.tick);
                }
            } else {
                console.log("received non tick data", parsedData);
            }
        });
        this.ws.on("error", err => {
            console.error("Websocket connection to",kLineUrl,"error", err);
        })
    }

    async getCoinList(): Promise<CoinInfo[]> {
        const response = await fetch(coinListUrl);
        if (!response.ok) {
            throw new Error(`Request error: ${coinListUrl}: ${response.statusText}`);
        }
        return responseParser(await response.json());
    }

    private static generateSubChannelForId(coinId: string) {
        return `${coinId}.kline.1m`;
    }

    private wsMustReady() {
        if (!this.wsReady) throw new Error("Web socket is not ready");
    }

    private _sendUnsubscribeCommand(coidId: string){
        this.wsMustReady();
        console.log("sending unsubscribe command for", coidId);
        this.ws.send(JSON.stringify({
            unsub: IndodaxCryptoPrices.generateSubChannelForId(coidId),
            id: coidId
        }));
    }

    private _sendSubscribeCommand(coidId: string){
        this.wsMustReady();
        console.log("sending subscribe command for", coidId);
        this.ws.send(JSON.stringify({
            sub: IndodaxCryptoPrices.generateSubChannelForId(coidId),
            id: coidId
        }));
    }

    getKlineSubject(coinId: string): Subject<PriceKlineTick> {
        if (!this.subjectDict.hasOwnProperty(coinId)) {
            this.subjectDict[coinId] = {
                lastUpdate: 0,
                subject: new Subject()
            }
            this._sendSubscribeCommand(coinId);
        }
        return this.subjectDict[coinId]!.subject;
    }
}

export default IndodaxCryptoPrices;
import IndodaxKlineWebsocket from "./IndodaxKlineWebsocket";
import {Observable, Subject} from "rxjs";
import PriceKlineTick from "../Entities/PriceKlineTick";
import WebSocket from "ws";
import Websocket from "ws";
import Dict = NodeJS.Dict;

const kLineUrl = "wss://kline.indodax.com/ws/";

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

class SubjectWithLastUpdate<T> {
    constructor(
        private subject = new Subject<T>(),
        private lastUpdate = 0
    ) {
    }

    getObservable() {
        return this.subject.asObservable();
    }

    notify(updateTime: number, data: T) {
        if (this.lastUpdate < updateTime) {
            this.lastUpdate = updateTime;
            this.subject.next(data);
        }
    }

    hasObserver() {
        return this.subject.observers.length > 0;
    }

    complete() {
        this.subject.complete();
    }
}

class IndodaxKlineWebsocketImpl implements IndodaxKlineWebsocket {
    private ready: boolean;
    private ws?: WebSocket;
    private subjectInfoDict: Dict<SubjectWithLastUpdate<PriceKlineTick>> = {};

    constructor() {
        this.ready = false;
        this._connectWs();
    }

    getKlineObserver(coinId: string): Observable<PriceKlineTick> {
        if (!this.subjectInfoDict.hasOwnProperty(coinId)) {
            // create new subject
            this.subjectInfoDict[coinId] = new SubjectWithLastUpdate<PriceKlineTick>()
            // send subscribe command
            this._sendSubscribeCommand(coinId);
        }
        return this.subjectInfoDict[coinId]!.getObservable();
    }

    isReady(): boolean {
        return this.ready;
    }

    private wsMustReady(): void {
        if (!this.isReady()) {
            throw new Error("Web socket is not ready");
        }
    }

    static generateSubChannelForId(coinId: string) {
        return `${coinId}.kline.30m`;
    }

    private _sendUnsubscribeCommand(coidId: string) {
        this.wsMustReady();
        console.log("sending unsubscribe command for", coidId);
        this.ws?.send(JSON.stringify({
            unsub: IndodaxKlineWebsocketImpl.generateSubChannelForId(coidId),
            id: coidId
        }));
    }

    private _sendSubscribeCommand(coidId: string) {
        this.wsMustReady();
        console.log("sending subscribe command for", coidId);
        this.ws?.send(JSON.stringify({
            sub: IndodaxKlineWebsocketImpl.generateSubChannelForId(coidId),
            id: coidId
        }));
    }

    private _connectWs(){
        this.ws = new WebSocket(kLineUrl);
        this.ws.once("open", () => {
            console.log("Websocket connection to", kLineUrl, "opened");
            this.ready = true;
            // re subscribe all coin
            for (let coinId in this.subjectInfoDict) {
                this._sendSubscribeCommand(coinId);
            }
        });
        this.ws.on("error", err => {
            console.error("Websocket connection to", kLineUrl, "error", err);
            this.ws?.close();
        })
        this.ws.on("close", (ws: Websocket, code: number, message: string) => {
            console.error("Connection to", kLineUrl, "closed:", message, code);
            this.ready = false;
            this._connectWs();
        });
        this.ws.on("message", data => {
            const parsedData = JSON.parse(data.toString());
            if (parsedData.tick) {
                const tickData = parsedData.tick as IWSTick;
                if (this.subjectInfoDict.hasOwnProperty(tickData.pair)) {
                    const subjectInfo = this.subjectInfoDict[tickData.pair]!;
                    if (subjectInfo.hasObserver()) {
                        tickData.t = tickData.t * 1000;
                        subjectInfo.notify(tickData.t, tickData);
                    } else {
                        // if observer not found
                        console.log("price detected in", tickData.pair, "but no observer found!");
                        subjectInfo.complete();
                        delete this.subjectInfoDict[tickData.pair];
                        this._sendUnsubscribeCommand(tickData.pair);
                    }
                } else {
                    console.warn("Receiving message from", kLineUrl, "that unavailable in subject list");
                    this._sendUnsubscribeCommand(parsedData.tick);
                }
            } else {
                console.log("received non tick data", parsedData);
            }
        })
    }
}

export default IndodaxKlineWebsocketImpl;

import {Observable} from "rxjs";
import PriceKlineTick from "../Entities/PriceKlineTick";

interface IndodaxKlineWebsocket {
    isReady(): boolean;
    getKlineObserver(coinId: string): Observable<PriceKlineTick>;
}

export default IndodaxKlineWebsocket;

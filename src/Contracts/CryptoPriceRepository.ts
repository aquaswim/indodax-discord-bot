import {CoinInfo} from "../Entities/CoinInfo";
import PriceKlineTick from "../Entities/PriceKlineTick";
import {Observable} from "rxjs";
import CoinDetail from "../Entities/CoinDetail";

interface CryptoPricesRepository {
    getCoinList(): Promise<CoinInfo[]>;
    getKlineTickEvent: (coinId: string) => Observable<PriceKlineTick>;
    getCoinDetail(coinId: string): Promise<CoinDetail>;
}

export default CryptoPricesRepository;

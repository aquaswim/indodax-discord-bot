import {CoinInfo} from "../Entities/CoinInfo";
import PriceKlineTick from "../Entities/PriceKlineTick";
import {Subject} from "rxjs";
import CoinDetail from "../Entities/CoinDetail";

interface CryptoPricesRepository {
    getCoinList(): Promise<CoinInfo[]>;
    getKlineSubject: (coinId: string) => Subject<PriceKlineTick>;
    getCoinDetail(coinId: string): Promise<CoinDetail>;
}

export default CryptoPricesRepository;

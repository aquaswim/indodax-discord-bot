import {CoinInfo} from "../Entities/CoinInfo";
import PriceKlineTick from "../Entities/PriceKlineTick";
import {Subject} from "rxjs";

interface CryptoPricesRepository {
    getCoinList(): Promise<CoinInfo[]>;
    getKlineSubject: (coinId: string) => Subject<PriceKlineTick>;
}

export default CryptoPricesRepository;

export interface CoinInfo {
    name: string;
    code: string;
    active: boolean;
}

interface CryptoPricesRepository {
    getCoinList(): Promise<CoinInfo[]>;
}

export default CryptoPricesRepository;

interface CoinPrice {
    h: number;
    l: number;
    vol: number;
    last: number;
    buy: number;
    sell: number;
    t: number;
}

interface CoinDetail {
    code: string;
    name: string;
    active: boolean;
    logo: string;
    price: Partial<CoinPrice>
}

export default CoinDetail;

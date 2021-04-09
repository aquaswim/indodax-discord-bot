export namespace Response {
    export interface ServerTimeResponse {
        timezone: string;
        server_time: number;
    }

    export interface Pair {
        id: string;
        symbol: string;
        base_currency: string;
        traded_currency: string;
        traded_currency_unit: string;
        description: string;
        ticker_id: string;
        volume_precision: number;
        price_precision: number;
        price_round: number;
        pricescale: number;
        trade_min_base_currency: number;
        trade_min_traded_currency: number;
        has_memo: boolean;
        memo_name: boolean;
        url_logo: string;
        url_logo_png: string;
        is_maintenance: number;
    }

    export interface TickerVolReal{
        vol_idr: string;
        vol_usdt: string;
    }

    export interface Ticker {
        high: string;
        low: string;
        last: string;
        buy: string;
        sell: string;
        server_time: number;
    }

    export interface TickerDetail {
        ticker: Ticker & Partial<TickerVolReal>
    }
}

interface IndodaxApi {
    getServerTime(): Promise<Response.ServerTimeResponse>;
    getPairs(): Promise<Response.Pair[]>
    getTicker(coinId: string): Promise<Response.TickerDetail>
}

export default IndodaxApi

import IndodaxApi, {Response} from "./IndodaxApi";
import fetchJson from "../Helpers/jsonFetch";

const URL_PAIR = "https://indodax.com/api/pairs";
const URL_SERVERTIME = "https://indodax.com/api/server_time";
const URL_TICKER = "https://indodax.com/api/ticker";

class IndodaxApiImpl implements IndodaxApi {
    getPairs(): Promise<Response.Pair[]> {
        return fetchJson<Response.Pair[]>(URL_PAIR);
    }

    getServerTime(): Promise<Response.ServerTimeResponse> {
        return fetchJson<Response.ServerTimeResponse>(URL_SERVERTIME);
    }

    getTicker(coinId: string): Promise<Response.TickerDetail> {
        return fetchJson<Response.TickerDetail>(`${URL_TICKER}/${coinId}`);
    }

}

export default IndodaxApiImpl;

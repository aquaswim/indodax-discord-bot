import {inject, singleton} from "tsyringe";
import Dict = NodeJS.Dict;
import {generateIdSimpleV2} from "../Helpers/generateId";
import CryptoPricesRepository from "../Contracts/CryptoPriceRepository";
import PriceKlineTick from "../Entities/PriceKlineTick";
import {Observable, Subscription} from "rxjs";
import IAlert from "../Entities/Alert";

export type AlertOperand = "<" | ">";

export type AlertCallback = (data:PriceKlineTick, alert: Alert) => any;

class Alert implements IAlert{
    constructor(
        public readonly id: string,
        public readonly coinId: string,
        public readonly operand: AlertOperand,
        public readonly amount: number,
        private readonly callback: AlertCallback
    ) {}

    public idIsEqual(id: string) {
        return id === this.id;
    }

    public getId(){
        return this.id;
    }
    public process(data: PriceKlineTick) {
        let isTriggered = false;
        switch (this.operand) {
            case "<":
                isTriggered = data.c < this.amount;
                break;
            case ">":
                isTriggered = data.c > this.amount;
                break;
            default:
                throw new Error(`unknown operand ${this.operand} in ${this.id}`);
        }
        if (isTriggered)
            return this.callback(data, this);
    }
}

class ParentAlert {
    private subscription: Subscription;
    constructor(
        public coinId: string,
        tickObservable: Observable<PriceKlineTick>,
        public alerts: Alert[] = [],
    ) {
        this.subscription = tickObservable.subscribe(data => {
            for (let alert of this.alerts) {
                alert.process(data);
            }
        })
    }

    pushAlert(alert: Alert) {
        this.alerts.push(alert);
    }

    removeById(id: string) {
        const indexToRemove = this.alerts.findIndex(alert=>alert.idIsEqual(id));
        if (indexToRemove === -1) {
            throw new Error(`Alert Id ${id} in ${this.coinId} Not Exists`);
        }
        this.alerts.splice(indexToRemove!, 1);
        if (this.alertIsEmpty()) {
            this.subscription.unsubscribe();
        }
        return;
    }

    alertIsEmpty() {
        return this.alerts.length <= 0;
    }
}

@singleton()
class PriceAlert {
    private readonly alerts: Dict<ParentAlert> = {};
    constructor(
        @inject("CryptoPricesRepository") private cryptoPriceRepo: CryptoPricesRepository
    ) {
    }

    addAlert(coinId: string, operand: AlertOperand, amount: number, callback: AlertCallback): Alert{
        const id = `${coinId}-${generateIdSimpleV2()}`;
        if (!this.alerts[coinId]) {
            this.alerts[coinId] = new ParentAlert(
                coinId,
                this.cryptoPriceRepo.getKlineTickEvent(coinId)
            );
        }
        const alert = new Alert(
            id,
            coinId,
            operand,
            amount,
            callback
        );
        this.alerts[coinId]!.pushAlert(alert);
        return alert;
    }

    removeAlert(id: string) {
        const coinId = id.slice(0, id.indexOf("-"));
        if (this.alerts.hasOwnProperty(coinId)) {
            this.alerts[coinId]?.removeById(id);
            return;
        }
        throw new Error(`Coin Id ${id} Not Exists`);
    }

    listAlerts(): IAlert[]{
        const results:IAlert[] = [];
        for (let coinId in this.alerts) {
            if (this.alerts.hasOwnProperty(coinId)) {
                const _alert: ParentAlert = this.alerts[coinId]!;
                for (let alert of _alert.alerts) {
                    results.push(alert);
                }
            }
        }
        return results;
    }
}

export default PriceAlert;

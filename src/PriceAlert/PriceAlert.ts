import {singleton} from "tsyringe";
import Dict = NodeJS.Dict;
import {generateIdSimple} from "../Helpers/generateId";

export type AlertOperand = "<" | ">";

export type AlertCallback = (data:any, alert: Alert) => any;

class Alert {
    constructor(
        private id: string,
        private coinId: string,
        private operand: AlertOperand,
        private amount: number,
        private callback: AlertCallback
    ) {}

    public idIsEqual(id: string) {
        return id === this.id;
    }

    public getId(){
        return this.id;
    }
    public notify(data: any) {
        return this.callback(data, this);
    }
}

@singleton()
class PriceAlert {
    private readonly alerts: Dict<Alert[]> = {};
    constructor() {
    }

    addAlert(coinId: string, operand: AlertOperand, amount: number, callback: AlertCallback): Alert{
        const id = `${coinId}-${generateIdSimple()}`;
        if (this.alerts.hasOwnProperty(id)) {
            throw new Error(`Id ${id} Already Exists`);
        }
        if (!this.alerts[coinId]) {
            this.alerts[coinId] = [];
        }
        const alert = new Alert(
            id,
            coinId,
            operand,
            amount,
            callback
        );
        this.alerts[coinId]!.push(alert);
        return alert;
    }

    removeAlert(id: string) {
        const coinId = id.slice(0, id.indexOf("-"));
        if (this.alerts.hasOwnProperty(coinId)) {
            const indexToRemove = this.alerts[coinId]!.findIndex(alert=>alert.idIsEqual(id));
            if (indexToRemove === -1) {
                throw new Error(`Alert Id ${id} in ${coinId} Not Exists`);
            }
            this.alerts[coinId]!.splice(indexToRemove!, 1);
            return;
        }
        throw new Error(`Coin Id ${id} Not Exists`);
    }

    private onPriceUpdate(){
        for (let coinId in this.alerts) {
            if (this.alerts.hasOwnProperty(coinId)) {
                const alerts = this.alerts[coinId];
                for (let alert of alerts!) {
                    alert.notify({});
                }
            }
        }
    }
}

export default PriceAlert;

import CommandMessage from "../Entities/CommandMessage";
import ICommandHandler, {HandlerResult} from "../Contracts/CommandHandler";
import {injectable} from "tsyringe";
import PriceAlert, {AlertOperand} from "../PriceAlert/PriceAlert";

@injectable()
class AlertHandler implements ICommandHandler{
    constructor(private priceAlerter: PriceAlert) {
    }
    async handle(cmd: CommandMessage): Promise<HandlerResult> {
        const coinId = cmd.getArg(0);
        const operand = cmd.getArg(1);
        const amount = Number(cmd.getArg(2));
        if (!coinId) {
            throw new Error("Coin id is required");
        }
        if (!["<", ">"].includes(operand!)) {
            throw new Error("Currently supported operand is < & >");
        }
        if (!amount) {
            throw new Error("Amount need to be valid number");
        }

        const alert = this.priceAlerter.addAlert(coinId!, operand as AlertOperand, amount!, ()=>{
            cmd.message.channel.send("test");
        });
        return {
            content: "Pong!" + alert.getId()
        };
    }

}

export default AlertHandler;

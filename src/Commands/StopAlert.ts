import CommandMessage from "../Entities/CommandMessage";
import ICommandHandler, {HandlerResult} from "../Contracts/CommandHandler";
import {injectable} from "tsyringe";
import PriceAlert from "../PriceAlert/PriceAlert";

@injectable()
class StopAlertHandler implements ICommandHandler{
    constructor(private priceAlerter: PriceAlert) {
    }

    async handle(cmd: CommandMessage): Promise<HandlerResult> {
        const id = cmd.getArg(0);
        if (!id) {
            throw new Error("Id is required!");
        }
        this.priceAlerter.removeAlert(id);
        return {
            content: "Pong!"
        };
    }

}

export default StopAlertHandler;

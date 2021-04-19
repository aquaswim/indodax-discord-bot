import {injectable} from "tsyringe";
import ICommandHandler, {HandlerResult} from "../Contracts/CommandHandler";
import CommandMessage from "../Entities/CommandMessage";
import PriceAlert from "../PriceAlert/PriceAlert";
import {MessageEmbed} from "discord.js";

@injectable()
class ListAlertHandler implements ICommandHandler{
    constructor(
        private priceAlerter: PriceAlert
    ) {
    }

    async handle(cmd: CommandMessage): Promise<HandlerResult> {
        const listAlert = this.priceAlerter.listAlerts();
        const embed = new MessageEmbed();
        embed.setTitle("List configured alert");
        if (listAlert.length > 0) {
            embed.setDescription(listAlert.map(alert => {
                return `**${alert.id}**: ${alert.coinId} ${alert.operand} ${alert.amount.toLocaleString("id")}`;
            }).join("\n"));
        } else {
            embed.setTitle(":x: No Alert defined!");
        }
        return {
            content: "",
            embed
        }
    }

}

export default ListAlertHandler;

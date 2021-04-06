import CommandMessage from "../Entities/CommandMessage";
import ICommandHandler, {HandlerResult} from "../Contracts/CommandHandler";
import {injectable} from "tsyringe";
import PriceAlert, {AlertOperand} from "../PriceAlert/PriceAlert";
import {MessageEmbed} from "discord.js";

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

        const alert = this.priceAlerter.addAlert(coinId!, operand as AlertOperand, amount!, (data, alert)=>{
            const embed = new MessageEmbed();
            embed.addField("id", alert.getId());
            embed.addField("trigger", `${coinId} ${operand} ${amount.toLocaleString("id")}`);
            embed.addField("C", data.c.toLocaleString("id"), true);
            embed.addField("H", data.h.toLocaleString("id"), true);
            embed.addField("L", data.l.toLocaleString("id"), true);
            embed.addField("O", data.o.toLocaleString("id"), true);
            embed.addField("V", data.v.toLocaleString("id"), true);
            cmd.message.channel.send(`Alert ${alert.getId()} triggered`, {
                embed
            });
        });
        const embed = new MessageEmbed();
        embed.addField("id", alert.getId());
        embed.addField("trigger", `${coinId} ${operand} ${amount.toLocaleString("id")}`);
        return {
            content: "Alert created",
            embed
        };
    }

}

export default AlertHandler;

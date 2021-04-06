import ICommandHandler, {HandlerResult} from "../Contracts/CommandHandler";
import {inject, injectable} from "tsyringe";
import CommandMessage from "../Entities/CommandMessage";
import CryptoPricesRepository from "../Repositories/CryptoPrices";
import {MessageEmbed} from "discord.js";

@injectable()
class ListHandler implements ICommandHandler{
    constructor(@inject("CryptoPricesRepository") private cryptoPriceRepo: CryptoPricesRepository) {
    }

    async handle(cmd: CommandMessage): Promise<HandlerResult> {
        const coins = await this.cryptoPriceRepo.getCoinList();
        let embed = new MessageEmbed();
        embed.setTitle("List Crypto")
            .setDescription(coins.map(coins=>coins.code).join(" | "));
        return {
            content: "",
            embed
        }
    }

}

export default ListHandler;

import CommandMessage from "../Entities/CommandMessage";
import ICommandHandler, {HandlerResult} from "../Contracts/CommandHandler";
import {inject, injectable} from "tsyringe";
import CryptoPricesRepository from "../Repositories/CryptoPrices";
import {MessageEmbed} from "discord.js";
import _ from "lodash";

@injectable()
class GetPriceHandler implements ICommandHandler{
    constructor(@inject("CryptoPricesRepository") private cryptoPriceRepository: CryptoPricesRepository) {
    }

    async handle(cmd: CommandMessage): Promise<HandlerResult> {
        const coinId = cmd.getArg(0);
        if (!coinId) {
            throw new Error("Coin id is required");
        }
        const coinDetail = await this.cryptoPriceRepository.getCoinDetail(coinId);
        const embed = new MessageEmbed()
        embed
            .setTitle("Coin price detail")
            .setAuthor(coinDetail.name, coinDetail.logo)
            .addField("Active", coinDetail.active ? "yes" : "no")
            .setFooter(`Last update ${coinDetail.price.t ? new Date(coinDetail.price.t) : "N/A"}`);
        for (const key in coinDetail.price) {
            const value = _.get(coinDetail.price, key);
            if (value && key !== 't') {
                embed.addField(key, value, true);
            }
        }
        return {
            embed
        }
    }
}

export default GetPriceHandler;

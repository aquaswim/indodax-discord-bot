import {Message} from "discord.js";
import CommandMessage from "../Entities/CommandMessage";

export interface ICommandParser {
    parseMessage(msg: Message): CommandMessage;
}

export class CommandParser implements ICommandParser{
    constructor(private prefix = process.env.PREFIX || "&") {

    }
    parseMessage(msg: Message): CommandMessage {
        const wordArray = msg.content.slice(msg.content.indexOf(this.prefix)+1).split(" ");
        return new CommandMessage(wordArray[0], wordArray.slice(1), msg);
    }

}

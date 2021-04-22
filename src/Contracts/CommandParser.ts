import {Message} from "discord.js";
import CommandMessage from "../Entities/CommandMessage";

interface ICommandParser {
    parseMessage(msg: Message): CommandMessage;
}

export default ICommandParser;

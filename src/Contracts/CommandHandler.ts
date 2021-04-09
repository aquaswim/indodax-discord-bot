import CommandMessage from "../Entities/CommandMessage";
import {MessageOptions} from "discord.js";

export type HandlerResult = (MessageOptions & { split?: false });

interface ICommandHandler {
    handle(cmd: CommandMessage): Promise<HandlerResult>
}

export default ICommandHandler;

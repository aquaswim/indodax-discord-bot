import CommandMessage from "../Entities/CommandMessage";
import {MessageOptions} from "discord.js";

export type HandlerResult = (MessageOptions & { split?: false });

export type IHandler = (cmd: CommandMessage)=>Promise<HandlerResult>;

export default IHandler;

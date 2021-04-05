import CommandMessage from "../Entities/CommandMessage";
import {HandlerResult} from "../Contracts/CommandHandler";

async function pingHandler(command: CommandMessage): Promise<HandlerResult> {
    return {
        content: "Pong!"
    };
}

export default pingHandler;

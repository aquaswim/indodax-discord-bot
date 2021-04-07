import CommandMessage from "../Entities/CommandMessage";
import ICommandHandler, {HandlerResult} from "../Contracts/CommandHandler";

class GetPriceHandler implements ICommandHandler{
    async handle(cmd: CommandMessage): Promise<HandlerResult> {
        return {
            content: "Pong!"
        };
    }

}

export default GetPriceHandler;

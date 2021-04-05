import IHandler , {HandlerResult} from "../Contracts/CommandHandler";
import CommandMessage from "../Entities/CommandMessage";
import Dict = NodeJS.Dict;

export interface ICommandRouter {
    registerHandler(command: string, handler: IHandler): void;
    handle(cmd: CommandMessage): Promise<HandlerResult>;
}

class CommandRouter implements ICommandRouter{
    private handlerDict: Dict<IHandler> = {};
    handle(cmd: CommandMessage): Promise<HandlerResult> {
        if (this.handlerDict.hasOwnProperty(cmd.command)) {
            return this.handlerDict[cmd.command]!(cmd);
        } else {
            return CommandRouter.notFoundHandler(cmd);
        }
    }

    private static async notFoundHandler(cmd: CommandMessage): Promise<HandlerResult> {
        return {
            content: `**"${cmd.command}"** Command Not Found!`
        }
    }

    registerHandler(command: string, handler: IHandler): void {
        this.handlerDict[command] = handler;
    }

}

export default CommandRouter;

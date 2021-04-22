import {container, inject, singleton} from "tsyringe";
import {Client, Message, MessageEmbed} from "discord.js";
import Dict = NodeJS.Dict;
import ICommandHandler from "../Contracts/CommandHandler";
import InjectionToken from "tsyringe/dist/typings/providers/injection-token";
import logger from "./Logger";
import ICommandParser from "../Contracts/CommandParser";

@singleton()
class App {
    private readonly handlerDict: Dict<ICommandHandler>;
    constructor(
        private discordClient: Client,
        @inject("ICommandParser") private cmdParser: ICommandParser
    ) {
        this.handlerDict = {};
    }

    start() {
        this.discordClient.on("error", (err) => {
            logger.error(err);
        });
        this.discordClient.on("ready", ()=> {
            logger.info("Logged in as", this.discordClient.user!.tag);
        });
        this.discordClient.on("message", this.processMessages.bind(this));
        this.discordClient.login(process.env.DISCORD_TOKEN)
            .catch((err) => logger.error(err));
    }

    private async processMessages(msg: Message){
        if (msg.content.startsWith(process.env.PREFIX || "&")) {
            try{
                const command = this.cmdParser.parseMessage(msg);
                if (this.handlerDict.hasOwnProperty(command.command)) {
                    await msg.reply(await this.handlerDict[command.command]!.handle(command));
                    return;
                }
                throw new Error("Command not found");
            }catch (e) {
                await msg.reply("", {
                    embed: (new MessageEmbed())
                        .setTitle("Command error")
                        .setDescription(e.message)
                });
                logger.error(e);
            }
        }
    }

    public registerHandler(command: string, handler: ICommandHandler | InjectionToken<ICommandHandler>): App {
        logger.info("register command", command);
        if ((<ICommandHandler>handler).handle) {
            this.handlerDict[command] = handler as ICommandHandler;
        } else {
            this.handlerDict[command] = container.resolve(handler as InjectionToken<ICommandHandler>);
        }
        return this;
    }
}

export default App;

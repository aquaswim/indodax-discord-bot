import {inject, singleton} from "tsyringe";
import {Client, Message, MessageEmbed} from "discord.js";
import {ICommandParser} from "./CommandParser";
import Dict = NodeJS.Dict;
import ICommandHandler from "../Contracts/CommandHandler";
import {notStrictEqual} from "assert";

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
            console.error("Discord Client Error", err);
        });
        this.discordClient.on("ready", ()=> {
            console.error("Logged in as", this.discordClient.user?.tag);
        });
        this.discordClient.on("message", this.processMessages.bind(this));
        this.discordClient.login(process.env.DISCORD_TOKEN)
            .catch((err) => console.error("Login error", err));
    }

    private async processMessages(msg: Message){
        if (msg.content.startsWith(process.env.PREFIX || "&")) {
            try{
                const command = this.cmdParser.parseMessage(msg);
                if (this.handlerDict.hasOwnProperty(command.command)) {
                    await msg.reply(await this.handlerDict[command.command]!(command));
                    return;
                }
                throw new Error("Command not found");
            }catch (e) {
                await msg.reply("", {
                    embed: (new MessageEmbed())
                        .setTitle("Command error")
                        .setDescription(e.message)
                })
            }
        }
    }

    public registerHandler(command: string, handler: ICommandHandler): App {
        this.handlerDict[command] = handler;
        return this;
    }
}

export default App;

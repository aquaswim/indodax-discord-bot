import {inject, singleton} from "tsyringe";
import {Client, Message} from "discord.js";
import {ICommandParser} from "./CommandParser";
import {ICommandRouter} from "./CommandRouter";

@singleton()
class App {
    constructor(
        private discordClient: Client,
        @inject("ICommandParser") private cmdParser: ICommandParser,
        @inject("ICommandRouter") private cmdRouter: ICommandRouter
    ) {
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
            const command = this.cmdParser.parseMessage(msg);
            await msg.reply(await this.cmdRouter.handle(command));
        }
    }
}

export default App;

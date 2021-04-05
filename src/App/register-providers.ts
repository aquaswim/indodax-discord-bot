import { Client } from "discord.js";
import {container} from "tsyringe";
import {CommandParser} from "./CommandParser";
import CommandRouter from "./CommandRouter";

// register all class
container.register(Client, {
    useValue: new Client()
});

container.register("ICommandParser", {
    useClass: CommandParser
});

container.register("ICommandRouter", {
    useClass: CommandRouter
});

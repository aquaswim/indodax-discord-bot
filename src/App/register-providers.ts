import { Client } from "discord.js";
import {container} from "tsyringe";
import {CommandParser} from "./CommandParser";

// register all class
container.register(Client, {
    useValue: new Client()
});

container.register("ICommandParser", {
    useClass: CommandParser
});

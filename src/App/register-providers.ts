import {Client} from "discord.js";
import {container} from "tsyringe";
import {CommandParser} from "./CommandParser";
import IndodaxCryptoPrices from "../Repositories/IndodaxCryptoPrices";
import {Lifecycle} from "tsyringe";
import IndodaxApiImpl from "../Api/IndodaxApiImpl";
import IndodaxKlinePooling from "../Api/IndodaxKlinePooling";

// register all class
container.register(Client, {
    useValue: new Client({
        retryLimit: 10
    })
});

container.register("ICommandParser", {
    useClass: CommandParser
});

container.register("CryptoPricesRepository", {
   useClass: IndodaxCryptoPrices
}, {
    lifecycle: Lifecycle.Singleton
});

container.register("IndodaxApi", {
    useClass: IndodaxApiImpl
});

container.register("IndodaxKlineWebsocket", {
    useClass: IndodaxKlinePooling
});

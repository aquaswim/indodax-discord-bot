import {Client} from "discord.js";
import {container} from "tsyringe";
import {CommandParser} from "./CommandParser";
import IndodaxCryptoPrices from "../Repositories/IndodaxCryptoPrices";
import {Lifecycle} from "tsyringe";
import IndodaxApiImpl from "../Api/IndodaxApiImpl";
import IndodaxKlineWebsocketImpl from "../Api/IndodaxKlineWebsocketImpl";
import WinstonLogger from "./LoggerImpl";

// register all class
container.register(Client, {
    useValue: new Client({
        retryLimit: 10
    })
});

container.register("Logger", {
    useClass: WinstonLogger
})

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
    useClass: IndodaxKlineWebsocketImpl
});

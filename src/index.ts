import "reflect-metadata";
import {config} from "dotenv";
import {container} from "tsyringe";
import "./App/register-providers";
import App from "./App/App";
import PingHandler from "./Commands/Ping";
import StopAlertHandler from "./Commands/StopAlert";
import AlertHandler from "./Commands/Alert";
import ListHandler from "./Commands/List";
import GetPriceHandler from "./Commands/Price";
import ListAlertHandler from "./Commands/ListAlert";

// initialize dotenv
config();
// get the app
const app = container.resolve(App);

// register commands
app
    .registerHandler("ping", PingHandler)
    .registerHandler("alert", AlertHandler)
    .registerHandler("stop-alert", StopAlertHandler)
    .registerHandler("list", ListHandler)
    .registerHandler("price", GetPriceHandler)
    .registerHandler("list-alert", ListAlertHandler);

// start the app
app.start();

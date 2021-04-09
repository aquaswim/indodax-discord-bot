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

// initialize dotenv
config();
// get the app
const app = container.resolve(App);

// register commands
app.registerHandler("ping", PingHandler);
app.registerHandler("alert", AlertHandler);
app.registerHandler("stop-alert", StopAlertHandler);
app.registerHandler("list", ListHandler);
app.registerHandler("price", GetPriceHandler);

// start the app
app.start();

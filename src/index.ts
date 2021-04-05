import "reflect-metadata";
import {config} from "dotenv";
import {container} from "tsyringe";
import "./App/register-providers";
import App from "./App/App";
import pingHandler from "./Commands/Ping";

// initialize dotenv
config();
// get the app
const app = container.resolve(App);

// register commands
app.registerHandler("ping", pingHandler);

// start the app
app.start();

import "reflect-metadata";
import {config} from "dotenv";
import {container} from "tsyringe";
import "./App/register-providers";
import App from "./App/App";
import PingHandler from "./Commands/Ping";

// initialize dotenv
config();
// get the app
const app = container.resolve(App);

// register commands
app.registerHandler("ping", container.resolve(PingHandler));

// start the app
app.start();

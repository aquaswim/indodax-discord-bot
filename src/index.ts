import "reflect-metadata";
import {config} from "dotenv";
import {container} from "tsyringe";
import "./App/register-providers";
import App from "./App/App";

// initialize dotenv
config();

// start the app
container.resolve(App).start();

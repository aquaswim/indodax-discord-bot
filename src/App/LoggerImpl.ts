import winston from "winston";
import Logger from "../Contracts/Logger";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `[${info.level}] ${info.timestamp} ${info.message}`
        })
    ),
    defaultMeta: {module: "general"},
    transports: [
        // console transport (since i only need this)
        new winston.transports.Console()
    ]
});

class LoggerImpl implements Logger{
    constructor() {
    }

    error(message: string | Error): void {
        if (message instanceof Error) {
            logger.error(`${message.message}\n${message.stack}`);
        } else {
            logger.error(message);
        }
    }

    info(...message: string[]): void {
        logger.info(message.join(" "));
    }

    warning(...message: string[]): void {
        logger.warning(message.join(""));
    }
}

export default LoggerImpl;

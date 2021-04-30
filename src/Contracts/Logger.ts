interface Logger {
    error(message: string | Error): void;
    info(...message: string[]): void;
    warning(...message: string[]): void;
}

export default Logger;

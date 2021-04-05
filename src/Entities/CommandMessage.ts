export interface ICommandMessage{
    command: string;
    args: string[]
}

class CommandMessage implements ICommandMessage{
    constructor(public command: string, public args: string[] = []) {
    }

    public getArg(index: number): string|undefined {
        return this.args[index];
    }
}

export default CommandMessage;

import {should} from "chai";
import {CommandParser} from "./CommandParser";
import {Message, Client, TextChannel, Guild} from "discord.js";

function createDummyMessage(content: string): Message {
    const dummyClient = new Client();
    const dummyGuild = new Guild(dummyClient, {});
    const dummyChannel = new TextChannel(dummyGuild, {});
    const dummyMessage = new Message(dummyClient, {
        id: 'randomsnowflakeid.yeahyeah',
        content
    }, dummyChannel);
    return dummyMessage;
}

describe('Command parser testing', function () {
    const parser = new CommandParser("%");
    it('should able to parse command with prefix %', function () {
        const cmdArr = ["cmd","arg1", "arg2", "arg3", "arg4"];
        for (let i = 1; i <= cmdArr.length; i++) {
            const cmds = cmdArr.slice(0, i);
            const dummyMessage = createDummyMessage("%" + cmds.join(" "));
            const cmd = parser.parseMessage(dummyMessage);
            should().equal(cmd.command, cmds[0]);
            for (let j = 1 /*Skip first index*/; j < cmds.length; j++) {
                should().equal(cmd.getArg(j-1), cmds[j]);
            }
        }
    });
});

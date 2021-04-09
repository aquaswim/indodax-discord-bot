import crypto from "crypto";
import random from "randomstring";

export function generateIdSimple() {
    return crypto
        .createHash("md5")
        .update(Date.now().toString(10)+(Math.round(Math.random()*99999999999)).toString())
        .digest()
        .toString("hex");
}

export function generateIdSimpleV2() {
    return random.generate({
        length: 5,
        charset: "alphanumeric",
        capitalization: "uppercase",
        readable: true
    });
}

import crypto from "crypto";

export function generateIdSimple() {
    return crypto
        .createHash("md5")
        .update(Date.now().toString(10)+(Math.round(Math.random()*99999999999)).toString())
        .digest()
        .toString("hex");
}

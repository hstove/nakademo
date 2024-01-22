import { base58, hex } from "@scure/base";

const [keyHex] = process.argv.slice(2);

const keyBuff = hex.decode(keyHex);

console.log(keyBuff);

const key = base58.encode(keyBuff);

console.log(key);

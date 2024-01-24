import {
  ClarityValue,
  createStacksPrivateKey,
  serializeCV,
  signWithKey,
  StacksPrivateKey,
  stringAsciiCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import { createHash } from 'crypto';
import { hex } from '@scure/base';

const structuredDataPrefix = new Uint8Array([0x53, 0x49, 0x50, 0x30, 0x31, 0x38]);

const chainIds = {
  mainnet: 1,
  testnet: 2147483648,
};

function sha256(data: Uint8Array): Uint8Array {
  return createHash('sha256').update(data).digest();
}

function structuredDataHash(structuredData: ClarityValue): Uint8Array {
  return sha256(serializeCV(structuredData));
}

const domainHash = structuredDataHash(
  tupleCV({
    name: stringAsciiCV('Dapp Name'),
    version: stringAsciiCV('1.0.0'),
    'chain-id': uintCV(chainIds.mainnet),
  })
);

export function makeStructuredDataInput(structuredData: ClarityValue, domain: ClarityValue) {
  const domainHash = structuredDataHash(domain);
  const messageHash = structuredDataHash(structuredData);
  const input = new Uint8Array([...structuredDataPrefix, ...domainHash, ...messageHash]);
  return input;
}

export function makeStructuredDataHash(structuredData: ClarityValue, domain: ClarityValue) {
  // const domainHash = structuredDataHash(domain);
  // const messageHash = structuredDataHash(structuredData);
  // const input = new Uint8Array([...structuredDataPrefix, ...domainHash, ...messageHash]);
  const input = makeStructuredDataInput(structuredData, domain);
  const hash = sha256(input);
  return hash;
}

export function signStructuredData(
  privateKey: string | Uint8Array,
  structuredData: ClarityValue
): Uint8Array {
  const messageHash = structuredDataHash(structuredData);
  const input = sha256(Buffer.concat([structuredDataPrefix, domainHash, messageHash]));
  return sign(hex.encode(input), privateKey);
  // const data = signWithKey(privateKey, input.toString('hex')).data;
  // return hex.decode(data.slice(2) + data.slice(0, 2));
  // return Buffer.from(data.slice(2) + data.slice(0, 2), 'hex');
}

export function sign(hash: string, privateKey: string | Uint8Array) {
  const key = createStacksPrivateKey(privateKey);
  const data = signWithKey(key, hash).data;
  return hex.decode(data.slice(2) + data.slice(0, 2));
}

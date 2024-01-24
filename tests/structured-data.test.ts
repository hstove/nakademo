import { expect, test } from 'vitest';
import { tupleCV, stringAsciiCV, uintCV } from '@stacks/transactions';
import { makeStructuredDataHash, makeStructuredDataInput } from '../src/structured-data';
import { hex } from '@scure/base';

test('sip18 structured data', () => {
  const domain = tupleCV({
    name: stringAsciiCV('Test App'),
    version: stringAsciiCV('1.0.0'),
    'chain-id': uintCV(1),
  });

  const data = stringAsciiCV('Hello World');

  const hash = makeStructuredDataHash(data, domain);

  console.log(hex.encode(hash));
});

test.only('sip18 structured data', () => {
  // const rust_val =
  //   '3531321e1f262538b5dc06c5ae2f11549261d7ae174d9f77a55a92b00f330884695497be50655297eef9765c466d945ad1cb2c81b30b9fed6c165575dc9226e9edf78b8cd9e8';

  const rust_val =
    '3531321e1f262538b5dc06c5ae2f11549261d7ae174d9f77a55a92b00f330884695497be50655297eef9765c466d945ad1cb2c81b30b9fed6c165575dc9226e9edf78b8cd9e8';
  const domain = tupleCV({
    name: stringAsciiCV('Test App'),
    version: stringAsciiCV('1.0.0'),
    'chain-id': uintCV(1),
  });

  const data = stringAsciiCV('Hello World');

  const message = makeStructuredDataInput(data, domain);

  console.log(hex.encode(message));
  expect(rust_val).toEqual(hex.encode(message));
  // expect(hex.encode(message)).toBe(rust_val);
});

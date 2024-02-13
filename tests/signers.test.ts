import { pox, deployer, alice, bob, charlie, contracts } from './helpers';
import { beforeAll, describe, expect, test, it } from 'vitest';
import {
  txErr,
  txOk,
  tx,
  ro,
  roOk,
  roErr,
  chain,
  rov,
  rovOk,
  rovErr,
  mapGet,
  varGet,
  TransactionResult,
  filterEvents,
} from '@clarigen/test';
import {
  compressPublicKey,
  makeRandomPrivKey,
  privateKeyToString,
  pubKeyfromPrivKey,
  publicKeyToString,
  randomBytes,
} from '@stacks/transactions';
import { hex } from '@scure/base';
import { sign } from '../src/structured-data';
import { secp256k1 } from '@noble/curves/secp256k1';
import { Address, NETWORK } from '@scure/btc-signer';

const utils = secp256k1.utils;
const { randomPrivateKey } = secp256k1.utils;
const aliceKey = randomPrivateKey();

const contract = contracts.signers;

type SetParams = Parameters<(typeof contract)['stackerdbSetSignerSlots']>;
// type SetParam = SetParams[0][0];
type SetParam = {
  numSlots: number;
  signer: string;
};

function makeSigner(): SetParam {
  return {
    signer: alice,
    numSlots: 1,
  };
}

describe.skip('signers', () => {
  it('sets signers', () => {
    let signers: SetParam[] = [];
    for (let i = 0; i < 3999; i++) {
      signers.push(makeSigner());
    }
    const result = txOk(contract.stackerdbSetSignerSlots(signers, 1n), alice);
  });

  it('gets results', () => {
    // const receipt = ro(contract.stackerdbGetSignerSlots(1n));
    const receipt = txOk(contract.getSlots(), alice);
    console.log(receipt);
  });
});

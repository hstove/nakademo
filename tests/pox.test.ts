import { pox, deployer, alice, bob, charlie } from './helpers';
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

export type PoxAddress = {
  version: Uint8Array;
  hashbytes: Uint8Array;
};

export function getPoxAddressFromString(address: string) {
  const addr = Address().decode(address);
  if (addr.type === 'pkh') {
    return {
      version: new Uint8Array([NETWORK.pubKeyHash]),
      hashbytes: addr.hash,
    };
  } else if (addr.type === 'sh') {
    return {
      version: new Uint8Array([NETWORK.scriptHash]),
      hashbytes: addr.hash,
    };
  } else if (addr.type === 'wsh') {
    return {
      version: new Uint8Array([10]),
      hashbytes: addr.hash,
    };
  } else if (addr.type === 'wpkh') {
    return {
      version: new Uint8Array([6]),
      hashbytes: addr.hash,
    };
  }
  throw new Error(`Unable to decode address ${address}`);
}

function makePoxAddr() {
  return {
    version: new Uint8Array([1]),
    hashbytes: hex.decode('0'.repeat(40)),
  };
}

function makeSignerSig({
  poxAddress,
  privateKey,
  rewardCycle,
  period,
  topic,
}: {
  poxAddress: PoxAddress;
  privateKey: string | Uint8Array;
  rewardCycle: number | bigint;
  period: number | bigint;
  topic: string;
}) {
  const hash = rov(
    pox.getSignerKeyMessageHash({
      poxAddr: poxAddress,
      rewardCycle,
      period,
      topic,
    })
  );
  return sign(hash, privateKey);
}

function currentCycle() {
  return rov(pox.currentPoxRewardCycle());
}

const alicePox = makePoxAddr();

describe('pox delegation', () => {
  beforeAll(async () => {
    // simnet.setEpoch('')
    const curHeight = simnet.blockHeight;
    const e3 = 121;
    simnet.mineEmptyBlocks(e3 - curHeight);

    // console.log(simnet.currentEpoch);
  });

  let minAmount: bigint;

  test('minimum amount', () => {
    minAmount = rov(pox.getStackingMinimum());
    // console.log(minAmount);
  });

  const alicePrivateKey = randomPrivateKey();
  const alicePublic = secp256k1.getPublicKey(alicePrivateKey, true);
  // const aliceSigner = hex.decode(privateKeyToString(makeRandomPrivKey()));
  // compress
  // const alicePublic = hex.decode(
  //   publicKeyToString(compressPublicKey(pubKeyfromPrivKey(aliceSigner)))
  // );
  // const alicePublic = hex.decode(
  //   publicKeyToString(compressPublicKey(publicKeyToString(pubKeyfromPrivKey(aliceSigner))))
  // );

  test.skip('alice can stack', () => {
    const poxAddr = makePoxAddr();
    const signerSig = makeSignerSig({
      poxAddress: poxAddr,
      privateKey: alicePrivateKey,
      topic: 'stack-stx',
      rewardCycle: 1,
      period: 1,
    });
    const result = txOk(
      pox.stackStx({
        amountUstx: minAmount,
        startBurnHt: simnet.blockHeight,
        poxAddr: poxAddr,
        lockPeriod: 1,
        signerKey: alicePrivateKey,
        signerSig,
      }),
      alice
    );

    const state = rov(pox.getStackerInfo(alice));
    console.log(state);
    expect(state).toBeTruthy();
  });

  // test('verifying signatures', () => {
  //   const signerSig = makeSignerSig(alice, alicePrivateKey);
  //   const result = rov(
  //     pox.verifySignerKeySig({
  //       stacker: alice,
  //       signerKey: alicePublic,
  //       signerSig,
  //     })
  //   );
  // });

  describe('delegation', () => {
    it('bob delegates for less than minimum', () => {
      txOk(
        pox.delegateStx({
          delegateTo: alice,
          amountUstx: minAmount - 1n,
          poxAddr: null,
          untilBurnHt: null,
          // untilBurnHt: simnet.blockHeight,
        }),
        bob
      );
    });

    it('alice can delegate-stack-stx', () => {
      const poxAddr = makePoxAddr();
      // const sig = makeSignerSig({ poxAddress: poxAddr, privateKey: alicePrivateKey });
      txOk(
        pox.delegateStackStx({
          stacker: bob,
          poxAddr,
          startBurnHt: simnet.blockHeight,
          lockPeriod: 1,
          amountUstx: minAmount - 1n,
          // signerKey: alicePublic,
          // signerSig: sig,
        }),
        alice
      );
    });

    it('alice cannot call stack-agg-commit', () => {
      const signature = makeSignerSig({
        poxAddress: alicePox,
        privateKey: alicePrivateKey,
        topic: 'agg-commit',
        period: 1,
        rewardCycle: 1,
      });
      const result = txErr(
        pox.stackAggregationCommit({
          rewardCycle: 1,
          poxAddr: alicePox,
          signerKey: alicePublic,
          signerSig: signature,
        }),
        alice
      );
      expect(result.value).toEqual(11n);
    });

    it('charlie increases', () => {
      txOk(
        pox.delegateStx({
          delegateTo: alice,
          amountUstx: 1n,
          poxAddr: null,
          untilBurnHt: null,
          // untilBurnHt: simnet.blockHeight,
        }),
        charlie
      );

      const poxAddr = makePoxAddr();
      txOk(
        pox.delegateStackStx({
          stacker: charlie,
          poxAddr: poxAddr,
          startBurnHt: simnet.blockHeight,
          lockPeriod: 1,
          amountUstx: 1n,
          // signerKey: alicePublic,
          // signerSig,
        }),
        alice
      );
    });

    it('alice can call stack-agg-commit', () => {
      const poxAddr = makePoxAddr();
      const signature = makeSignerSig({
        poxAddress: poxAddr,
        privateKey: alicePrivateKey,
        rewardCycle: 1,
        topic: 'agg-commit',
        period: 1,
      });
      const result = txOk(
        pox.stackAggregationCommit({
          rewardCycle: 1,
          poxAddr: alicePox,
          signerKey: alicePublic,
          signerSig: signature,
        }),
        alice
      );
      expect(result.value).toEqual(true);
    });

    it('can alice solo stack with a different reward address', () => {
      const poxAddr = makePoxAddr();
      poxAddr.hashbytes = randomBytes(20);
      let rewardCycle = rov(pox.currentPoxRewardCycle());
      const signature = makeSignerSig({
        poxAddress: poxAddr,
        privateKey: alicePrivateKey,
        topic: 'stack-stx',
        period: 1,
        rewardCycle,
      });
      const result = txOk(
        pox.stackStx({
          signerKey: alicePublic,
          signerSig: signature,
          poxAddr,
          amountUstx: minAmount,
          startBurnHt: simnet.blockHeight,
          lockPeriod: 1,
        }),
        alice
      );
    });
  });
});

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
import { CoreNodeEventType } from '@clarigen/core';
import { describe, it, test, beforeAll, expect } from 'vitest';
import { hex } from '@scure/base';

import { contracts, alice, deployer } from './helpers';
import { sign } from '../src/structured-data';
import { createStacksPrivateKey, getPublicKey } from '@stacks/transactions';

const contract = contracts.delegateSig;

export function signatureVrsToRsv(signature: string) {
  return signature.slice(2) + signature.slice(0, 2);
}

function generateSignature(stacker: string, signerKey: string, privateKey: string) {
  const hash = rov(contract.getSignerKeyMessageHash({ stacker, signerKey: hex.decode(signerKey) }));
  const sig = sign(hex.encode(hash), privateKey);
  // const data = `${stacker} ${rewardCycle}`;
  // const sig = txOk(contract.delegateSignature({ data }, { sender: alice.address, privateKey }));
  // return signatureVrsToRsv(sig);
}

function setRewardCycle(cycle: number | bigint) {
  txOk(contract.setRewardCycle(cycle), deployer);
}

describe('delegate sig', () => {
  it.skip('can verify data', () => {
    const sigHex =
      '58f685165d441e77677aeca1b9bc276aff929d343e6004c216bbc68e0a3d4cbe5c77c2f356a620530e3a62c2d726bbb462e08c10fff632189cc5bd2f8d7206cc01';
    const hashHex = 'a4e8e2fcecd8ba7db8f9c2e7fbd78c3b3dd4ac109483b8891c2deff5ea7e07dd';
    // const hashHex = 'a4e8e2fcecd8ba7db8f9c2e7fbd78c3b3dd4ac109483b8891c2deff5ea7e07dd';
    // const sigHex =
    //   '0158f685165d441e77677aeca1b9bc276aff929d343e6004c216bbc68e0a3d4cbe5c77c2f356a620530e3a62c2d726bbb462e08c10fff632189cc5bd2f8d7206cc';
    const sender = 'ST2Q1B4S2DY2Y96KYNZTVCCZZD1V9AGWCS5MFXM4C';
    const rewardCycle = 22;

    const delegate = 'ST1GCB6NH3XR67VT4R5PKVJ2PYXNVQ4AYQATXNP4P';

    // const sig = hex.decode(signatureVrsToRsv(sigHex));
    const sig = hex.decode(sigHex);
    const hash = hex.decode(hashHex);
    rovOk(
      contract.verifyDelegateSignature({
        sender,
        delegate,
        delegateSig: sig,
        rewardCycle,
      })
    );
  });
  test('new signature format', () => {
    const stacker = 'ST3DYDR173ZWF79YJ40JEHDPVAR2815PDZ0PF8C67';
    const sigHex =
      'c1c35246d1f682644214c3145757a05e5475fe7b5693db5025a6694540f60748546d458f86eb3dbd08803f2b642882f7e0f5492d450402d50f98282fd38aacf800';
    const keyHex = '00eed368626b96e482944e02cc136979973367491ea923efb57c482933dd7c0b01';

    const sig = hex.decode(sigHex);
    const key = hex.decode(keyHex);
    const result = rovOk(
      contract.verifySigningKeySignature({
        signerSig: sig,
        signingKey: key,
        stacker,
      })
    );
    expect(result).toBe(true);
  });

  test.only('from stack-stx', () => {
    const data =
      'ST3DYDR173ZWF79YJ40JEHDPVAR2815PDZ0PF8C67 22 6792fc3fca6459e761515bdba3921365d600b3bfdc855c8eb9174b6c3e3b34305e101b4a838bd00074490efba1d2b861cc799fca205b90da7ad8d7652a48cc3000 11d055ac8b0ab4f04c5eb5ea4b4def9c60ae338355d81c9411b27b4f49da2a8301';
    const [stacker, rewardCycle, sig, key] = data.split(' ') as [string, string, string, string];
    setRewardCycle(parseInt(rewardCycle, 10));
    const pubKey = getPublicKey(createStacksPrivateKey(key));
    const result = rovOk(
      contract.verifySigningKeySignature({
        signerSig: hex.decode(sig),
        // signingKey: hex.decode(pubKey.data),
        signingKey: pubKey.data,
        stacker,
      })
    );
    expect(result).toEqual(true);
  });

  test.only('signing from rust code', () => {
    const data =
      'ST3DYDR173ZWF79YJ40JEHDPVAR2815PDZ0PF8C67 22 6792fc3fca6459e761515bdba3921365d600b3bfdc855c8eb9174b6c3e3b34305e101b4a838bd00074490efba1d2b861cc799fca205b90da7ad8d7652a48cc3000 11d055ac8b0ab4f04c5eb5ea4b4def9c60ae338355d81c9411b27b4f49da2a8301';
    const [stacker, rewardCycle, sig, key] = data.split(' ') as [string, string, string, string];
    setRewardCycle(parseInt(rewardCycle, 10));
    // const signature = generateSignature(stacker, key, key);
  });
});

import {
  makeContractCall,
  createStacksPrivateKey,
  pubKeyfromPrivKey,
  compressPublicKey,
} from '@stacks/transactions';
import { StackingClient, signPox4SignatureHash, Pox4SignatureTopic } from '@stacks/stacking';
import { StacksDevnet } from '@stacks/network';
import { hex } from '@scure/base';

const stackers = [
  '7287ba251d44a4d3fd9276c88ce34c5c52a038955511cccaf77e61068649c17801',
  '530d9f61984c888536871c6573073bdfc0058896dc1adfe9a6a10dfacadc209101',
] as const;

// export const STACKER_SK = '7287ba251d44a4d3fd9276c88ce34c5c52a038955511cccaf77e61068649c17801';
// export const STACKER_PK = compressPublicKey(pubKeyfromPrivKey(STACKER_SK).data);

const network = new StacksDevnet({
  url: 'http://localhost:20443',
});

const client = new StackingClient('ST000000000000000000002AMW42H.pox-4', network);

async function run() {
  const txs = stackers.map(async stackerSk => {
    const stackerPk = compressPublicKey(pubKeyfromPrivKey(stackerSk).data);

    const signature = signPox4SignatureHash({
      topic: Pox4SignatureTopic.StackStx,
      poxAddress: 'n3GRiDLKWuKLCw1DZmV75W1mE35qmW2tQm',
      period: 12,
      privateKey: createStacksPrivateKey(stackerSk),
      network,
      rewardCycle: 20,
    });

    const result = await client.stack({
      amountMicroStx: 50_160_000_000_000,
      poxAddress: 'n3GRiDLKWuKLCw1DZmV75W1mE35qmW2tQm',
      cycles: 12,
      signerKey: hex.encode(stackerPk.data),
      signerSignature: signature,
      burnBlockHeight: 200,
      network,
      privateKey: stackerSk,
    });

    console.log(result);
  });
  await Promise.all(txs);
  // const signature = signPox4SignatureHash({
  //   topic: Pox4SignatureTopic.StackStx,
  //   poxAddress: 'n3GRiDLKWuKLCw1DZmV75W1mE35qmW2tQm',
  //   period: 12,
  //   privateKey: createStacksPrivateKey(STACKER_SK),
  //   network,
  //   rewardCycle: 20,
  // });

  // const result = await client.stack({
  //   amountMicroStx: 50_160_000_000_000,
  //   poxAddress: 'n3GRiDLKWuKLCw1DZmV75W1mE35qmW2tQm',
  //   cycles: 12,
  //   signerKey: hex.encode(STACKER_PK.data),
  //   signerSignature: signature,
  //   burnBlockHeight: 200,
  //   network,
  //   privateKey: STACKER_SK,
  // });

  // console.log(result);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });

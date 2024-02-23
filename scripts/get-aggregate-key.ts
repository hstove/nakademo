import { contractFactory, ClarigenClient } from '@clarigen/core';
import { contracts } from '../src/clarigen-types';

const pox = contractFactory(contracts.mockPox4, 'ST000000000000000000002AMW42H.pox-4');
const voting = contractFactory(
  contracts.signersVoting,
  'ST000000000000000000002AMW42H.signers-voting'
);

const client = new ClarigenClient('http://localhost:20443');

let [cycle] = process.argv.slice(2);

async function run() {
  const keyRes = await client.ro(voting.getApprovedAggregateKey(parseInt(cycle, 10)));
  console.log(keyRes);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });

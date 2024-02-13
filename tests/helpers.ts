// Move this stuff into @clarigen/test
// import { mapGet, rov, varGet } from '@clarigen/test';
import { project, accounts as _accounts } from '../src/clarigen-types';
import {
  bootContractIdentifier,
  contractFactory,
  projectFactory,
  rawClarityToValue,
} from '@clarigen/core';

export const contracts = projectFactory(project, 'simnet');

// export const pox = contractFactory(contracts.pox4, bootContractIdentifier('pox-4', false));
export const pox = contracts.mockPox4;
// export const pox = contractFactory(contracts.mockPox4, bootContractIdentifier('pox-4', false));

// export const contract = contracts.fundraiser;

// export const tokenAsset = `${contract.identifier}::${contract.fungible_tokens[0].name}`;

export interface Account {
  address: string;
  balance: number;
}
export type Accounts = Readonly<{
  deployer: Account;
  [name: string]: Account;
}>;

type ValOf<A extends Accounts, K extends keyof A> = A[K];

type AddressesOf<A extends Accounts, Keys extends (keyof A)[]> = {
  [K in keyof Keys]: A[Keys[K]]['address'];
};

export class AccountMap<A extends Accounts> extends Map {
  public a: A;
  constructor(accounts: A) {
    super();
    this.a = accounts;
  }

  get<K extends keyof A>(key: K): ValOf<A, K> {
    return this.a[key];
  }

  addr<K extends keyof A>(key: K): ValOf<A, K>['address'] {
    return this.a[key].address;
  }

  addresses<Keys extends (keyof A)[]>(...keys: Keys): AddressesOf<A, Keys> {
    const vals = keys.map(k => this.a[k].address) as AddressesOf<A, Keys>;
    return vals;
  }
}

export const accounts = new AccountMap(_accounts);

export const alice = accounts.addr('wallet_1');
export const deployer = accounts.addr('deployer');
export const bob = accounts.addr('wallet_2');
export const charlie = accounts.addr('wallet_3');

export function getStxBalance(address: string) {
  const result = simnet.runSnippet(`(stx-get-balance '${address})`);
  return rawClarityToValue(result[1], 'uint128');
}

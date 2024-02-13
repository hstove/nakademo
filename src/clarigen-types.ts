export type ClarityAbiTypeBuffer = { buffer: { length: number } };
export type ClarityAbiTypeStringAscii = { 'string-ascii': { length: number } };
export type ClarityAbiTypeStringUtf8 = { 'string-utf8': { length: number } };
export type ClarityAbiTypeResponse = {
  response: { ok: ClarityAbiType; error: ClarityAbiType };
};
export type ClarityAbiTypeOptional = { optional: ClarityAbiType };
export type ClarityAbiTypeTuple = {
  tuple: readonly { name: string; type: ClarityAbiType }[];
};
export type ClarityAbiTypeList = {
  list: { type: ClarityAbiType; length: number };
};

export type ClarityAbiTypeUInt128 = 'uint128';
export type ClarityAbiTypeInt128 = 'int128';
export type ClarityAbiTypeBool = 'bool';
export type ClarityAbiTypePrincipal = 'principal';
export type ClarityAbiTypeTraitReference = 'trait_reference';
export type ClarityAbiTypeNone = 'none';

export type ClarityAbiTypePrimitive =
  | ClarityAbiTypeUInt128
  | ClarityAbiTypeInt128
  | ClarityAbiTypeBool
  | ClarityAbiTypePrincipal
  | ClarityAbiTypeTraitReference
  | ClarityAbiTypeNone;

export type ClarityAbiType =
  | ClarityAbiTypePrimitive
  | ClarityAbiTypeBuffer
  | ClarityAbiTypeResponse
  | ClarityAbiTypeOptional
  | ClarityAbiTypeTuple
  | ClarityAbiTypeList
  | ClarityAbiTypeStringAscii
  | ClarityAbiTypeStringUtf8
  | ClarityAbiTypeTraitReference;

export interface ClarityAbiArg {
  name: string;
  type: ClarityAbiType;
}

export interface ClarityAbiFunction {
  name: string;
  access: 'private' | 'public' | 'read_only';
  args: ClarityAbiArg[];
  outputs: {
    type: ClarityAbiType;
  };
}

export type TypedAbiArg<T, N extends string> = { _t?: T; name: N };

export type TypedAbiFunction<T extends TypedAbiArg<unknown, string>[], R> = ClarityAbiFunction & {
  _t?: T;
  _r?: R;
};

export interface ClarityAbiVariable {
  name: string;
  access: 'variable' | 'constant';
  type: ClarityAbiType;
}

export type TypedAbiVariable<T> = ClarityAbiVariable & {
  defaultValue: T;
};

export interface ClarityAbiMap {
  name: string;
  key: ClarityAbiType;
  value: ClarityAbiType;
}

export type TypedAbiMap<K, V> = ClarityAbiMap & {
  _k?: K;
  _v?: V;
};

export interface ClarityAbiTypeFungibleToken {
  name: string;
}

export interface ClarityAbiTypeNonFungibleToken<T = unknown> {
  name: string;
  type: ClarityAbiType;
  _t?: T;
}

export interface ClarityAbi {
  functions: ClarityAbiFunction[];
  variables: ClarityAbiVariable[];
  maps: ClarityAbiMap[];
  fungible_tokens: ClarityAbiTypeFungibleToken[];
  non_fungible_tokens: readonly ClarityAbiTypeNonFungibleToken<unknown>[];
}

export type TypedAbi = Readonly<{
  functions: {
    [key: string]: TypedAbiFunction<TypedAbiArg<unknown, string>[], unknown>;
  };
  variables: {
    [key: string]: TypedAbiVariable<unknown>;
  };
  maps: {
    [key: string]: TypedAbiMap<unknown, unknown>;
  };
  constants: {
    [key: string]: unknown;
  };
  fungible_tokens: Readonly<ClarityAbiTypeFungibleToken[]>;
  non_fungible_tokens: Readonly<ClarityAbiTypeNonFungibleToken<unknown>[]>;
  contractName: string;
  contractFile?: string;
}>;

export interface ResponseOk<T, E> {
  value: T;
  isOk: true;
  _e?: E;
}

export interface ResponseErr<T, E> {
  value: E;
  isOk: false;
  _o?: T;
}

export type Response<Ok, Err> = ResponseOk<Ok, Err> | ResponseErr<Ok, Err>;

export type OkType<R> = R extends ResponseOk<infer V, unknown> ? V : never;
export type ErrType<R> = R extends ResponseErr<unknown, infer V> ? V : never;

export const contracts = {
  delegateSig: {
    functions: {
      setRewardCycle: {
        name: 'set-reward-cycle',
        access: 'public',
        args: [{ name: 'cycle', type: 'uint128' }],
        outputs: { type: { response: { ok: 'bool', error: 'none' } } },
      } as TypedAbiFunction<
        [cycle: TypedAbiArg<number | bigint, 'cycle'>],
        Response<boolean, null>
      >,
      currentPoxRewardCycle: {
        name: 'current-pox-reward-cycle',
        access: 'read_only',
        args: [],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getSignerKeyMessageHash: {
        name: 'get-signer-key-message-hash',
        access: 'read_only',
        args: [
          { name: 'signer-key', type: { buffer: { length: 33 } } },
          { name: 'stacker', type: 'principal' },
        ],
        outputs: { type: { buffer: { length: 32 } } },
      } as TypedAbiFunction<
        [signerKey: TypedAbiArg<Uint8Array, 'signerKey'>, stacker: TypedAbiArg<string, 'stacker'>],
        Uint8Array
      >,
      verifyDelegateSignature: {
        name: 'verify-delegate-signature',
        access: 'read_only',
        args: [
          { name: 'sender', type: 'principal' },
          { name: 'delegate', type: 'principal' },
          { name: 'delegate-sig', type: { buffer: { length: 65 } } },
          { name: 'reward-cycle', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          sender: TypedAbiArg<string, 'sender'>,
          delegate: TypedAbiArg<string, 'delegate'>,
          delegateSig: TypedAbiArg<Uint8Array, 'delegateSig'>,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
        ],
        Response<boolean, bigint>
      >,
      verifyDelegatorSignature: {
        name: 'verify-delegator-signature',
        access: 'read_only',
        args: [
          { name: 'stacker', type: 'principal' },
          { name: 'delegator', type: 'principal' },
          { name: 'delegator-sig', type: { buffer: { length: 65 } } },
          { name: 'reward-cycle', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          delegator: TypedAbiArg<string, 'delegator'>,
          delegatorSig: TypedAbiArg<Uint8Array, 'delegatorSig'>,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
        ],
        Response<boolean, bigint>
      >,
      verifySigningKeySignature: {
        name: 'verify-signing-key-signature',
        access: 'read_only',
        args: [
          { name: 'stacker', type: 'principal' },
          { name: 'signing-key', type: { buffer: { length: 33 } } },
          { name: 'signer-sig', type: { buffer: { length: 65 } } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          signingKey: TypedAbiArg<Uint8Array, 'signingKey'>,
          signerSig: TypedAbiArg<Uint8Array, 'signerSig'>,
        ],
        Response<boolean, bigint>
      >,
    },
    maps: {},
    variables: {
      ERR_DELEGATION_INVALID_SIGNATURE: {
        name: 'ERR_DELEGATION_INVALID_SIGNATURE',
        type: {
          response: {
            ok: 'none',
            error: 'int128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      rewardCycleVar: {
        name: 'reward-cycle-var',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
    },
    // TODO: fix with clarinet v2
    constants: {
      ERR_DELEGATION_INVALID_SIGNATURE: {
        isOk: false,
        value: 35n,
      },
      rewardCycleVar: 22n,
    },
    // constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    epoch: 'Epoch24',
    clarity_version: 'Clarity2',
    contractName: 'delegate-sig',
  },
  mockPox4: {
    functions: {
      addPoxAddrToIthRewardCycle: {
        name: 'add-pox-addr-to-ith-reward-cycle',
        access: 'private',
        args: [
          { name: 'cycle-index', type: 'uint128' },
          {
            name: 'params',
            type: {
              tuple: [
                { name: 'amount-ustx', type: 'uint128' },
                { name: 'first-reward-cycle', type: 'uint128' },
                { name: 'i', type: 'uint128' },
                { name: 'num-cycles', type: 'uint128' },
                {
                  name: 'pox-addr',
                  type: {
                    tuple: [
                      { name: 'hashbytes', type: { buffer: { length: 32 } } },
                      { name: 'version', type: { buffer: { length: 1 } } },
                    ],
                  },
                },
                { name: 'reward-set-indexes', type: { list: { type: 'uint128', length: 12 } } },
                { name: 'signer', type: { buffer: { length: 33 } } },
                { name: 'stacker', type: { optional: 'principal' } },
              ],
            },
          },
        ],
        outputs: {
          type: {
            tuple: [
              { name: 'amount-ustx', type: 'uint128' },
              { name: 'first-reward-cycle', type: 'uint128' },
              { name: 'i', type: 'uint128' },
              { name: 'num-cycles', type: 'uint128' },
              {
                name: 'pox-addr',
                type: {
                  tuple: [
                    { name: 'hashbytes', type: { buffer: { length: 32 } } },
                    { name: 'version', type: { buffer: { length: 1 } } },
                  ],
                },
              },
              { name: 'reward-set-indexes', type: { list: { type: 'uint128', length: 12 } } },
              { name: 'signer', type: { buffer: { length: 33 } } },
              { name: 'stacker', type: { optional: 'principal' } },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          cycleIndex: TypedAbiArg<number | bigint, 'cycleIndex'>,
          params: TypedAbiArg<
            {
              amountUstx: number | bigint;
              firstRewardCycle: number | bigint;
              i: number | bigint;
              numCycles: number | bigint;
              poxAddr: {
                hashbytes: Uint8Array;
                version: Uint8Array;
              };
              rewardSetIndexes: number | bigint[];
              signer: Uint8Array;
              stacker: string | null;
            },
            'params'
          >,
        ],
        {
          amountUstx: bigint;
          firstRewardCycle: bigint;
          i: bigint;
          numCycles: bigint;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          rewardSetIndexes: bigint[];
          signer: Uint8Array;
          stacker: string | null;
        }
      >,
      addPoxAddrToRewardCycles: {
        name: 'add-pox-addr-to-reward-cycles',
        access: 'private',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'first-reward-cycle', type: 'uint128' },
          { name: 'num-cycles', type: 'uint128' },
          { name: 'amount-ustx', type: 'uint128' },
          { name: 'stacker', type: 'principal' },
          { name: 'signer', type: { buffer: { length: 33 } } },
        ],
        outputs: {
          type: { response: { ok: { list: { type: 'uint128', length: 12 } }, error: 'int128' } },
        },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          firstRewardCycle: TypedAbiArg<number | bigint, 'firstRewardCycle'>,
          numCycles: TypedAbiArg<number | bigint, 'numCycles'>,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          stacker: TypedAbiArg<string, 'stacker'>,
          signer: TypedAbiArg<Uint8Array, 'signer'>,
        ],
        Response<bigint[], bigint>
      >,
      addPoxPartialStacked: {
        name: 'add-pox-partial-stacked',
        access: 'private',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'first-reward-cycle', type: 'uint128' },
          { name: 'num-cycles', type: 'uint128' },
          { name: 'amount-ustx', type: 'uint128' },
        ],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          firstRewardCycle: TypedAbiArg<number | bigint, 'firstRewardCycle'>,
          numCycles: TypedAbiArg<number | bigint, 'numCycles'>,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
        ],
        boolean
      >,
      addPoxPartialStackedToIthCycle: {
        name: 'add-pox-partial-stacked-to-ith-cycle',
        access: 'private',
        args: [
          { name: 'cycle-index', type: 'uint128' },
          {
            name: 'params',
            type: {
              tuple: [
                { name: 'amount-ustx', type: 'uint128' },
                { name: 'num-cycles', type: 'uint128' },
                {
                  name: 'pox-addr',
                  type: {
                    tuple: [
                      { name: 'hashbytes', type: { buffer: { length: 32 } } },
                      { name: 'version', type: { buffer: { length: 1 } } },
                    ],
                  },
                },
                { name: 'reward-cycle', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: {
          type: {
            tuple: [
              { name: 'amount-ustx', type: 'uint128' },
              { name: 'num-cycles', type: 'uint128' },
              {
                name: 'pox-addr',
                type: {
                  tuple: [
                    { name: 'hashbytes', type: { buffer: { length: 32 } } },
                    { name: 'version', type: { buffer: { length: 1 } } },
                  ],
                },
              },
              { name: 'reward-cycle', type: 'uint128' },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          cycleIndex: TypedAbiArg<number | bigint, 'cycleIndex'>,
          params: TypedAbiArg<
            {
              amountUstx: number | bigint;
              numCycles: number | bigint;
              poxAddr: {
                hashbytes: Uint8Array;
                version: Uint8Array;
              };
              rewardCycle: number | bigint;
            },
            'params'
          >,
        ],
        {
          amountUstx: bigint;
          numCycles: bigint;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          rewardCycle: bigint;
        }
      >,
      appendRewardCyclePoxAddr: {
        name: 'append-reward-cycle-pox-addr',
        access: 'private',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'amount-ustx', type: 'uint128' },
          { name: 'stacker', type: { optional: 'principal' } },
          { name: 'signer', type: { buffer: { length: 33 } } },
        ],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          stacker: TypedAbiArg<string | null, 'stacker'>,
          signer: TypedAbiArg<Uint8Array, 'signer'>,
        ],
        bigint
      >,
      foldUnlockRewardCycle: {
        name: 'fold-unlock-reward-cycle',
        access: 'private',
        args: [
          { name: 'set-index', type: 'uint128' },
          {
            name: 'data-res',
            type: {
              response: {
                ok: {
                  tuple: [
                    { name: 'cycle', type: 'uint128' },
                    { name: 'first-unlocked-cycle', type: 'uint128' },
                    { name: 'stacker', type: 'principal' },
                  ],
                },
                error: 'int128',
              },
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'cycle', type: 'uint128' },
                  { name: 'first-unlocked-cycle', type: 'uint128' },
                  { name: 'stacker', type: 'principal' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          setIndex: TypedAbiArg<number | bigint, 'setIndex'>,
          dataRes: TypedAbiArg<
            Response<
              {
                cycle: number | bigint;
                firstUnlockedCycle: number | bigint;
                stacker: string;
              },
              number | bigint
            >,
            'dataRes'
          >,
        ],
        Response<
          {
            cycle: bigint;
            firstUnlockedCycle: bigint;
            stacker: string;
          },
          bigint
        >
      >,
      handleUnlock: {
        name: 'handle-unlock',
        access: 'private',
        args: [
          { name: 'user', type: 'principal' },
          { name: 'amount-locked', type: 'uint128' },
          { name: 'cycle-to-unlock', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          user: TypedAbiArg<string, 'user'>,
          amountLocked: TypedAbiArg<number | bigint, 'amountLocked'>,
          cycleToUnlock: TypedAbiArg<number | bigint, 'cycleToUnlock'>,
        ],
        Response<boolean, bigint>
      >,
      increaseRewardCycleEntry: {
        name: 'increase-reward-cycle-entry',
        access: 'private',
        args: [
          { name: 'reward-cycle-index', type: 'uint128' },
          {
            name: 'updates',
            type: {
              optional: {
                tuple: [
                  { name: 'add-amount', type: 'uint128' },
                  { name: 'first-cycle', type: 'uint128' },
                  { name: 'reward-cycle', type: 'uint128' },
                  { name: 'stacker', type: 'principal' },
                ],
              },
            },
          },
        ],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'add-amount', type: 'uint128' },
                { name: 'first-cycle', type: 'uint128' },
                { name: 'reward-cycle', type: 'uint128' },
                { name: 'stacker', type: 'principal' },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [
          rewardCycleIndex: TypedAbiArg<number | bigint, 'rewardCycleIndex'>,
          updates: TypedAbiArg<
            {
              addAmount: number | bigint;
              firstCycle: number | bigint;
              rewardCycle: number | bigint;
              stacker: string;
            } | null,
            'updates'
          >,
        ],
        {
          addAmount: bigint;
          firstCycle: bigint;
          rewardCycle: bigint;
          stacker: string;
        } | null
      >,
      innerStackAggregationCommit: {
        name: 'inner-stack-aggregation-commit',
        access: 'private',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'signer-sig', type: { buffer: { length: 65 } } },
          { name: 'signer-key', type: { buffer: { length: 33 } } },
        ],
        outputs: { type: { response: { ok: 'uint128', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          signerSig: TypedAbiArg<Uint8Array, 'signerSig'>,
          signerKey: TypedAbiArg<Uint8Array, 'signerKey'>,
        ],
        Response<bigint, bigint>
      >,
      setAggregatePublicKey: {
        name: 'set-aggregate-public-key',
        access: 'private',
        args: [
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'aggregate-public-key', type: { buffer: { length: 33 } } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'none' } } },
      } as TypedAbiFunction<
        [
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          aggregatePublicKey: TypedAbiArg<Uint8Array, 'aggregatePublicKey'>,
        ],
        Response<boolean, null>
      >,
      allowContractCaller: {
        name: 'allow-contract-caller',
        access: 'public',
        args: [
          { name: 'caller', type: 'principal' },
          { name: 'until-burn-ht', type: { optional: 'uint128' } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          caller: TypedAbiArg<string, 'caller'>,
          untilBurnHt: TypedAbiArg<number | bigint | null, 'untilBurnHt'>,
        ],
        Response<boolean, bigint>
      >,
      delegateStackExtend: {
        name: 'delegate-stack-extend',
        access: 'public',
        args: [
          { name: 'stacker', type: 'principal' },
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'extend-count', type: 'uint128' },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'stacker', type: 'principal' },
                  { name: 'unlock-burn-height', type: 'uint128' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          extendCount: TypedAbiArg<number | bigint, 'extendCount'>,
        ],
        Response<
          {
            stacker: string;
            unlockBurnHeight: bigint;
          },
          bigint
        >
      >,
      delegateStackIncrease: {
        name: 'delegate-stack-increase',
        access: 'public',
        args: [
          { name: 'stacker', type: 'principal' },
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'increase-by', type: 'uint128' },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'stacker', type: 'principal' },
                  { name: 'total-locked', type: 'uint128' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          increaseBy: TypedAbiArg<number | bigint, 'increaseBy'>,
        ],
        Response<
          {
            stacker: string;
            totalLocked: bigint;
          },
          bigint
        >
      >,
      delegateStackStx: {
        name: 'delegate-stack-stx',
        access: 'public',
        args: [
          { name: 'stacker', type: 'principal' },
          { name: 'amount-ustx', type: 'uint128' },
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'start-burn-ht', type: 'uint128' },
          { name: 'lock-period', type: 'uint128' },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'lock-amount', type: 'uint128' },
                  { name: 'stacker', type: 'principal' },
                  { name: 'unlock-burn-height', type: 'uint128' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          startBurnHt: TypedAbiArg<number | bigint, 'startBurnHt'>,
          lockPeriod: TypedAbiArg<number | bigint, 'lockPeriod'>,
        ],
        Response<
          {
            lockAmount: bigint;
            stacker: string;
            unlockBurnHeight: bigint;
          },
          bigint
        >
      >,
      delegateStx: {
        name: 'delegate-stx',
        access: 'public',
        args: [
          { name: 'amount-ustx', type: 'uint128' },
          { name: 'delegate-to', type: 'principal' },
          { name: 'until-burn-ht', type: { optional: 'uint128' } },
          {
            name: 'pox-addr',
            type: {
              optional: {
                tuple: [
                  { name: 'hashbytes', type: { buffer: { length: 32 } } },
                  { name: 'version', type: { buffer: { length: 1 } } },
                ],
              },
            },
          },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          delegateTo: TypedAbiArg<string, 'delegateTo'>,
          untilBurnHt: TypedAbiArg<number | bigint | null, 'untilBurnHt'>,
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            } | null,
            'poxAddr'
          >,
        ],
        Response<boolean, bigint>
      >,
      disallowContractCaller: {
        name: 'disallow-contract-caller',
        access: 'public',
        args: [{ name: 'caller', type: 'principal' }],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<[caller: TypedAbiArg<string, 'caller'>], Response<boolean, bigint>>,
      revokeDelegateStx: {
        name: 'revoke-delegate-stx',
        access: 'public',
        args: [],
        outputs: {
          type: {
            response: {
              ok: {
                optional: {
                  tuple: [
                    { name: 'amount-ustx', type: 'uint128' },
                    { name: 'delegated-to', type: 'principal' },
                    {
                      name: 'pox-addr',
                      type: {
                        optional: {
                          tuple: [
                            { name: 'hashbytes', type: { buffer: { length: 32 } } },
                            { name: 'version', type: { buffer: { length: 1 } } },
                          ],
                        },
                      },
                    },
                    { name: 'until-burn-ht', type: { optional: 'uint128' } },
                  ],
                },
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [],
        Response<
          {
            amountUstx: bigint;
            delegatedTo: string;
            poxAddr: {
              hashbytes: Uint8Array;
              version: Uint8Array;
            } | null;
            untilBurnHt: bigint | null;
          } | null,
          bigint
        >
      >,
      setBurnchainParameters: {
        name: 'set-burnchain-parameters',
        access: 'public',
        args: [
          { name: 'first-burn-height', type: 'uint128' },
          { name: 'prepare-cycle-length', type: 'uint128' },
          { name: 'reward-cycle-length', type: 'uint128' },
          { name: 'begin-pox-4-reward-cycle', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          firstBurnHeight: TypedAbiArg<number | bigint, 'firstBurnHeight'>,
          prepareCycleLength: TypedAbiArg<number | bigint, 'prepareCycleLength'>,
          rewardCycleLength: TypedAbiArg<number | bigint, 'rewardCycleLength'>,
          beginPox4RewardCycle: TypedAbiArg<number | bigint, 'beginPox4RewardCycle'>,
        ],
        Response<boolean, bigint>
      >,
      stackAggregationCommit: {
        name: 'stack-aggregation-commit',
        access: 'public',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'signer-sig', type: { buffer: { length: 65 } } },
          { name: 'signer-key', type: { buffer: { length: 33 } } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          signerSig: TypedAbiArg<Uint8Array, 'signerSig'>,
          signerKey: TypedAbiArg<Uint8Array, 'signerKey'>,
        ],
        Response<boolean, bigint>
      >,
      stackAggregationCommitIndexed: {
        name: 'stack-aggregation-commit-indexed',
        access: 'public',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'signer-sig', type: { buffer: { length: 65 } } },
          { name: 'signer-key', type: { buffer: { length: 33 } } },
        ],
        outputs: { type: { response: { ok: 'uint128', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          signerSig: TypedAbiArg<Uint8Array, 'signerSig'>,
          signerKey: TypedAbiArg<Uint8Array, 'signerKey'>,
        ],
        Response<bigint, bigint>
      >,
      stackAggregationIncrease: {
        name: 'stack-aggregation-increase',
        access: 'public',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'reward-cycle-index', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          rewardCycleIndex: TypedAbiArg<number | bigint, 'rewardCycleIndex'>,
        ],
        Response<boolean, bigint>
      >,
      stackExtend: {
        name: 'stack-extend',
        access: 'public',
        args: [
          { name: 'extend-count', type: 'uint128' },
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'signer-sig', type: { buffer: { length: 65 } } },
          { name: 'signer-key', type: { buffer: { length: 33 } } },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'stacker', type: 'principal' },
                  { name: 'unlock-burn-height', type: 'uint128' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          extendCount: TypedAbiArg<number | bigint, 'extendCount'>,
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          signerSig: TypedAbiArg<Uint8Array, 'signerSig'>,
          signerKey: TypedAbiArg<Uint8Array, 'signerKey'>,
        ],
        Response<
          {
            stacker: string;
            unlockBurnHeight: bigint;
          },
          bigint
        >
      >,
      stackIncrease: {
        name: 'stack-increase',
        access: 'public',
        args: [{ name: 'increase-by', type: 'uint128' }],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'stacker', type: 'principal' },
                  { name: 'total-locked', type: 'uint128' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [increaseBy: TypedAbiArg<number | bigint, 'increaseBy'>],
        Response<
          {
            stacker: string;
            totalLocked: bigint;
          },
          bigint
        >
      >,
      stackStx: {
        name: 'stack-stx',
        access: 'public',
        args: [
          { name: 'amount-ustx', type: 'uint128' },
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'start-burn-ht', type: 'uint128' },
          { name: 'lock-period', type: 'uint128' },
          { name: 'signer-sig', type: { buffer: { length: 65 } } },
          { name: 'signer-key', type: { buffer: { length: 33 } } },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'lock-amount', type: 'uint128' },
                  { name: 'signer-key', type: { buffer: { length: 33 } } },
                  { name: 'stacker', type: 'principal' },
                  { name: 'unlock-burn-height', type: 'uint128' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          startBurnHt: TypedAbiArg<number | bigint, 'startBurnHt'>,
          lockPeriod: TypedAbiArg<number | bigint, 'lockPeriod'>,
          signerSig: TypedAbiArg<Uint8Array, 'signerSig'>,
          signerKey: TypedAbiArg<Uint8Array, 'signerKey'>,
        ],
        Response<
          {
            lockAmount: bigint;
            signerKey: Uint8Array;
            stacker: string;
            unlockBurnHeight: bigint;
          },
          bigint
        >
      >,
      burnHeightToRewardCycle: {
        name: 'burn-height-to-reward-cycle',
        access: 'read_only',
        args: [{ name: 'height', type: 'uint128' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[height: TypedAbiArg<number | bigint, 'height'>], bigint>,
      canStackStx: {
        name: 'can-stack-stx',
        access: 'read_only',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'amount-ustx', type: 'uint128' },
          { name: 'first-reward-cycle', type: 'uint128' },
          { name: 'num-cycles', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          firstRewardCycle: TypedAbiArg<number | bigint, 'firstRewardCycle'>,
          numCycles: TypedAbiArg<number | bigint, 'numCycles'>,
        ],
        Response<boolean, bigint>
      >,
      checkCallerAllowed: {
        name: 'check-caller-allowed',
        access: 'read_only',
        args: [],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[], boolean>,
      checkPoxAddrHashbytes: {
        name: 'check-pox-addr-hashbytes',
        access: 'read_only',
        args: [
          { name: 'version', type: { buffer: { length: 1 } } },
          { name: 'hashbytes', type: { buffer: { length: 32 } } },
        ],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<
        [
          version: TypedAbiArg<Uint8Array, 'version'>,
          hashbytes: TypedAbiArg<Uint8Array, 'hashbytes'>,
        ],
        boolean
      >,
      checkPoxAddrVersion: {
        name: 'check-pox-addr-version',
        access: 'read_only',
        args: [{ name: 'version', type: { buffer: { length: 1 } } }],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[version: TypedAbiArg<Uint8Array, 'version'>], boolean>,
      checkPoxLockPeriod: {
        name: 'check-pox-lock-period',
        access: 'read_only',
        args: [{ name: 'lock-period', type: 'uint128' }],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[lockPeriod: TypedAbiArg<number | bigint, 'lockPeriod'>], boolean>,
      currentPoxRewardCycle: {
        name: 'current-pox-reward-cycle',
        access: 'read_only',
        args: [],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getAggregatePublicKey: {
        name: 'get-aggregate-public-key',
        access: 'read_only',
        args: [{ name: 'reward-cycle', type: 'uint128' }],
        outputs: { type: { optional: { buffer: { length: 33 } } } },
      } as TypedAbiFunction<
        [rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>],
        Uint8Array | null
      >,
      getAllowanceContractCallers: {
        name: 'get-allowance-contract-callers',
        access: 'read_only',
        args: [
          { name: 'sender', type: 'principal' },
          { name: 'calling-contract', type: 'principal' },
        ],
        outputs: {
          type: { optional: { tuple: [{ name: 'until-burn-ht', type: { optional: 'uint128' } }] } },
        },
      } as TypedAbiFunction<
        [
          sender: TypedAbiArg<string, 'sender'>,
          callingContract: TypedAbiArg<string, 'callingContract'>,
        ],
        {
          untilBurnHt: bigint | null;
        } | null
      >,
      getCheckDelegation: {
        name: 'get-check-delegation',
        access: 'read_only',
        args: [{ name: 'stacker', type: 'principal' }],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'amount-ustx', type: 'uint128' },
                { name: 'delegated-to', type: 'principal' },
                {
                  name: 'pox-addr',
                  type: {
                    optional: {
                      tuple: [
                        { name: 'hashbytes', type: { buffer: { length: 32 } } },
                        { name: 'version', type: { buffer: { length: 1 } } },
                      ],
                    },
                  },
                },
                { name: 'until-burn-ht', type: { optional: 'uint128' } },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [stacker: TypedAbiArg<string, 'stacker'>],
        {
          amountUstx: bigint;
          delegatedTo: string;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          } | null;
          untilBurnHt: bigint | null;
        } | null
      >,
      getDelegationInfo: {
        name: 'get-delegation-info',
        access: 'read_only',
        args: [{ name: 'stacker', type: 'principal' }],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'amount-ustx', type: 'uint128' },
                { name: 'delegated-to', type: 'principal' },
                {
                  name: 'pox-addr',
                  type: {
                    optional: {
                      tuple: [
                        { name: 'hashbytes', type: { buffer: { length: 32 } } },
                        { name: 'version', type: { buffer: { length: 1 } } },
                      ],
                    },
                  },
                },
                { name: 'until-burn-ht', type: { optional: 'uint128' } },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [stacker: TypedAbiArg<string, 'stacker'>],
        {
          amountUstx: bigint;
          delegatedTo: string;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          } | null;
          untilBurnHt: bigint | null;
        } | null
      >,
      getNumRewardSetPoxAddresses: {
        name: 'get-num-reward-set-pox-addresses',
        access: 'read_only',
        args: [{ name: 'reward-cycle', type: 'uint128' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>], bigint>,
      getPartialStackedByCycle: {
        name: 'get-partial-stacked-by-cycle',
        access: 'read_only',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'sender', type: 'principal' },
        ],
        outputs: { type: { optional: { tuple: [{ name: 'stacked-amount', type: 'uint128' }] } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          sender: TypedAbiArg<string, 'sender'>,
        ],
        {
          stackedAmount: bigint;
        } | null
      >,
      getPoxInfo: {
        name: 'get-pox-info',
        access: 'read_only',
        args: [],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'first-burnchain-block-height', type: 'uint128' },
                  { name: 'min-amount-ustx', type: 'uint128' },
                  { name: 'prepare-cycle-length', type: 'uint128' },
                  { name: 'reward-cycle-id', type: 'uint128' },
                  { name: 'reward-cycle-length', type: 'uint128' },
                  { name: 'total-liquid-supply-ustx', type: 'uint128' },
                ],
              },
              error: 'none',
            },
          },
        },
      } as TypedAbiFunction<
        [],
        Response<
          {
            firstBurnchainBlockHeight: bigint;
            minAmountUstx: bigint;
            prepareCycleLength: bigint;
            rewardCycleId: bigint;
            rewardCycleLength: bigint;
            totalLiquidSupplyUstx: bigint;
          },
          null
        >
      >,
      getRewardSetPoxAddress: {
        name: 'get-reward-set-pox-address',
        access: 'read_only',
        args: [
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'index', type: 'uint128' },
        ],
        outputs: {
          type: {
            optional: {
              tuple: [
                {
                  name: 'pox-addr',
                  type: {
                    tuple: [
                      { name: 'hashbytes', type: { buffer: { length: 32 } } },
                      { name: 'version', type: { buffer: { length: 1 } } },
                    ],
                  },
                },
                { name: 'signer', type: { buffer: { length: 33 } } },
                { name: 'stacker', type: { optional: 'principal' } },
                { name: 'total-ustx', type: 'uint128' },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          index: TypedAbiArg<number | bigint, 'index'>,
        ],
        {
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          signer: Uint8Array;
          stacker: string | null;
          totalUstx: bigint;
        } | null
      >,
      getRewardSetSize: {
        name: 'get-reward-set-size',
        access: 'read_only',
        args: [{ name: 'reward-cycle', type: 'uint128' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>], bigint>,
      getSignerKeyMessageHash: {
        name: 'get-signer-key-message-hash',
        access: 'read_only',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'topic', type: { 'string-ascii': { length: 12 } } },
          { name: 'period', type: 'uint128' },
        ],
        outputs: { type: { buffer: { length: 32 } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          topic: TypedAbiArg<string, 'topic'>,
          period: TypedAbiArg<number | bigint, 'period'>,
        ],
        Uint8Array
      >,
      getStackerInfo: {
        name: 'get-stacker-info',
        access: 'read_only',
        args: [{ name: 'stacker', type: 'principal' }],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'delegated-to', type: { optional: 'principal' } },
                { name: 'first-reward-cycle', type: 'uint128' },
                { name: 'lock-period', type: 'uint128' },
                {
                  name: 'pox-addr',
                  type: {
                    tuple: [
                      { name: 'hashbytes', type: { buffer: { length: 32 } } },
                      { name: 'version', type: { buffer: { length: 1 } } },
                    ],
                  },
                },
                { name: 'reward-set-indexes', type: { list: { type: 'uint128', length: 12 } } },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [stacker: TypedAbiArg<string, 'stacker'>],
        {
          delegatedTo: string | null;
          firstRewardCycle: bigint;
          lockPeriod: bigint;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          rewardSetIndexes: bigint[];
        } | null
      >,
      getStackingMinimum: {
        name: 'get-stacking-minimum',
        access: 'read_only',
        args: [],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getTotalUstxStacked: {
        name: 'get-total-ustx-stacked',
        access: 'read_only',
        args: [{ name: 'reward-cycle', type: 'uint128' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>], bigint>,
      minimalCanStackStx: {
        name: 'minimal-can-stack-stx',
        access: 'read_only',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'amount-ustx', type: 'uint128' },
          { name: 'first-reward-cycle', type: 'uint128' },
          { name: 'num-cycles', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          firstRewardCycle: TypedAbiArg<number | bigint, 'firstRewardCycle'>,
          numCycles: TypedAbiArg<number | bigint, 'numCycles'>,
        ],
        Response<boolean, bigint>
      >,
      rewardCycleToBurnHeight: {
        name: 'reward-cycle-to-burn-height',
        access: 'read_only',
        args: [{ name: 'cycle', type: 'uint128' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[cycle: TypedAbiArg<number | bigint, 'cycle'>], bigint>,
      verifySignerKeySig: {
        name: 'verify-signer-key-sig',
        access: 'read_only',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'topic', type: { 'string-ascii': { length: 12 } } },
          { name: 'period', type: 'uint128' },
          { name: 'signer-sig', type: { buffer: { length: 65 } } },
          { name: 'signer-key', type: { buffer: { length: 33 } } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          topic: TypedAbiArg<string, 'topic'>,
          period: TypedAbiArg<number | bigint, 'period'>,
          signerSig: TypedAbiArg<Uint8Array, 'signerSig'>,
          signerKey: TypedAbiArg<Uint8Array, 'signerKey'>,
        ],
        Response<boolean, bigint>
      >,
    },
    maps: {
      aggregatePublicKeys: {
        name: 'aggregate-public-keys',
        key: 'uint128',
        value: { buffer: { length: 33 } },
      } as TypedAbiMap<number | bigint, Uint8Array>,
      allowanceContractCallers: {
        name: 'allowance-contract-callers',
        key: {
          tuple: [
            { name: 'contract-caller', type: 'principal' },
            { name: 'sender', type: 'principal' },
          ],
        },
        value: { tuple: [{ name: 'until-burn-ht', type: { optional: 'uint128' } }] },
      } as TypedAbiMap<
        {
          contractCaller: string;
          sender: string;
        },
        {
          untilBurnHt: bigint | null;
        }
      >,
      delegationState: {
        name: 'delegation-state',
        key: { tuple: [{ name: 'stacker', type: 'principal' }] },
        value: {
          tuple: [
            { name: 'amount-ustx', type: 'uint128' },
            { name: 'delegated-to', type: 'principal' },
            {
              name: 'pox-addr',
              type: {
                optional: {
                  tuple: [
                    { name: 'hashbytes', type: { buffer: { length: 32 } } },
                    { name: 'version', type: { buffer: { length: 1 } } },
                  ],
                },
              },
            },
            { name: 'until-burn-ht', type: { optional: 'uint128' } },
          ],
        },
      } as TypedAbiMap<
        {
          stacker: string;
        },
        {
          amountUstx: bigint;
          delegatedTo: string;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          } | null;
          untilBurnHt: bigint | null;
        }
      >,
      loggedPartialStackedByCycle: {
        name: 'logged-partial-stacked-by-cycle',
        key: {
          tuple: [
            {
              name: 'pox-addr',
              type: {
                tuple: [
                  { name: 'hashbytes', type: { buffer: { length: 32 } } },
                  { name: 'version', type: { buffer: { length: 1 } } },
                ],
              },
            },
            { name: 'reward-cycle', type: 'uint128' },
            { name: 'sender', type: 'principal' },
          ],
        },
        value: { tuple: [{ name: 'stacked-amount', type: 'uint128' }] },
      } as TypedAbiMap<
        {
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          rewardCycle: number | bigint;
          sender: string;
        },
        {
          stackedAmount: bigint;
        }
      >,
      partialStackedByCycle: {
        name: 'partial-stacked-by-cycle',
        key: {
          tuple: [
            {
              name: 'pox-addr',
              type: {
                tuple: [
                  { name: 'hashbytes', type: { buffer: { length: 32 } } },
                  { name: 'version', type: { buffer: { length: 1 } } },
                ],
              },
            },
            { name: 'reward-cycle', type: 'uint128' },
            { name: 'sender', type: 'principal' },
          ],
        },
        value: { tuple: [{ name: 'stacked-amount', type: 'uint128' }] },
      } as TypedAbiMap<
        {
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          rewardCycle: number | bigint;
          sender: string;
        },
        {
          stackedAmount: bigint;
        }
      >,
      rewardCyclePoxAddressList: {
        name: 'reward-cycle-pox-address-list',
        key: {
          tuple: [
            { name: 'index', type: 'uint128' },
            { name: 'reward-cycle', type: 'uint128' },
          ],
        },
        value: {
          tuple: [
            {
              name: 'pox-addr',
              type: {
                tuple: [
                  { name: 'hashbytes', type: { buffer: { length: 32 } } },
                  { name: 'version', type: { buffer: { length: 1 } } },
                ],
              },
            },
            { name: 'signer', type: { buffer: { length: 33 } } },
            { name: 'stacker', type: { optional: 'principal' } },
            { name: 'total-ustx', type: 'uint128' },
          ],
        },
      } as TypedAbiMap<
        {
          index: number | bigint;
          rewardCycle: number | bigint;
        },
        {
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          signer: Uint8Array;
          stacker: string | null;
          totalUstx: bigint;
        }
      >,
      rewardCyclePoxAddressListLen: {
        name: 'reward-cycle-pox-address-list-len',
        key: { tuple: [{ name: 'reward-cycle', type: 'uint128' }] },
        value: { tuple: [{ name: 'len', type: 'uint128' }] },
      } as TypedAbiMap<
        {
          rewardCycle: number | bigint;
        },
        {
          len: bigint;
        }
      >,
      rewardCycleTotalStacked: {
        name: 'reward-cycle-total-stacked',
        key: { tuple: [{ name: 'reward-cycle', type: 'uint128' }] },
        value: { tuple: [{ name: 'total-ustx', type: 'uint128' }] },
      } as TypedAbiMap<
        {
          rewardCycle: number | bigint;
        },
        {
          totalUstx: bigint;
        }
      >,
      stackingState: {
        name: 'stacking-state',
        key: { tuple: [{ name: 'stacker', type: 'principal' }] },
        value: {
          tuple: [
            { name: 'delegated-to', type: { optional: 'principal' } },
            { name: 'first-reward-cycle', type: 'uint128' },
            { name: 'lock-period', type: 'uint128' },
            {
              name: 'pox-addr',
              type: {
                tuple: [
                  { name: 'hashbytes', type: { buffer: { length: 32 } } },
                  { name: 'version', type: { buffer: { length: 1 } } },
                ],
              },
            },
            { name: 'reward-set-indexes', type: { list: { type: 'uint128', length: 12 } } },
          ],
        },
      } as TypedAbiMap<
        {
          stacker: string;
        },
        {
          delegatedTo: string | null;
          firstRewardCycle: bigint;
          lockPeriod: bigint;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          rewardSetIndexes: bigint[];
        }
      >,
    },
    variables: {
      aDDRESS_VERSION_NATIVE_P2TR: {
        name: 'ADDRESS_VERSION_NATIVE_P2TR',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_NATIVE_P2WPKH: {
        name: 'ADDRESS_VERSION_NATIVE_P2WPKH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_NATIVE_P2WSH: {
        name: 'ADDRESS_VERSION_NATIVE_P2WSH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_P2PKH: {
        name: 'ADDRESS_VERSION_P2PKH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_P2SH: {
        name: 'ADDRESS_VERSION_P2SH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_P2WPKH: {
        name: 'ADDRESS_VERSION_P2WPKH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_P2WSH: {
        name: 'ADDRESS_VERSION_P2WSH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      ERR_DELEGATION_ALREADY_REVOKED: {
        name: 'ERR_DELEGATION_ALREADY_REVOKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_EXPIRES_DURING_LOCK: {
        name: 'ERR_DELEGATION_EXPIRES_DURING_LOCK',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_NO_REWARD_SLOT: {
        name: 'ERR_DELEGATION_NO_REWARD_SLOT',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_POX_ADDR_REQUIRED: {
        name: 'ERR_DELEGATION_POX_ADDR_REQUIRED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_TOO_MUCH_LOCKED: {
        name: 'ERR_DELEGATION_TOO_MUCH_LOCKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_WRONG_REWARD_SLOT: {
        name: 'ERR_DELEGATION_WRONG_REWARD_SLOT',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_INVALID_SIGNATURE_PUBKEY: {
        name: 'ERR_INVALID_SIGNATURE_PUBKEY',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_INVALID_SIGNATURE_RECOVER: {
        name: 'ERR_INVALID_SIGNATURE_RECOVER',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_INVALID_SIGNER_KEY: {
        name: 'ERR_INVALID_SIGNER_KEY',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_INVALID_START_BURN_HEIGHT: {
        name: 'ERR_INVALID_START_BURN_HEIGHT',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_NOT_ALLOWED: {
        name: 'ERR_NOT_ALLOWED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_NOT_CURRENT_STACKER: {
        name: 'ERR_NOT_CURRENT_STACKER',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_REUSED_SIGNER_KEY: {
        name: 'ERR_REUSED_SIGNER_KEY',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_ALREADY_DELEGATED: {
        name: 'ERR_STACKING_ALREADY_DELEGATED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_ALREADY_STACKED: {
        name: 'ERR_STACKING_ALREADY_STACKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_CORRUPTED_STATE: {
        name: 'ERR_STACKING_CORRUPTED_STATE',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_EXPIRED: {
        name: 'ERR_STACKING_EXPIRED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_INSUFFICIENT_FUNDS: {
        name: 'ERR_STACKING_INSUFFICIENT_FUNDS',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_INVALID_AMOUNT: {
        name: 'ERR_STACKING_INVALID_AMOUNT',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_INVALID_LOCK_PERIOD: {
        name: 'ERR_STACKING_INVALID_LOCK_PERIOD',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_INVALID_POX_ADDRESS: {
        name: 'ERR_STACKING_INVALID_POX_ADDRESS',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_IS_DELEGATED: {
        name: 'ERR_STACKING_IS_DELEGATED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_NOT_DELEGATED: {
        name: 'ERR_STACKING_NOT_DELEGATED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_NO_SUCH_PRINCIPAL: {
        name: 'ERR_STACKING_NO_SUCH_PRINCIPAL',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_PERMISSION_DENIED: {
        name: 'ERR_STACKING_PERMISSION_DENIED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_POX_ADDRESS_IN_USE: {
        name: 'ERR_STACKING_POX_ADDRESS_IN_USE',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_STX_LOCKED: {
        name: 'ERR_STACKING_STX_LOCKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_THRESHOLD_NOT_MET: {
        name: 'ERR_STACKING_THRESHOLD_NOT_MET',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_UNREACHABLE: {
        name: 'ERR_STACKING_UNREACHABLE',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACK_EXTEND_NOT_LOCKED: {
        name: 'ERR_STACK_EXTEND_NOT_LOCKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACK_INCREASE_NOT_LOCKED: {
        name: 'ERR_STACK_INCREASE_NOT_LOCKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      MAX_ADDRESS_VERSION: {
        name: 'MAX_ADDRESS_VERSION',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      mAX_ADDRESS_VERSION_BUFF_20: {
        name: 'MAX_ADDRESS_VERSION_BUFF_20',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      mAX_ADDRESS_VERSION_BUFF_32: {
        name: 'MAX_ADDRESS_VERSION_BUFF_32',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      MAX_POX_REWARD_CYCLES: {
        name: 'MAX_POX_REWARD_CYCLES',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      MIN_POX_REWARD_CYCLES: {
        name: 'MIN_POX_REWARD_CYCLES',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      PREPARE_CYCLE_LENGTH: {
        name: 'PREPARE_CYCLE_LENGTH',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      REWARD_CYCLE_LENGTH: {
        name: 'REWARD_CYCLE_LENGTH',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      sIP018_MSG_PREFIX: {
        name: 'SIP018_MSG_PREFIX',
        type: {
          buffer: {
            length: 6,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      sTACKING_THRESHOLD_25: {
        name: 'STACKING_THRESHOLD_25',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      configured: {
        name: 'configured',
        type: 'bool',
        access: 'variable',
      } as TypedAbiVariable<boolean>,
      firstBurnchainBlockHeight: {
        name: 'first-burnchain-block-height',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      firstPox4RewardCycle: {
        name: 'first-pox-4-reward-cycle',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      poxPrepareCycleLength: {
        name: 'pox-prepare-cycle-length',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      poxRewardCycleLength: {
        name: 'pox-reward-cycle-length',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
    },
    // TODO: fix with clarinet v2
    constants: {
      aDDRESS_VERSION_NATIVE_P2TR: Uint8Array.from([6]),
      aDDRESS_VERSION_NATIVE_P2WPKH: Uint8Array.from([4]),
      aDDRESS_VERSION_NATIVE_P2WSH: Uint8Array.from([5]),
      aDDRESS_VERSION_P2PKH: Uint8Array.from([0]),
      aDDRESS_VERSION_P2SH: Uint8Array.from([1]),
      aDDRESS_VERSION_P2WPKH: Uint8Array.from([2]),
      aDDRESS_VERSION_P2WSH: Uint8Array.from([3]),
      configured: false,
      ERR_DELEGATION_ALREADY_REVOKED: 34n,
      ERR_DELEGATION_EXPIRES_DURING_LOCK: 21n,
      ERR_DELEGATION_NO_REWARD_SLOT: 28n,
      ERR_DELEGATION_POX_ADDR_REQUIRED: 23n,
      ERR_DELEGATION_TOO_MUCH_LOCKED: 22n,
      ERR_DELEGATION_WRONG_REWARD_SLOT: 29n,
      ERR_INVALID_SIGNATURE_PUBKEY: 35n,
      ERR_INVALID_SIGNATURE_RECOVER: 36n,
      ERR_INVALID_SIGNER_KEY: 32n,
      ERR_INVALID_START_BURN_HEIGHT: 24n,
      ERR_NOT_ALLOWED: 19n,
      ERR_NOT_CURRENT_STACKER: 25n,
      ERR_REUSED_SIGNER_KEY: 33n,
      ERR_STACK_EXTEND_NOT_LOCKED: 26n,
      ERR_STACK_INCREASE_NOT_LOCKED: 27n,
      ERR_STACKING_ALREADY_DELEGATED: 20n,
      ERR_STACKING_ALREADY_STACKED: 3n,
      ERR_STACKING_CORRUPTED_STATE: 254n,
      ERR_STACKING_EXPIRED: 5n,
      ERR_STACKING_INSUFFICIENT_FUNDS: 1n,
      ERR_STACKING_INVALID_AMOUNT: 18n,
      ERR_STACKING_INVALID_LOCK_PERIOD: 2n,
      ERR_STACKING_INVALID_POX_ADDRESS: 13n,
      ERR_STACKING_IS_DELEGATED: 30n,
      ERR_STACKING_NO_SUCH_PRINCIPAL: 4n,
      ERR_STACKING_NOT_DELEGATED: 31n,
      ERR_STACKING_PERMISSION_DENIED: 9n,
      ERR_STACKING_POX_ADDRESS_IN_USE: 12n,
      ERR_STACKING_STX_LOCKED: 6n,
      ERR_STACKING_THRESHOLD_NOT_MET: 11n,
      ERR_STACKING_UNREACHABLE: 255n,
      firstBurnchainBlockHeight: 0n,
      firstPox4RewardCycle: 0n,
      MAX_ADDRESS_VERSION: 6n,
      mAX_ADDRESS_VERSION_BUFF_20: 4n,
      mAX_ADDRESS_VERSION_BUFF_32: 6n,
      MAX_POX_REWARD_CYCLES: 12n,
      MIN_POX_REWARD_CYCLES: 1n,
      poxPrepareCycleLength: 50n,
      poxRewardCycleLength: 1050n,
      PREPARE_CYCLE_LENGTH: 50n,
      REWARD_CYCLE_LENGTH: 1050n,
      sIP018_MSG_PREFIX: Uint8Array.from([83, 73, 80, 48, 49, 56]),
      sTACKING_THRESHOLD_25: 8000n,
    },
    // constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    epoch: 'Epoch24',
    clarity_version: 'Clarity2',
    contractName: 'mock-pox4',
  },
  pox4: {
    functions: {
      addPoxAddrToIthRewardCycle: {
        name: 'add-pox-addr-to-ith-reward-cycle',
        access: 'private',
        args: [
          { name: 'cycle-index', type: 'uint128' },
          {
            name: 'params',
            type: {
              tuple: [
                { name: 'amount-ustx', type: 'uint128' },
                { name: 'first-reward-cycle', type: 'uint128' },
                { name: 'i', type: 'uint128' },
                { name: 'num-cycles', type: 'uint128' },
                {
                  name: 'pox-addr',
                  type: {
                    tuple: [
                      { name: 'hashbytes', type: { buffer: { length: 32 } } },
                      { name: 'version', type: { buffer: { length: 1 } } },
                    ],
                  },
                },
                { name: 'reward-set-indexes', type: { list: { type: 'uint128', length: 12 } } },
                { name: 'stacker', type: { optional: 'principal' } },
              ],
            },
          },
        ],
        outputs: {
          type: {
            tuple: [
              { name: 'amount-ustx', type: 'uint128' },
              { name: 'first-reward-cycle', type: 'uint128' },
              { name: 'i', type: 'uint128' },
              { name: 'num-cycles', type: 'uint128' },
              {
                name: 'pox-addr',
                type: {
                  tuple: [
                    { name: 'hashbytes', type: { buffer: { length: 32 } } },
                    { name: 'version', type: { buffer: { length: 1 } } },
                  ],
                },
              },
              { name: 'reward-set-indexes', type: { list: { type: 'uint128', length: 12 } } },
              { name: 'stacker', type: { optional: 'principal' } },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          cycleIndex: TypedAbiArg<number | bigint, 'cycleIndex'>,
          params: TypedAbiArg<
            {
              amountUstx: number | bigint;
              firstRewardCycle: number | bigint;
              i: number | bigint;
              numCycles: number | bigint;
              poxAddr: {
                hashbytes: Uint8Array;
                version: Uint8Array;
              };
              rewardSetIndexes: number | bigint[];
              stacker: string | null;
            },
            'params'
          >,
        ],
        {
          amountUstx: bigint;
          firstRewardCycle: bigint;
          i: bigint;
          numCycles: bigint;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          rewardSetIndexes: bigint[];
          stacker: string | null;
        }
      >,
      addPoxAddrToRewardCycles: {
        name: 'add-pox-addr-to-reward-cycles',
        access: 'private',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'first-reward-cycle', type: 'uint128' },
          { name: 'num-cycles', type: 'uint128' },
          { name: 'amount-ustx', type: 'uint128' },
          { name: 'stacker', type: 'principal' },
        ],
        outputs: {
          type: { response: { ok: { list: { type: 'uint128', length: 12 } }, error: 'int128' } },
        },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          firstRewardCycle: TypedAbiArg<number | bigint, 'firstRewardCycle'>,
          numCycles: TypedAbiArg<number | bigint, 'numCycles'>,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          stacker: TypedAbiArg<string, 'stacker'>,
        ],
        Response<bigint[], bigint>
      >,
      addPoxPartialStacked: {
        name: 'add-pox-partial-stacked',
        access: 'private',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'first-reward-cycle', type: 'uint128' },
          { name: 'num-cycles', type: 'uint128' },
          { name: 'amount-ustx', type: 'uint128' },
        ],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          firstRewardCycle: TypedAbiArg<number | bigint, 'firstRewardCycle'>,
          numCycles: TypedAbiArg<number | bigint, 'numCycles'>,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
        ],
        boolean
      >,
      addPoxPartialStackedToIthCycle: {
        name: 'add-pox-partial-stacked-to-ith-cycle',
        access: 'private',
        args: [
          { name: 'cycle-index', type: 'uint128' },
          {
            name: 'params',
            type: {
              tuple: [
                { name: 'amount-ustx', type: 'uint128' },
                { name: 'num-cycles', type: 'uint128' },
                {
                  name: 'pox-addr',
                  type: {
                    tuple: [
                      { name: 'hashbytes', type: { buffer: { length: 32 } } },
                      { name: 'version', type: { buffer: { length: 1 } } },
                    ],
                  },
                },
                { name: 'reward-cycle', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: {
          type: {
            tuple: [
              { name: 'amount-ustx', type: 'uint128' },
              { name: 'num-cycles', type: 'uint128' },
              {
                name: 'pox-addr',
                type: {
                  tuple: [
                    { name: 'hashbytes', type: { buffer: { length: 32 } } },
                    { name: 'version', type: { buffer: { length: 1 } } },
                  ],
                },
              },
              { name: 'reward-cycle', type: 'uint128' },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          cycleIndex: TypedAbiArg<number | bigint, 'cycleIndex'>,
          params: TypedAbiArg<
            {
              amountUstx: number | bigint;
              numCycles: number | bigint;
              poxAddr: {
                hashbytes: Uint8Array;
                version: Uint8Array;
              };
              rewardCycle: number | bigint;
            },
            'params'
          >,
        ],
        {
          amountUstx: bigint;
          numCycles: bigint;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          rewardCycle: bigint;
        }
      >,
      appendRewardCyclePoxAddr: {
        name: 'append-reward-cycle-pox-addr',
        access: 'private',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'amount-ustx', type: 'uint128' },
          { name: 'stacker', type: { optional: 'principal' } },
        ],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          stacker: TypedAbiArg<string | null, 'stacker'>,
        ],
        bigint
      >,
      foldUnlockRewardCycle: {
        name: 'fold-unlock-reward-cycle',
        access: 'private',
        args: [
          { name: 'set-index', type: 'uint128' },
          {
            name: 'data-res',
            type: {
              response: {
                ok: {
                  tuple: [
                    { name: 'cycle', type: 'uint128' },
                    { name: 'first-unlocked-cycle', type: 'uint128' },
                    { name: 'stacker', type: 'principal' },
                  ],
                },
                error: 'int128',
              },
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'cycle', type: 'uint128' },
                  { name: 'first-unlocked-cycle', type: 'uint128' },
                  { name: 'stacker', type: 'principal' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          setIndex: TypedAbiArg<number | bigint, 'setIndex'>,
          dataRes: TypedAbiArg<
            Response<
              {
                cycle: number | bigint;
                firstUnlockedCycle: number | bigint;
                stacker: string;
              },
              number | bigint
            >,
            'dataRes'
          >,
        ],
        Response<
          {
            cycle: bigint;
            firstUnlockedCycle: bigint;
            stacker: string;
          },
          bigint
        >
      >,
      handleUnlock: {
        name: 'handle-unlock',
        access: 'private',
        args: [
          { name: 'user', type: 'principal' },
          { name: 'amount-locked', type: 'uint128' },
          { name: 'cycle-to-unlock', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          user: TypedAbiArg<string, 'user'>,
          amountLocked: TypedAbiArg<number | bigint, 'amountLocked'>,
          cycleToUnlock: TypedAbiArg<number | bigint, 'cycleToUnlock'>,
        ],
        Response<boolean, bigint>
      >,
      increaseRewardCycleEntry: {
        name: 'increase-reward-cycle-entry',
        access: 'private',
        args: [
          { name: 'reward-cycle-index', type: 'uint128' },
          {
            name: 'updates',
            type: {
              optional: {
                tuple: [
                  { name: 'add-amount', type: 'uint128' },
                  { name: 'first-cycle', type: 'uint128' },
                  { name: 'reward-cycle', type: 'uint128' },
                  { name: 'stacker', type: 'principal' },
                ],
              },
            },
          },
        ],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'add-amount', type: 'uint128' },
                { name: 'first-cycle', type: 'uint128' },
                { name: 'reward-cycle', type: 'uint128' },
                { name: 'stacker', type: 'principal' },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [
          rewardCycleIndex: TypedAbiArg<number | bigint, 'rewardCycleIndex'>,
          updates: TypedAbiArg<
            {
              addAmount: number | bigint;
              firstCycle: number | bigint;
              rewardCycle: number | bigint;
              stacker: string;
            } | null,
            'updates'
          >,
        ],
        {
          addAmount: bigint;
          firstCycle: bigint;
          rewardCycle: bigint;
          stacker: string;
        } | null
      >,
      innerStackAggregationCommit: {
        name: 'inner-stack-aggregation-commit',
        access: 'private',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'uint128', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
        ],
        Response<bigint, bigint>
      >,
      insertSignerKey: {
        name: 'insert-signer-key',
        access: 'private',
        args: [{ name: 'signer-key', type: { buffer: { length: 33 } } }],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [signerKey: TypedAbiArg<Uint8Array, 'signerKey'>],
        Response<boolean, bigint>
      >,
      setAggregatePublicKey: {
        name: 'set-aggregate-public-key',
        access: 'private',
        args: [
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'aggregate-public-key', type: { buffer: { length: 33 } } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'none' } } },
      } as TypedAbiFunction<
        [
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          aggregatePublicKey: TypedAbiArg<Uint8Array, 'aggregatePublicKey'>,
        ],
        Response<boolean, null>
      >,
      allowContractCaller: {
        name: 'allow-contract-caller',
        access: 'public',
        args: [
          { name: 'caller', type: 'principal' },
          { name: 'until-burn-ht', type: { optional: 'uint128' } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          caller: TypedAbiArg<string, 'caller'>,
          untilBurnHt: TypedAbiArg<number | bigint | null, 'untilBurnHt'>,
        ],
        Response<boolean, bigint>
      >,
      delegateStackExtend: {
        name: 'delegate-stack-extend',
        access: 'public',
        args: [
          { name: 'stacker', type: 'principal' },
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'extend-count', type: 'uint128' },
          { name: 'signer-sig', type: { buffer: { length: 65 } } },
          { name: 'signer-key', type: { buffer: { length: 33 } } },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'stacker', type: 'principal' },
                  { name: 'unlock-burn-height', type: 'uint128' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          extendCount: TypedAbiArg<number | bigint, 'extendCount'>,
          signerSig: TypedAbiArg<Uint8Array, 'signerSig'>,
          signerKey: TypedAbiArg<Uint8Array, 'signerKey'>,
        ],
        Response<
          {
            stacker: string;
            unlockBurnHeight: bigint;
          },
          bigint
        >
      >,
      delegateStackIncrease: {
        name: 'delegate-stack-increase',
        access: 'public',
        args: [
          { name: 'stacker', type: 'principal' },
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'increase-by', type: 'uint128' },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'stacker', type: 'principal' },
                  { name: 'total-locked', type: 'uint128' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          increaseBy: TypedAbiArg<number | bigint, 'increaseBy'>,
        ],
        Response<
          {
            stacker: string;
            totalLocked: bigint;
          },
          bigint
        >
      >,
      delegateStackStx: {
        name: 'delegate-stack-stx',
        access: 'public',
        args: [
          { name: 'stacker', type: 'principal' },
          { name: 'amount-ustx', type: 'uint128' },
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'start-burn-ht', type: 'uint128' },
          { name: 'lock-period', type: 'uint128' },
          { name: 'signer-sig', type: { buffer: { length: 65 } } },
          { name: 'signer-key', type: { buffer: { length: 33 } } },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'lock-amount', type: 'uint128' },
                  { name: 'stacker', type: 'principal' },
                  { name: 'unlock-burn-height', type: 'uint128' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          startBurnHt: TypedAbiArg<number | bigint, 'startBurnHt'>,
          lockPeriod: TypedAbiArg<number | bigint, 'lockPeriod'>,
          signerSig: TypedAbiArg<Uint8Array, 'signerSig'>,
          signerKey: TypedAbiArg<Uint8Array, 'signerKey'>,
        ],
        Response<
          {
            lockAmount: bigint;
            stacker: string;
            unlockBurnHeight: bigint;
          },
          bigint
        >
      >,
      delegateStx: {
        name: 'delegate-stx',
        access: 'public',
        args: [
          { name: 'amount-ustx', type: 'uint128' },
          { name: 'delegate-to', type: 'principal' },
          { name: 'until-burn-ht', type: { optional: 'uint128' } },
          {
            name: 'pox-addr',
            type: {
              optional: {
                tuple: [
                  { name: 'hashbytes', type: { buffer: { length: 32 } } },
                  { name: 'version', type: { buffer: { length: 1 } } },
                ],
              },
            },
          },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          delegateTo: TypedAbiArg<string, 'delegateTo'>,
          untilBurnHt: TypedAbiArg<number | bigint | null, 'untilBurnHt'>,
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            } | null,
            'poxAddr'
          >,
        ],
        Response<boolean, bigint>
      >,
      disallowContractCaller: {
        name: 'disallow-contract-caller',
        access: 'public',
        args: [{ name: 'caller', type: 'principal' }],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<[caller: TypedAbiArg<string, 'caller'>], Response<boolean, bigint>>,
      revokeDelegateStx: {
        name: 'revoke-delegate-stx',
        access: 'public',
        args: [],
        outputs: {
          type: {
            response: {
              ok: {
                optional: {
                  tuple: [
                    { name: 'amount-ustx', type: 'uint128' },
                    { name: 'delegated-to', type: 'principal' },
                    {
                      name: 'pox-addr',
                      type: {
                        optional: {
                          tuple: [
                            { name: 'hashbytes', type: { buffer: { length: 32 } } },
                            { name: 'version', type: { buffer: { length: 1 } } },
                          ],
                        },
                      },
                    },
                    { name: 'until-burn-ht', type: { optional: 'uint128' } },
                  ],
                },
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [],
        Response<
          {
            amountUstx: bigint;
            delegatedTo: string;
            poxAddr: {
              hashbytes: Uint8Array;
              version: Uint8Array;
            } | null;
            untilBurnHt: bigint | null;
          } | null,
          bigint
        >
      >,
      setBurnchainParameters: {
        name: 'set-burnchain-parameters',
        access: 'public',
        args: [
          { name: 'first-burn-height', type: 'uint128' },
          { name: 'prepare-cycle-length', type: 'uint128' },
          { name: 'reward-cycle-length', type: 'uint128' },
          { name: 'begin-pox-4-reward-cycle', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          firstBurnHeight: TypedAbiArg<number | bigint, 'firstBurnHeight'>,
          prepareCycleLength: TypedAbiArg<number | bigint, 'prepareCycleLength'>,
          rewardCycleLength: TypedAbiArg<number | bigint, 'rewardCycleLength'>,
          beginPox4RewardCycle: TypedAbiArg<number | bigint, 'beginPox4RewardCycle'>,
        ],
        Response<boolean, bigint>
      >,
      stackAggregationCommit: {
        name: 'stack-aggregation-commit',
        access: 'public',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
        ],
        Response<boolean, bigint>
      >,
      stackAggregationCommitIndexed: {
        name: 'stack-aggregation-commit-indexed',
        access: 'public',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'uint128', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
        ],
        Response<bigint, bigint>
      >,
      stackAggregationIncrease: {
        name: 'stack-aggregation-increase',
        access: 'public',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'reward-cycle-index', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          rewardCycleIndex: TypedAbiArg<number | bigint, 'rewardCycleIndex'>,
        ],
        Response<boolean, bigint>
      >,
      stackExtend: {
        name: 'stack-extend',
        access: 'public',
        args: [
          { name: 'extend-count', type: 'uint128' },
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'signer-sig', type: { buffer: { length: 65 } } },
          { name: 'signer-key', type: { buffer: { length: 33 } } },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'stacker', type: 'principal' },
                  { name: 'unlock-burn-height', type: 'uint128' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          extendCount: TypedAbiArg<number | bigint, 'extendCount'>,
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          signerSig: TypedAbiArg<Uint8Array, 'signerSig'>,
          signerKey: TypedAbiArg<Uint8Array, 'signerKey'>,
        ],
        Response<
          {
            stacker: string;
            unlockBurnHeight: bigint;
          },
          bigint
        >
      >,
      stackIncrease: {
        name: 'stack-increase',
        access: 'public',
        args: [{ name: 'increase-by', type: 'uint128' }],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'stacker', type: 'principal' },
                  { name: 'total-locked', type: 'uint128' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [increaseBy: TypedAbiArg<number | bigint, 'increaseBy'>],
        Response<
          {
            stacker: string;
            totalLocked: bigint;
          },
          bigint
        >
      >,
      stackStx: {
        name: 'stack-stx',
        access: 'public',
        args: [
          { name: 'amount-ustx', type: 'uint128' },
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'start-burn-ht', type: 'uint128' },
          { name: 'lock-period', type: 'uint128' },
          { name: 'signer-sig', type: { buffer: { length: 65 } } },
          { name: 'signer-key', type: { buffer: { length: 33 } } },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'lock-amount', type: 'uint128' },
                  { name: 'signer-key', type: { buffer: { length: 33 } } },
                  { name: 'stacker', type: 'principal' },
                  { name: 'unlock-burn-height', type: 'uint128' },
                ],
              },
              error: 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          startBurnHt: TypedAbiArg<number | bigint, 'startBurnHt'>,
          lockPeriod: TypedAbiArg<number | bigint, 'lockPeriod'>,
          signerSig: TypedAbiArg<Uint8Array, 'signerSig'>,
          signerKey: TypedAbiArg<Uint8Array, 'signerKey'>,
        ],
        Response<
          {
            lockAmount: bigint;
            signerKey: Uint8Array;
            stacker: string;
            unlockBurnHeight: bigint;
          },
          bigint
        >
      >,
      burnHeightToRewardCycle: {
        name: 'burn-height-to-reward-cycle',
        access: 'read_only',
        args: [{ name: 'height', type: 'uint128' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[height: TypedAbiArg<number | bigint, 'height'>], bigint>,
      canStackStx: {
        name: 'can-stack-stx',
        access: 'read_only',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'amount-ustx', type: 'uint128' },
          { name: 'first-reward-cycle', type: 'uint128' },
          { name: 'num-cycles', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          firstRewardCycle: TypedAbiArg<number | bigint, 'firstRewardCycle'>,
          numCycles: TypedAbiArg<number | bigint, 'numCycles'>,
        ],
        Response<boolean, bigint>
      >,
      checkCallerAllowed: {
        name: 'check-caller-allowed',
        access: 'read_only',
        args: [],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[], boolean>,
      checkPoxAddrHashbytes: {
        name: 'check-pox-addr-hashbytes',
        access: 'read_only',
        args: [
          { name: 'version', type: { buffer: { length: 1 } } },
          { name: 'hashbytes', type: { buffer: { length: 32 } } },
        ],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<
        [
          version: TypedAbiArg<Uint8Array, 'version'>,
          hashbytes: TypedAbiArg<Uint8Array, 'hashbytes'>,
        ],
        boolean
      >,
      checkPoxAddrVersion: {
        name: 'check-pox-addr-version',
        access: 'read_only',
        args: [{ name: 'version', type: { buffer: { length: 1 } } }],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[version: TypedAbiArg<Uint8Array, 'version'>], boolean>,
      checkPoxLockPeriod: {
        name: 'check-pox-lock-period',
        access: 'read_only',
        args: [{ name: 'lock-period', type: 'uint128' }],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[lockPeriod: TypedAbiArg<number | bigint, 'lockPeriod'>], boolean>,
      currentPoxRewardCycle: {
        name: 'current-pox-reward-cycle',
        access: 'read_only',
        args: [],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getAggregatePublicKey: {
        name: 'get-aggregate-public-key',
        access: 'read_only',
        args: [{ name: 'reward-cycle', type: 'uint128' }],
        outputs: { type: { optional: { buffer: { length: 33 } } } },
      } as TypedAbiFunction<
        [rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>],
        Uint8Array | null
      >,
      getAllowanceContractCallers: {
        name: 'get-allowance-contract-callers',
        access: 'read_only',
        args: [
          { name: 'sender', type: 'principal' },
          { name: 'calling-contract', type: 'principal' },
        ],
        outputs: {
          type: { optional: { tuple: [{ name: 'until-burn-ht', type: { optional: 'uint128' } }] } },
        },
      } as TypedAbiFunction<
        [
          sender: TypedAbiArg<string, 'sender'>,
          callingContract: TypedAbiArg<string, 'callingContract'>,
        ],
        {
          untilBurnHt: bigint | null;
        } | null
      >,
      getCheckDelegation: {
        name: 'get-check-delegation',
        access: 'read_only',
        args: [{ name: 'stacker', type: 'principal' }],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'amount-ustx', type: 'uint128' },
                { name: 'delegated-to', type: 'principal' },
                {
                  name: 'pox-addr',
                  type: {
                    optional: {
                      tuple: [
                        { name: 'hashbytes', type: { buffer: { length: 32 } } },
                        { name: 'version', type: { buffer: { length: 1 } } },
                      ],
                    },
                  },
                },
                { name: 'until-burn-ht', type: { optional: 'uint128' } },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [stacker: TypedAbiArg<string, 'stacker'>],
        {
          amountUstx: bigint;
          delegatedTo: string;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          } | null;
          untilBurnHt: bigint | null;
        } | null
      >,
      getDelegationInfo: {
        name: 'get-delegation-info',
        access: 'read_only',
        args: [{ name: 'stacker', type: 'principal' }],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'amount-ustx', type: 'uint128' },
                { name: 'delegated-to', type: 'principal' },
                {
                  name: 'pox-addr',
                  type: {
                    optional: {
                      tuple: [
                        { name: 'hashbytes', type: { buffer: { length: 32 } } },
                        { name: 'version', type: { buffer: { length: 1 } } },
                      ],
                    },
                  },
                },
                { name: 'until-burn-ht', type: { optional: 'uint128' } },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [stacker: TypedAbiArg<string, 'stacker'>],
        {
          amountUstx: bigint;
          delegatedTo: string;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          } | null;
          untilBurnHt: bigint | null;
        } | null
      >,
      getNumRewardSetPoxAddresses: {
        name: 'get-num-reward-set-pox-addresses',
        access: 'read_only',
        args: [{ name: 'reward-cycle', type: 'uint128' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>], bigint>,
      getPartialStackedByCycle: {
        name: 'get-partial-stacked-by-cycle',
        access: 'read_only',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'sender', type: 'principal' },
        ],
        outputs: { type: { optional: { tuple: [{ name: 'stacked-amount', type: 'uint128' }] } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          sender: TypedAbiArg<string, 'sender'>,
        ],
        {
          stackedAmount: bigint;
        } | null
      >,
      getPoxInfo: {
        name: 'get-pox-info',
        access: 'read_only',
        args: [],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'first-burnchain-block-height', type: 'uint128' },
                  { name: 'min-amount-ustx', type: 'uint128' },
                  { name: 'prepare-cycle-length', type: 'uint128' },
                  { name: 'reward-cycle-id', type: 'uint128' },
                  { name: 'reward-cycle-length', type: 'uint128' },
                  { name: 'total-liquid-supply-ustx', type: 'uint128' },
                ],
              },
              error: 'none',
            },
          },
        },
      } as TypedAbiFunction<
        [],
        Response<
          {
            firstBurnchainBlockHeight: bigint;
            minAmountUstx: bigint;
            prepareCycleLength: bigint;
            rewardCycleId: bigint;
            rewardCycleLength: bigint;
            totalLiquidSupplyUstx: bigint;
          },
          null
        >
      >,
      getRewardSetPoxAddress: {
        name: 'get-reward-set-pox-address',
        access: 'read_only',
        args: [
          { name: 'reward-cycle', type: 'uint128' },
          { name: 'index', type: 'uint128' },
        ],
        outputs: {
          type: {
            optional: {
              tuple: [
                {
                  name: 'pox-addr',
                  type: {
                    tuple: [
                      { name: 'hashbytes', type: { buffer: { length: 32 } } },
                      { name: 'version', type: { buffer: { length: 1 } } },
                    ],
                  },
                },
                { name: 'stacker', type: { optional: 'principal' } },
                { name: 'total-ustx', type: 'uint128' },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          index: TypedAbiArg<number | bigint, 'index'>,
        ],
        {
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          stacker: string | null;
          totalUstx: bigint;
        } | null
      >,
      getRewardSetSize: {
        name: 'get-reward-set-size',
        access: 'read_only',
        args: [{ name: 'reward-cycle', type: 'uint128' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>], bigint>,
      getSignerKeyMessageHash: {
        name: 'get-signer-key-message-hash',
        access: 'read_only',
        args: [{ name: 'stacker', type: 'principal' }],
        outputs: { type: { buffer: { length: 32 } } },
      } as TypedAbiFunction<[stacker: TypedAbiArg<string, 'stacker'>], Uint8Array>,
      getStackerInfo: {
        name: 'get-stacker-info',
        access: 'read_only',
        args: [{ name: 'stacker', type: 'principal' }],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'delegated-to', type: { optional: 'principal' } },
                { name: 'first-reward-cycle', type: 'uint128' },
                { name: 'lock-period', type: 'uint128' },
                {
                  name: 'pox-addr',
                  type: {
                    tuple: [
                      { name: 'hashbytes', type: { buffer: { length: 32 } } },
                      { name: 'version', type: { buffer: { length: 1 } } },
                    ],
                  },
                },
                { name: 'reward-set-indexes', type: { list: { type: 'uint128', length: 12 } } },
                { name: 'signer-key', type: { buffer: { length: 33 } } },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [stacker: TypedAbiArg<string, 'stacker'>],
        {
          delegatedTo: string | null;
          firstRewardCycle: bigint;
          lockPeriod: bigint;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          rewardSetIndexes: bigint[];
          signerKey: Uint8Array;
        } | null
      >,
      getStackingMinimum: {
        name: 'get-stacking-minimum',
        access: 'read_only',
        args: [],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getTotalUstxStacked: {
        name: 'get-total-ustx-stacked',
        access: 'read_only',
        args: [{ name: 'reward-cycle', type: 'uint128' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>], bigint>,
      minimalCanStackStx: {
        name: 'minimal-can-stack-stx',
        access: 'read_only',
        args: [
          {
            name: 'pox-addr',
            type: {
              tuple: [
                { name: 'hashbytes', type: { buffer: { length: 32 } } },
                { name: 'version', type: { buffer: { length: 1 } } },
              ],
            },
          },
          { name: 'amount-ustx', type: 'uint128' },
          { name: 'first-reward-cycle', type: 'uint128' },
          { name: 'num-cycles', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<
            {
              hashbytes: Uint8Array;
              version: Uint8Array;
            },
            'poxAddr'
          >,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          firstRewardCycle: TypedAbiArg<number | bigint, 'firstRewardCycle'>,
          numCycles: TypedAbiArg<number | bigint, 'numCycles'>,
        ],
        Response<boolean, bigint>
      >,
      rewardCycleToBurnHeight: {
        name: 'reward-cycle-to-burn-height',
        access: 'read_only',
        args: [{ name: 'cycle', type: 'uint128' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[cycle: TypedAbiArg<number | bigint, 'cycle'>], bigint>,
      verifySignerKeySig: {
        name: 'verify-signer-key-sig',
        access: 'read_only',
        args: [
          { name: 'stacker', type: 'principal' },
          { name: 'signer-key', type: { buffer: { length: 33 } } },
          { name: 'signer-sig', type: { buffer: { length: 65 } } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'int128' } } },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          signerKey: TypedAbiArg<Uint8Array, 'signerKey'>,
          signerSig: TypedAbiArg<Uint8Array, 'signerSig'>,
        ],
        Response<boolean, bigint>
      >,
    },
    maps: {
      aggregatePublicKeys: {
        name: 'aggregate-public-keys',
        key: 'uint128',
        value: { buffer: { length: 33 } },
      } as TypedAbiMap<number | bigint, Uint8Array>,
      allowanceContractCallers: {
        name: 'allowance-contract-callers',
        key: {
          tuple: [
            { name: 'contract-caller', type: 'principal' },
            { name: 'sender', type: 'principal' },
          ],
        },
        value: { tuple: [{ name: 'until-burn-ht', type: { optional: 'uint128' } }] },
      } as TypedAbiMap<
        {
          contractCaller: string;
          sender: string;
        },
        {
          untilBurnHt: bigint | null;
        }
      >,
      delegationState: {
        name: 'delegation-state',
        key: { tuple: [{ name: 'stacker', type: 'principal' }] },
        value: {
          tuple: [
            { name: 'amount-ustx', type: 'uint128' },
            { name: 'delegated-to', type: 'principal' },
            {
              name: 'pox-addr',
              type: {
                optional: {
                  tuple: [
                    { name: 'hashbytes', type: { buffer: { length: 32 } } },
                    { name: 'version', type: { buffer: { length: 1 } } },
                  ],
                },
              },
            },
            { name: 'until-burn-ht', type: { optional: 'uint128' } },
          ],
        },
      } as TypedAbiMap<
        {
          stacker: string;
        },
        {
          amountUstx: bigint;
          delegatedTo: string;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          } | null;
          untilBurnHt: bigint | null;
        }
      >,
      loggedPartialStackedByCycle: {
        name: 'logged-partial-stacked-by-cycle',
        key: {
          tuple: [
            {
              name: 'pox-addr',
              type: {
                tuple: [
                  { name: 'hashbytes', type: { buffer: { length: 32 } } },
                  { name: 'version', type: { buffer: { length: 1 } } },
                ],
              },
            },
            { name: 'reward-cycle', type: 'uint128' },
            { name: 'sender', type: 'principal' },
          ],
        },
        value: { tuple: [{ name: 'stacked-amount', type: 'uint128' }] },
      } as TypedAbiMap<
        {
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          rewardCycle: number | bigint;
          sender: string;
        },
        {
          stackedAmount: bigint;
        }
      >,
      partialStackedByCycle: {
        name: 'partial-stacked-by-cycle',
        key: {
          tuple: [
            {
              name: 'pox-addr',
              type: {
                tuple: [
                  { name: 'hashbytes', type: { buffer: { length: 32 } } },
                  { name: 'version', type: { buffer: { length: 1 } } },
                ],
              },
            },
            { name: 'reward-cycle', type: 'uint128' },
            { name: 'sender', type: 'principal' },
          ],
        },
        value: { tuple: [{ name: 'stacked-amount', type: 'uint128' }] },
      } as TypedAbiMap<
        {
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          rewardCycle: number | bigint;
          sender: string;
        },
        {
          stackedAmount: bigint;
        }
      >,
      rewardCyclePoxAddressList: {
        name: 'reward-cycle-pox-address-list',
        key: {
          tuple: [
            { name: 'index', type: 'uint128' },
            { name: 'reward-cycle', type: 'uint128' },
          ],
        },
        value: {
          tuple: [
            {
              name: 'pox-addr',
              type: {
                tuple: [
                  { name: 'hashbytes', type: { buffer: { length: 32 } } },
                  { name: 'version', type: { buffer: { length: 1 } } },
                ],
              },
            },
            { name: 'stacker', type: { optional: 'principal' } },
            { name: 'total-ustx', type: 'uint128' },
          ],
        },
      } as TypedAbiMap<
        {
          index: number | bigint;
          rewardCycle: number | bigint;
        },
        {
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          stacker: string | null;
          totalUstx: bigint;
        }
      >,
      rewardCyclePoxAddressListLen: {
        name: 'reward-cycle-pox-address-list-len',
        key: { tuple: [{ name: 'reward-cycle', type: 'uint128' }] },
        value: { tuple: [{ name: 'len', type: 'uint128' }] },
      } as TypedAbiMap<
        {
          rewardCycle: number | bigint;
        },
        {
          len: bigint;
        }
      >,
      rewardCycleTotalStacked: {
        name: 'reward-cycle-total-stacked',
        key: { tuple: [{ name: 'reward-cycle', type: 'uint128' }] },
        value: { tuple: [{ name: 'total-ustx', type: 'uint128' }] },
      } as TypedAbiMap<
        {
          rewardCycle: number | bigint;
        },
        {
          totalUstx: bigint;
        }
      >,
      stackingState: {
        name: 'stacking-state',
        key: { tuple: [{ name: 'stacker', type: 'principal' }] },
        value: {
          tuple: [
            { name: 'delegated-to', type: { optional: 'principal' } },
            { name: 'first-reward-cycle', type: 'uint128' },
            { name: 'lock-period', type: 'uint128' },
            {
              name: 'pox-addr',
              type: {
                tuple: [
                  { name: 'hashbytes', type: { buffer: { length: 32 } } },
                  { name: 'version', type: { buffer: { length: 1 } } },
                ],
              },
            },
            { name: 'reward-set-indexes', type: { list: { type: 'uint128', length: 12 } } },
            { name: 'signer-key', type: { buffer: { length: 33 } } },
          ],
        },
      } as TypedAbiMap<
        {
          stacker: string;
        },
        {
          delegatedTo: string | null;
          firstRewardCycle: bigint;
          lockPeriod: bigint;
          poxAddr: {
            hashbytes: Uint8Array;
            version: Uint8Array;
          };
          rewardSetIndexes: bigint[];
          signerKey: Uint8Array;
        }
      >,
      usedSignerKeys: {
        name: 'used-signer-keys',
        key: { buffer: { length: 33 } },
        value: 'uint128',
      } as TypedAbiMap<Uint8Array, bigint>,
    },
    variables: {
      aDDRESS_VERSION_NATIVE_P2TR: {
        name: 'ADDRESS_VERSION_NATIVE_P2TR',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_NATIVE_P2WPKH: {
        name: 'ADDRESS_VERSION_NATIVE_P2WPKH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_NATIVE_P2WSH: {
        name: 'ADDRESS_VERSION_NATIVE_P2WSH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_P2PKH: {
        name: 'ADDRESS_VERSION_P2PKH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_P2SH: {
        name: 'ADDRESS_VERSION_P2SH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_P2WPKH: {
        name: 'ADDRESS_VERSION_P2WPKH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_P2WSH: {
        name: 'ADDRESS_VERSION_P2WSH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      ERR_DELEGATION_ALREADY_REVOKED: {
        name: 'ERR_DELEGATION_ALREADY_REVOKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_EXPIRES_DURING_LOCK: {
        name: 'ERR_DELEGATION_EXPIRES_DURING_LOCK',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_INVALID_SIGNATURE: {
        name: 'ERR_DELEGATION_INVALID_SIGNATURE',
        type: {
          response: {
            ok: 'none',
            error: 'int128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_DELEGATION_NO_REWARD_SLOT: {
        name: 'ERR_DELEGATION_NO_REWARD_SLOT',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_POX_ADDR_REQUIRED: {
        name: 'ERR_DELEGATION_POX_ADDR_REQUIRED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_TOO_MUCH_LOCKED: {
        name: 'ERR_DELEGATION_TOO_MUCH_LOCKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_WRONG_REWARD_SLOT: {
        name: 'ERR_DELEGATION_WRONG_REWARD_SLOT',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_INVALID_SIGNER_KEY: {
        name: 'ERR_INVALID_SIGNER_KEY',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_INVALID_START_BURN_HEIGHT: {
        name: 'ERR_INVALID_START_BURN_HEIGHT',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_NOT_ALLOWED: {
        name: 'ERR_NOT_ALLOWED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_NOT_CURRENT_STACKER: {
        name: 'ERR_NOT_CURRENT_STACKER',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_REUSED_SIGNER_KEY: {
        name: 'ERR_REUSED_SIGNER_KEY',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_ALREADY_DELEGATED: {
        name: 'ERR_STACKING_ALREADY_DELEGATED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_ALREADY_STACKED: {
        name: 'ERR_STACKING_ALREADY_STACKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_CORRUPTED_STATE: {
        name: 'ERR_STACKING_CORRUPTED_STATE',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_EXPIRED: {
        name: 'ERR_STACKING_EXPIRED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_INSUFFICIENT_FUNDS: {
        name: 'ERR_STACKING_INSUFFICIENT_FUNDS',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_INVALID_AMOUNT: {
        name: 'ERR_STACKING_INVALID_AMOUNT',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_INVALID_LOCK_PERIOD: {
        name: 'ERR_STACKING_INVALID_LOCK_PERIOD',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_INVALID_POX_ADDRESS: {
        name: 'ERR_STACKING_INVALID_POX_ADDRESS',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_IS_DELEGATED: {
        name: 'ERR_STACKING_IS_DELEGATED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_NOT_DELEGATED: {
        name: 'ERR_STACKING_NOT_DELEGATED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_NO_SUCH_PRINCIPAL: {
        name: 'ERR_STACKING_NO_SUCH_PRINCIPAL',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_PERMISSION_DENIED: {
        name: 'ERR_STACKING_PERMISSION_DENIED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_POX_ADDRESS_IN_USE: {
        name: 'ERR_STACKING_POX_ADDRESS_IN_USE',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_STX_LOCKED: {
        name: 'ERR_STACKING_STX_LOCKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_THRESHOLD_NOT_MET: {
        name: 'ERR_STACKING_THRESHOLD_NOT_MET',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_UNREACHABLE: {
        name: 'ERR_STACKING_UNREACHABLE',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACK_EXTEND_NOT_LOCKED: {
        name: 'ERR_STACK_EXTEND_NOT_LOCKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACK_INCREASE_NOT_LOCKED: {
        name: 'ERR_STACK_INCREASE_NOT_LOCKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      MAX_ADDRESS_VERSION: {
        name: 'MAX_ADDRESS_VERSION',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      mAX_ADDRESS_VERSION_BUFF_20: {
        name: 'MAX_ADDRESS_VERSION_BUFF_20',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      mAX_ADDRESS_VERSION_BUFF_32: {
        name: 'MAX_ADDRESS_VERSION_BUFF_32',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      MAX_POX_REWARD_CYCLES: {
        name: 'MAX_POX_REWARD_CYCLES',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      MIN_POX_REWARD_CYCLES: {
        name: 'MIN_POX_REWARD_CYCLES',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      PREPARE_CYCLE_LENGTH: {
        name: 'PREPARE_CYCLE_LENGTH',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      REWARD_CYCLE_LENGTH: {
        name: 'REWARD_CYCLE_LENGTH',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      sTACKING_THRESHOLD_25: {
        name: 'STACKING_THRESHOLD_25',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      configured: {
        name: 'configured',
        type: 'bool',
        access: 'variable',
      } as TypedAbiVariable<boolean>,
      firstBurnchainBlockHeight: {
        name: 'first-burnchain-block-height',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      firstPox4RewardCycle: {
        name: 'first-pox-4-reward-cycle',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      poxPrepareCycleLength: {
        name: 'pox-prepare-cycle-length',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      poxRewardCycleLength: {
        name: 'pox-reward-cycle-length',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
    },
    // TODO: fix with clarinet v2
    constants: {
      aDDRESS_VERSION_NATIVE_P2TR: Uint8Array.from([6]),
      aDDRESS_VERSION_NATIVE_P2WPKH: Uint8Array.from([4]),
      aDDRESS_VERSION_NATIVE_P2WSH: Uint8Array.from([5]),
      aDDRESS_VERSION_P2PKH: Uint8Array.from([0]),
      aDDRESS_VERSION_P2SH: Uint8Array.from([1]),
      aDDRESS_VERSION_P2WPKH: Uint8Array.from([2]),
      aDDRESS_VERSION_P2WSH: Uint8Array.from([3]),
      configured: false,
      ERR_DELEGATION_ALREADY_REVOKED: 34n,
      ERR_DELEGATION_EXPIRES_DURING_LOCK: 21n,
      ERR_DELEGATION_INVALID_SIGNATURE: {
        isOk: false,
        value: 35n,
      },
      ERR_DELEGATION_NO_REWARD_SLOT: 28n,
      ERR_DELEGATION_POX_ADDR_REQUIRED: 23n,
      ERR_DELEGATION_TOO_MUCH_LOCKED: 22n,
      ERR_DELEGATION_WRONG_REWARD_SLOT: 29n,
      ERR_INVALID_SIGNER_KEY: 32n,
      ERR_INVALID_START_BURN_HEIGHT: 24n,
      ERR_NOT_ALLOWED: 19n,
      ERR_NOT_CURRENT_STACKER: 25n,
      ERR_REUSED_SIGNER_KEY: 33n,
      ERR_STACK_EXTEND_NOT_LOCKED: 26n,
      ERR_STACK_INCREASE_NOT_LOCKED: 27n,
      ERR_STACKING_ALREADY_DELEGATED: 20n,
      ERR_STACKING_ALREADY_STACKED: 3n,
      ERR_STACKING_CORRUPTED_STATE: 254n,
      ERR_STACKING_EXPIRED: 5n,
      ERR_STACKING_INSUFFICIENT_FUNDS: 1n,
      ERR_STACKING_INVALID_AMOUNT: 18n,
      ERR_STACKING_INVALID_LOCK_PERIOD: 2n,
      ERR_STACKING_INVALID_POX_ADDRESS: 13n,
      ERR_STACKING_IS_DELEGATED: 30n,
      ERR_STACKING_NO_SUCH_PRINCIPAL: 4n,
      ERR_STACKING_NOT_DELEGATED: 31n,
      ERR_STACKING_PERMISSION_DENIED: 9n,
      ERR_STACKING_POX_ADDRESS_IN_USE: 12n,
      ERR_STACKING_STX_LOCKED: 6n,
      ERR_STACKING_THRESHOLD_NOT_MET: 11n,
      ERR_STACKING_UNREACHABLE: 255n,
      firstBurnchainBlockHeight: 0n,
      firstPox4RewardCycle: 0n,
      MAX_ADDRESS_VERSION: 6n,
      mAX_ADDRESS_VERSION_BUFF_20: 4n,
      mAX_ADDRESS_VERSION_BUFF_32: 6n,
      MAX_POX_REWARD_CYCLES: 12n,
      MIN_POX_REWARD_CYCLES: 1n,
      poxPrepareCycleLength: 50n,
      poxRewardCycleLength: 1050n,
      PREPARE_CYCLE_LENGTH: 50n,
      REWARD_CYCLE_LENGTH: 1050n,
      sTACKING_THRESHOLD_25: 8000n,
    },
    // constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    epoch: 'Epoch24',
    clarity_version: 'Clarity2',
    contractName: 'pox-4',
  },
  signers: {
    functions: {
      getSlots: {
        name: 'get-slots',
        access: 'public',
        args: [],
        outputs: {
          type: {
            response: {
              ok: {
                list: {
                  type: {
                    tuple: [
                      { name: 'num-slots', type: 'uint128' },
                      { name: 'signer', type: 'principal' },
                    ],
                  },
                  length: 4000,
                },
              },
              error: 'none',
            },
          },
        },
      } as TypedAbiFunction<
        [],
        Response<
          {
            numSlots: bigint;
            signer: string;
          }[],
          null
        >
      >,
      stackerdbSetSignerSlots: {
        name: 'stackerdb-set-signer-slots',
        access: 'public',
        args: [
          {
            name: 'signer-slots',
            type: {
              list: {
                type: {
                  tuple: [
                    { name: 'num-slots', type: 'uint128' },
                    { name: 'signer', type: 'principal' },
                  ],
                },
                length: 4000,
              },
            },
          },
          { name: 'reward-cycle', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'none' } } },
      } as TypedAbiFunction<
        [
          signerSlots: TypedAbiArg<
            {
              numSlots: number | bigint;
              signer: string;
            }[],
            'signerSlots'
          >,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
        ],
        Response<boolean, null>
      >,
      stackerdbGetConfig: {
        name: 'stackerdb-get-config',
        access: 'read_only',
        args: [],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'chunk-size', type: 'uint128' },
                  { name: 'hint-replicas', type: { list: { type: 'none', length: 0 } } },
                  { name: 'max-neighbors', type: 'uint128' },
                  { name: 'max-writes', type: 'uint128' },
                  { name: 'write-freq', type: 'uint128' },
                ],
              },
              error: 'none',
            },
          },
        },
      } as TypedAbiFunction<
        [],
        Response<
          {
            chunkSize: bigint;
            hintReplicas: null[];
            maxNeighbors: bigint;
            maxWrites: bigint;
            writeFreq: bigint;
          },
          null
        >
      >,
      stackerdbGetLastSetCycle: {
        name: 'stackerdb-get-last-set-cycle',
        access: 'read_only',
        args: [],
        outputs: { type: { response: { ok: 'uint128', error: 'none' } } },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      stackerdbGetSignerByIndex: {
        name: 'stackerdb-get-signer-by-index',
        access: 'read_only',
        args: [{ name: 'signer-index', type: 'uint128' }],
        outputs: {
          type: {
            response: {
              ok: {
                optional: {
                  tuple: [
                    { name: 'num-slots', type: 'uint128' },
                    { name: 'signer', type: 'principal' },
                  ],
                },
              },
              error: 'none',
            },
          },
        },
      } as TypedAbiFunction<
        [signerIndex: TypedAbiArg<number | bigint, 'signerIndex'>],
        Response<
          {
            numSlots: bigint;
            signer: string;
          } | null,
          null
        >
      >,
      stackerdbGetSignerSlots: {
        name: 'stackerdb-get-signer-slots',
        access: 'read_only',
        args: [],
        outputs: {
          type: {
            response: {
              ok: {
                list: {
                  type: {
                    tuple: [
                      { name: 'num-slots', type: 'uint128' },
                      { name: 'signer', type: 'principal' },
                    ],
                  },
                  length: 4000,
                },
              },
              error: 'none',
            },
          },
        },
      } as TypedAbiFunction<
        [],
        Response<
          {
            numSlots: bigint;
            signer: string;
          }[],
          null
        >
      >,
    },
    maps: {},
    variables: {
      CHUNK_SIZE: {
        name: 'CHUNK_SIZE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      MAX_WRITES: {
        name: 'MAX_WRITES',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      lastSetCycle: {
        name: 'last-set-cycle',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      stackerdbSignerSlots: {
        name: 'stackerdb-signer-slots',
        type: {
          list: {
            type: {
              tuple: [
                {
                  name: 'num-slots',
                  type: 'uint128',
                },
                {
                  name: 'signer',
                  type: 'principal',
                },
              ],
            },
            length: 4000,
          },
        },
        access: 'variable',
      } as TypedAbiVariable<
        {
          numSlots: bigint;
          signer: string;
        }[]
      >,
    },
    // TODO: fix with clarinet v2
    constants: {
      CHUNK_SIZE: 2097152n,
      lastSetCycle: 0n,
      MAX_WRITES: 340282366920938463463374607431768211455n,
      stackerdbSignerSlots: [],
    },
    // constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    epoch: 'Epoch24',
    clarity_version: 'Clarity2',
    contractName: 'signers',
  },
  signersStackerdb: {
    functions: {
      stackerdbGetConfig: {
        name: 'stackerdb-get-config',
        access: 'read_only',
        args: [],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'chunk-size', type: 'uint128' },
                  { name: 'hint-replicas', type: { list: { type: 'none', length: 0 } } },
                  { name: 'max-neighbors', type: 'uint128' },
                  { name: 'max-writes', type: 'uint128' },
                  { name: 'write-freq', type: 'uint128' },
                ],
              },
              error: 'none',
            },
          },
        },
      } as TypedAbiFunction<
        [],
        Response<
          {
            chunkSize: bigint;
            hintReplicas: null[];
            maxNeighbors: bigint;
            maxWrites: bigint;
            writeFreq: bigint;
          },
          null
        >
      >,
      stackerdbGetSignerSlots: {
        name: 'stackerdb-get-signer-slots',
        access: 'read_only',
        args: [],
        outputs: {
          type: {
            response: {
              ok: {
                list: {
                  type: {
                    tuple: [
                      { name: 'num-slots', type: 'uint128' },
                      { name: 'signer', type: 'principal' },
                    ],
                  },
                  length: 5,
                },
              },
              error: 'none',
            },
          },
        },
      } as TypedAbiFunction<
        [],
        Response<
          {
            numSlots: bigint;
            signer: string;
          }[],
          null
        >
      >,
    },
    maps: {},
    variables: {},
    // TODO: fix with clarinet v2
    constants: {},
    // constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    epoch: 'Epoch21',
    clarity_version: 'Clarity2',
    contractName: 'signers-stackerdb',
  },
} as const;

export const accounts = {
  wallet_3: { address: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC', balance: 100000000000000 },
  wallet_6: { address: 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0', balance: 100000000000000 },
  wallet_1: { address: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5', balance: 100000000000000 },
  wallet_5: { address: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB', balance: 100000000000000 },
  wallet_7: { address: 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ', balance: 100000000000000 },
  wallet_2: { address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', balance: 100000000000000 },
  faucet: { address: 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6', balance: 100000000000000 },
  wallet_4: { address: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND', balance: 100000000000000 },
  wallet_8: { address: 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP', balance: 100000000000000 },
  deployer: { address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', balance: 100000000000000 },
} as const;

export const identifiers = {
  delegateSig: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.delegate-sig',
  mockPox4: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mock-pox4',
  pox4: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.pox-4',
  signers: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.signers',
  signersStackerdb: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.signers-stackerdb',
} as const;

export const simnet = {
  accounts,
  contracts,
  identifiers,
} as const;

export const deployments = {
  delegateSig: {
    devnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.delegate-sig',
    simnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.delegate-sig',
    testnet: null,
    mainnet: null,
  },
  mockPox4: {
    devnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mock-pox4',
    simnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mock-pox4',
    testnet: null,
    mainnet: null,
  },
  pox4: {
    devnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.pox-4',
    simnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.pox-4',
    testnet: null,
    mainnet: null,
  },
  signers: {
    devnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.signers',
    simnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.signers',
    testnet: null,
    mainnet: null,
  },
  signersStackerdb: {
    devnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.signers-stackerdb',
    simnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.signers-stackerdb',
    testnet: null,
    mainnet: null,
  },
} as const;

export const project = {
  contracts,
  deployments,
} as const;

# How to run the devnet

This project uses [Velociraptor](https://velociraptor.run) as a script runner (similar to a Makefile). You need it installed for the `vr` command to work. You can see what's happening in the `scripts.yaml` file.

You also need to build `stacks-core` locally on the `next` branch. Run `cargo build`, and then add `./stacks-core/target/debug` to your $PATH.

Start bitcoind:

```
vr btc
```

Mine 195 bitcoin blocks:

```
vr m 195
```

Start the signers. This will spin up 2 signers:

```
vr signer
```

Start the stacks node:

```
vr stacks
```

That will take a minute to get started. Once you see a log line in the bitcoind process about a new mempool tx (the stack's miners vrf key registration), proceed.

NB: once you start mining blocks, the logs go crazy and never stop. I think it might be due to my Stacks config, because the miner is in a constant loop of trying to rebroadcast Stacks mining transactions. You can ignore this, the node seems to be working as expected.

Mine 7 blocks with ~10 seconds in between so that the Stacks miner can make Stacks blocks:

```
vr m 1
# wait 10 seconds
vr m 1
# ...
```

Check [http://localhost:20443/v2/pox](http://localhost:20443/v2/pox) to see the status of the node. At this point, the active contract should be `pox-4`. After burn height 201, epoch 2.5 is activated.

Once activated, make Stacking transactions:

```bash
pnpm tsx scripts/stack-stx.ts
```

Mine 1 block (`vr m 1`) and refresh `/v2/pox`. You should see `stacked_ustx` in the next cycle be non-zero.

Mine until 206, wait 10 seconds, then mine 1 more:

```bash
vr m 5
# wait
vr m 1
```

Now the reward set should be calculated: [http://localhost:20443/v2/stacker_set/21](http://localhost:20443/v2/stacker_set/21)

**Broken from here**

DKG never finishes with a single Stacks node, because a Stacks node doesn't send StackerDB messages "back" to itself. Thus, the `vote-for-aggregate-key` transactions are never broadcast.

You can check to see if an aggregate key was voted on with:

```bash
pnpm tsx scripts/get-aggregate-key.ts 21 # <- replace with any reward cycle
```

If this setup was tweaked to include a follower node (which uses one of the signers as an events observer), I think this would work.

docker run -it --rm --name stacks-signer \
  -v $(pwd)/signer.toml:/src/stacks-signer/signer.toml \
  --platform linux/amd64 \
  -p 30000:30000 \
  blockstack/stacks-blockchain:next \
bash
# /bin/stacks-signer start --config /src/stacks-signer/signer.toml
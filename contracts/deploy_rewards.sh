source .env
forge create src/Contracts.sol:Rewarder \
  --rpc-url https://worldchain-mainnet.g.alchemy.com/public \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --constructor-args 0x8F583e77A0858B63caAE9d45f684482Cb5989Bb4 0xBcD1275E0Cc9AE47fC50be91829D3EDF913Aaf14 1000000000

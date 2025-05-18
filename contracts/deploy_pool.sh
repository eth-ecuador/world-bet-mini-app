source .env
forge create src/Contracts.sol:Pool \
  --rpc-url https://worldchain-mainnet.g.alchemy.com/public \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --constructor-args 0xBcD1275E0Cc9AE47fC50be91829D3EDF913Aaf14 \

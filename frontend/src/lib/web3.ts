import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: process.env.ALCHEMY_API_KEY ,
  network: Network.WORLDCHAIN_MAINNET,
  connectionInfoOverrides: {
    skipFetchSetup: true,
  },
};

const alchemy = new Alchemy(config);

export const getTokenBalance = async (
  ownerAddress: string,
  tokenContractAddresses: string
) => {
  try {
    const data = await alchemy.core.getTokenBalances(ownerAddress, [
      tokenContractAddresses,
    ]);
    return data;
  } catch (error) {
    console.error("Alchemy API error in web3.ts:", error);
    throw error;
  }
};

export const CONTRACTS = {
  USDC: {
    address: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
    decimals: 6,
  },
  WLD: {
    address: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
    decimals: 18,
  },
};

import { CONTRACTS } from "@/contracts/directory";

export const payToPool = (amount: bigint) => {
  const transaction = [
    {
      address: CONTRACTS.Pool.address,
      abi: CONTRACTS.Pool.abi,
      functionName: "pay",
      args: [amount],
    },
  ];

  return transaction;
};

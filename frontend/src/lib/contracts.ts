import { CONTRACTS } from "@/contracts/directory";

export const payToPool = (address: string) => {
  const transaction = [
    {
      address: CONTRACTS.Pool.address,
      abi: CONTRACTS.Pool.abi,
      functionName: "pay",
      args: [address],
    },
  ];

  return transaction;
};

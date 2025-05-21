import { abi as GGTokenAbi } from "./GGTToken.json";
import { abi as PoolAbi } from "./Pool.json";
import { abi as RewarderAbi } from "./Rewarder.json";

export const CONTRACTS = {
  Pool: {
    address: "0x163142D00354B52F8f4F0431069AbE3119E1BC4a",
    abi: PoolAbi,
  },
  Rewarder: {
    address: "0xaFcB2ec9CDAC73B4F602636bD8f172482b9D0285",
    abi: RewarderAbi,
  },
  GGToken: {
    address: "0xBcD1275E0Cc9AE47fC50be91829D3EDF913Aaf14",
    abi: GGTokenAbi,
  },
};

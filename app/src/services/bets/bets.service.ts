import apiClient from "../api-client";
import { CreateBetResponse } from "./bets.type";

export const createBet = async (): Promise<CreateBetResponse> => {
  const { data } = await apiClient.get("/events/featured");
  return data;
};

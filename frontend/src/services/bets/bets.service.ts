import { API_MOCKS } from "@/lib/mocks";
import { CreateBetResponse } from "./bets.type";
//import apiClient from "../api-client";

export const createBet = async (): Promise<CreateBetResponse> => {
  return await API_MOCKS.BETS.CREATE;
  /*
  const { data } = await apiClient.get("/events/featured");
  return data;
  */
};

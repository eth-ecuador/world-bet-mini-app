import { API_MOCKS } from "@/lib/mocks";
//import apiClient from "../api-client";
import { GetEventsResponse } from "./events.type";

export const getEvents = async (): Promise<GetEventsResponse> => {
  return await API_MOCKS.EVENTS.FEATURED;
  /*
  const { data } = await apiClient.get("/events/featured");
  return data;
  */
};
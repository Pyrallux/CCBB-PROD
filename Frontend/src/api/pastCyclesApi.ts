import axios from "axios";
import { databaseURL } from "./apiConfig";

interface PastCycle {
  past_cycle_id?: number,
  name: string,
  date_completed: string,
  asignee: string,
  bin_list: string[],
  warehouse_id: number,
}

const pastCyclesApi = axios.create({
  baseURL: databaseURL,
});

export const getPastCycles = async () => {
  const response = await pastCyclesApi.get("/past_cycles/");
  return response.data;
};

export const getPastCycleDetail = async (past_cycle_id: number) => {
  const response = await pastCyclesApi.get(`/past_cycle/${past_cycle_id}`);
  return response.data;
};

export const getPastCycleParent = async (parent_id: number) => {
  const response = await pastCyclesApi.get(`/past_cycles/parent/${parent_id}`);
  return response.data;
};

export const addPastCycle = async (past_cycle: PastCycle) => {
  return await pastCyclesApi.post("/past_cycles/", past_cycle);
};

export const updatePastCycle = async (past_cycle: PastCycle) => {
  return await pastCyclesApi.put(
    `/past_cycles/${past_cycle.past_cycle_id}`,
    past_cycle
  );
};

export const deletePastCycle = async (past_cycle_id: number) => {
  return await pastCyclesApi.delete(`/past_cycles/${past_cycle_id}`);
};

export default pastCyclesApi;

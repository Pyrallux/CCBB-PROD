import axios from "axios";
import { databaseURL } from "./apiConfig";

interface Cycle {
	cycle_id?: number,
	name: string,
	date: Date | string,
  asignee?: string,
  completed?: boolean,
	warehouse_id: number,
}

const cyclesApi = axios.create({
  baseURL: databaseURL,
});

export const getCycles = async () => {
  const response = await cyclesApi.get("/cycles/");
  return response.data;
};

export const getCycleDetail = async (cycle_id: number) => {
  const response = await cyclesApi.get(`/cycles/${cycle_id}`);
  return response.data;
};

export const getCycleParent = async (parent_id: number) => {
  const response = await cyclesApi.get(`/cycles/parent/${parent_id}`);
  return response.data;
};

export const addCycle = async (cycle: Cycle) => {
  return await cyclesApi.post("/cycles/", cycle);
};

export const updateCycle = async (cycle: Cycle) => {
  return await cyclesApi.put(
    `/cycles/${cycle.cycle_id}`,
    cycle
  );
};

export const deleteCycle = async (cycle_id: number) => {
  return await cyclesApi.delete(`/cycles/${cycle_id}`);
};

export default cyclesApi;

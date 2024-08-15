import axios from "axios";
import { databaseURL } from "./apiConfig";

interface Bin {
	bin_id?: number,
	name: string,
	cycle_id: number,
}

const binsApi = axios.create({
  baseURL: databaseURL,
});

export const getBins = async () => {
  const response = await binsApi.get("/bins/");
  return response.data;
};

export const getBinDetail = async (bin_id: number) => {
  const response = await binsApi.get(`/bins/${bin_id}`);
  return response.data;
};

export const getBinParent = async (parent_id: number) => {
  const response = await binsApi.get(`/bins/parent/${parent_id}`);
  return response.data;
};

export const addBin = async (bin: Bin) => {
  return await binsApi.post("/bins/", bin);
};

export const updateBin = async (bin: Bin) => {
  return await binsApi.put(
    `/bins/${bin.bin_id}`,
    bin
  );
};

export const deleteBin = async (bin_id: number) => {
  return await binsApi.delete(`/bins/${bin_id}`);
};

export default binsApi;

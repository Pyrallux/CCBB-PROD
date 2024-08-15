import axios from "axios";
import { databaseURL } from "./apiConfig";

interface SystemPart {
    system_part_id?: number,
    number: string,
    quantity: number,
    bin_id: number,
}

const systemPartApi = axios.create({
  baseURL: databaseURL,
});

export const getSystemParts = async () => {
  const response = await systemPartApi.get("/system_parts/");
  return response.data;
};

export const getSystemPartDetail = async (system_part_id: number) => {
  const response = await systemPartApi.get(`/system_parts/${system_part_id}`);
  return response.data;
};

export const getSystemPartParent = async (parent_id: number) => {
  const response = await systemPartApi.get(`/system_parts/parent/${parent_id}`);
  return response.data;
};

export const addSystemPart = async (system_part: SystemPart) => {
  return await systemPartApi.post("/system_parts/", system_part);
};

export const updateSystemPart = async (system_part: SystemPart) => {
  return await systemPartApi.put(
    `/system_parts/${system_part.system_part_id}`,
    system_part
  );
};

export const deleteSystemPart = async (system_part_id: number) => {
  return await systemPartApi.delete(`/system_parts/${system_part_id}`);
};

export default systemPartApi;

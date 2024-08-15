import axios from "axios";
import { databaseURL } from "./apiConfig";

interface PhysicallyMissingPart {
  physically_missing_part_id?: number,
  number: string,
  quantity: number,
  location: string,
  date: Date | string,
  bin_id: number,
}

const physicallyMissingPartsApi = axios.create({
  baseURL: databaseURL,
});

export const getPhysicallyMissingParts = async () => {
  const response = await physicallyMissingPartsApi.get("/physically_missing_parts/");
  return response.data;
};

export const getPhysicallyMissingPartDetail = async (physically_missing_part_id: number) => {
  const response = await physicallyMissingPartsApi.get(`/physically_missing_parts/${physically_missing_part_id}`);
  return response.data;
};

export const getPhysicallyMissingPartParent = async (parent_id: number) => {
  const response = await physicallyMissingPartsApi.get(`/physically_missing_parts/parent/${parent_id}`);
  return response.data;
};

export const addPhysicallyMissingPart = async (physically_missing_part: PhysicallyMissingPart) => {
  return await physicallyMissingPartsApi.post("/physically_missing_parts/", physically_missing_part);
};

export const updatePhysicallyMissingPart = async (physically_missing_part: PhysicallyMissingPart) => {
  return await physicallyMissingPartsApi.put(
    `/physically_missing_parts/${physically_missing_part.physically_missing_part_id}`,
    physically_missing_part
  );
};

export const deletePhysicallyMissingPart = async (physically_missing_part_id: number) => {
  return await physicallyMissingPartsApi.delete(`/physically_missing_parts/${physically_missing_part_id}`);
};

export default physicallyMissingPartsApi;

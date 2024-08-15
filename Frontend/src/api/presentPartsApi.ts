import axios from "axios";
import { databaseURL } from "./apiConfig";

interface PresentPart {
  present_part_id?: number,
  number: string,
  quantity: number,
  bin_id: number,
}

const presentPartsApi = axios.create({
  baseURL: databaseURL,
});

export const getPresentParts = async () => {
  const response = await presentPartsApi.get("/present_parts/");
  return response.data;
};

export const getPresentPartDetail = async (present_part_id: number) => {
  const response = await presentPartsApi.get(`/present_parts/${present_part_id}`);
  return response.data;
};

export const getPresentPartParent = async (parent_id: number) => {
  const response = await presentPartsApi.get(`/present_parts/parent/${parent_id}`);
  return response.data;
};

export const addPresentPart = async (present_part: PresentPart) => {
  return await presentPartsApi.post("/present_parts/", present_part);
};

export const updatePresentPart = async (present_part: PresentPart) => {
  return await presentPartsApi.put(
    `/present_parts/${present_part.present_part_id}`,
    present_part
  );
};

export const deletePresentPart = async (present_part_id: number) => {
  return await presentPartsApi.delete(`/present_parts/${present_part_id}`);
};

export default presentPartsApi;

import axios from "axios";
import { databaseURL } from "./apiConfig";

interface Transaction {
  transaction_id?: number;
  part_number: string;
  old_location: string;
  new_location: string;
  quantity: number;
  date: Date | string;
  executed: boolean;
  warehouse_id: number;
}

const transactionsApi = axios.create({
  baseURL: databaseURL,
});

export const getTransactions = async () => {
  const response = await transactionsApi.get("/transactions/");
  return response.data;
};

export const getTransactionDetail = async (transaction_id: number) => {
  const response = await transactionsApi.get(`/transactions/${transaction_id}`);
  return response.data;
};

export const getTransactionParent = async (parent_id: number) => {
  const response = await transactionsApi.get(`/transactions/parent/${parent_id}`);
  return response.data;
};

export const addTransaction = async (transaction: Transaction) => {
  return await transactionsApi.post("/transactions/", transaction);
};

export const updateTransaction = async (transaction: Transaction) => {
  return await transactionsApi.put(
    `/transactions/${transaction.transaction_id}`,
    transaction
  );
};

export const deleteTransaction = async (transaction_id: number) => {
  return await transactionsApi.delete(`/transactions/${transaction_id}`);
};

export default transactionsApi;

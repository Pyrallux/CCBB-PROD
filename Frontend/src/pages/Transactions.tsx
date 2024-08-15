import { AppContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction, getTransactions } from "../api/transactionApi";
import Data5Col from "../components/Data5Col";
import ButtonGroup from "../components/ButtonGroup";
import { useNavigate } from "react-router-dom";

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

function Transactions() {
  const { whse } = useContext(AppContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isDataValid, setIsDataValid] = useState(false);
  const isDataRecieved = (data: any) => {
    if (data == undefined) {
      setIsDataValid(false);
      return false;
    } else {
      setIsDataValid(true);
      return true;
    }
  };

  // R.D Transactions
  const {
    isLoading,
    isError,
    error,
    data: transactions,
  } = useQuery({
    queryKey: ["getTransactionHistory"],
    queryFn: () => getTransactions(),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTransactionHistory"],
      });
    },
  });

  const [partNumberList, setPartNumberList] = useState([""]);
  const [quantityList, setQuantityList] = useState([""]);
  const [oldLocationList, setOldLocationList] = useState([""]);
  const [newLocationList, setNewLocationList] = useState([""]);
  const [dateList, setDateList] = useState([""]);
  useEffect(() => {
    if (isDataValid) {
      let executed_list: Transaction[] = transactions?.filter(
        (transaction: Transaction) =>
          transaction.executed == true && transaction.warehouse_id == whse
      );
      setPartNumberList(
        executed_list.map((transaction: Transaction) => transaction.part_number)
      );
      setQuantityList(
        executed_list.map((transaction: Transaction) =>
          transaction.quantity.toString()
        )
      );
      setOldLocationList(
        executed_list.map(
          (transaction: Transaction) => transaction.old_location
        )
      );
      setNewLocationList(
        executed_list.map(
          (transaction: Transaction) => transaction.new_location
        )
      );
      setDateList(
        executed_list.map((transaction: Transaction) =>
          transaction.date.toString()
        )
      );
    }
  }, [transactions]);

  const [selectedTransactionList, setSelectedTransactionList] = useState([-1]);
  const deleteTransactions = () => {
    console.log("Executing Selected Bin List:", selectedTransactionList);
    for (let i = 0; i < selectedTransactionList.length; i++) {
      let transaction = transactions[selectedTransactionList[i]];
      console.log(transaction, i);
      deleteTransactionMutation.mutate(transaction.transaction_id);
    }

    setSelectedTransactionList([-1]);

    queryClient.invalidateQueries({
      queryKey: ["getBinHistory"],
    });
  };
  // end Transactions

  // Event Handlers
  const handleSelectItem = (indexList: number[]) => {
    console.log(`Selected Elements: ${indexList}`);
    setSelectedTransactionList([...indexList]);
  };

  const handleClick = (label: string) => {
    console.log(`Button: ${label} clicked`);
    if (label == "Back") {
      navigate("/InventoryManager");
    } else if (label == "Delete Transactions") {
      deleteTransactions();
    }
  };
  // end Event Handlers

  // Shows loading/error screen until query is loaded successfully
  if (isLoading) {
    return <h2>Fetching Data From Database...</h2>;
  } else if (isError) {
    return <h2>{error.message}</h2>;
  } else if (!isDataValid) {
    return <h2>Validating Data...</h2>;
  }

  return (
    <>
      <h2>Transaction History List:</h2>
      <Data5Col
        row1Data={partNumberList}
        row2Data={quantityList}
        row3Data={oldLocationList}
        row4Data={newLocationList}
        row5Data={dateList}
        heading1="Part Number"
        heading2="Quantity"
        heading3="Moved From"
        heading4="Moved To"
        heading5="Date Executed"
        onSelectItem={handleSelectItem}
      />
      <ButtonGroup label="Back" style="secondary" onClick={handleClick} />
      <ButtonGroup
        label="Delete Transactions"
        style="outline-danger"
        onClick={handleClick}
      />
    </>
  );
}

export default Transactions;

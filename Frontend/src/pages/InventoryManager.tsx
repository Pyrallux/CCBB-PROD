import { AppContext } from "../App";
import { useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import ButtonGroup from "../components/ButtonGroup";
import {
  deletePhysicallyMissingPart,
  getPhysicallyMissingParts,
  updatePhysicallyMissingPart,
} from "../api/physicallyMissingPartsApi";
import {
  deleteSystematicallyMissingPart,
  getSystematicallyMissingParts,
  updateSystematicallyMissingPart,
} from "../api/systematicallyMissingPartsApi";
import { format } from "date-fns";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../api/transactionApi";
import { useNavigate } from "react-router-dom";
import Data4Col from "../components/Data4Col";

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

interface MissingPart {
  part_id?: number;
  number: string;
  quantity: number;
  location: string;
  date: Date | string;
  bin_id: number;
}

interface PhysicallyMissingPart {
  physically_missing_part_id: number;
  number: string;
  quantity: number;
  location: string;
  date: Date | string;
  bin_id: number;
}

interface SystematicallyMissingPart {
  systematically_missing_part_id: number;
  number: string;
  quantity: number;
  location: string;
  date: Date | string;
  bin_id: number;
}

function InventoryManager() {
  const { whse } = useContext(AppContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isGeneratingTransactions, setIsGeneratingTransactions] =
    useState(false);
  const [isExecutingTransactions, setIsExecutingTransactions] = useState(false);

  const [isDataValid, setIsDataValid] = useState(false);
  const isDataRecieved = (data: any) => {
    if (
      data === undefined ||
      queryClient.isFetching() ||
      queryClient.isMutating()
    ) {
      setIsDataValid(false);
      return false;
    } else {
      setIsDataValid(true);
      return true;
    }
  };

  // R.U.D Physically Missing Parts
  const { mutate: getPhysicallyMissingPartData, data: physicallyMissingParts } =
    useMutation({
      mutationKey: ["physicallyMissingPartsIM"],
      mutationFn: () => getPhysicallyMissingParts(),
      onSuccess: () => {
        getSystematicallyMissingPartData();
      },
    });

  const updatePhysicallyMissingPartMutation = useMutation({
    mutationFn: updatePhysicallyMissingPart,
  });

  const deletePhysicallyMissingPartMutation = useMutation({
    mutationFn: deletePhysicallyMissingPart,
  });
  // end Physically Missing Parts

  // R.U.D Systematically Missing Parts
  const { mutate: getSystematicallyMissingPartData } = useMutation({
    mutationKey: ["systematicallyMissingPartsIM"],
    mutationFn: () => getSystematicallyMissingParts(),
    onSuccess: (data) => {
      if (isGeneratingTransactions) {
        generateTransactions(data, physicallyMissingParts);
      } else if (isExecutingTransactions) {
        executeTransactions(data, physicallyMissingParts);
      }
    },
  });

  const updateSystematicallyMissingPartMutation = useMutation({
    mutationFn: updateSystematicallyMissingPart,
  });

  const deleteSystematicallyMissingPartMutation = useMutation({
    mutationFn: deleteSystematicallyMissingPart,
  });
  // end Systematically Missing Parts

  // C.R.U.D Transactions
  const {
    isLoading,
    isError,
    error,
    data: transactions,
  } = useQuery({
    queryKey: ["getTransactions"],
    queryFn: () => getTransactions(),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });

  const addTransactionMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTransactions"],
      });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTransactions"],
      });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTransactions"],
      });
    },
  });

  const [enableTransactionList, setEnableTransactionList] = useState(false);
  const [haveTransactionsBeenGenerated, setHaveTransactionsBeenGenerated] =
    useState(false);
  const [partNumberList, setPartNumberList] = useState([""]);
  const [quantityList, setQuantityList] = useState([""]);
  const [oldLocationList, setOldLocationList] = useState([""]);
  const [newLocationList, setNewLocationList] = useState([""]);
  useEffect(() => {
    if (enableTransactionList) {
      let not_executed_list: Transaction[] = transactions?.filter(
        (transaction: Transaction) => !transaction.executed
      );
      if (!not_executed_list.length) {
        setPartNumberList([""]);
        setQuantityList([""]);
        setOldLocationList([""]);
        setNewLocationList([""]);
      } else {
        setPartNumberList([
          ...not_executed_list.map(
            (transaction: Transaction) => transaction.part_number
          ),
        ]);
        setQuantityList([
          ...not_executed_list.map((transaction: Transaction) =>
            transaction.quantity.toString()
          ),
        ]);
        setOldLocationList([
          ...not_executed_list.map(
            (transaction: Transaction) => transaction.old_location
          ),
        ]);
        setNewLocationList([
          ...not_executed_list.map(
            (transaction: Transaction) => transaction.new_location
          ),
        ]);
      }
    }
  }, [transactions, isGeneratingTransactions]);
  // end Transactions

  // Transaction Generation/Execution Algorithms
  useEffect(() => {
    if (haveTransactionsBeenGenerated && partNumberList[0] === "") {
      getPhysicallyMissingPartData();
    }
  }, [isGeneratingTransactions]);

  const generateTransactions = (
    systematicallyMissingPartsList: MissingPart[],
    physicallyMissingPartsList: MissingPart[]
  ) => {
    for (let i = 0; i < transactions.length; i++) {
      if (!transactions[i].executed) {
        deleteTransactionMutation.mutate(transactions[i].transaction_id);
      }
    }
    let transactionList: Transaction[] = [];
    for (let i = 0; i < physicallyMissingPartsList.length; i++) {
      // Filter systematically missing part list for elements that match the current physically missing part
      let matchingPartsList: MissingPart[] =
        systematicallyMissingPartsList.filter(
          (part: MissingPart) =>
            part.number === physicallyMissingPartsList[i].number
        );
      // Only continue if matches exist
      if (matchingPartsList.length) {
        let matchingPartsIndex = 0;
        // Loops while Physically missing quantity exists and not at end of matching part list
        while (
          physicallyMissingPartsList[i].quantity > 0 &&
          matchingPartsIndex < matchingPartsList.length
        ) {
          // Gets the index of the n'th matching part in the systematically missing list
          let j = systematicallyMissingPartsList.indexOf(
            matchingPartsList[matchingPartsIndex]
          );
          let transactionQty = Math.min(
            physicallyMissingPartsList[i].quantity,
            systematicallyMissingPartsList[j].quantity
          );
          // Adds the matching defecit to the transaction list
          if (transactionQty > 0) {
            transactionList.push({
              part_number: physicallyMissingPartsList[i].number,
              old_location: physicallyMissingPartsList[i].location,
              new_location: systematicallyMissingPartsList[j].location, // New location of the Matching Defecit
              quantity: transactionQty,
              date: format(new Date(), "yyyy-MM-dd"),
              executed: false,
              warehouse_id: whse,
            });
            physicallyMissingPartsList[i].quantity -= transactionQty;
            systematicallyMissingPartsList[j].quantity -= transactionQty;
          }
          matchingPartsIndex++;
        }
      }
    }
    for (let i = 0; i < transactionList.length; i++) {
      addTransactionMutation.mutate(transactionList[i]);
    }
    setIsGeneratingTransactions(false);
  };

  const [selectedTransactionList, setSelectedTransactionList] = useState([-1]);
  const executeTransactions = (
    systematicallyMissingPartsList: SystematicallyMissingPart[],
    physicallyMissingPartsList: PhysicallyMissingPart[]
  ) => {
    let not_executed_transactions: Transaction[] = transactions?.filter(
      (transaction: Transaction) => !transaction.executed
    );
    for (let i = 0; i < selectedTransactionList.length; i++) {
      let transaction = not_executed_transactions[selectedTransactionList[i]];
      let physicallyMissingPart = physicallyMissingPartsList.filter(
        (part: MissingPart) =>
          part.number === transaction.part_number &&
          part.location === transaction.old_location
      )[0];
      physicallyMissingPart.quantity = Number(
        (physicallyMissingPart.quantity - transaction.quantity).toFixed(2)
      );
      updatePhysicallyMissingPartMutation.mutate(physicallyMissingPart);
      let systematicallyMissingPart = systematicallyMissingPartsList.filter(
        (part: MissingPart) =>
          part.number === transaction.part_number &&
          part.location === transaction.new_location
      )[0];
      systematicallyMissingPart.quantity = Number(
        (systematicallyMissingPart.quantity - transaction.quantity).toFixed(2)
      );
      updateSystematicallyMissingPartMutation.mutate(systematicallyMissingPart);
      transaction.executed = true;
      updateTransactionMutation.mutate(transaction);
    }
    setSelectedTransactionList([-1]);
    // Remove all parts from system and missing part lists that have quantity less than or equal to 0
    for (let i = 0; i < physicallyMissingPartsList.length; i++) {
      if (!physicallyMissingPartsList[i].quantity) {
        deletePhysicallyMissingPartMutation.mutate(
          physicallyMissingPartsList[i].physically_missing_part_id
        );
      }
    }
    for (let i = 0; i < systematicallyMissingPartsList.length; i++) {
      if (!systematicallyMissingPartsList[i].quantity) {
        deleteSystematicallyMissingPartMutation.mutate(
          systematicallyMissingPartsList[i].systematically_missing_part_id
        );
      }
    }
    queryClient.invalidateQueries({
      queryKey: ["getTransactions"],
    });
    setIsExecutingTransactions(false);
    setHaveTransactionsBeenGenerated(false);
  };
  // end Transaction Algorithms

  // Event Handlers
  const handleClick = (label: string) => {
    switch (label) {
      case "Generate Transaction List":
        setHaveTransactionsBeenGenerated(true);
        setEnableTransactionList(true);
        setIsGeneratingTransactions(true);
        /* Getting Physically Missing Part Data triggers getting systematically 
        missing part data and transaction list generation */
        getPhysicallyMissingPartData();
        break;
      case "Back":
        navigate("/SelectAction");
        break;
      case "View Transaction History":
        navigate("/Transactions");
        break;
      case "Execute Moves":
        setIsExecutingTransactions(true);
        getPhysicallyMissingPartData();
        break;
      case "Invalidate Bins":
        navigate("/InvalidateBins");
        break;
    }
  };

  const handleSelectItem = (indexList: number[]) => {
    setSelectedTransactionList(indexList);
  };
  // end Event Handlers

  // Shows loading/error screen until query is loaded successfully
  if (isLoading) {
    return <h2>Fetching Data From Database...</h2>;
  } else if (isError) {
    return <h2>{error.message}</h2>;
  } else if (!isDataValid) {
    return <h2>Validating Data...</h2>;
  } else if (isGeneratingTransactions) {
    return <h2>Generating Transactions...</h2>;
  } else if (isExecutingTransactions) {
    return <h2>Executing Transactions...</h2>;
  }

  return (
    <>
      {haveTransactionsBeenGenerated ? (
        <>
          <h2>List of Identified Transactions:</h2>
          <p>
            Be sure to select each move as you make them, then click "Execute
            Moves" when you are finished.
          </p>
          {partNumberList[0] === "" ? (
            <li className="list-group-item text-danger fst-italic ">
              No Transactions Found
            </li>
          ) : (
            <Data4Col
              row1Data={partNumberList}
              row2Data={quantityList}
              row3Data={oldLocationList}
              row4Data={newLocationList}
              heading1="Part Number"
              heading2="Quantity"
              heading3="Move From"
              heading4="Move To"
              onSelectItem={handleSelectItem}
            />
          )}
        </>
      ) : (
        <h2>Please Generate Transaction List Below</h2>
      )}
      <div>
        <ButtonGroup
          label="Generate Transaction List"
          style="primary"
          onClick={handleClick}
        />
      </div>
      <div>
        <ButtonGroup
          label="View Transaction History"
          style="outline-dark"
          onClick={handleClick}
        />
      </div>
      <ButtonGroup label="Back" style="secondary" onClick={handleClick} />
      <ButtonGroup
        label="Execute Moves"
        style="primary"
        onClick={handleClick}
        disabled={
          selectedTransactionList.length < 1 ||
          selectedTransactionList[0] === -1
        }
      />
    </>
  );
}

export default InventoryManager;

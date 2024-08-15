import { AppContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Data4Col from "../../components/Data4Col.tsx";
import ButtonGroup from "../../components/ButtonGroup";
import { useNavigate } from "react-router-dom";
import { getPastCycleParent } from "../../api/pastCyclesApi";

interface PastCycle {
  past_cycle_id?: number;
  name: string;
  date_completed: string;
  bin_list: string[];
  asignee: string;
  warehouse_id: number;
}

function CycleHistory() {
  const { whse } = useContext(AppContext);
  const navigate = useNavigate();

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

  // R. PastCycles
  const {
    isLoading,
    isError,
    error,
    data: pastCycles,
  } = useQuery({
    queryKey: ["getPastCycles"],
    queryFn: () => getPastCycleParent(whse),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });

  const [cycleNameList, setCycleNameList] = useState([""]);
  const [cycleDateList, setCycleDateList] = useState([""]);
  const [cycleBinListList, setCycleBinListList] = useState([""]);
  const [cycleAsigneeList, setCycleAsigneeList] = useState([""]);
  useEffect(() => {
    if (isDataValid) {
      setCycleNameList(pastCycles.map((a: PastCycle) => a.name));
      setCycleDateList(pastCycles.map((a: PastCycle) => a.date_completed));
      setCycleBinListList(
        pastCycles.map((a: PastCycle) =>
          JSON.stringify(a.bin_list)
            .replace(/["\]\[]/g, "")
            .replace(/,/g, ", ")
        )
      );
      setCycleAsigneeList(pastCycles.map((a: PastCycle) => a.asignee));
    }
  }, [pastCycles]);
  // end PastCycles

  const [selectedCycleList, setSelectedCycleList] = useState([-1]);
  const handleSelectItem = (indexList: number[]) => {
    setSelectedCycleList([...indexList]);
    console.log(selectedCycleList);
  };

  const handleClick = (label: string) => {
    label === "Back" && navigate("/SelectCycle");
  };

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
      <h2>Completed Cycle Counts:</h2>
      <Data4Col
        row1Data={cycleNameList}
        row2Data={cycleBinListList}
        row3Data={cycleDateList}
        row4Data={cycleAsigneeList}
        heading1="Cycle Cound ID"
        heading2="Counted Bins"
        heading3="Date Completed"
        heading4="Counted By"
        onSelectItem={handleSelectItem} // Right now this just returns a single item but we want multiple selection
      />
      <ButtonGroup label="Back" style="secondary" onClick={handleClick} />
    </>
  );
}

export default CycleHistory;

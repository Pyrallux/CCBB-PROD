import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CycleTable from "../../components/CycleListGroup";
import ButtonGroup from "../../components/ButtonGroup";
import { getCycleParent } from "../../api/cyclesApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { addCycle } from "../../api/cyclesApi";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { pdf } from "@react-pdf/renderer";
import CycleSheet from "./CycleSheet";
import { saveAs } from "file-saver";
import { getBinParent } from "../../api/binsApi";

interface FormData {
  cycle: number;
}

interface DocumentData {
  name: string;
  date: string;
  asignee: string;
  binList: string[];
}

function SelectCycle() {
  const { whse, cycle, setBinList, manual, setCycle } = useContext(AppContext);
  const navigate = useNavigate();

  const [isDataValid, setIsDataValid] = useState(false);
  const isDataRecieved = (data: any) => {
    if (data === undefined) {
      setIsDataValid(false);
      return false;
    } else {
      setIsDataValid(true);
      return true;
    }
  };

  // C.R. Cycles
  const {
    isLoading,
    isError,
    error,
    data: cycles,
  } = useQuery({
    queryKey: ["getCycleParent"],
    queryFn: () => getCycleParent(whse),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });

  const addCycleMutation = useMutation({
    mutationFn: addCycle,
    onSuccess: () => {
      navigate("/AddCycle");
    },
  });

  const [cycleNames, setCycleNames] = useState(["Loading..."]);
  const [cycleDates, setCycleDates] = useState(["Loading..."]);
  const [cycleAsignees, setCycleAsignees] = useState(["Loading..."]);
  const [cycleKeys, setCycleKeys] = useState([-1]);
  useEffect(() => {
    const cycle_names: string[] = [];
    const cycle_dates: string[] = [];
    const cycle_asignees: string[] = [];
    const cycle_keys: number[] = [];
    for (let i = 0; i < cycles?.length; i++) {
      if (!cycles[i].completed) {
        cycle_names.push(cycles[i].name);
        cycle_dates.push(cycles[i].date);
        cycle_asignees.push(cycles[i].asignee);
        cycle_keys.push(cycles[i].cycle_id);
      }
    }
    setCycleNames([...cycle_names]);
    setCycleDates([...cycle_dates]);
    setCycleAsignees([...cycle_asignees]);
    setCycleKeys([...cycle_keys]);
  }, [cycles]);
  // end Cycles

  // R. Bins
  const [itemIndex, setItemIndex] = useState(-1);
  const { mutate: getBinData } = useMutation({
    mutationFn: (cycle: number) => getBinParent(cycle),
    onSuccess: (data) => {
      let bin_names: string[] = [];
      for (let i = 0; i < data.length; i++) {
        bin_names.push(data[i].name);
      }
      setBinList([...bin_names.sort()]);
      Cookies.set("sessionBinList", JSON.stringify([...bin_names.sort()]), {
        sameSite: "Strict",
      });

      generatePdfDocument(
        {
          name: cycleNames[itemIndex],
          date: cycleDates[itemIndex],
          asignee: cycleAsignees[itemIndex],
          binList: bin_names.sort(),
        },
        `BayCount-${cycleNames[itemIndex]}-(${cycleDates[itemIndex]})`
      );
    },
  });
  // end Bins

  // PDF Document Generator
  const generatePdfDocument = async (
    documentData: DocumentData,
    fileName: string
  ) => {
    const blob = await pdf(
      <CycleSheet
        name={documentData.name}
        date={documentData.date}
        asignee={documentData.asignee}
        binList={documentData.binList}
      />
    ).toBlob();
    saveAs(blob, fileName);
  };
  // end PDF Document

  // Yup + useForm Validator
  const schema = yup.object().shape({
    cycle: yup
      .number()
      .min(0, "*Cycle Selection is Required")
      .required("*Cycle Selection is Required"),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // end Validator

  // Event Handlers
  const onSubmit = (data: FormData) => {
    console.log("Submit Called");
    setCycle(cycleKeys[data.cycle]);
    Cookies.set("sessionCycle", cycleKeys[data.cycle].toString(), {
      sameSite: "Strict",
    });
    navigate("/CycleCount");
  };

  const [itemSelected, setItemSelected] = useState(false);
  const handleSelectItem = (index: number) => {
    setItemSelected(true);
    setItemIndex(index);
    setValue("cycle", index);
    setCycle(cycleKeys[index]);
    Cookies.set("sessionCycle", cycleKeys[index].toString(), {
      sameSite: "Strict",
    });
  };

  const handleClickEdit = (index: number) => {
    setCycle(cycleKeys[index]);
    Cookies.set("sessionCycle", cycleKeys[index].toString(), {
      sameSite: "Strict",
    });
    navigate("/EditCycle");
  };

  const handleClickDownload = (index: number) => {
    console.log("New Cycle: ", cycleKeys[index]);
    setItemIndex(index);
    setCycle(cycleKeys[index]);
    Cookies.set("sessionCycle", cycleKeys[index].toString(), {
      sameSite: "Strict",
    });
    getBinData(cycleKeys[index]);
  };

  const handleClick = (label: string) => {
    switch (label) {
      case "Back":
        navigate("/SelectAction");
        break;
      case "View Transactions":
        navigate("/InventoryManager");
        break;
      case "View Cycle Count History":
        navigate("/CycleHistory");
        break;
      case "+ Add New Cycle":
        // Automatically Navigates to the AddCycle on mutation completion
        addCycleMutation.mutate({
          name: "Pending New Cycle...",
          date: format(new Date(), "yyyy-MM-dd"),
          asignee: "",
          completed: false,
          warehouse_id: whse,
        });
        break;
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="md-4">Select Cycle Count Below:</h2>
      <p className="ms-3 text-danger fst-italic">{errors.cycle?.message}</p>
      <CycleTable
        names={cycleNames}
        dates={cycleDates}
        asignees={cycleAsignees}
        heading1="Cycle Count ID"
        heading2="Cycle Date"
        heading3="Asignee"
        onSelectItem={handleSelectItem}
        onClickEdit={handleClickEdit}
        onClickDownload={handleClickDownload}
      />
      {!cycles.length && <p>No Items Found</p>}
      <input type="hidden" defaultValue={cycle} {...register("cycle")} />
      {manual && (
        <div>
          <ButtonGroup
            label="+ Add New Cycle"
            style="outline-secondary"
            onClick={handleClick}
          />
        </div>
      )}
      <div>
        <ButtonGroup
          label="View Cycle Count History"
          style="outline-dark"
          onClick={handleClick}
        />
      </div>
      <ButtonGroup label="Back" style="secondary" onClick={handleClick} />
      {itemSelected ? (
        <ButtonGroup label="Continue" type="submit" onClick={handleClick} />
      ) : (
        <ButtonGroup
          label="Continue"
          type="submit"
          disabled={true}
          onClick={handleClick}
        />
      )}
    </form>
  );
}

export default SelectCycle;

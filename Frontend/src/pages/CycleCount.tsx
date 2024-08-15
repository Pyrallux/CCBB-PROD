import PartListGroup from "../components/PartListGroup";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../App";
import ButtonGroup from "../components/ButtonGroup";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  deleteCycle,
  getCycleDetail,
  getCycleParent,
  updateCycle,
} from "../api/cyclesApi";
import { deleteBin, getBinParent, getBins } from "../api/binsApi";
import {
  getPresentPartParent,
  addPresentPart,
  deletePresentPart,
} from "../api/presentPartsApi";
import {
  getSystemPartParent,
  addSystemPart,
  deleteSystemPart,
} from "../api/systemPartsApi";
import {
  addSystematicallyMissingPart,
  deleteSystematicallyMissingPart,
  getSystematicallyMissingPartParent,
} from "../api/systematicallyMissingPartsApi";
import {
  addPhysicallyMissingPart,
  deletePhysicallyMissingPart,
  getPhysicallyMissingPartParent,
} from "../api/physicallyMissingPartsApi";
import { format } from "date-fns";
import { addPastCycle } from "../api/pastCyclesApi";
import Cookies from "js-cookie";

interface Part {
  part_number: string;
  qty: number;
}

interface BinData {
  bin_id?: number;
  name: string;
  cycle_id: number;
}

interface Cycle {
  cycle_id: number;
  name: string;
  date: Date | string;
  completed: boolean;
  warehouse_id: number;
}

function CycleCount() {
  const {
    whse,
    cycle,
    bin,
    setBin,
    binList,
    setBinList,
    manual,
    presentPartList,
    setPresentPartList,
    systemPartList,
    setSystemPartList,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  // R.U. Cycles
  const {
    isError,
    error,
    data: cycleData,
  } = useQuery({
    queryKey: ["getCycleCountInfo"],
    queryFn: () => getCycleDetail(cycle),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });

  const updateCycleMutation = useMutation({
    mutationFn: updateCycle,
    onSuccess: () => {
      // Clears bin list and redirects user to inventory manager
      setBinList([""]);
      Cookies.set("sessionBinList", JSON.stringify([""]), {
        sameSite: "Strict",
      });
      navigate("/SelectCycle");
    },
  });
  // end Cycles

  // R. Bins
  const { data: binData } = useQuery({
    queryKey: ["cycleCountBins"],
    queryFn: () => getBinParent(cycle),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });

  const [binIndex, setBinIndex] = useState(0);
  const [binListIds, setBinListIds] = useState([-1]);
  useEffect(() => {
    // Sorts bin list based on bin name
    let sorted_bin_list = binData?.sort((a: BinData, b: BinData) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    let bin_names: string[] = [];
    let bin_ids: number[] = [];
    for (let i = 0; i < sorted_bin_list?.length; i++) {
      bin_names.push(sorted_bin_list[i].name);
      bin_ids.push(sorted_bin_list[i].bin_id);
    }
    setBinList([...bin_names]);
    Cookies.set("sessionBinList", JSON.stringify([...bin_names]), {
      sameSite: "Strict",
    });
    setBinListIds(bin_ids);
    setBin(bin_ids[binIndex]);
    Cookies.set("sessionBin", String(bin_ids[binIndex]), {
      sameSite: "Strict",
    });
  }, [binData]);

  useEffect(() => {
    // Updates bin based on the current index of the cycle's binList
    setBin(binListIds[binIndex]);
    Cookies.set("sessionBin", String(binListIds[binIndex]), {
      sameSite: "Strict",
    });
  }, [binIndex]);

  useEffect(() => {
    if (bin > -1) {
      getPresentPartData();
      getSystemPartData();
      getPhysicallyMissingPartData();
      getSystematicallyMissingPartData();
    }
  }, [bin]);
  // end Bins

  // C.R.D PresentParts
  const { mutate: getPresentPartData, data: presentPartData } = useMutation({
    mutationKey: ["cycleCountPresentParts"],
    mutationFn: () => getPresentPartParent(bin),
  });

  const addPresentPartMutation = useMutation({
    mutationFn: addPresentPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycleCountPresentParts"] });
    },
  });

  const deletePresentPartMutation = useMutation({
    mutationFn: deletePresentPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycleCountPresentParts"] });
    },
  });

  useEffect(() => {
    let present_part_list: Part[] = [];
    for (let i = 0; i < presentPartData?.length; i++) {
      present_part_list.push({
        part_number: presentPartData[i].number,
        qty: presentPartData[i].quantity,
      });
    }
    setPresentPartList([...present_part_list]);
    Cookies.set(
      "sessionPresentPartList",
      JSON.stringify([...present_part_list]),
      {
        sameSite: "Strict",
      }
    );
  }, [presentPartData, bin]);
  // end PresentParts

  // C.R.D SystemParts
  const { mutate: getSystemPartData, data: systemPartData } = useMutation({
    mutationKey: ["cycleCountSystemParts"],
    mutationFn: () => getSystemPartParent(bin),
  });

  const addSystemPartMutation = useMutation({
    mutationFn: addSystemPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycleCountSystemParts"] });
    },
  });

  const deleteSystemPartMutation = useMutation({
    mutationFn: deleteSystemPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycleCountSystemParts"] });
    },
  });

  useEffect(() => {
    let system_part_list: Part[] = [];
    for (let i = 0; i < systemPartData?.length; i++) {
      system_part_list.push({
        part_number: systemPartData[i].number,
        qty: systemPartData[i].quantity,
      });
    }
    setSystemPartList([...system_part_list]);
  }, [systemPartData, bin]);
  // end SystemParts

  // C.R.D PhysicallyMissingParts
  const {
    mutate: getPhysicallyMissingPartData,
    data: physicallyMissingPartData,
  } = useMutation({
    mutationKey: ["physicallyMissingPartsCycleCount"],
    mutationFn: () => getPhysicallyMissingPartParent(bin),
  });

  const addPhysicallyMissingPartMutation = useMutation({
    mutationFn: addPhysicallyMissingPart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["physicallyMissingPartsCycleCount"],
      });
    },
  });

  const deletePhysicallyMissingPartMutation = useMutation({
    mutationFn: deletePhysicallyMissingPart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["physicallyMissingPartsCycleCount"],
      });
    },
  });
  // end PhysicallyMissingParts

  // C.R.D SystematicallyMissingParts
  const {
    mutate: getSystematicallyMissingPartData,
    data: systematicallyMissingPartData,
  } = useMutation({
    mutationKey: ["systematicallyMissingPartsCycleCount"],
    mutationFn: () => getSystematicallyMissingPartParent(bin),
  });

  const addSystematicallyMissingPartMutation = useMutation({
    mutationFn: addSystematicallyMissingPart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["systematicallyMissingPartsCycleCount"],
      });
    },
  });

  const deleteSystematicallyMissingPartMutation = useMutation({
    mutationFn: deleteSystematicallyMissingPart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["systematicallyMissingPartsCycleCount"],
      });
    },
  });
  // end SystematicallyMissingParts

  // C. PastCycles
  const addPastCycleMutation = useMutation({
    mutationFn: addPastCycle,
  });
  // end PastCycles

  // R.D. Stale Cycles
  const { data: cycles } = useQuery({
    queryKey: ["cycleCountCyclesList"],
    queryFn: () => getCycleParent(whse),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });

  const deleteCycleMutation = useMutation({
    mutationFn: deleteCycle,
  });

  const { mutate: deleteStaleCycles } = useMutation({
    mutationFn: getBins,
    onSuccess: (data) => {
      // Deletes the Stale Bin Parents (Cycles)
      let childBinList: BinData[] = [];
      let completedCycles: Cycle[] = cycles.filter((e: Cycle) => e.completed);
      for (let i = 0; i < completedCycles.length; i++) {
        childBinList = data.filter(
          (e: BinData) => e.cycle_id === completedCycles[i].cycle_id
        );
        if (!childBinList.length) {
          deleteCycleMutation.mutate(completedCycles[i].cycle_id);
        }
      }
    },
  });
  // end Stale Cycles

  // R.D. Stale Bins
  const { data: bins } = useQuery({
    queryKey: ["cycleCountBinsList"],
    queryFn: () => getBins(),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });

  const deleteBinMutation = useMutation({
    mutationFn: deleteBin,
  });

  const deleteStaleBins = () => {
    let staleCycleList: Cycle[] = [];
    // Deletes Stale Bins
    for (let i = 0; i < bins.length; i++) {
      let parentCycle = cycles.filter(
        (e: Cycle) => e.cycle_id === bins[i].cycle_id
      );
      if (
        parentCycle.length &&
        binList.includes(bins[i].name) &&
        !binListIds.includes(bins[i].bin_id)
      ) {
        if (parentCycle[0].completed) {
          deleteBinMutation.mutate(bins[i].bin_id);
          if (!staleCycleList.includes(parentCycle[0])) {
            staleCycleList.push(parentCycle[0]);
          }
        }
      }
    }
    deleteStaleCycles();
  };
  // end Stale Bins

  // Missing Part Algorithms
  const updateMissingPartLists = (
    presentParts: Part[],
    systemParts: Part[]
  ) => {
    // Delete all contents of both Systematically and Physically Missing Part Lists
    for (let i = 0; i < physicallyMissingPartData?.length; i++) {
      deletePhysicallyMissingPartMutation.mutate(
        physicallyMissingPartData[i].physically_missing_part_id
      );
    }
    for (let i = 0; i < systematicallyMissingPartData?.length; i++) {
      deleteSystematicallyMissingPartMutation.mutate(
        systematicallyMissingPartData[i].systematically_missing_part_id
      );
    }
    let presentPartsNotUsed = [...presentParts];
    let systemPartsNotUsed = [...systemParts];
    for (let i = 0; i < presentParts.length; i++) {
      for (let j = 0; j < systemParts.length; j++) {
        if (presentParts[i].part_number === systemParts[j].part_number) {
          let quantity_difference = Number(
            (presentParts[i].qty - systemParts[j].qty).toFixed(2)
          );
          if (quantity_difference > 0) {
            addSystematicallyMissingPartMutation.mutate({
              number: presentParts[i].part_number,
              quantity: quantity_difference,
              location: binList[binIndex],
              date: format(new Date(), "yyyy-MM-dd"),
              bin_id: bin,
            });
          } else if (quantity_difference < 0) {
            addPhysicallyMissingPartMutation.mutate({
              number: presentParts[i].part_number,
              quantity: -quantity_difference,
              location: binList[binIndex],
              date: format(new Date(), "yyyy-MM-dd"),
              bin_id: bin,
            });
          }
          presentPartsNotUsed = [
            ...presentPartsNotUsed.filter((e) => e !== presentParts[i]),
          ];
          systemPartsNotUsed = [
            ...systemPartsNotUsed.filter((e) => e !== systemParts[j]),
          ];
          break;
        }
      }
    }
    for (let i = 0; i < presentPartsNotUsed.length; i++) {
      addSystematicallyMissingPartMutation.mutate({
        number: presentPartsNotUsed[i].part_number,
        quantity: presentPartsNotUsed[i].qty,
        location: binList[binIndex],
        date: format(new Date(), "yyyy-MM-dd"),
        bin_id: bin,
      });
    }
    for (let i = 0; i < systemPartsNotUsed.length; i++) {
      addPhysicallyMissingPartMutation.mutate({
        number: systemPartsNotUsed[i].part_number,
        quantity: systemPartsNotUsed[i].qty,
        location: binList[binIndex],
        date: format(new Date(), "yyyy-MM-dd"),
        bin_id: bin,
      });
    }
  };

  const deleteMissingPartLists = () => {
    // Delete all contents of both Systematically and Physically Missing Part Lists
    for (let i = 0; i < physicallyMissingPartData?.length; i++) {
      deletePhysicallyMissingPartMutation.mutate(
        physicallyMissingPartData[i].physically_missing_part_id
      );
    }
    for (let i = 0; i < systematicallyMissingPartData?.length; i++) {
      deleteSystematicallyMissingPartMutation.mutate(
        systematicallyMissingPartData[i].systematically_missing_part_id
      );
    }
  };
  // end Missing Part Algorithms

  // Event Handlers
  const [countError, setCountError] = useState("");
  const handleClick = (label: string) => {
    switch (label) {
      case "Continue":
        if (
          JSON.stringify(presentPartList).includes("Error") ||
          JSON.stringify(systemPartList).includes("Error")
        ) {
          setCountError("*Form Data Includes Errors");
          break;
        } else {
          setCountError("");
        }

        if (manual) {
          // Updates System Part List
          for (let i = 0; i < systemPartData?.length; i++) {
            deleteSystemPartMutation.mutate(systemPartData[i].system_part_id);
          }
          for (let i = 0; i < systemPartList.length; i++) {
            addSystemPartMutation.mutate({
              number: systemPartList[i].part_number,
              quantity: systemPartList[i].qty,
              bin_id: bin,
            });
          }
        }
        // Updates Present Part List
        for (let i = 0; i < presentPartData?.length; i++) {
          deletePresentPartMutation.mutate(presentPartData[i].present_part_id);
        }
        for (let i = 0; i < presentPartList.length; i++) {
          addPresentPartMutation.mutate({
            number: presentPartList[i].part_number,
            quantity: presentPartList[i].qty,
            bin_id: bin,
          });
        }
        updateMissingPartLists(presentPartList, systemPartList);
        setBinIndex(binIndex + 1);
        // Marks cycle as completed if current bin is the last in binList, and navigates to next page
        if (binIndex >= binList.length - 1) {
          deleteStaleBins();
          addPastCycleMutation.mutate({
            name: cycleData.name,
            date_completed: format(new Date(), "yyyy-MM-dd"),
            asignee: cycleData.asignee,
            bin_list: [...binList],
            warehouse_id: cycleData.warehouse_id,
          });
          updateCycleMutation.mutate({
            cycle_id: cycle,
            name: cycleData.name,
            date: cycleData.date,
            asignee: cycleData.asignee,
            completed: true,
            warehouse_id: cycleData.warehouse_id,
          });
        }
        break;
      case "Back":
        // Checks if it is the last bin in the list
        if (binIndex <= binList.length - 1) {
          if (manual) {
            // Updates System Part List
            for (let i = 0; i < systemPartData?.length; i++) {
              deleteSystemPartMutation.mutate(systemPartData[i].system_part_id);
            }
            for (let i = 0; i < systemPartList.length; i++) {
              addSystemPartMutation.mutate({
                number: systemPartList[i].part_number,
                quantity: systemPartList[i].qty,
                bin_id: bin,
              });
            }
          }
          // Updates Present Part List
          for (let i = 0; i < presentPartData?.length; i++) {
            deletePresentPartMutation.mutate(
              presentPartData[i].present_part_id
            );
          }
          for (let i = 0; i < presentPartList.length; i++) {
            addPresentPartMutation.mutate({
              number: presentPartList[i].part_number,
              quantity: presentPartList[i].qty,
              bin_id: bin,
            });
          }
          deleteMissingPartLists();
          setBinIndex(binIndex - 1);
        }
        if (binIndex - 1 < 0) {
          setBinList([""]);
          Cookies.set("sessionBinList", JSON.stringify([""]), {
            sameSite: "Strict",
          });
          navigate("/SelectCycle");
        }
        break;
    }
  };
  // end Event Handlers

  // Shows loading/error screen until page is loaded successfully
  if (queryClient.isFetching() || queryClient.isMutating()) {
    return <h2>Fetching Data From Database...</h2>;
  } else if (isError) {
    return <h2>{error.message}</h2>;
  } else if (binList[binIndex] === undefined) {
    return (
      <>
        <p className="mb-3 text-danger fst-italic">
          WARNING: No bins present in cycle count, pressing continue will mark
          the count as completed!
        </p>
        <ButtonGroup label="Back" onClick={handleClick} />
        <ButtonGroup label="Continue" onClick={handleClick} />
      </>
    );
  } else if (!isDataValid) {
    return <h2>Validating Data...</h2>;
  }

  return (
    <>
      <h1>
        <b>Enter Details for Bin: {binList[binIndex]}</b>
      </h1>
      <div className="container">
        <div className="row">
          <div className="col">
            <h2>
              <u>Enter Parts Present:</u>
            </h2>
            <PartListGroup type="present" />
          </div>
          {manual && (
            <div className="col">
              <h2>
                <u>Enter Parts in ERP System:</u>
              </h2>
              <PartListGroup type="system" />
            </div>
          )}
        </div>
        <p className="ms-3 text-danger fst-italic">{countError}</p>
      </div>
      <ButtonGroup label="Back" style="secondary" onClick={handleClick} />
      <ButtonGroup label="Continue" onClick={handleClick} />
    </>
  );
}

export default CycleCount;

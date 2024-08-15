import { AppContext } from "../App";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ButtonGroup from "../components/ButtonGroup";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addCycle, getCycleParent } from "../api/cyclesApi";
import { addBin, getBins } from "../api/binsApi";
import { addPhysicallyMissingPart } from "../api/physicallyMissingPartsApi";
import { addSystematicallyMissingPart } from "../api/systematicallyMissingPartsApi";
import { format } from "date-fns";

interface FormData {
  missing_part_id?: number;
  number: string;
  quantity: number;
  location: string;
}

interface Cycle {
  cycle_id?: number;
  name: string;
  date: Date | string;
  asignee?: string;
  completed?: boolean;
  warehouse_id: number;
}

interface Bin {
  bin_id?: number;
  name: string;
  cycle_id: number;
}

function AddMissingPart() {
  const { whse } = useContext(AppContext);
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

  // C.R. Cycles Parent
  const {
    isError,
    error,
    data: cycleData,
  } = useQuery({
    queryKey: ["AddMissingPartCycles"],
    queryFn: () => getCycleParent(whse),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });

  const [missingPartNumber, setMissingPartNumber] = useState("");
  const [missingPartQuantity, setMissingPartQuantity] = useState(-1);
  const [missingPartLocation, setMissingPartLocation] = useState("");
  const { mutate: updateCycles } = useMutation({
    mutationFn: () => getCycleParent(whse),
    onSuccess: (data) => {
      addBinMutation.mutate({
        name: missingPartLocation,
        cycle_id: data[data.length - 1].cycle_id,
      });
    },
  });
  const addCycleMutation = useMutation({
    mutationFn: addCycle,
    onSuccess: () => {
      updateCycles();
    },
  });
  // end Cycles

  // C.R. Bins Parent
  const { data: binData } = useQuery({
    queryKey: ["AddMissingPartBins"],
    queryFn: () => getBins(),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });
  const { mutate: updateBins } = useMutation({
    mutationFn: () => getBins(),
    onSuccess: (data) => {
      if (isViewingPhysicallyMissingParts) {
        addPhysicallyMissingPartMutation.mutate({
          number: missingPartNumber,
          quantity: missingPartQuantity,
          location: missingPartLocation,
          date: format(new Date(), "yyyy-MM-dd"),
          bin_id: data[data.length - 1].bin_id,
        });
      } else {
        addSystematicallyMissingPartMutation.mutate({
          number: missingPartNumber,
          quantity: missingPartQuantity,
          location: missingPartLocation,
          date: format(new Date(), "yyyy-MM-dd"),
          bin_id: data[data.length - 1].bin_id,
        });
      }
    },
  });

  const addBinMutation = useMutation({
    mutationFn: addBin,
    onSuccess: () => {
      updateBins();
    },
  });
  // end Bins

  // C. PhysicallyMissingParts
  const addPhysicallyMissingPartMutation = useMutation({
    mutationFn: addPhysicallyMissingPart,
    onSuccess: () => {
      navigate("/MissingPartSearch");
    },
  });
  // end PhysicallyMissingParts

  // C. SystematicallyMissingParts
  const addSystematicallyMissingPartMutation = useMutation({
    mutationFn: addSystematicallyMissingPart,
    onSuccess: () => {
      navigate("/MissingPartSearch");
    },
  });
  // end SystematicallyMissingParts

  // Yup + useForm Validator
  const schema = yup.object().shape({
    number: yup.string().required("*Part Number is Required"),
    quantity: yup.number().positive().required("*Quantity is Required"),
    location: yup.string().required("*Bin Location is Required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // end Validator

  // Event Handlers
  const [isViewingPhysicallyMissingParts, setIsViewingPhysicallyMissingParts] =
    useState(false);
  const [
    isViewingSystematicallyMissingParts,
    setIsViewingSystematicallyMissingParts,
  ] = useState(false);
  const onSubmit = (data: FormData) => {
    let childCycles = cycleData
      .filter((a: Cycle) => a.warehouse_id === whse)
      .map((b: Cycle) => b.cycle_id);
    let childBins = binData.filter((a: Bin) =>
      childCycles.includes(a.cycle_id)
    );
    let matchingBinId = childBins
      .filter((a: Bin) => a.name === data.location)
      .map((b: Bin) => b.bin_id);

    if (!matchingBinId) {
      if (isViewingPhysicallyMissingParts) {
        addPhysicallyMissingPartMutation.mutate({
          number: data.number,
          quantity: data.quantity,
          location: data.location,
          date: format(new Date(), "yyyy-MM-dd"),
          bin_id: matchingBinId,
        });
      } else {
        addSystematicallyMissingPartMutation.mutate({
          number: data.number,
          quantity: data.quantity,
          location: data.location,
          date: format(new Date(), "yyyy-MM-dd"),
          bin_id: matchingBinId,
        });
      }
    } else {
      setMissingPartNumber(data.number);
      setMissingPartQuantity(data.quantity);
      setMissingPartLocation(data.location);
      addCycleMutation.mutate({
        name: `Add Missing Part - ${format(new Date(), "yyyy-MM-dd")}`,
        date: format(new Date(), "yyyy-MM-dd"),
        completed: true,
        warehouse_id: whse,
      });
    }
  };

  const handleClick = (label: string) => {
    switch (label) {
      case "Cancel":
        navigate("/MissingPartSearch");
        break;
      case "Physically Missing":
        setIsViewingPhysicallyMissingParts(!isViewingPhysicallyMissingParts);
        setIsViewingSystematicallyMissingParts(false);
        break;
      case "Systematically Missing":
        setIsViewingPhysicallyMissingParts(false);
        setIsViewingSystematicallyMissingParts(
          !isViewingSystematicallyMissingParts
        );
        break;
    }
  };
  // end Event Handlers

  // Shows loading/error screen until query is loaded successfully
  if (queryClient.isFetching() || queryClient.isMutating()) {
    return <h2>Fetching Data From Database...</h2>;
  } else if (isError) {
    return <h2>{error.message}</h2>;
  } else if (!isDataValid) {
    return <h2>Validating Data...</h2>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Input Missing Part Below:</h2>
      <label className="form-label mt-3">Part Number</label>
      <input type="text" className="form-control" {...register("number")} />
      <p className="ms-3 text-danger fst-italic">{errors.number?.message}</p>

      <label className="form-label mt-3">Quantity Missing</label>
      <input type="text" className="form-control" {...register("quantity")} />
      <p className="ms-3 text-danger fst-italic">{errors.quantity?.message}</p>

      <label className="form-label mt-3">Missing From Bin</label>
      <input type="text" className="form-control" {...register("location")} />
      <p className="ms-3 text-danger fst-italic">{errors.location?.message}</p>

      <p className="mb-0"> Select an Option Below:</p>
      {isViewingPhysicallyMissingParts ? (
        <ButtonGroup
          label="Physically Missing"
          style="dark"
          onClick={handleClick}
        />
      ) : (
        <ButtonGroup
          label="Physically Missing"
          style="outline-dark"
          onClick={handleClick}
        />
      )}
      {isViewingSystematicallyMissingParts ? (
        <ButtonGroup
          label="Systematically Missing"
          style="dark"
          onClick={handleClick}
        />
      ) : (
        <ButtonGroup
          label="Systematically Missing"
          style="outline-dark"
          onClick={handleClick}
        />
      )}

      <div>
        <ButtonGroup label="Cancel" style="secondary" onClick={handleClick} />
        <ButtonGroup label="Done" type="submit" onClick={handleClick} />
      </div>
    </form>
  );
}

export default AddMissingPart;

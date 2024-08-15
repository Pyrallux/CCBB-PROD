import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonGroup from "../../components/ButtonGroup";
import BinListGroup from "../../components/BinListGroup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCycleParent, updateCycle, deleteCycle } from "../../api/cyclesApi";
import { addBin } from "../../api/binsApi";
import { format } from "date-fns";
import Cookies from "js-cookie";

interface FormData {
  cycle_id?: number;
  name: string;
  date: Date | string;
  asignee?: string;
  completed?: boolean;
  warehouse_id?: number;
}

function AddCycle() {
  const { whse, cycle, setCycle, binList, setBinList } = useContext(AppContext);
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

  // C.R.U.D Cycles
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

  const deleteCycleMutation = useMutation({
    mutationFn: deleteCycle,
    onSuccess: () => {
      navigate("/SelectCycle");
    },
  });

  const updateCycleMutation = useMutation({
    mutationFn: updateCycle,
    onSuccess: () => {
      binList.map((bin) =>
        addBinMutation.mutate({
          name: bin,
          cycle_id: cycle,
        })
      );
      setBinList([""]);
      Cookies.set("sessionBinList", JSON.stringify([""]), {
        sameSite: "Strict",
      });
      navigate("/SelectCycle");
    },
  });

  const addBinMutation = useMutation({
    mutationFn: addBin,
  });

  const [cycleId, setCycleId] = useState(-1);
  useEffect(() => {
    let max = -1;
    for (let i = 0; i < cycles?.length; i++) {
      if (cycles[i].cycle_id > max) {
        max = cycles[i].cycle_id;
      }
    }
    setCycleId(max);
  }, [cycles]);
  // end Cycles

  // Yup + useForm Validator
  useEffect(() => {
    setValue("bin_list", JSON.stringify([...binList]));
    console.log(JSON.stringify([...binList]));
  }, [binList]);

  const schema = yup.object().shape({
    name: yup.string().required("*Cycle Name is Required"),
    date: yup.date().required("*Cycle Date is Required"),
    asignee: yup.string().optional(),
    completed: yup.boolean(),
    bin_list: yup
      .string()
      .test(
        "no-errors",
        "*Bin List Includes Errors",
        (value) => !value?.includes("Error")
      )
      .min(5, "*At Least One Bin Must be Added"),
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
    setCycle(cycleId);
    Cookies.set("sessionCycle", cycleId.toString(), {
      sameSite: "Strict",
    });
    updateCycleMutation.mutate({
      cycle_id: cycleId,
      name: data.name,
      date: format(data.date, "yyyy-MM-dd"),
      asignee: data.asignee,
      completed: data.completed,
      warehouse_id: whse,
    });
  };

  const handleClick = (label: string) => {
    if (label === "Cancel") {
      setBinList([""]);
      Cookies.set("sessionBinList", JSON.stringify([""]), {
        sameSite: "Strict",
      });
      setCycle(cycleId);
      Cookies.set("sessionCycle", cycleId.toString(), {
        sameSite: "Strict",
      });
      deleteCycleMutation.mutate(cycleId);
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
      <h2>Add New Cycle Info Below:</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="form-label mt-3">Cycle Name</label>
        <input type="text" className="form-control" {...register("name")} />
        <p className="ms-3 text-danger fst-italic">{errors.name?.message}</p>
        <label className="form-label mt-3">Cycle Date</label>
        <input type="date" className="form-control" {...register("date")} />
        <p className="ms-3 text-danger fst-italic">{errors.date?.message}</p>
        <label className="form-label mt-3">Asignee</label>
        <input type="text" className="form-control" {...register("asignee")} />
        <p className="ms-3 text-danger fst-italic">{errors.asignee?.message}</p>
        <div className="mt-4 form-check form-switch">
          <input
            className="mt-1 form-check-input"
            type="checkbox"
            role="switch"
            {...register("completed")}
          />
          <label className="form-check-label">Cycle Completed?</label>
        </div>
        <label className="form-label">Bins to Count</label>
        <BinListGroup />
        <input
          type="hidden"
          className="form-control"
          value={binList}
          {...register("bin_list")}
        />
        <p className="ms-3 text-danger fst-italic">
          {errors.bin_list?.message}
        </p>
        <ButtonGroup label="Cancel" style="secondary" onClick={handleClick} />
        <ButtonGroup label="Done" type="submit" onClick={handleClick} />
      </form>
    </>
  );
}

export default AddCycle;

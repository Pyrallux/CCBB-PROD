import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonGroup from "../../components/ButtonGroup";
import BinListGroup from "../../components/BinListGroup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCycleDetail, updateCycle, deleteCycle } from "../../api/cyclesApi";
import { getBinParent, deleteBin, addBin } from "../../api/binsApi";
import { format } from "date-fns";
import Cookies from "js-cookie";

interface FormData {
  cycle_id?: number;
  name: string;
  date: Date | string;
  completed?: boolean;
  asignee?: string;
  warehouse_id?: number;
  bin_list?: string;
}

function EditCycle() {
  const { cycle, whse, binList, setBinList } = useContext(AppContext);
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

  // R.U.D. Cycles
  const {
    isError,
    error,
    data: cycleData,
  } = useQuery({
    queryKey: ["editCycle"],
    queryFn: () => getCycleDetail(cycle),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });

  const deleteCycleMutation = useMutation({
    mutationFn: deleteCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editCycle"] });
      navigate("/SelectCycle");
    },
  });

  const updateCycleMutation = useMutation({
    mutationFn: updateCycle,
    onSuccess: () => {
      for (let i = 0; i < binData?.length; i++) {
        deleteBinMutation.mutate(binData[i].bin_id);
      }
      binList.map((bin: string) =>
        addBinMutation.mutate({
          name: bin,
          cycle_id: cycle,
        })
      );
      queryClient.invalidateQueries({ queryKey: ["editCycle"] });
      setBinList([""]);
      Cookies.set("sessionBinList", JSON.stringify([""]), {
        sameSite: "Strict",
      });
      navigate("/SelectCycle");
    },
  });

  useEffect(() => {
    setValue("name", cycleData?.name);
    setValue("date", cycleData?.date);
    setValue("completed", cycleData?.completed);
    setValue("asignee", cycleData?.asignee);
    getBinData();
  }, [cycleData]);
  // end Cycles

  // C.R.D. Bins
  const { mutate: getBinData, data: binData } = useMutation({
    mutationFn: () => getBinParent(cycleData.cycle_id),
    onSuccess: (data) => {
      let bin_names: string[] = [];
      for (let i = 0; i < data.length; i++) {
        bin_names.push(data[i].name);
      }
      setBinList([...bin_names.sort()]);
      Cookies.set("sessionBinList", JSON.stringify([...bin_names.sort()]), {
        sameSite: "Strict",
      });
    },
  });

  const addBinMutation = useMutation({
    mutationFn: addBin,
  });

  const deleteBinMutation = useMutation({
    mutationFn: deleteBin,
  });
  // end Bins

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
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });
  // End Validator

  // Event Handlers
  const onSubmit = (data: FormData) => {
    updateCycleMutation.mutate({
      cycle_id: cycle,
      name: data.name,
      date: format(data.date, "yyyy-MM-dd"),
      asignee: data.asignee,
      completed: data.completed,
      warehouse_id: whse,
    });
  };

  const handleClick = (label: string) => {
    switch (label) {
      case "Delete Cycle":
        deleteCycleMutation.mutate(cycle); // Navigates to SelectCycle on Completion
        setBinList([""]);
        Cookies.set("sessionBinList", JSON.stringify([""]), {
          sameSite: "Strict",
        });
        break;
      case "Cancel":
        navigate("/SelectCycle");
        setBinList([""]);
        Cookies.set("sessionBinList", JSON.stringify([""]), {
          sameSite: "Strict",
        });
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
    <>
      <h2>Edit Cycle Info Below:</h2>
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
        <label className="form-label mt-3">Bins to Count</label>
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
      <div>
        <ButtonGroup
          label="Delete Cycle"
          style="outline-danger"
          onClick={handleClick}
        />
      </div>
    </>
  );
}

export default EditCycle;

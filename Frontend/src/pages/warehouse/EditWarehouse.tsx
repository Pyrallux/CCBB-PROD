import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonGroup from "../../components/ButtonGroup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWarehouseDetail,
  updateWarehouse,
  deleteWarehouse,
} from "../../api/warehousesApi";
import Cookies from "js-cookie";

interface FormData {
  warehouse_id?: number;
  name: string;
  path?: string;
  abc_code_path?: string;
  cycles_per_year?: number;
  manual?: boolean;
}

function EditWarehouse() {
  const { manual, setManual, whse } = useContext(AppContext);
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

  // C.U.D Warehosues
  const {
    isLoading,
    isError,
    error,
    data: warehouse,
  } = useQuery({
    queryKey: ["editWarehouse"],
    queryFn: () => getWarehouseDetail(whse),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });

  const updateWarehouseMutation = useMutation({
    mutationFn: updateWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editWarehouse"] });
    },
  });
  const deleteWarehouseMutation = useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editWarehouse"] });
      navigate("/SelectWarehouse");
    },
  });

  useEffect(() => {
    setManual(warehouse?.manual);
    Cookies.set("sessionManual", warehouse?.manual.toString(), {
      sameSite: "Strict",
    });
    setValue("manual", warehouse?.manual);
    setValue("name", warehouse?.name);
    setValue("path", warehouse?.path);
    setValue("abc_code_path", warehouse?.abc_code_path);
    setValue("cycles_per_year", warehouse?.cycles_per_year);
  }, [warehouse]);
  // end Warehouses

  // Yup + useForm Validator
  const schema = yup.object().shape({
    manual: yup.boolean(),
    name: yup.string().required("*Warehouse Nickname is Required"),
    path: yup.string().when("manual", ([manual], schema) => {
      return manual
        ? schema
        : yup.string().required("*Warehouse Path is Required");
    }),
    abc_code_path: yup.string().when("manual", ([manual], schema) => {
      return manual
        ? schema
        : yup.string().required("*ABC Code Path is Required");
    }),
    cycles_per_year: yup.number().when("manual", ([manual], schema) => {
      return manual
        ? schema
        : yup.number().required("*Cycles/Year Input is Required");
    }),
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
  // end Validator

  // Event Handlers
  const onSubmit = (data: FormData) => {
    data.warehouse_id = whse;
    updateWarehouseMutation.mutate(data);
    navigate("/SelectWarehouse");
  };

  const handleClick = (label: string) => {
    label === "Delete Warehouse" && deleteWarehouseMutation.mutate(whse);
    label === "Cancel" && navigate("/SelectWarehouse");
  };

  const handleChange = () => {
    setValue("manual", true);
    setManual(true);
    Cookies.set("sessionManual", String(true), {
      sameSite: "Strict",
    });
    setValue("path", undefined);
    setValue("abc_code_path", undefined);
    setValue("cycles_per_year", undefined);
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
      <h2>Edit Warehouse Info Below:</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="form-label mt-3">Warehouse Nickname</label>
        <input type="text" className="form-control" {...register("name")} />
        <p className="ms-3 text-danger fst-italic">{errors.name?.message}</p>
        {!manual && (
          <>
            <label className="form-label mt-3">Warehouse Database Path</label>
            <input type="text" className="form-control" {...register("path")} />
            <p className="ms-3 text-danger fst-italic">
              {errors.path?.message}
            </p>
            <label className="form-label mt-3">
              Warehouse ABC Code Database Path
            </label>
            <input
              type="text"
              className="form-control"
              {...register("abc_code_path")}
            />
            <p className="ms-3 text-danger fst-italic">
              {errors.abc_code_path?.message}
            </p>
            <label className="form-label mt-3">
              Number of Cycles/Year to Generate
            </label>
            <input
              type="text"
              className="form-control"
              {...register("cycles_per_year")}
            />
            <p className="ms-3 text-danger fst-italic">
              {errors.cycles_per_year?.message}
            </p>
          </>
        )}
        <div className="mt-4 form-check form-switch">
          <input
            className="mt-1 form-check-input"
            type="checkbox"
            role="switch"
            checked={true}
            {...register("manual")}
            onChange={handleChange}
          />
          <label className="form-check-label">Enable Manual Mode?</label>
          <p className="text-danger fst-italic">
            Note: Only manual mode is currently supported.
          </p>
        </div>
        <ButtonGroup label="Cancel" style="secondary" onClick={handleClick} />
        <ButtonGroup label="Done" type="submit" onClick={handleClick} />
        <div>
          <ButtonGroup
            label="Delete Warehouse"
            style="outline-danger"
            onClick={handleClick}
          />
        </div>
      </form>
    </>
  );
}

export default EditWarehouse;

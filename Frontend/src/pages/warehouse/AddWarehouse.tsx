import { useContext } from "react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonGroup from "../../components/ButtonGroup";
import { useMutation } from "@tanstack/react-query";
import { addWarehouse } from "../../api/warehousesApi";
import Cookies from "js-cookie";

interface FormData {
  warehouse_id?: number;
  name: string;
  path?: string;
  abc_code_path?: string;
  cycles_per_year?: number;
  manual?: boolean;
}

function AddWarehouse() {
  const { manual, setManual, whse } = useContext(AppContext);
  const navigate = useNavigate();

  // C. Warehouses
  const addWarehouseMutation = useMutation({
    mutationFn: addWarehouse,
    onSuccess: () => {
      navigate("/SelectWarehouse");
    },
  });
  // end Warehouses

  // Yup + useForm Validator
  const schema = yup.object().shape({
    name: yup.string().required("*Warehouse Nickname is Required"),
    path: yup.string().when("manual", ([manual], schema) => {
      return !manual
        ? yup.string().required("*Warehouse Path is Required")
        : schema;
    }),
    abc_code_path: yup.string().when("manual", ([manual], schema) => {
      return !manual
        ? yup.string().required("*ABC Code Path is Required")
        : schema;
    }),
    cycles_per_year: yup.number().when("manual", ([manual], schema) => {
      return !manual
        ? yup.number().required("*Cycles/Year Input is Required")
        : schema;
    }),
    manual: yup.boolean(),
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
    data.warehouse_id = whse;
    addWarehouseMutation.mutate(data);
  };

  const handleClick = (label: string) => {
    label === "Cancel" && navigate("/SelectWarehouse");
  };

  const handleChangeManual = () => {
    setManual(true);
    Cookies.set("sessionManual", String(true), {
      sameSite: "Strict",
    });
    setValue("path", undefined);
    setValue("abc_code_path", undefined);
    setValue("cycles_per_year", undefined);
  };
  // end Event Handlers

  return (
    <>
      <h2>Enter New Warehouse Setup Info Below:</h2>
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
            onChange={handleChangeManual}
          />
          <label className="form-check-label">Enable Manual Mode?</label>
          <p className="text-danger fst-italic">
            Note: Only manual mode is currently supported.
          </p>
        </div>
        <ButtonGroup label="Cancel" style="secondary" onClick={handleClick} />
        <ButtonGroup label="Done" type="submit" onClick={handleClick} />
      </form>
    </>
  );
}

export default AddWarehouse;

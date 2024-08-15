import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonGroup from "../../components/ButtonGroup";
import ListGroup from "../../components/ListGroup";
import { useQuery } from "@tanstack/react-query";
import { getWarehouses } from "../../api/warehousesApi";
import Cookies from "js-cookie";

interface FormData {
  warehouse: number;
}

function SelectWarehouse() {
  const { setWhse, setManual } = useContext(AppContext);
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

  // R. Warehouses
  const {
    isLoading,
    isError,
    error,
    data: warehouses,
  } = useQuery({
    queryKey: ["getWarehouseList"],
    queryFn: () => getWarehouses(),
    refetchInterval: (query) =>
      isDataRecieved(query.state.data) ? false : 500,
  });

  const [warehouseList, setWarehouseList] = useState(["Loading..."]);
  const [warehouseListKeys, setWarehouseListKeys] = useState([0]);
  useEffect(() => {
    const warehouse_list: string[] = [];
    const warehouse_list_keys: number[] = [];
    for (let i = 0; i < warehouses?.length; i++) {
      if (!warehouses[i].hasOwnProperty("name")) {
        continue;
      }
      warehouse_list.push(warehouses[i].name);
      warehouse_list_keys.push(warehouses[i].warehouse_id);
    }
    setWarehouseList([...warehouse_list]);
    setWarehouseListKeys([...warehouse_list_keys]);
  }, [warehouses]);
  // end Warehouses

  // Yup + useForm Validator
  const schema = yup.object().shape({
    warehouse: yup
      .number()
      .min(-1, "*Warehouse Selection is Required")
      .required("*Warehouse Selection is Required"),
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
    setWhse(warehouseListKeys[data.warehouse]);
    Cookies.set("sessionWhse", warehouseListKeys[data.warehouse].toString(), {
      sameSite: "Strict",
    });
    setManual(warehouses[data.warehouse].manual);
    Cookies.set("sessionManual", warehouses[data.warehouse].manual.toString(), {
      sameSite: "Strict",
    });
    navigate("/SelectAction");
  };

  const [itemSelected, setItemSelected] = useState(false);
  const handleSelectItem = (index: number) => {
    setItemSelected(true);
    setValue("warehouse", index);
  };

  const handleClick = (label: string) => {
    label === "+ Add New Warehouse" && navigate("/AddWarehouse");
  };

  const handleEdit = (index: number) => {
    setWhse(warehouseListKeys[index]);

    navigate("/EditWarehouse");
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
      <h2>Select A Warehouse:</h2>
      {warehouses.length === 0 ? (
        <p className="ms-3 text-danger fst-italic">
          No Items Found, Please Add a Warehouse Below
        </p>
      ) : (
        <>
          <p className="ms-3 text-danger fst-italic">
            {errors.warehouse?.message}
          </p>
          <ListGroup
            items={warehouseList}
            onSelectItem={handleSelectItem}
            onClickEdit={handleEdit}
          />
          <input type="hidden" {...register("warehouse")} />
        </>
      )}
      <div>
        <ButtonGroup
          label="+ Add New Warehouse"
          style="outline-secondary"
          onClick={handleClick}
        />
      </div>
      {itemSelected ? (
        <ButtonGroup label="Continue" type="submit" onClick={handleClick} />
      ) : (
        <ButtonGroup
          label="Continue"
          disabled={true}
          type="submit"
          onClick={handleClick}
        />
      )}
    </form>
  );
}

export default SelectWarehouse;

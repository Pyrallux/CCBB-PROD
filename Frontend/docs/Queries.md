# Queries

- This pattern describes how queries are made throughout the application using `@tanstack/react-query` and `axios`.

- ## Creating the API

  - First, an API must be created to interact with a specific data model. These are stored in thier own folder within `/src/api`.
  - This API uses axios to generate a request to the backend.
    - Import it with `import axios from "axios"`
  - First, the structure of the data model must be defined. All fields must be defined, but those that use a default value and may be optional inside a mutation request must be specified as such.
  - e.g. See Below:

    ```ts
    interface Warehouse {
        warehouse_id?: number;
        name: string;
        manual?: boolean;
        path?: string;
        abc_code_path?: string;
        cycles_per_year?: number;
    }
    ```

  - Next, define the API's path using the URL path and port of the backend. In this example, localhost is used for local development. See Below:

    ```ts
    const warehousesApi = axios.create({
        baseURL: "http://localhost:8000",
    });
    ```

  - Now the various request types and mutations functions of the API must be defined as asynchronous functions. Various examples of different functions are shown below:

    ```ts
    export const getWarehouses = async () => {
        const response = await warehousesApi.get("/warehouses/");
        return response.data;
    };

    export const getWarehouseDetail = async (warehouse_id: number) => {
        const response = await warehousesApi.get(`/warehouses/${warehouse_id}`);
        return response.data;
    };

    export const addWarehouse = async (warehouse: Warehouse) => {
        return await warehousesApi.post("/warehouses/", warehouse);
    };

    export const updateWarehouse = async (warehouse: Warehouse) => {
        return await warehousesApi.put(
            `/warehouses/${warehouse.warehouse_id}`,
            warehouse
        );
    };

    export const deleteWarehouse = async (warehouse_id: number) => {
        return await warehousesApi.delete(`/warehouses/${warehouse_id}`);
    };
    ```

  - The structure of the API has now been created. To interact with this API inside of a component using `react-query`, see below. Don't forget to export the contents of the file (e.g. `export default warehousesApi`).

- ## Making a Request

  - In this app, requests are made using a `useQuery` hook. This first must be imported from the `react-query` library with:
    - `import { useQuery } from "@tanstack/react-query"`
  - A useQuery hook is then made as follows:

    ```ts
    const {
        isLoading,
        isError,
        error,
        data: binData,
    } = useQuery({
        queryKey: ["editCycleBins"],
        queryFn: () => getBinParent(cycle),
        refetchInterval: (query) =>
          isDataRecieved(query.state.data) ? false : 500,
    });
    ```

    - Note that in this example, `getBinParent()` is an API function imported from an API file similar to the one discussed in the above section.
    - The variable that `data` is mapped to will store the data requested from the backend.
  - This `useQuery` hook in combination with the API will then query the data.
  - To avoid rendering the webpage prior to the request being satisfied or data fully mutated, this bit of code should be included:

    ```ts
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

    if (isLoading) {
      return <h2>Fetching Data From Database...</h2>;
    } else if (isError) {
      return <h2>{error.message}</h2>;
    } else if (!isDataValid) {
      return <h2>Validating Data...</h2>;
    }
    ```

- ## Mutating Data

  - Mutations are handled intuitively using the `react-query` `useMutation` and `useQueryClient` hooks in addition to the functions created in the API file in the first section. Import the the hooks needed with:
    - `import { useMutation, useQueryClient } from "@tanstack/react-query"`
  - The `useQueryClient` hook must first be defined as such:

    ```ts
    const queryClient = useQueryClient();
    ```

  - The `useMutation` hook should follow this general structure:

    ```ts
    const updateWarehouseMutation = useMutation({
        mutationFn: updateWarehouse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["editCycleBins"] });
        },
    });
    ```

    - Note that this mutation also invalidates the query key `'editCycleBins'`. This query key should match the query key used in the original `useQuery` hook, triggering a refetch of the data.
    - Many of these mutations are often defined at the start of a file, one for each mutation function needed.

- ## Using Mutations to Control Data Fetch Order

  - There are many times in which a webpage depends on multiple different queries that may or may not depend on one another. A regular list of queries often will not be refetched with precise timing and order even when certian conditionals are included within the `useQuery` hook. To fix this, data fetching can be done with `useMutation` hooks that call one another using their `onSuccess` function.

  - In this example, calling `getPresentPartData` will fetch the data:

  ```ts
    const { mutate: getPresentPartData, data: presentPartData } = useMutation({
    mutationKey: ["cycleCountPresentParts"],
    mutationFn: () => getPresentPartParent(bin),
    onSuccess: () => {
      // Call next query or perform some dependant functionality here.
    }
  });
  ```

- ## Other Important Notes

  - Oftentimes a webpage relies on data that has recently been modified. To account for the delay, a `useEffect` hook in addition to brief delay and some logic can achieve the desired effect. For example:

    ```ts
    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["getWarehouseList"] });
        setTimeout(() => {
        refetch;
        const warehouse_list: string[] = [];
        const warehouse_list_keys: number[] = [];
        for (let i = 0; i < warehouses?.length; i++) {
            if (!warehouses[i].hasOwnProperty("name")) {
                continue;
            }
            warehouse_list.push(warehouses[i].name);
            warehouse_list_keys.push(warehouses[i].warehouse_id);
        }
        setWarehouseList(warehouse_list);
        setWarehouseListKeys(warehouse_list_keys);
        }, 100);
    }, [warehouses]);
    ```

    - Note that, in this case, the `warehouses` variable is the data from the `useQuery` hook request.

  - Additionally, some queries may rely on other queries to be completed first. In this circumstance, this code cane be used:

    ```ts
    const cycleId = cycleData?.cycle_id;
    const { data: binData } = useQuery({
      queryKey: ["editCycleBins"],
      queryFn: () => getBinParent(cycleId),
      enabled: !!cycleId,
    });

    ```

    - Where, in this example, `cycleData` is the query data that `binData` is reliant on.

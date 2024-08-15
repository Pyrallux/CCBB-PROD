import { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SelectWarehouse from "./pages/warehouse/Home";
import AddWarehouse from "./pages/warehouse/AddWarehouse";
import EditWarehouse from "./pages/warehouse/EditWarehouse";
import SelectAction from "./pages/SelectAction";
import MissingPartSearch from "./pages/MissingPartSearch";
import AddMissingPart from "./pages/AddMissingPart";
import SelectCycle from "./pages/cycle/SelectCycle";
import AddCycle from "./pages/cycle/AddCycle";
import EditCycle from "./pages/cycle/EditCycle";
import CycleHistory from "./pages/cycle/CycleHistory";
import CycleCount from "./pages/CycleCount";
import Transactions from "./pages/Transactions";
import InventoryManager from "./pages/InventoryManager";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from "js-cookie";

interface Part {
  part_number: string;
  qty: number;
}

// Import Cookies
const whseCookie = Cookies.get("sessionWhse");
const cycleCookie = Cookies.get("sessionCycle");
const binCookie = Cookies.get("sessionBin");
const binListCookie = Cookies.get("sessionBinList");
const binAddedCookie = Cookies.get("sessionBinAdded");
// const manualCookie = Cookies.get("sessionManual");
const presentPartListCookie = Cookies.get("sessionPresentPartList");
const systemPartListCookie = Cookies.get("sessionSystemPartList");

export const AppContext = createContext<{
  whse: number;
  setWhse: (newValue: number) => void;
  cycle: number;
  setCycle: (newValue: number) => void;
  bin: number;
  setBin: (newValue: number) => void;
  binList: string[];
  setBinList: (newValue: string[]) => void;
  binAdded: boolean;
  setBinAdded: (newValue: boolean) => void;
  manual: boolean;
  setManual: (newValue: boolean) => void;
  presentPartList: Part[];
  setPresentPartList: (newValue: Part[]) => void;
  systemPartList: Part[];
  setSystemPartList: (newValue: Part[]) => void;
}>({
  whse: whseCookie ? parseInt(whseCookie) : -1,
  setWhse: () => undefined,
  cycle: cycleCookie ? parseInt(cycleCookie) : -1,
  setCycle: () => undefined,
  bin: binCookie ? parseInt(binCookie) : -1,
  setBin: () => undefined,
  binList: binListCookie ? JSON.parse(decodeURI(binListCookie)) : [""],
  setBinList: () => undefined,
  binAdded: binAddedCookie === "true",
  setBinAdded: () => undefined,
  manual: true,
  setManual: () => undefined,
  presentPartList: presentPartListCookie
    ? JSON.parse(decodeURI(presentPartListCookie))
    : [{ part_number: "", qty: 0 }],
  setPresentPartList: () => undefined,
  systemPartList: systemPartListCookie
    ? JSON.parse(decodeURI(systemPartListCookie))
    : [{ part_number: "", qty: 0 }],
  setSystemPartList: () => undefined,
});

const client = new QueryClient();

function App() {
  const [whse, setWhse] = useState(whseCookie ? parseInt(whseCookie) : -1);
  const [cycle, setCycle] = useState(cycleCookie ? parseInt(cycleCookie) : -1);
  const [bin, setBin] = useState(binCookie ? parseInt(binCookie) : -1);
  const [binList, setBinList] = useState(
    binListCookie ? JSON.parse(decodeURI(binListCookie)) : [""]
  );
  const [binAdded, setBinAdded] = useState(binAddedCookie === "true");
  const [manual, setManual] = useState(true);
  const [presentPartList, setPresentPartList] = useState(
    presentPartListCookie
      ? JSON.parse(decodeURI(presentPartListCookie))
      : [{ part_number: "", qty: 0 }]
  );
  const [systemPartList, setSystemPartList] = useState([
    systemPartListCookie
      ? JSON.parse(decodeURI(systemPartListCookie))
      : [{ part_number: "", qty: 0 }],
  ]);

  return (
    <div className="App">
      <QueryClientProvider client={client}>
        <AppContext.Provider
          value={{
            whse,
            setWhse,
            cycle,
            setCycle,
            bin,
            setBin,
            binList,
            setBinList,
            binAdded,
            setBinAdded,
            manual,
            setManual,
            presentPartList,
            setPresentPartList,
            systemPartList,
            setSystemPartList,
          }}
        >
          <Router>
            <Routes>
              <Route path="/SelectWarehouse" element={<SelectWarehouse />} />
              <Route path="/AddWarehouse" element={<AddWarehouse />} />
              <Route path="/EditWarehouse" element={<EditWarehouse />} />
              <Route path="/SelectAction" element={<SelectAction />} />
              <Route
                path="/MissingPartSearch"
                element={<MissingPartSearch />}
              />
              <Route path="/AddMissingPart" element={<AddMissingPart />} />
              <Route path="/SelectCycle" element={<SelectCycle />} />
              <Route path="/AddCycle" element={<AddCycle />} />
              <Route path="/EditCycle" element={<EditCycle />} />
              <Route path="/CycleHistory" element={<CycleHistory />} />
              <Route path="/CycleCount" element={<CycleCount />} />
              <Route path="/Transactions" element={<Transactions />} />
              <Route path="/InventoryManager" element={<InventoryManager />} />
              <Route path="*" element={<SelectWarehouse />} />
            </Routes>
          </Router>
        </AppContext.Provider>
      </QueryClientProvider>
    </div>
  );
}

export default App;

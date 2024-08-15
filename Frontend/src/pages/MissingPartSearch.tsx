import { AppContext } from "../App";
import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Data4Col from "../components/Data4Col";
import ButtonGroup from "../components/ButtonGroup";
import { useNavigate } from "react-router-dom";
import {
  deletePhysicallyMissingPart,
  getPhysicallyMissingParts,
} from "../api/physicallyMissingPartsApi";
import {
  deleteSystematicallyMissingPart,
  getSystematicallyMissingParts,
} from "../api/systematicallyMissingPartsApi";
import { getCycleParent } from "../api/cyclesApi";
import { getBins } from "../api/binsApi";

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

interface PhysicallyMissingPart {
  physically_missing_part_id?: number;
  number: string;
  quantity: number;
  location: string;
  date: Date | string;
  bin_id: number;
}

interface SystematicallyMissingPart {
  systematically_missing_part_id?: number;
  number: string;
  quantity: number;
  location: string;
  date: Date | string;
  bin_id: number;
}

function MissingPartSearch() {
  const { whse } = useContext(AppContext);
  const navigate = useNavigate();

  // R. Cycles Parent
  const [partNumberList, setPartNumberList] = useState([""]);
  const [quantityList, setQuantityList] = useState([""]);
  const [locationList, setLocationList] = useState([""]);
  const [dateList, setDateList] = useState([""]);
  const [idList, setIdList] = useState([-1]);
  const [isSearching, setIsSearching] = useState(false);
  const { mutate: getSearchData, data: cycles } = useMutation({
    mutationFn: () => getCycleParent(whse),
    onSuccess: () => {
      getBinData();
    },
  });
  // end Cycles

  // R. Bins Parent
  const { mutate: getBinData, data: bins } = useMutation({
    mutationFn: () => getBins(),
    onSuccess: () => {
      if (isViewingPhysicallyMissingParts) {
        getPhysicallyMissingPartData();
      } else {
        getSystematicallyMissingPartData();
      }
    },
  });
  // end Bins

  // R.D. Physically Missing Parts Parent
  const { mutate: getPhysicallyMissingPartData } = useMutation({
    mutationFn: () => getPhysicallyMissingParts(),
    onSuccess: (data) => {
      let childCycles = cycles
        .filter((a: Cycle) => a.warehouse_id === whse)
        .map((b: Cycle) => b.cycle_id);
      let childBins = bins
        .filter((a: Bin) => childCycles.includes(a.cycle_id))
        .map((b: Bin) => b.bin_id);
      let childParts = data.filter((a: PhysicallyMissingPart) =>
        childBins.includes(a.bin_id)
      );
      let matchingParts = childParts.filter(
        (a: PhysicallyMissingPart) =>
          a.number === partNumberInput || !partNumberInput
      );
      setPartNumberList([
        ...matchingParts.map((a: PhysicallyMissingPart) => a.number),
      ]);
      setQuantityList([
        ...matchingParts.map((a: PhysicallyMissingPart) =>
          a.quantity.toString()
        ),
      ]);
      setLocationList([
        ...matchingParts.map((a: PhysicallyMissingPart) => a.location),
      ]);
      setDateList([...matchingParts.map((a: PhysicallyMissingPart) => a.date)]);
      setIdList([
        ...matchingParts.map(
          (a: PhysicallyMissingPart) => a.physically_missing_part_id
        ),
      ]);
      setIsSearching(true);
    },
  });
  const deletePhysicallyMissingPartMutation = useMutation({
    mutationFn: deletePhysicallyMissingPart,
    onSuccess: () => {
      getSearchData();
    },
  });
  // end Physically Missing Parts

  // R.D. Systematically Missing Parts Parent
  const { mutate: getSystematicallyMissingPartData } = useMutation({
    mutationFn: () => getSystematicallyMissingParts(),
    onSuccess: (data) => {
      let childCycles = cycles
        .filter((a: Cycle) => a.warehouse_id === whse)
        .map((b: Cycle) => b.cycle_id);
      let childBins = bins
        .filter((a: Bin) => childCycles.includes(a.cycle_id))
        .map((b: Bin) => b.bin_id);
      let childParts = data.filter((a: SystematicallyMissingPart) =>
        childBins.includes(a.bin_id)
      );
      let matchingParts = childParts.filter(
        (a: SystematicallyMissingPart) =>
          a.number === partNumberInput || !partNumberInput
      );
      setPartNumberList([
        ...matchingParts.map((a: SystematicallyMissingPart) => a.number),
      ]);
      setQuantityList([
        ...matchingParts.map((a: SystematicallyMissingPart) =>
          a.quantity.toString()
        ),
      ]);
      setLocationList([
        ...matchingParts.map((a: SystematicallyMissingPart) => a.location),
      ]);
      setDateList([
        ...matchingParts.map((a: SystematicallyMissingPart) => a.date),
      ]);
      setIdList([
        ...matchingParts.map(
          (a: SystematicallyMissingPart) => a.systematically_missing_part_id
        ),
      ]);
      setIsSearching(true);
      console.log(partNumberList);
    },
  });
  const deleteSystematicallyMissingPartMutation = useMutation({
    mutationFn: deleteSystematicallyMissingPart,
    onSuccess: () => {
      getSearchData();
    },
  });
  // end Systematically Missing Parts

  // Event Handlers
  const [isViewingPhysicallyMissingParts, setIsViewingPhysicallyMissingParts] =
    useState(false);
  const [
    isViewingSystematicallyMissingParts,
    setIsViewingSystematicallyMissingParts,
  ] = useState(false);

  const [selectedPartList, setSelectedPartList] = useState([-1]);
  const handleSelectItem = (indexList: number[]) => {
    setSelectedPartList([...indexList]);
  };

  const handleClick = (label: string) => {
    switch (label) {
      case "Back":
        navigate("/SelectAction");
        break;
      case "Physically Missing":
        setIsSearching(false);
        setIsViewingPhysicallyMissingParts(!isViewingPhysicallyMissingParts);
        setIsViewingSystematicallyMissingParts(false);
        break;
      case "Systematically Missing":
        setIsSearching(false);
        setIsViewingPhysicallyMissingParts(false);
        setIsViewingSystematicallyMissingParts(
          !isViewingSystematicallyMissingParts
        );
        break;
      case "Search":
        getSearchData();
        break;
      case "Invalidate Missing Part(s)":
        if (isViewingPhysicallyMissingParts) {
          for (let i = 0; i < selectedPartList.length; i++) {
            deletePhysicallyMissingPartMutation.mutate(
              idList[selectedPartList[i]]
            );
          }
        } else {
          for (let i = 0; i < selectedPartList.length; i++) {
            deleteSystematicallyMissingPartMutation.mutate(
              idList[selectedPartList[i]]
            );
          }
        }
        break;
      case "+ Add New Missing Part":
        navigate("/AddMissingPart");
        break;
    }
  };
  // end Event Handlers

  const [partNumberInput, setPartNumberInput] = useState("");
  return (
    <>
      <h2 className="mb-3">Missing Part Search:</h2>
      <p className="mb-2">Enter a Part Number:</p>
      <input
        className="form-control mb-3"
        type="text"
        placeholder="Leave Blank to View Entire List"
        defaultValue={partNumberInput}
        onChange={(event) => {
          setIsSearching(false);
          setPartNumberInput(event.target.value);
        }}
      />
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

      {isSearching ? (
        <div className="mt-3">
          <Data4Col
            row1Data={partNumberList}
            row2Data={quantityList}
            row3Data={locationList}
            row4Data={dateList}
            heading1="Part Number"
            heading2="Quantity Missing"
            heading3="Location"
            heading4="Date Counted"
            onSelectItem={handleSelectItem}
          />
          <div>
            {!partNumberList.length ? (
              <>
                <p className="mt-3 text-danger">
                  No matching missing parts found.
                </p>
                <ButtonGroup
                  label="+ Add New Missing Part"
                  style="outline-secondary"
                  onClick={handleClick}
                />
              </>
            ) : (
              <>
                <div className="mb-3">
                  <ButtonGroup
                    label="+ Add New Missing Part"
                    style="outline-secondary"
                    onClick={handleClick}
                  />
                </div>
                <ButtonGroup
                  label="Invalidate Missing Part(s)"
                  style="outline-danger"
                  margin={false}
                  onClick={handleClick}
                />
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          <ButtonGroup
            label="+ Add New Missing Part"
            style="outline-secondary"
            onClick={handleClick}
          />
        </div>
      )}
      <div>
        <ButtonGroup label="Back" style="secondary" onClick={handleClick} />
        <ButtonGroup
          label="Search"
          style="primary"
          disabled={
            !isViewingPhysicallyMissingParts &&
            !isViewingSystematicallyMissingParts
          }
          onClick={handleClick}
        />
      </div>
    </>
  );
}

export default MissingPartSearch;

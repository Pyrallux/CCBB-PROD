import ButtonGroup from "./ButtonGroup";
import { useContext } from "react";
import { AppContext } from "../App";
import Cookies from "js-cookie";

function BinListGroup() {
  const { binList, setBinList } = useContext(AppContext);
  let bin_list: string[];

  const handleAddBin = () => {
    /**
     * Handles the "Add Bin" event
     *
     * @remarks
     * Adds a blank bin to the binList context variable
     */
    bin_list = binList;
    bin_list.push("");
    setBinList([...bin_list]);
    Cookies.set("sessionBinList", JSON.stringify([...bin_list]), {
      sameSite: "Strict",
    });
    console.log(bin_list);
  };

  const handleEditBin = (value: string, index: number) => {
    /**
     * Handles the "Edit Bin" event
     *
     * @remarks
     * Takes in a value and an index and edits the bin
     * inside the binList context variable.
     *
     * @param value - New value (name) of the bin
     * @param index - The index of the bin to be edited
     */
    bin_list = binList;
    if (
      bin_list.filter((_, i: number) => i !== index).includes(value) &&
      value !== ""
    ) {
      value = `${value} - Error! Value at index ${index} already exists!`;
    }
    bin_list[index] = value;
    setBinList([...bin_list]);
    Cookies.set("sessionBinList", JSON.stringify([...bin_list]), {
      sameSite: "Strict",
    });
  };

  const handleClickDelete = (index: number) => {
    /**
     * Handles the "Click Delete" event
     *
     * @remarks
     * Splices onve value from the binList context variable
     * at the location given by the index.
     *
     * @param index - index of the bin to be deleted
     */
    bin_list = binList;
    bin_list.splice(index, 1);
    setBinList([...bin_list]);
    Cookies.set("sessionBinList", JSON.stringify([...bin_list]), {
      sameSite: "Strict",
    });
    console.log(binList);
  };

  // Rendered Page
  return (
    <>
      <ul className="list-group">
        {binList.length === 0 && (
          <li className="list-group-item text-danger fst-italic ">
            Please Add a Bin Below
          </li>
        )}

        {binList.map((bin, index) => (
          <li className="list-group-item" key={bin}>
            <div className="d-flex justify-content-between">
              <input
                defaultValue={binList[index]}
                type="text"
                className="form-control me-3"
                onBlur={(e) => handleEditBin(e.target.value, index)}
              />
              <button
                className="btn btn-danger"
                onClick={() => handleClickDelete(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trash-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                </svg>
              </button>
            </div>
          </li>
        ))}
        <li className="list-group-item">
          <ButtonGroup
            label="+ Add New Bin"
            style="outline-secondary"
            margin={false}
            onClick={handleAddBin}
          />
        </li>
      </ul>
    </>
  );
}

export default BinListGroup;

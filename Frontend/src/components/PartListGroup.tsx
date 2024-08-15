import ButtonGroup from "./ButtonGroup";
import { useContext } from "react";
import { AppContext } from "../App";
import Cookies from "js-cookie";

interface Props {
  type: "present" | "system";
}

interface Part {
  part_number: string;
  qty: number;
}

function PartListGroup({ type }: Props) {
  const {
    presentPartList,
    setPresentPartList,
    systemPartList,
    setSystemPartList,
  } = useContext(AppContext);

  let part_list: Part[];

  const handleAddPart = () => {
    /**
     * Handles the "Add Part" event
     *
     * @remarks
     * Adds a blank part to the partList context variable
     */
    if (type == "present") {
      part_list = presentPartList;
      part_list.push({ part_number: "", qty: 0 });
      setPresentPartList([...part_list]);
      Cookies.set("sessionPresentPartList", JSON.stringify([...part_list]), {
        sameSite: "Strict",
      });
    } else if (type == "system") {
      part_list = systemPartList;
      part_list.push({ part_number: "", qty: 0 });
      setSystemPartList([...part_list]);
      Cookies.set("sessionSystemPartList", JSON.stringify([...part_list]), {
        sameSite: "Strict",
      });
    }
  };

  const handleEditPartNumber = (value: string, index: number) => {
    /**
     * Handles the "Add Part Number" event
     *
     * @remarks
     * Edits the part number with the value given at the index given
     *
     * @param value - New value to replace the old part_number attribute
     * @param index - Index of the part object to be edited.
     */
    if (type == "present") {
      part_list = presentPartList;
      if (
        part_list
          .filter((_, i: number) => i !== index)
          .map((b: Part) => b.part_number)
          .includes(value) &&
        value !== ""
      ) {
        value = `${value} - Error! Value at index ${index} already exists!`;
      }
      part_list[index].part_number = value;
      setPresentPartList([...part_list]);
      Cookies.set("sessionPresentPartList", JSON.stringify([...part_list]), {
        sameSite: "Strict",
      });
    } else if (type == "system") {
      part_list = systemPartList;
      if (
        part_list
          .filter((_, i: number) => i !== index)
          .map((b: Part) => b.part_number)
          .includes(value) &&
        value !== ""
      ) {
        value = `${value} - Error! Value at index ${index} already exists!`;
      }
      part_list[index].part_number = value;
      setSystemPartList([...part_list]);
      Cookies.set("sessionSystemPartList", JSON.stringify([...part_list]), {
        sameSite: "Strict",
      });
    }
  };

  const handleEditPartQty = (value: number, index: number) => {
    /**
     * Handles the "Add Part Number" event
     *
     * @remarks
     * Edits the part number with the value given at the index given
     *
     * @param value - New value to replace the old part_number attribute
     * @param index - Index of the part object to be edited.
     */
    if (type == "present") {
      part_list = presentPartList;
      part_list[index].qty = value;
      setPresentPartList([...part_list]);
      Cookies.set("sessionPresentPartList", JSON.stringify([...part_list]), {
        sameSite: "Strict",
      });
    } else if (type == "system") {
      part_list = systemPartList;
      part_list[index].qty = value;
      setSystemPartList([...part_list]);
      Cookies.set("sessionSystemPartList", JSON.stringify([...part_list]), {
        sameSite: "Strict",
      });
    }
  };

  const handleClickDelete = (index: number) => {
    /**
     * Handles the "Click Delete" event
     *
     * @remarks
     * Splices one value from the partList context variable
     * at the location given by the index.
     *
     * @param index - index of the part to be deleted
     */
    if (type == "present") {
      part_list = presentPartList;
      part_list.splice(index, 1);
      setPresentPartList([...part_list]);
      Cookies.set("sessionPresentPartList", JSON.stringify([...part_list]), {
        sameSite: "Strict",
      });
    } else if (type == "system") {
      part_list = systemPartList;
      part_list.splice(index, 1);
      setSystemPartList([...part_list]);
      Cookies.set("sessionSystemPartList", JSON.stringify([...part_list]), {
        sameSite: "Strict",
      });
    }
  };

  // Rendered Page
  return (
    <>
      {type == "present" ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Part Number</th>
                <th scope="col">QTY</th>
              </tr>
            </thead>
            {presentPartList.length === 0 && (
              <p className="text fst-italic">Please Add a Part Below</p>
            )}

            <tbody>
              {presentPartList.map((part, index) => (
                <tr
                  key={part.part_number}
                  className={"table-active table-light bg-white"}
                >
                  <th scope="row">{index + 1}</th>
                  <td>
                    <input
                      defaultValue={part.part_number}
                      type="text"
                      className="form-control me-3"
                      onBlur={(e) =>
                        handleEditPartNumber(e.target.value, index)
                      }
                    />
                  </td>
                  <td>
                    <div className="d-flex justify-content-between">
                      <input
                        defaultValue={part.qty}
                        type="number"
                        className="form-control me-3"
                        onBlur={(e) =>
                          handleEditPartQty(Number(e.target.value), index)
                        }
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ButtonGroup
            label="+ Add New Part"
            style="outline-secondary"
            margin={false}
            onClick={handleAddPart}
          />
        </>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Part Number</th>
                <th scope="col">QTY</th>
              </tr>
            </thead>
            {systemPartList.length === 0 && (
              <p className="text fst-italic">Please Add a Part Below</p>
            )}

            <tbody>
              {systemPartList.map((part, index) => (
                <tr
                  key={part.part_number}
                  className={"table-active table-light bg-white"}
                >
                  <th scope="row">{index + 1}</th>
                  <td>
                    <input
                      defaultValue={part.part_number}
                      type="text"
                      className="form-control me-3"
                      onBlur={(e) =>
                        handleEditPartNumber(e.target.value, index)
                      }
                    />
                  </td>
                  <td>
                    <div className="d-flex justify-content-between">
                      <input
                        defaultValue={part.qty}
                        type="number"
                        className="form-control me-3"
                        onBlur={(e) =>
                          handleEditPartQty(Number(e.target.value), index)
                        }
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ButtonGroup
            label="+ Add New Part"
            style="outline-secondary"
            margin={false}
            onClick={handleAddPart}
          />
        </>
      )}
    </>
  );
}

export default PartListGroup;

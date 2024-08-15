import ButtonGroup from "../components/ButtonGroup";
import { useNavigate } from "react-router-dom";

function SelectAction() {
  const navigate = useNavigate();

  // Event Handlers
  const handleClick = (label: string) => {
    label === "Cycle Count by Bin" && navigate("/SelectCycle");
    label === "Find Transactions" && navigate("/InventoryManager");
    label === "Search for Missing Parts" && navigate("/MissingPartSearch");
    label === "Back" && navigate("/SelectWarehouse");
  };
  // end Event Handlers

  return (
    <>
      <h2>Choose an Action Below:</h2>
      <div>
        <button
          className={`me-3 btn btn-primary`}
          onClick={() => handleClick("Cycle Count by Bin")}
        >
          Cycle Count
          <br />
          by Bin
        </button>
        <button
          className={`me-3 btn btn-dark`}
          onClick={() => handleClick("Find Transactions")}
        >
          Find
          <br />
          Transactions
        </button>
        <button
          className={`me-3 btn btn-success`}
          onClick={() => handleClick("Search for Missing Parts")}
        >
          Search for
          <br />
          Missing Parts
        </button>
      </div>
      <ButtonGroup label="Back" style="secondary" onClick={handleClick} />
    </>
  );
}

export default SelectAction;

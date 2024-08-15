import { useState } from "react";

interface Props {
  names: string[];
  dates: string[];
  asignees: string[];
  heading1: string;
  heading2: string;
  heading3: string;
  onSelectItem: (index: number) => void;
  onClickEdit: (index: number) => void;
  onClickDownload: (index: number) => void;
}

function CycleTable({
  names,
  dates,
  asignees,
  heading1,
  heading2,
  heading3,
  onSelectItem,
  onClickEdit,
  onClickDownload,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">{heading1}</th>
          <th scope="col">{heading2}</th>
          <th scope="col">{heading3}</th>
        </tr>
      </thead>
      <tbody>
        {names.map((name, index) => (
          <tr
            className={
              selectedIndex === index
                ? "table-active"
                : "table-active table-light bg-white"
            }
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(index);
            }}
          >
            <th scope="row">{index + 1}</th>
            <td>{name}</td>
            <td>{dates[index]}</td>

            <td>
              <div className="d-flex justify-content-between">
                <td>{asignees[index]}</td>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-dark me-3"
                    onClick={() => onClickDownload(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-download"
                      viewBox="0 0 16 16"
                    >
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onClickEdit(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CycleTable;

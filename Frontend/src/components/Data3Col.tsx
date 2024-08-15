import { useState } from "react";

interface Props {
  row1Data: string[];
  row2Data: string[];
  row3Data: string[];
  heading1: string;
  heading2: string;
  heading3: string;
  onSelectItem: (indexList: number[]) => void;
}

function Data3Col({
  row1Data,
  row2Data,
  row3Data,
  heading1,
  heading2,
  heading3,
  onSelectItem,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState([-1]);

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
        {row1Data.map((row1Item, index) => (
          <tr
            className={
              selectedIndex.includes(index)
                ? "table-active"
                : "table-active table-light bg-white"
            }
            onClick={() => {
              selectedIndex.includes(index)
                ? (setSelectedIndex([
                    ...selectedIndex.filter((i: number) => i != index),
                  ]),
                  onSelectItem([
                    ...selectedIndex.filter((i: number) => i != index),
                  ]))
                : (setSelectedIndex([
                    ...selectedIndex.filter((i: number) => i != -1),
                    index,
                  ]),
                  onSelectItem([
                    ...selectedIndex.filter((i: number) => i != -1),
                    index,
                  ]));
            }}
          >
            <th scope="row">{index + 1}</th>
            <td>{row1Item}</td>
            <td>{row2Data[index]}</td>
            <td>{row3Data[index]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Data3Col;

import { HTMLInputTypeAttribute } from "react";

interface Props {
  label: string;
  type?: HTMLInputTypeAttribute;
  onChange: (label: string, input: string) => void;
}

function InputGroup({ label, type = "text", onChange }: Props) {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">{label}</label>
        <input
          type={type}
          className="form-control"
          onChange={(event) => {
            onChange(label, event.target.value);
          }}
        />
      </div>
    </>
  );
}

export default InputGroup;

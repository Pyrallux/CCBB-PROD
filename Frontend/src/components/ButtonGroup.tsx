interface Props {
  label: string;
  type?: "submit" | "reset" | "button" | undefined;
  style?:
    | "primary"
    | "secondary"
    | "success"
    | "dark"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-danger"
    | "outline-dark";
  margin?: boolean;
  disabled?: boolean;
  onClick: (label: string) => void;
}

function ButtonGroup({
  label,
  type = "button",
  style = "primary",
  margin = true,
  disabled = false,
  onClick,
}: Props) {
  if (disabled) {
    if (margin) {
      return (
        <button
          className={`mt-3 me-3 btn btn-${style}`}
          type={type}
          onClick={() => onClick(label)}
          disabled
        >
          {label}
        </button>
      );
    } else {
      return (
        <button
          className={`btn btn-${style}`}
          type={type}
          onClick={() => onClick(label)}
          disabled
        >
          {label}
        </button>
      );
    }
  } else {
    if (margin) {
      return (
        <button
          className={`mt-3 me-3 btn btn-${style}`}
          type={type}
          onClick={() => onClick(label)}
        >
          {label}
        </button>
      );
    } else {
      return (
        <button
          className={`btn btn-${style}`}
          type={type}
          onClick={() => onClick(label)}
        >
          {label}
        </button>
      );
    }
  }
}

export default ButtonGroup;

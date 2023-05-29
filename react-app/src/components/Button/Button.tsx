import React from "react";
import styles from "./Button.module.css";

interface Props {
  children: string;
  onClick: () => void;
  colorChange: "primary" | "secondary" | "danger";
}

const Button = ({ children, onClick, colorChange = "primary" }: Props) => {
  return (
    <button
      color={colorChange}
      // className={"btn btn-" + colorChange}
      className={[styles.btn, styles["btn-" + colorChange]].join(" ")}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

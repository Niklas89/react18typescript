import Button from "./Button/Button";
import { useState } from "react";

interface Props {
  children: string;
  maxChars?: number;
}

const ExpandableText = ({ children, maxChars = 100 }: Props) => {
  const [isExpanded, setExpanded] = useState(false);

  if (children.length <= maxChars) return <p>{children}</p>;

  const text = isExpanded ? children : children.substring(0, maxChars);

  return (
    <p>
      {text} ...
      <Button colorChange="primary" onClick={() => setExpanded(!isExpanded)}>
        {isExpanded ? "Less" : "More"}
      </Button>
    </p>
  );
};

export default ExpandableText;

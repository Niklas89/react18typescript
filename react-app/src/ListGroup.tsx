// import { MouseEvent } from "react"; -> import for const handleClick
import { useState } from "react";
import styled from "styled-components";

const List = styled.ul`
  list-styled: none;
  padding: 0;
`;

interface ListItemProps {
  active: boolean;
}

const ListItem = styled.li<ListItemProps>`
  padding: 5px 0;
  background: ${(props) => (props.active ? "blue" : "none")};
`;

interface Props {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: Props) {
  // function ListGroup(props: Props) { -> can also be used, but then below specify props.items / props.heading
  // below now passed as props through App.tsx
  // let items = ["New York", "San Francisco", "Tokyo", "London", "Paris"];
  // let item = [];

  // CONDITIONAL RENDERING --------------------
  // one way: const message = items.length === 0 ? <p>No items found</p> : null;
  /* another way
  const getMessage = () => {
    return items.length === 0 ? <p>No items found</p> : null;
  }; */

  // HANDING EVENTS --------------------
  //mouse over event in 'return()' you can see the type 'MouseEvent', then only import it and use it as below
  // this is called type annotation => event: MouseEvent
  // const handleClick = (event: MouseEvent) => console.log(event);

  // MANAGING STATE --------------------
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <h1>{heading}</h1>
      {/* another way: {message} */}
      {/* benefits of using functions is that we can use parameters */}
      {/* {getMessage()} */}
      {/* how the below code works:
            true && 1 => 1
            true && 'Mosh' => 'Mosh'
            false && 'Mosh' => false  */}
      {items.length === 0 && <p>No items found</p>}
      {/* <ul className="list-group"> replaced with List */}
      <List>
        {items.map((item, index) => (
          // <li replaced with ListItem
          <ListItem
            // className="list-group-item"
            /* className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            } replaced with active for ListItem */
            active={index === selectedIndex}
            key={item}
            // onClick={() => console.log(item, index)}
            // onClick={(event) => console.log(event)}
            // onClick={handleClick}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
          >
            {item}
            {/* </li> */}
          </ListItem>
        ))}
        {/* </ul> */}
      </List>
    </>
  );
}

export default ListGroup;

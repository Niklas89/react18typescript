import { useEffect, useState } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button/Button";
import ListGroup from "./ListGroup";
import { BsFillCalendarFill } from "react-icons/bs";
import Like from "./components/Like";
import produce from "immer"; // simplifying update logic for state management
import NavBar from "./components/NavBar";
import Cart from "./components/Cart";
import ExpandableText from "./components/ExpandableText";
import Form from "./components/Form";
import SecondForm from "./components/SecondForm";
import ThirdForm from "./components/ThirdForm";
import FourthForm from "./components/FourthForm";
import ExpenseList from "./expense-tracker/components/ExpenseList";
import ExpenseFilter from "./expense-tracker/components/ExpenseFilter";
import ExpenseForm from "./expense-tracker/components/ExpenseForm";
import ProductList from "./components/ProductList";
// import axios, { AxiosError, CanceledError } from "axios";
import apiClient, { CanceledError } from "./services/api-client";
import UserList from "./components/UserList";

// Connecting to the Backend - Effect Dependencies
interface User {
  id: number;
  name: string;
}

function App() {
  let items = ["New York", "San Francisco", "Tokyo", "London", "Paris"];
  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  /*  alert example
  const handleOnClick = () => {
    setAlertVisibility(true);
  };
  const [alertVisible, setAlertVisibility] = useState(false);
  */

  // For nested objects
  /* 12 - Exercice1: Updating state */
  const [game, setGame] = useState({
    id: 1,
    player: {
      name: "John",
    },
  });
  const handleOnClickGame = () => {
    // update without immer
    // setGame({ ...game, player: { ...game.player, name: "George" } });
    // update with immer
    setGame(
      produce(game, (draft) => {
        draft.player.name = "Bob";
      })
    );
  };

  // For nested array in object
  /* 12 - Exercice2: Updating state */
  const [pizza, setPizza] = useState({
    name: "Spicy Pepperoni",
    toppings: ["Mushroom"],
  });
  const handleOnClickPizza = () => {
    // add without immer
    // setPizza({ ...pizza, toppings: [...pizza.toppings, "Tomato"] });
    // add with immer
    setPizza(
      produce(pizza, (draft) => {
        draft.toppings.push("Cheese");
      })
    );
  };

  // For nested array in object
  /* 12 - Exercice3": Updating state */
  const [cart, setCart] = useState({
    discount: 0.1,
    items: [
      { id: 1, title: "Product 1", quantity: 1 },
      { id: 2, title: "Product 2", quantity: 1 },
    ],
  });
  const handleOnClickCart = () => {
    // edit without immer
    // setCart({
    //   ...cart,
    //   items: cart.items.map((item) =>
    //     item.id === 1 ? { ...item, quantity: item.quantity + 1 } : item
    //   ),
    // });
    // edit with immer
    setCart(
      produce(cart, (draft) => {
        const item = draft.items.find((item) => item.id === 1);
        if (item) item.quantity = item.quantity + 1;
      })
    );
  };

  // For array in object:
  const [bugs, setBugs] = useState([
    { id: 1, title: "Bug 1", fixed: false },
    { id: 2, title: "Bug 2", fixed: false },
  ]);

  // Update -- we create only a brand new object of Bug 1 that needs to be modified, no need to create a brand new array.
  const handleOnClick = () => {
    // immutable way of updating
    // setBugs(bugs.map((bug) => (bug.id === 1 ? { ...bug, fixed: true } : bug)));

    // simplified update with immer - mutating object just like a regular javascript object
    setBugs(
      produce((draft) => {
        const bug = draft.find((bug) => bug.id === 1);
        if (bug) bug.fixed = true;
      })
    );
  };

  // Sharing state between components
  const [cartItems, setCartItems] = useState(["Product1", "Product2"]);

  // ExpenseList and ExpenseFilter
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenses, setExpenses] = useState([
    { id: 1, description: "aaa", amount: 10, category: "Utilities" },
    { id: 2, description: "bbb", amount: 10, category: "Utilities" },
    { id: 3, description: "ccc", amount: 10, category: "Groceries" },
    { id: 4, description: "ddd", amount: 10, category: "Utilities" },
  ]);
  const visibleExpenses = selectedCategory
    ? expenses.filter((e) => e.category === selectedCategory)
    : expenses;

  // Connecting to the Backend - Effect Dependencies
  const [category, setCategory] = useState("");

  // Connecting to the Backend - Fetching Data
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    // this is for cancellation request (with the strict mode enabled we don't have to worry about the request
    // sent the to the server twice, or if a user navigates away from the page)
    const controller = new AbortController();
    setLoading(true);
    // When we use Typescript below with User[] we get auto-completion when we type "res.data[0].",
    // we can choose id or name
    // .then((res) => console.log(res.data[0].name));
    // get returns a promise -> res / err
    apiClient
      .get<User[]>("/users", {
        signal: controller.signal,
      })
      .then((res) => {
        setLoading(false);
        setUsers(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    // .finally(() => {
    //   // better this way than duplicating code,
    //   // but this doesn't work with strict mode turned on
    //   setLoading(false);
    // });

    return () => controller.abort(); // we return the cleanup function

    // other way (traditionnal way) of doing it without ".then" and ".catch":
    /*
    const fetchUsers = async () => {
      try {
        const res = await axios.get<User[]>(
          "https://jsonplaceholder.typicode.com/users"
        );
        setUsers(res.data);
      } catch (err) {
        setError((err as AxiosError).message);
      }
    };
    fetchUsers(); */
    // but the promise is better
  }, []);

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter((u) => u.id !== user.id));

    // optimistic update: we update the UI first
    apiClient.delete("/users/" + user.id).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = { id: 0, name: "Mosh" };
    setUsers([newUser, ...users]);

    apiClient
      .post("/users/", newUser)
      .then(({ data: savedUser }) => setUsers([savedUser, ...users]))
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  const updateUser = (user: User) => {
    const originalUsers = [...users];
    const updatedUser = { ...user, name: user.name + "!" };
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));

    // put replacing an object
    // patch: modifiying one or more of its properties
    apiClient.patch("/users/" + user.id, updatedUser).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  return (
    <div>
      {/* Connecting to the Backend - Fetching Data */}
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}
      <button className="btn btn-primary mb-3" onClick={addUser}>
        Add
      </button>
      <ul className="list-group">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between"
          >
            {/* d-flex -> display flex */}
            {user.name}
            <div>
              <button
                className="btn btn-outline-secondary mx-1"
                onClick={() => updateUser(user)}
              >
                Update
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => deleteUser(user)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <UserList />

      {/* Connecting to the Backend - Effect Dependencies */}
      <select
        className="form-select"
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value=""></option>
        <option value="Clothing">Clothing</option>
        <option value="Household">Household</option>
      </select>
      <ProductList category={category} />

      {/* ExpenseList and ExpenseFilter */}
      <div className="mb-5">
        <ExpenseForm
          onSubmit={(expense) =>
            setExpenses([...expenses, { ...expense, id: expenses.length + 1 }])
          }
        />
      </div>
      <div className="mb-3">
        <ExpenseFilter
          onSelectCategory={(category) => setSelectedCategory(category)}
        />
      </div>
      <ExpenseList
        expenses={visibleExpenses}
        onDelete={(id) => setExpenses(expenses.filter((e) => e.id !== id))}
      />

      {/* Building Forms - Building a form */}
      <FourthForm />

      {/* alert example
      {alertVisible && (
        <Alert onClose={() => setAlertVisibility(false)}>
          <strong>Holy guacamole!</strong> My Alert
        </Alert>
      )} */}

      {/* Sharing state between components */}
      <NavBar cartItemsCount={cartItems.length} />
      {/* the component that holds the state should be the one who also updates it */}
      <Cart cartItems={cartItems} onClear={() => setCartItems([])} />

      <BsFillCalendarFill color="red" size="40" />
      <Like onClick={() => console.log("clicked")} />
      <ListGroup
        items={items}
        heading="Cities"
        onSelectItem={handleSelectItem}
      />

      {/* State update example */}
      {bugs.map((bug) => (
        <p key={bug.id}>
          {bug.title} {bug.fixed ? "Fixed" : "New"}
        </p>
      ))}
      <Button colorChange="primary" onClick={handleOnClick}>
        setBugs
      </Button>

      {/* 12 - Exercice1: Updating state */}
      {game.player.name}
      <Button colorChange="primary" onClick={handleOnClickGame}>
        setGame
      </Button>

      {/* 12 - Exercice2: Updating state */}
      {pizza.toppings.map((top) => (
        <p>{top}</p>
      ))}
      <Button colorChange="primary" onClick={handleOnClickPizza}>
        setPizza
      </Button>

      {/* 12 - Exercice3: Updating state */}
      {cart.items.map((item) => (
        <p>
          {item.id} - {item.title} - {item.quantity}
        </p>
      ))}
      <Button colorChange="primary" onClick={handleOnClickCart}>
        setCart
      </Button>

      {/* 13 - Exercice: Build an ExpandableText Component */}
      <ExpandableText maxChars={10}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </ExpandableText>
    </div>
  );
}

export default App;

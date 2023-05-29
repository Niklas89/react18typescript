import React, { FormEvent, useState } from "react";

const SecondForm = () => {
  // Accessing Input fields with useState
  const [person, setPerson] = useState({
    name: "",
    age: "",
  });
  const handleSubmit = (event: FormEvent) => {
    // prevent form from being submitted to the server, cause it makes a full page reload
    event.preventDefault();
    console.log(person);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          onChange={(
            event // everytime the user types a keystroke we update the name
          ) => setPerson({ ...person, name: event.target.value })}
          value={person.name}
          id="name"
          type="text"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="age" className="form-label">
          Age
        </label>
        <input
          onChange={(
            event // everytime the user types a keystroke we update the age
          ) => setPerson({ ...person, age: event.target.value })}
          value={person.age}
          id="age"
          type="number"
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default SecondForm;

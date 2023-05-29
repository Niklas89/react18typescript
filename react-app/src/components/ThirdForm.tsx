import React, { FormEvent, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

interface FormData {
  name: string;
  age: number;
}

const ThirdForm = () => {
  //   const form = useForm();
  //   console.log(form); // see what functions we have in form object
  // const { register } = useForm();
  // console.log(register("name")); use this in input field instead of onChange and value like in SecondForm.tsx

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  // console.log(formState);
  // console.log(formState.errors);

  const onSubmit = (data: FieldValues) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          // we spread the result with "...", check console of this function above to see what it returns
          {...(register("name"), { required: true, minLength: 3 })}
          id="name"
          type="text"
          className="form-control"
        />
        {/* if we have an error of type required we render this paragraph. */}
        {/* errors.name? (optional chaining) because our errors object can be empty. So type will be checked only if we have a name property in errors object */}
        {errors.name?.type === "required" && (
          <p className="text-danger">The name field is required.</p>
        )}
        {errors.name?.type === "minLength" && (
          <p className="text-danger">The name must be at least 3 characters</p>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="age" className="form-label">
          Age
        </label>
        <input
          {...register("age")}
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

export default ThirdForm;

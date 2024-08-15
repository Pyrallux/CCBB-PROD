# Forms

- This pattern describes how forms are made throughout the application using  `react-hook-form` and `yup`.

- ## Setup

  - Forms in this app use a combination of react-hook-form and yupResolver.
  - Imports are as follows:

    ```ts
    import { useForm } from "react-hook-form";
    import * as yup from "yup";
    import { yupResolver } from "@hookform/resolvers/yup";
    ```

    - In order to create a form the whole TSX objects should be wrapped in a `<form>` tag.
    - The `<form>` tag will also need an `onSubmit` tag and a child submit button defined as such:

    ```tsx
    <form onSubmit={handleSubmit(onSubmit)}>
    <button label="Done" type="submit" />
    </form>
    ```

  - Additionally, the useForm hook should be used as such:

    ```ts
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
     });
    ```

  - The attributes in the code above such as `register, handleSubmit, and formState` are used for state management of the form.
  - Note that in the above code, a `yupResolver` is defined and passed a `schema` (and therefore the schema must be defined above it).
  - An example process for defining a `schema` is as follows:

    ```ts
    const schema = yup.object().shape({
        name: yup.string().required("*Cycle Name is Required"),
        date: yup
            .date()
            .min(new Date(), "*Date Must be in the future")
            .required("*Cycle Date is Required"),
    });
    ```

  - Note all the strings being passed into the objects on each element of the `schema` are used to display on the screen as part of the `errors` attribute of the `useForm` hook.
  - With each object inside of the yup resolver's shape, a value must be registered inside the input tag as follows:

    ```tsx
    <input type="text" className="form-control" {...register("name")} />
    <input type="date" className="form-control" {...register("date")} />
    ```

  - Error handling should be done as follows within the TSX object:

    ```tsx
    <p className="ms-3 text-danger fst-italic">{errors.name?.message}</p>
    ```

  - Finally, define an onSubmit function (that will only execute when the yupResolver is valid) and watch you form do its thing!

    ```ts
    const onSubmit = () => {
        console.log("Form Submitted");
    };
    ```

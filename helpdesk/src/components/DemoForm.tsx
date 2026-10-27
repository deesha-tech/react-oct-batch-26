import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import BootstrapTextInput from "./BootstrapTextInput";



function DemoForm() {
    
   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()


  return (
    <form onSubmit={handleSubmit(console.log)}>

        <Controller 
            name="email"
            render={ (props) => <BootstrapTextInput {...props} /> }
             />

        <Form.Control />


      <input
        {...register("firstName", {
          required: "First name is required",
          minLength: { value: 2, message: "Min length is 2" },
        })}
      />
      <p>{errors.firstName?.message}</p>

      <input
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
        })}
      />
      <p>{errors.email?.message}</p>

      <input
        type="number"
        {...register("age", {
          valueAsNumber: true,
        })}
      />
      <p>{errors.age?.message}</p>

      <button type="submit">Submit</button>
    </form>
  )
}

export default DemoForm;
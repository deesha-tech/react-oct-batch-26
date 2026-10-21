import { useState } from "react";

function ControlledForm() {
  const [form, setForm] = useState({ email: "", message: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();

    const errs = {};
    if (!form.email.includes("@")) errs.email = "Enter a valid email";
    if (form.message.length < 10) errs.message = "At least 10 characters";

    setErrors(errs);
    if (Object.keys(errs).length) return;

    console.log('form submitted', form)
  }

  return (
    <div>
      <h1>Controlled Form</h1>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" value={form.email} onChange={onChange} />
        <p>{errors.email}</p>

        <label htmlFor="message">Message ({form.message.length}/500)</label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={onChange}
        />
        <p>{errors.message}</p>

        <button>Send</button>
      </form>
    </div>
  );
}

export default ControlledForm;

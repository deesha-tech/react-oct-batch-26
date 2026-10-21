import { useState } from "react";

function UnControlledForm() {
  

  function handleSubmit(e) {
    e.preventDefault();

    // console.log(e.currentTarget)
    const form = e.currentTarget; 

    const data =   Object.fromEntries( new FormData(form))
    
    console.log('form submitted ', data)
  }

  return (
    <div>
      <h1>UnControlled Form</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" required/>
        
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
        />

        <button>Send</button>
      </form>
    </div>
  );
}

export default UnControlledForm;

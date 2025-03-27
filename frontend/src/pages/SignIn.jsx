import React from "react";
import { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { useNavigate } from "react-router-dom";

const SignIn = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        axios.post('http//localhost:8081/signup', values)
        .then(res => navigate('/'))
        .catch(err => console.log(err));
    }

  return (
    <div className={classes.bg}>
      <div className={classes.card}>
        <div className={classes.entry}>
          <form onSubmit={handleSubmit}>
            <div className={classes.inputs + ' ' + classes[`crimson-text-regular`]}>
              <label htmlFor="name" className={classes[`crimson-text-regular`]}>Username</label>
              <input type="text" name="name" onChange={handleInput} required/>
            </div>
            <div className={classes.inputs}>
              <label htmlFor="password" className={classes[`crimson-text-regular`]}>Password</label>
              <input type="text" name="password" onChange={handleInput} required/>
            </div>
            <button className={classes.submit} type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

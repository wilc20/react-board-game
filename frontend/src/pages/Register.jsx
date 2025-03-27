import React from "react";
import { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {

  useEffect(()=> {
    console.log('useEffect');
    const fetchUser = async () => {
      console.log('inside async');
      axios.get('http://localhost:8801/user')
      .then(res => console.log(JSON.stringify(res)))
      .catch(err => console.error(err));
    }

    fetchUser();
  }, [])

    const [values, setValues] = useState({
        username: '',
        password: ''
    });

    const [user, setUser] =useState('');

    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        axios.post('http://localhost:8801/register', values)
        .then(res => navigate('/Login'))
        .catch(err => console.log(err));
    }

    const testAxios = async (event) => {
      event.preventDefault();
      axios.get('http://localhost:8801/getList')
      .then(res => console.log(JSON.stringify(res)))
      .catch(err => console.log(err));
    }

    const testSubmit = async (event) => {
      event.preventDefault();
      /* axios.post('http://localhost:8801/register', values) */
      axios.post('http://localhost:8801/api/auth/register', values)
      .then(res => {console.log(JSON.stringify(res)); navigate('/');})
      .catch(err => console.log(err));
    }

  return (
    <div className={classes.bg}>
      <div className={classes.card}>
        <div className={classes.entry}>
          <form onSubmit={testSubmit}>
            <div className={classes.inputs + ' ' + classes[`crimson-text-regular`]}>
              <label htmlFor="username" className={classes[`crimson-text-regular`]}>Username</label>
              <input type="text" name="username" onChange={handleInput} required/>
            </div>
            <div className={classes.inputs}>
              <label htmlFor="password" className={classes[`crimson-text-regular`]}>Password</label>
              <input type="text" name="password" onChange={handleInput} required/>
            </div>
            <button className={classes.submit} type="submit">Register</button>
          </form>
          {/*< button type="button" onClick={testAxios}>TestAxios</button> */}
        </div>
      </div>
    </div>
  );
};

export default Register;

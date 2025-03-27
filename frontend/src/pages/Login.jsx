import React, { useContext } from "react";
import { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { useNavigate, redirect, useOutletContext } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";
/* import axiosInstance from "../axiosConfig"; */
//import { useUser } from "../context/userContext";

const Login = () => {

  const navigate = useNavigate();
  //const {setUsername} = useOutletContext();
  //const {setUser, userChangeHandler} = useContext(UserContext);
  //const { setUsername, username } = useUser();
  const {user, setUser } = useContext(UserContext);

  const [values, setValues] = useState({
    username: '',
    password: ''
});
const handleInput = (event) => {
  setValues(prev => ({...prev, [event.target.name]: event.target.value}));
};
/*     const testSubmit = async (event) => {
      event.preventDefault();
      axiosInstance.post('/api/auth/login', values)
      .then(res => {console.log(JSON.stringify(res)); navigate('/');})
      .catch(err => console.log(err));
    } */
    const testSubmit = async (event) => {
      event.preventDefault();
      axios.post('http://localhost:8801/api/auth/login', values, {withCredentials: true, credentials: 'include'})
      .then(res => {console.log(JSON.stringify(res)); setUser('fred');  navigate('/'); })
      .catch(err => console.log(err)); 

      
      //redirect('/');
    }

  return (
    <div className={classes.bg}>
      <div className={classes.card}>
        <div className={classes.entry}>
          <form onSubmit={testSubmit}>
            <div className={classes.inputs + ' ' + classes[`crimson-text-regular`]}>
              <label htmlFor="username" className={classes[`crimson-text-regular`]}>Username: {user}</label>
              <input type="text" name="username" onChange={handleInput} required/>
            </div>
            <div className={classes.inputs}>
              <label htmlFor="password" className={classes[`crimson-text-regular`]}>Password</label>
              <input type="text" name="password" onChange={handleInput} required/>
            </div>
            <button className={classes.submit } type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

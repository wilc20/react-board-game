import React, {useEffect, useContext} from 'react'

import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket  from '../socket';


import { checkAuthLoader } from '../util/auth';
import { UserContext } from "../App";


const AuthLayout = () => {
  const navigate = useNavigate();
  const {user, setUser } = useContext(UserContext);
  console.log("AUTHLAYOUT");
    useEffect(()=>{
/*         const fetchUser = async () => {
            console.log("inside async");
            axios
              .get("http://localhost:8801/api/auth/profile", {
                withCredentials: true,
              })
              .then((res) => {
                console.log(JSON.stringify(res));
                //fetchGames();
              })
              .catch((err) => {
                console.error(err);
                navigate("/login");
              });
          };
      
      
          fetchUser(); */
          async function checkAuth() {
            const isAuth = await checkAuthLoader();
            if(!isAuth){
              navigate('/login');
            } else {
              console.log("isAuth:", isAuth.username);
              setUser(isAuth.username);
            }
          }
          checkAuth();
          console.log("Auth Layout useEffect");
    },[navigate]);

  return (
    <div>
          <Outlet />
    </div>
  )
}

export default AuthLayout
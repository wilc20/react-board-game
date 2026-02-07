import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user,SetUser] = useState(null);
    const [loading,SetLoading] = useState(true);

    useEffect(() => {
          axios.get('http://localhost:8801/api/auth/profile', {withCredentials: true})
          .then(res => {SetUser(res.data.username); console.log('useEffect res', res.data.username);})
          .catch(() => SetUser(null))
          .finally(()=> SetLoading(false));
    },[]);

    const login = async (values) => {
/*             axios.post('http://localhost:8801/api/auth/login', values, {withCredentials: true, credentials: 'include'})
            .then(res => {SetUser(res.username);  navigate('/'); })
            .catch(err => console.log(err));  */
            try {
                await axios.post('http://localhost:8801/api/auth/login', values, {withCredentials: true, credentials: 'include'});
                const res = await axios.get(/* '/api/auth/profile' */'http://localhost:8801/api/auth/profile', {withCredentials: true});
                let username = res.data.username;
                SetUser(username)
                console.log("username",username);
                return { success: true };
            } catch (err) {
                const errMessage = err.response?.data || "Login failed.";
                return { success: false, errMessage };
            }
    };

    const logout = async () => {
        await axios.post('http://localhost:8801/api/auth/logout', {},{
            withCredentials: true,
           // credentials: "include",
          });
        SetUser(null);
    };

    const register = (values) => {
        axios.post('http://localhost:8801/api/auth/register', values, {withCredentials: true, credentials: 'include'})
        .then(res => {SetUser(res.username);})
        .catch(err => console.error(err));
    };

    return (
        <AuthContext.Provider value={{  user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
};
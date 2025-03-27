import React from 'react';
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  return isAuth ? (element) : (<Navigate to='/login' replace/>)
}

export default PrivateRoute;
// DELETE THIS FILE
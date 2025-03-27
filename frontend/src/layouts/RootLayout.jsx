import React, {useState} from 'react'
import { Outlet } from 'react-router-dom'
import { UserProvider } from '../context/userContext';

const RootLayout = () => {
  //const [username, setUsername] = useState('Something');

  return (
    <Outlet/>
  )
}

export default RootLayout
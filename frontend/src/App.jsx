import { BrowserRouter, Routes, Route, useRoutes, createBrowserRouter, RouterProvider } from "react-router-dom";
import React, {useState} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Game from "./pages/Game";
import Lobby from "./pages/Lobby";
//import GameLayout from "./layouts/GameLayout";
import AuthLayout from "./layouts/AuthLayout";

import { checkAuthLoader } from "./util/auth";
import RootLayout from "./layouts/RootLayout";
import ErrorPage from "./pages/ErrorPage";
//import { UserProvider } from "./context/userContext";

export const UserContext = React.createContext(null);

console.log()

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children:[
      {
        path:'/',
        element: <AuthLayout />,
        id:'root',
        loader: checkAuthLoader,
        children:[
          {index: true, element: <Home />},
          {
            path: 'game',
            element:  <Lobby key={"something"}/>,
          },
          {
            path: 'gameBoard',
            element: <Game />
          } 
        ]
      },
      {
        path:'/login',
        element: <Login />,
        id:'login'
      }
    ]
  }
  
])

function App() {
  const [user, setUser] = useState(null);

/*   const routes = useRoutes([
    { 
      element:<AuthLayout />,
      loader: checkAuthLoader,
      children: [
        {path: "/",element: <Home />},
        {
          element: <GameLayout />,
          children: [
            {
              path: "/game",
              element: <Game />
            },
            {
              path: "/lobby/:state",
              element: <Lobby />
            }
          ]
        },
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    
    
  ])
  return routes; */
  return (
    <BrowserRouter>
      <UserContext.Provider value={{user:user, setUser: setUser}}>
        <Routes>
          {/* Root Layout */}
          <Route path="/" element={<RootLayout />}>
            {/* Auth Layout */}
            <Route
              element={<AuthLayout />}
            >
               <Route index element={<Home />} />
              <Route path="game" element={<Lobby />} />
              <Route path="gameBoard" element={<Game />} />
              </Route>
            {/* Login Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>}/>
          </Route>
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
/*   return <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>; */
}

export default App;

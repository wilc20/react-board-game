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
//import AuthLayout from "./layouts/AuthLayout";

import { checkAuthLoader } from "./util/auth";
import RootLayout from "./layouts/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Testpage from "./pages/Testpage";

function App() {
  return (
        <Routes>
          <Route element={<RootLayout />}>
          <Route element={<ProtectedRoutes />}>
            <Route index path="/"  element={<Home />} />
              <Route path="game" element={<Lobby />} />
              <Route path="gameBoard" element={<Game />} />
          </Route>
            {/* Login Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>}/>
            <Route path='/testpage' element={<Testpage />} />
          </Route>
        </Routes>
  );
}

export default App;
import React, { createContext, useContext, useEffect } from "react";
import { socket } from "../socket";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    // Ensure socket connection persists
    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);

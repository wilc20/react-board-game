import { useEffect, useCallback } from "react";
import socket from '../socket';

/* const useSocket = (listenEvent, callback) => {
    useEffect(() => {
      if (listenEvent) {
        socket.on(listenEvent, callback);  // Attach the listener if provided
        console.log(`Listening for ${listenEvent}`);
      }
  
      return () => {
        if (listenEvent) {
          socket.off(listenEvent, callback);  // Cleanup listener
        }
      };
    }, [listenEvent, callback]);
  
    const emit = useCallback((event, data) => {
      if (socket.connected) {
        socket.emit(event, data);
        console.log(`Emitting ${event}`, data);
      } else {
        console.warn(`Cannot emit ${event} - socket not connected`);
      }
    }, []);
  
    return { emit };  // Return emit function
  };
  
  export default useSocket; */
  const useSocket = (eventListeners = []) => {
    useEffect(() => {

    if(!socket.connected) {
        console.log("Reconnecting socket due to navigation...");
        socket.connect();
        }
        
      eventListeners.forEach(({ event, callback }) => {
        socket.on(event, callback);  // Attach each event listener
      });

  
      return () => {
        eventListeners.forEach(({ event, callback }) => {
          socket.off(event, callback);  // Cleanup all event listeners
        });
      };
    }, [eventListeners]);
  
    const emit = useCallback((event, data) => {
      socket.emit(event, data);
    }, []);
  
    return { emit };
  };
  
  export default useSocket;
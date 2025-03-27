import React, {useEffect, useState} from 'react';
import { socket } from '../socket';

export const useSocket = () => {
    const [data, setData] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [buttonFlicked, setButtonIsFlicked] = useState(false);
    const [gameReady, setGameReady] = useState(false);

    useEffect(()=>{

        function onConnect() {
            setIsConnected(true);
        }
        function onDisconnect() {
            setIsConnected(false);
        }

        function onRenderLobby(value) {
            setData([...value]);
        }

        function onGameReady() {
          setGameReady(true);
        }

        if(!socket.connected) {
            console.log("Reconnecting socket due to navigation...");
            socket.connect();
          }

        socket.on('startGame', onGameReady); 

       
        socket.on('disconnect', onDisconnect);
        socket.on('renderLobby', onRenderLobby);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('renderLobby', onRenderLobby);
            socket.off('startGame', onGameReady);
            socket.off();
        };
    })

    

      const getLobbyHandler = (gameId) => {
       socket.emit("joinRoom", gameId);
        console.log("gameId: ",gameId);
      };

      const selectCharHandler = (charPayload) => {
        socket.emit('selectChar',charPayload);
      }

      const gameStartHandler = (startPayload) => {
        socket.emit('readyLobby', startPayload);
      }

      const buttonFlicker = () => {
        console.log(!buttonFlicked)
        setButtonIsFlicked(!buttonFlicked);
      }

      const leaveSocket = (gameId) => {
        socket.emit('leaveSession', {room: gameId});
      }


    return {lobbyData: data, getLobbyHandler, isConnected, buttonFlicker, leaveSocket, gameReady, selectCharHandler, gameStartHandler};
}
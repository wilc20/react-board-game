import React, {useEffect, useState} from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useParams } from 'react-router-dom';

import { useLocation } from 'react-router-dom';

import {socket} from '../socket';

const GameLayout = () => {
  //const {state} = useParams();
  const [playerList, setPlayerList] = useState(null);
  const navigate = useNavigate();
  const {state} = useLocation();
  const [gameId, setGameId] = useState();
  //let gameId = location.state?.gameId;
  
  //console.log("location search",location.search)
  
  useEffect(()=>{
    console.log("GameLayout - State:",state);
    if(!state){
      navigate('/');
      return;
    }else{
      console.log("GameLayout - GAMEID", state.gameId);
      //setGameId(state.gameId);
    }

    const handleGameData = (response) => {
      console.log("Data received:", response);
      setPlayerList([...response]);
    };


    socket.on('renderLobby', handleGameData);

      function listPlayers(){
        console.log("socket connected firing joinroom from within listPlayers()");
        socket.emit("joinRoom", state.gameId);
        socket.emit("testSock");
      }

      listPlayers();

    //listPlayers().then(data=>setPlayerList([...data.gameLobby]));

      // Emit after ensuring the listener is set up
  if (socket.connected) {
    console.log("socket connected firing joinroom");
    socket.emit("joinRoom", state.gameId);
  } else {
    socket.on("connect", () => {
      console.log("socket connected firing joinroom");
      socket.emit("joinRoom", state.gameId);
    });
  }

/*     socket.on("connect", () => {
      if (socket.recovered) {
        // any event missed during the disconnection period will be received now
        //socket.emit("joinRoom", gameId);
        console.log("recovered");
        socket.emit("getLobby", state.gameId);
      } else {
        // new or unrecoverable session
        console.log("news");
        //socket.emit("joinRoom", 'something');
      }
    }); */

     socket.on("disconnect", () => {
        setTimeout(()=>{
          if(!socket.connected){
            navigate("/");
            return;
          }
        }, 10000);
    }); 

    socket.on('reconnect_attempt', () => {
      console.log('Client attempting to reconnect...');
    });
 
    socket.on("endGame", (reason) => {
      console.log("Game ended:", reason);
      if(!state.gameId){
        navigate("/Lobby");
        //console.log("Game Layout Navigated:")
        return;
      }
    }); 

    return () => {
      socket.off('renderLobby', handleGameData); // Prevent duplicate listeners
      socket.off("connect");
    };
  },[]);

  const simulateDisconnection = (event) => {
    event.preventDefault();
      if (socket.io.engine) {
        console.log("Simulating disconnection...");
        socket.io.engine.close();
      }
  };

  

    window.onpopstate = () => {
      //alert('URL CHanges');
      //const roomId = location.state.gameId;

      socket.emit('leaveSession', {room: state.gameId});
    };

    window.addEventListener('beforeunload', () => {
      socket.disconnect();
      socket.io.opts.reconnection = false;
    });

    console.log('GameLayout');



    //const myOutlet = 

  if(playerList === null) return <button onClick={() => console.log("firibnf",playerList)}>PLAYERLIST</button>;

  return ( state &&
    <div className="">
        <header style={{display: 'flex'}}>
            <button onClick={simulateDisconnection}>Disconnect</button>
            <button onClick={() => {if(!socket.connected){console.log('Attempting to reconnect...'); socket.connect();}}}>Reconnect</button>
        </header>
        <main>
          <Outlet context={{playerList:playerList, gameId: state.gameId}}/>;
        </main>
    </div>
  )
}

export default GameLayout

//Call setPlayerList from inside the Outlet, in order to force rerender?
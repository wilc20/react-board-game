import React, {useState, useEffect, useContext} from 'react';


//import { socket } from '../socket.js';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
//import { useSocket } from '../context/socketContext.jsx';

//import { useSocket as useSocket2 } from '../hooks/socketHook.jsx';
//import useSocket from '../hooks/useSocket';
import useSocket from "../hooks/useSocket";

import axios from "axios";

import classes from "./Lobby.module.css";

//import { useUser } from "../context/userContext";
import { UserContext } from "../App";

const charNames = ['General Ludgwig Beck','Dietrich Bonhoeffer', 'Admiral Wilhelm Canaris', 'Carl Goerdeler','Erich Kordt', 'General Friedrich Olbricht', 'General Hans Oster', 'Claus Von Stauffenberg', 'Henning Von Tresckow'];

const Lobby = () => {
  const imageName = 'char1';

  
  
  //const data = useSocket2();
  //console.log("SOCALLEDDATA", data);
  //let gameId = location.state?.gameId;
  const {state} = useLocation();
  const gameId = state.gameId;
  const navigate = useNavigate();
  //const { username } = useUser();
  const {user} = useContext(UserContext)
  //const {playerList, gameId} = useOutletContext();
  const [playerList, setPlayerList] = useState([]);

  const [selectedChar, setSelectedChar] = useState('');  
  const [pNames, setPNames] = useState([]);
  const [connection, setConnectionStatus] = useState(false);

  const playernames = ['HeyArnols','HeyClive','HeyDave','HeyTerry','HeyJoules','HeyJusde'];

  const { emit } = useSocket([
    {event: "renderLobby", callback: (data) => setPlayerList([...data])},
    {event: "disconnect", callback: (status) => setConnectionStatus(false)},
    {event: "connect", callback: (status) => setConnectionStatus(true)},
    {event: "startGame", callback: () => {
      navigate('/gameBoard',{
        state: {
          gameId: gameId,
        },
        replace: true
      })
    }}
  ]);
  
  useEffect(()=>{


    console.log("GameLayout - State:",state);
    if(!state){
      navigate('/');
      return;
    }else{
      console.log("GameLayout - GAMEID", gameId);
      //setGameId(state.gameId);
    }

    



    const fetchUser = async () => {
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
          return;
        });
    };
    const handleGameData = (response) => {
      console.log("Data received:", response);
      setPlayerList([...response]);
    };

    //data.getLobbyHandler(state.gameId);
    emit("joinRoom", gameId );




/*         socket.on('renderLobby', handleGameData);
    
          function listPlayers(){
            console.log("socket connected firing joinroom from within listPlayers()");
            socket.emit("joinRoom", state.gameId);
            console.log("listPLayers gameId: ",state.gameId);
            socket.emit("testSock");
          }
    
          if(socket.connected) {
            console.log("Socket already connected. Emitting events...");
            listPlayers();
          }else{
            socket.on("connect", () => {
              console.log("Socket connected. Emitting events...");
              listPlayers();
            })
          }
           */

      

/*      socket.on('startGame', () => {
      navigate('/game/14141',{
        state: {
          gameId: gameId,
        },
        replace: true
      });
    });  */
/*      socket.on('startGame', () => {
      navigate('/gameBoard',{
        state: {
          gameId: gameId,
        },
        replace: true
      });
    });  */
    
    console.log('[L60 gameId]- ', gameId);

    fetchUser();

    return () => {
/*       socket.off('startGame', () => {
        navigate('/game/14141',{
          state: {
            gameId: gameId,
          },
          replace: true
        });
      }); */ 
/*       socket.off('startGame', () => {
        navigate('/gameBoard',{
          state: {
            gameId: gameId,
          },
          replace: true
        });
      });  */

     // socket.off('renderLobby', handleGameData);
     // socket.off('connect');
    }

  },[]);

/*   useSocket('renderLobby', (lobbyData) => {
    console.log("Data receuved:", lobbyData);
    setPlayerList([...lobbyData]);
} ); */


  const playerRelocateHandler = () => {
    //socket.emit('movePlayer', { room:location.state.gameId, newPos:JSON.stringify({"name":"Dave","color":"green","location":{"id":"Posen","zone":"3","name":"Posen","neighbours":["Train Station","Wolfsschanze","Warsaw"],"textContent":["-3 Suspicion","(distributed)","for Badge"],"lat":49.1,"lng":45.5,"item":"Badge","itemState":"concealed"}})});
  };

  const selectCharHandler = async (event) => {
    event.preventDefault();
    setSelectedChar(event.target.value);
    console.log(event.target.value);
    console.log(gameId);

    ////data.selectCharHandler({room: state.gameId, char:event.target.value});
   // socket.emit('selectChar',{room: gameId, char:event.target.value});
   emit('selectChar',{room: gameId, char:event.target.value});
  };

  const gameStartHandler = () => {
    ////data.gameStartHandler({room: state.gameId});
   // socket.emit('readyLobby', {room: gameId});
    emit('readyLobby', {room: gameId});
    console.log("gameId: ", state.gameId);
  };

  const displayCharacters = () => {
    let chosenChars = selectedChar;
    //let savedChars = playerList.filter((player) => player.existingChar.name);
    let savedChars = playerList.reduce((filtered, option) =>{
      if(option.existingChar){
        filtered.push(option.existingChar.name);
      }
      return filtered;
    }, []);

    return charNames.map((character, i) => { let charTaken = savedChars.some(savedChar => savedChar == character); return <div className={[classes.char_portrait, charTaken && classes.char_taken].join(' ')} key={`characterPortrait${i}`}><button type='submit' style={{filter: charTaken && 'grayscale(1)', backgroundColor: 'red', border: character === selectedChar ? '2px red solid' : '1px green solid', backgroundImage: `url('./src/assets/portraits/${character.split(' ').slice(-1).join(' ')}.png')` }} onClick={(event) => selectCharHandler(event)/* setSelectedChar(event.target.value) */} value={character} disabled={charTaken}></button></div>})
  };
  const getLobbyHandler = () => {
    //socket.emit("joinRoom", state.gameId);
    emit("joinRoom", state.gameId);
    ////data.getLobbyHandler(state.gameId);
    console.log("gameId: ",state.gameId);
    console.log(data.isConnected);
  };

    window.onpopstate = () => {
      //alert('URL CHanges');
      //const roomId = location.state.gameId;
      ////data.leaveSocket(state.gameId);
      emit('leaveSession', {room: state.gameId});
      //socket.emit('leaveSession', {room: state.gameId});
    };
  
/*     if(data.gameReady){
      navigate('/gameBoard',{
        state: {
          gameId: state.gameId,
        },
        replace: true
      });
    } */

      /// onClick={()=>data.buttonFlicker()}
  return (
    <main className={classes.background}>
      <section className={classes.char_sect}>
        <section className={classes.char_list}>
          <h2>Character Selection {user}  AM I CONNECTED? { connection ? "yes" : "no" }</h2>
          <div className={classes.char_select}>
            {/* {charNames.map((character) => (<div className=""><button type='submit' style={{ backgroundColor: 'red', backgroundImage: `url('./src/assets/portraits/${character.split(' ').slice(-1).join(' ')}.png')` }} onClick={(event) => setSelectedChar(event.target.value)} value={character}></button></div>))} */}
            {displayCharacters()}
          </div>
          {<button className={classes.char_submit} onClick={()=>gameStartHandler()}>{playerList?.filter((playo) => playo.ready !== true).length < 1 ? "GO" : "Ready Up"}</button>}
          <button onClick={()=>getLobbyHandler()}>getLobby</button>
          <button>Flcikbutton</button>
        </section>
        {selectedChar && <aside className={classes.char_display}>
            <h2>{selectedChar}</h2>
            <h3>Civilian</h3>
            <p>Kordt's love of England and knowledge of the english language led him to a career in the german foreign office.</p>
            <div>
              <h4>Ability: </h4>
              <p>Reveal the top three cards of the current stage's event deck and replace them in any order.</p>
            </div>
        </aside>}
      </section>
      <aside className={classes.player_sect}>
        <section className={classes.player_list}>
          {/* data.lobbyData && <h5>{data.lobbyData.length}/5</h5> */}
          { playerList && <h5>{playerList.length}/5</h5> }
          <ul>
            {/* {playernames && playernames.map((playo)=> <li><p>{playo}</p></li>)} */}
            {/* data.lobbyData && data.lobbyData.map((playo, i)=> <li key={"player "+i}><p>{playo.userId} {"<---"} {playo.ready ? 'Ready!' : 'Not Ready'}</p></li>) */}
            {playerList && playerList.map((playo, i)=> {console.log("playo.userName",playo); return <li key={"player "+i}><p>{playo.userName}{playo.userName == user ? "(You) " : null}{" : "} {playo.ready && 'Ready!'}{playo.existingChar?.name || playo.character || ''}</p></li>})}
          </ul>
        </section>
        <section className={classes.player_chat}>

        </section>
      </aside>
      
    </main>
  )
}

export default Lobby
import React, { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import { MapInteractionCSS } from "react-map-interaction";

import Location from "../components/game_components/Location";
//import PlayerStore from "../stores/PlayerStore";
import shuffle from "../stores/shuffle";
import useDice from "../stores/useDice";
import DiceRoll from "../components/game_components/DiceRoll";

import PlayerHUD from "../components/game_components/PlayerHUD";
import LocationDetails from "../components/game_components/LocationDetails";
import Item from "../components/game_components/Item";

/* import {socket} from '../socket'; */
/* import { io } from 'socket.io-client'; */
import useSocket from "../hooks/useSocket";

import axios from "axios";

import classes from "./Game.module.css";

import { UserContext } from "../App";

import { useLocation } from "react-router-dom";

import { usePlayerState } from "../hooks/usePlayerState";

/* const socket = io('http://localhost:5173', {
  withCredentials: true,
  transports: ['websocket', 'polling']
}); */

/* const socket = io('http://localhost:8801');
 */
const Game = () => {

    const [players, setPlayers] = useState([
        { name: "Dave", color: "green", location: LocationDetails[13]},
        { name: "Mary", color: "red", location: LocationDetails[20] },
        { name: "Chaz", color: "blue", location: LocationDetails[22] },
      ]);

    const navigate = useNavigate();  
    //const location = useLocation();
    const {state} = useLocation();
    
    
      const {user} = useContext(UserContext);
      console.log('U S E R', user);
    const player = usePlayerState(user);
    //const player = PlayerStore();
    


    const [locations, setLocations] = useState([]);
    const [dissent, setDissent] = useState(0);
    const [actionCount, setActionCount] = useState(3);
    const [diceRolls, setDiceRolls] = useState([1,2,3,4,5,6]);
    const [stage, setStage] = useState([[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7,7,7,7,7]]);
    const [mapState, setMapState] = useState({
        scale: 0.5,
        translation: {x: 0, y:0}
    });

    const dice = useDice();

    //const [room, setRoom] = useState(location.state.gameId);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const mapHandler = (values) => {
        console.log(values);
        setMapState(values);
    }
    

    const { emit } = useSocket([
      {event: "renderLobby", callback: (data) => console.log(data)},
      {event:"startup", callback:(gameDetails)=>{
        alert(JSON.stringify(gameDetails));
        
        let myDetails = gameDetails.players.find((storedP) => {if((storedP.name === user) && storedP.name !== null){console.log("USER MATCH", storedP.username); return storedP}})
        player.movePlayerTo(myDetails.location.name); //Dictates the gold ribbon
        playerRelocateHandler(myDetails.location, user); // Dictates which locations I can click on
        setPlayers(gameDetails.players); // Dictates which names are placed where
/*         player.motivationChange(myDetails.motivation);*/
        player.suspicionChange(3); 
        console.log('myDetailsItem',myDetails.items);
        player.setPlayerInventoryLimit(myDetails.character.itemLimit);
        player.setPlayerInventory(myDetails.items);
        //let updatedLocations = [...locations];
        /* updatedLocations[gameDetails.items.findIndex(el => el.name == updatedLocations.name)]; */
/*         gameDetails.items.forEach(itemDetails => {
          let locationItemIndex = updatedLocations.findIndex((updatedLocation) => updatedLocation.name === itemDetails.name);
          updatedLocations[locationItemIndex].itemState = itemDetails.itemState;
        }); */
        setLocations([...gameDetails.locations]);
        console.log(gameDetails.locations);
        /* gameDetails.items */
/*         for ( const iteem of myDetails.items) {
          console.log('iteem', iteem);
          player.pickUpItem(iteem);
        } */
        
      }

      },
      {event:"message", callback:(message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
          console.log('currentmessage', message);
        }}, 
      {event:"disconnect", callback: () => {
        if(confirm("You have disconnected!")){
          navigate("/");
          return;
        }
      }},
      {event:"connect", callback: () => {  ///// NEWLY ADDED
        emit('joinRoom', state.gameId);
      }},
      {event:"move", callback: (moveResults) => {
          //let othersResults;
          let myResults = moveResults.find((storedP) => {if((storedP.name === user) && storedP.name !== null){console.log("USER MATCH", storedP.name);/* player.setPlayerLocation(storedP.location.name) */ return storedP.location}});
          console.log(`move result: ${JSON.stringify(moveResults)}`);
          console.log(`my move result: ${JSON.stringify(myResults)}`);
          ////player.setPlayerLocation(myResults.location);

          //Try replacing setPlayers with moveResults
          // as might not need playerRelocateHandler if React updates the board
          player.movePlayerTo(myResults.location.name);
          
          playerRelocateHandler(myResults.location, user);
          setPlayers([...moveResults]);

          let updatePlayers = [...players];
          updatePlayers = updatePlayers.map((playerToUpdate) => {
              const foundPlayer = moveResults.find(storedP => storedP.username === playerToUpdate.name);
              return foundPlayer ? {...playerToUpdate, location: LocationDetails.find(location => location === foundPlayer.location)}: playerToUpdate;
          })

          //let replacePlayers = moveResults.map((player))
          console.log("updatePlayers",updatePlayers);
          console.log("moveResults", moveResults);
      } }
    ]);

    useEffect(()=>{ 

        /* const fetchUser = async () => {
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
            });
        }; */

/*         if(!location.state?.gameId){
          navigate("/");
          console.log("Line 87")
          return;
        } */
        if(!state){
          navigate("/");
          return;
        }

        //fetchUser();

          const Items = [
            "Intel", "Intel", "Intel",
            "Explosives","Explosives","Explosives",
            "Poison","Poison","Poison",
            "Map","Map","Map",
            "Badge","Badge","Badge",
            "Signature","Signature","Signature",
            "Keys","Keys","Keys",
            "Weapons","Weapons","Weapons"];
      
          let locationItem = 0;
          let locationItemsSet = [...LocationDetails];
          let locationItems = shuffle(Items);
      
/*           for(let i = 0; i < locationItemsSet.length; i++){
      
            if(locationItemsSet[i].textContent?.length > 2){
              locationItemsSet[i].item = locationItems.pop();
              //locationItemsSet[i].item = null;
              //locationItemsSet[i].itemState = "concealed";
              locationItemsSet[i].itemState = "concealed";
              locationItem++;
            }
          }; */
          
          //emit("getLobby", state.gameId);
          emit('gameSetup', state.gameId);

          //setLocations([...locationItemsSet]);

          //emit('loadBoard', {room: state.gameId});
          //socket.emit("joinRoom", location.state.gameId);
        ////joinRoom(location.state.id);

        //console.log('locationthingy useEffect eh:', location.state.gameId);
        /* socket.on('message', (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
          console.log('currentmessage', message);
        }); */

/*         socket.on('renderLobby', async (lobby) => {
          console.log('Current players: ', await lobby);
          console.log('renderLobby Called');
        }); */

    },[]);
    

/*       useEffect(() => {
        alert("URL CHABNGE");
      },[navigate]); */
      window.onpopstate = () => {
        //alert('URL CHanges');
        //const roomId = location.state.gameId;

        /* socket.emit('leaveSession', {room: roomId}); */
        emit('leaveSession', {room: state.gameId});
      };

      const conspire = (amount) => {
        let validatedAmount = (amount <= 3 && amount > 0) ? amount : 0;

        let newActionCount = actionCount - validatedAmount;
        let newDissentTrack = dissent;

        console.log("IM CONSPIRING");
        //setConspiring(true);
        let rolls = [...dice.rollDice2(amount)];
        setDiceRolls([...rolls]);
        for(let i = 0; i < rolls.length; i++)
          {
            switch(rolls[i]) {
              case 1:
              case 2:
              case 3:
                newActionCount += rolls[i];
                break;
              case 4:
              case 5:
                //EAGLES
                player.suspicionChange((player.suspicion+1));
                break;
              case 6:
                newDissentTrack++;
                //TARGETS
              ;
            }
          }
        
        setActionCount(newActionCount);
        setDissent(newDissentTrack);
      }

      const locationPlayerRequest = (newLocation) => {
        emit('movePlayer', { room: state.gameId, newPos:newLocation});
      };

    const playerRelocateHandler = (newLocation, playerName) => {
        console.log("MOVEMENT");
        console.log(playerName + " wants to go to " + newLocation.name);
        let playerIndex = players.findIndex((entry) => entry.name === playerName);
        let playerEntry = players[playerIndex];

        console.log("playerEntry:", playerEntry);
        console.log("RelocateHandlerPlayer:", player.playerName);
        playerEntry = { ...playerEntry, location: newLocation };
        if(playerName == player.playerName) {
          player.movePlayerTo(newLocation.name);
          player.setPlayerDestinations([...newLocation.neighbours]);
          console.log("NEWDESTINATIONS:", newLocation.neighbours);
        }
        console.log("playerEntry postChange:", playerEntry);
        let newPlayersList = [...players];
        newPlayersList[playerIndex] = playerEntry;
        setPlayers(newPlayersList);
        ////socket.emit('movePlayer', { room:location.state.gameId, newPos:JSON.stringify(playerEntry)});
        //emit('movePlayer', { room: state.gameId, newPos:/* JSON.stringify(playerEntry) */playerEntry});
        console.log("newPlayersList", newPlayersList);
      };

      const envelopeStateChange = (currentLocation, newEnvelopeState) => {
        if(player.playerInventory.length >= player.playerInventoryLimit && newEnvelopeState == 'collected'){
          alert('Inventory FULL');
          return;
        }
        emit('updateEnvelopeState', {room: state.gameId, currentLocation: currentLocation, newEnvelopeState: newEnvelopeState});

        console.log("EnvelopeStateChange for: ",currentLocation, newEnvelopeState);
        if(currentLocation === player.playerLocation){
          let locationsCopy = [...locations];
          let currentLocationIndex = locations.findIndex((location) => location.name === currentLocation);
    
          if(locationsCopy[currentLocationIndex].itemState == "item"){
            player.pickUpItem(locationsCopy[currentLocationIndex].item);
          }
          locationsCopy[currentLocationIndex].itemState = newEnvelopeState;
          console.log(locationsCopy[currentLocationIndex].itemState);
          setLocations(locationsCopy);
          //actionHandler();
        };
    
      };

      const determineClosestAvailableSpace2 = (startLocation) => {
        let currentLocation = startLocation;
          //retrieve info about neighouring locations
          
          console.log('determineClosestAvailableSpace2',locations);
          console.log('determineClosestAvailableSpace2 startlocation',startLocation);
          console.log('neighbors', locations.filter((location) => {console.log(location.name,location.neighbours); return location.neighbours?.includes(currentLocation.name)}));
          let neighbours = locations.filter((location) => location.neighbours.includes(currentLocation.name));
          let validNeighbours = neighbours.filter((location) => !location.hasOwnProperty('restricted'));
    
          while (validNeighbours.length < 1) {
              currentLocation = neighbours[0];
              neighbours = locations.filter((location) => location.neighbours.includes(currentLocation.name));
              validNeighbours = neighbours.filter((location) => !location.hasOwnProperty('restricted'));
          }
    
          console.log("APP - validNeighbours[0]: ",validNeighbours[0]);
          
          return validNeighbours[0];/* closestValidLocation; */
      }

      const renderLocations = () => {
        return locations.map((location) => (
          <Location
            key={location.id}
            textContent={location.textContent}
            visitors={players
              .filter((p) => p.location.name === location.name)
              .map((p) => p.name)}
            addVisitor={playerRelocateHandler}
            visitorRequest={locationPlayerRequest}
            restricted={(stage[0][0] == 7 && location.restricted)}
            lat={location.lat}
            lng={location.lng}
            item={location.item}
            location={location}
            isNeighbour={player.playerDestinations.includes(location.name)}
            playerPresent={(player.playerLocation === location.name)}
            envelopeHandler={envelopeStateChange}
            validLocationCalculator={determineClosestAvailableSpace2}
            player={player}
          >
            <Item itemType={location.item}/>
          </Location>
        ))
      };

      const memoLocations = useMemo(()=>renderLocations(), [locations, players]);

      const sendMessage = () => {
        const roomId = state.gameId;
        console.log('roomId', roomId);
        if(message && roomId) {
          console.log('message && roomId');
          emit('sendMessage', { room:roomId, message });
          setMessage('');
        }
      };

      const goToLobby = () => {
        navigate("/lobby", {
          state: {
            gameId: gameId,
          }
        });
      }
      const loadBoard = () => {
        const roomId = state.gameId;
        emit('loadBoard', { room:roomId});
      };

      const motivationUp = () => {
        player.suspicionChange(player.suspicion+1);
      };
      const setPlayerUsername = () => {
        player.setPlayerName(user);
      };

      const getGameDetails = ( ) => {
        //const roomId = state.gameId;
        emit('gameSetup', state.gameId);
      };



      

  return (<div className={classes.background}>
    <PlayerHUD destinations={player.playerDestinations} currentLocation={player.playerLocation} suspicion={player.suspicion} actions={actionCount} stage={stage[0][0]} inventory={player.playerInventory} dissent={dissent} message={message} messages={messages} setMessage={setMessage} sendMessage={sendMessage} player={player} user={user}/>
    <MapInteractionCSS  value={mapState} onChange={mapHandler} maxScale={0.5}  minScale={0.3}  translationBounds={{xMin:((0 - ((2420 / 1.2)*mapState.scale))/* 0 - (mapState.scale * 1000) */), xMax:(window.innerWidth - (1000 * mapState.scale) /* 0 + (mapState.scale * 2420) */), yMin:(0 - (mapState.scale * 1000)), yMax: (0 + (mapState.scale * 1000)) }}>
        <div className={classes.board}>
            <div className={classes.map}>
            {memoLocations}
            </div>
        </div>
        <div>Is connected: {/* {socket.active} */}</div>
        <button onClick={goToLobby}>Return to Lobby</button>
        <button onClick={() => conspire(prompt("How many die?", 1))}>Conspire</button>
        <button onClick={loadBoard}>LoadBoard</button>
        <button onClick={motivationUp}>SusUp</button>
        <button onClick={setPlayerUsername}>SetName</button>
        <button onClick={getGameDetails}>gameStart</button>
        <ul>
{/*         {messages.map((msg, index) => (
                        <li key={"msg-"+index}>{msg.chatter ? msg.chatter+': '+msg.message : msg}</li>
                    ))} */}
        {players?.map((pEntry, index) => (
                        <li key={"player-"+index}>{pEntry.name+': '+pEntry.location.name}</li>
                    ))}
        </ul>
    </MapInteractionCSS>
    </div>);
};

export default Game;

import React from 'react';
import { useState } from 'react';
import LocationDetails from '../components/game_components/LocationDetails';

export const PlayerStore = (initalPlayers) => {
    const [playerLocation, setPlayerLocation] = useState("Train Station");
    const [playerDestinations, setPlayerDestinations] = useState(["Hannover",  "Prague", "Posen", "Gestapo HQ", "Ministry of Propaganda", "Sportpalast", "Chancellery", "DeutschlandHalle", "Zeughaus", "Nuremberg"]);
    const [playerColor, setPlayerColor] = useState("Red");
    const [playerName, setPlayerName] = useState('Default');
    const [playerInventory, setPlayerInventory] = useState([]);

    const [motivation, setMotivation] = useState(1);
    const [suspicion, setSuspicion] = useState(2)

    const movePlayerTo = (locale) => {
        console.log("Player is heading to: ", locale);
        setPlayerLocation(locale);
/*         let locationIndex = LocationDetails.findIndex((location) => location.name === locale);
        setPlayerDestinations([...LocationDetails[locationIndex].neighbours]);
        console.log("playerStoreDestinations: ",[...LocationDetails[locationIndex].neighbours]); */
    };

    const playerIntro = () => {
        console.log(`My name is ${playerColor}`);
    };

    const pickUpItem = (item) => {
        let tempInv = [...playerInventory];
        tempInv.push(item);

        setPlayerInventory(tempInv);
    };

    const dropItem = (item) => {
        let tempInv = [...playerInventory];
    }

    const suspicionChange = (amount) => {
        console.log("suspicionTriggered"+amount);
        if(Number.isSafeInteger(amount) && amount > 0 && amount < 5){
            console.log("newSuspicion:"+amount);
            setSuspicion(amount);
        }
    };
    const motivationChange = (amount) => {
        console.log("motivationTriggered"+amount);
        if(Number.isSafeInteger(amount) && amount > 0 && amount < 5){
            console.log("newSuspicion:"+amount);
            setMotivation(amount);
        }
    };



  return {playerLocation, playerDestinations, setPlayerName,setPlayerDestinations, movePlayerTo, playerColor, playerName, pickUpItem, dropItem, setPlayerLocation, suspicion, suspicionChange, motivation, motivationChange, playerInventory}
};

//export default PlayerStore;
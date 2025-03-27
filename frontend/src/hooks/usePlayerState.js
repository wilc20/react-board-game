import { useState } from "react";

export const usePlayerState = (initialPlayers) => {
  console.log("usePlayerState:", initialPlayers);
  const [playerLocation, setPlayerLocation] = useState("Train Station");
  const [playerDestinations, setPlayerDestinations] = useState([
    "Hannover",
    "Prague",
    "Posen",
    "Gestapo HQ",
    "Ministry of Propaganda",
    "Sportpalast",
    "Chancellery",
    "DeutschlandHalle",
    "Zeughaus",
    "Nuremberg",
  ]);
  const [playerCharacter, setPlayerCharacter] = useState("Red");
  const [playerName, setPlayerName] = useState(initialPlayers);
  const [playerInventory, setPlayerInventory] = useState([]);
  const [playerInventoryLimit, setPlayerInventoryLimit] = useState(3);

  const [motivation, setMotivation] = useState(1);
  const [suspicion, setSuspicion] = useState(2);

  const movePlayerTo = (locale) => {
    console.log("Player is heading to: ", locale);
    setPlayerLocation(locale);
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
  };

  const suspicionChange = (amount) => {
    console.log("suspicionTriggered" + amount);
    if (Number.isSafeInteger(amount) && amount > 0 && amount < 5) {
      console.log("newSuspicion:" + amount);
      setSuspicion(amount);
    }
  };
  const motivationChange = (amount) => {
    console.log("motivationTriggered" + amount);
    if (Number.isSafeInteger(amount) && amount > 0 && amount < 5) {
      console.log("newMotivation:" + amount);
      setMotivation(amount);
    }
  };

  return {
    playerLocation,
    setPlayerName,
    playerDestinations,
    setPlayerDestinations,
    movePlayerTo,
    playerCharacter,
    playerName,
    pickUpItem,
    dropItem,
    setPlayerLocation,
    suspicion,
    suspicionChange,
    motivation,
    motivationChange,
    playerInventory,
    setPlayerInventory,
    setPlayerCharacter,
    playerInventoryLimit,
    setPlayerInventoryLimit
  };
};

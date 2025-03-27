import React from 'react'
import { useState } from 'react'

import Items from '../components/game_components/Items'
import LocationDetails from '../components/game_components/LocationDetails'

const GameStore = () => {

    const [currentLocationInfo, setcurrentLocationInfo] = useState();
    const [dissentTrack, setDissentTrack] = useState();

    const adjustDissentTrack = () => {
      
    };

    const distributeItems = () => {

    };
    let locationItemsSet = [...LocationDetails];
    let locationItems = shuffle(Items);


    for(let i = 0; i < locationItemsSet.length; i++){
      /* if(LocationDetails[i].textContent?.length > 2){
        console.log(LocationDetails[i].textContent);
        locationItem++;
      }
      console.log(LocationDetails[i].name + LocationDetails[i].textContent?.length); */
      if(locationItemsSet[i].textContent?.length > 2){
        locationItemsSet[i].item = locationItems.pop();
        console.log(locationItemsSet[i]);
        locationItem++;
      }
      /* console.log(locationItemsSet[i].name + locationItemsSet[i].textContent?.length); */
    };


  return (
  )
}

export default GameStore
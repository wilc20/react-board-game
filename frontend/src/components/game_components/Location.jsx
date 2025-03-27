import React, { Children } from "react";
import Toon from "./Toon";
import classStyle from "./Location.module.css";
import {PlayerStore} from "../../stores/PlayerStore";
import { usePlayerState } from "../../hooks/usePlayerState";
import Item from "./Item";

import useSocket from "../../hooks/useSocket";

const Location = ({ visitors, textContent = [], addVisitor, visitorRequest,restricted = false, lat = 0, lng = 0, item = "weapon", location, isNeighbour, playerPresent, envelopeHandler, validLocationCalculator, player, children}) => {
    //const player = PlayerStore();
    //const player = usePlayerState();
    const { emit } = useSocket([]); 
  
    if(restricted && playerPresent)
      {
        addVisitor(validLocationCalculator(location), player.playerName);
      }

    const locationHandler = () => {
        //addVisitor(location, player.playerName);
        visitorRequest(location);
        

        console.log("Location Playerdestinations: ",player.playerDestinations);
    }

/*     if(visitors.length > 0){
      console.log(location.name+" visitors: ", visitors);
    } */

    if(playerPresent){
      console.log("player is at:", location.name);
    }


    const availableTitle2 = () => {
     let isDisabled = (!isNeighbour || restricted == true);

     return <button className={classStyle.title + ' ' + classStyle[`poppins-bold`] + ' ' + (playerPresent ? classStyle.titlePresent + ' ' + classStyle.present: "")} disabled={isDisabled} onTouchEnd={() => locationHandler()} onClick={() => locationHandler()}>
     <h4>{location.name}</h4>
   </button>
    };

  return (
    <div className={classStyle.base + ' ' + classStyle[`tier${location.zone}`] + ' ' + (playerPresent ? classStyle.present : "")} style={{left: lat+'%', top: lng+'%'}} disabled={!isNeighbour}>
        <h3 className={classStyle.zone}>{location.zone}</h3>
        {textContent.length > 0 && <div className={classStyle.content}>
          {textContent.length > 2 ? <div style={{height:100+'%', width:100+'%'}}>
            {location.itemState == "concealed" ? <button className={classStyle.envelope} onClick={() => envelopeHandler(location.name, 'item')} onTouchEnd={() => envelopeHandler(location.name,'item')} disabled={!playerPresent}><hr/></button> : <div style={{height:100+'%', width:100+'%'}}>
                {location.itemState == "collected" ? <div className={classStyle.result}>
                {textContent.map((line, index) => (<p key={"textContent_"+location.name+index} className={classStyle.germaniaOne + ' ' + classStyle[`line${textContent.length}`]}>{line}</p>))}
            </div> : 
            <button className={classStyle.localeItem} onClick={() => envelopeHandler(location.name, 'collected')} disabled={!playerPresent}>
              {/* <Item itemType={item}/> */}
              {children}
            </button>
            }
              </div>}
          </div> : <div className={classStyle.itemless}>
          {textContent.map((line, index) => (<p key={"itemlessTextContent_"+location.name+"_line"+index} className={classStyle.germaniaOne + ' ' + classStyle[`line2`]}>{line}</p>))}
            </div>}
        </div>}
        {availableTitle2()}
        {visitors && <div className={classStyle.playerbase}>
          <ul className={classStyle.playerTokens}>
            {visitors.map((visitor, index) => (<li key={visitor} className={classStyle.germaniaOne + ' ' + classStyle['tokenchild']} style={{ "--degrees": 30*index +"deg"}} ><p>{visitor}</p></li>))}
          </ul>
          </div>
        }
      {(restricted) && <div className={classStyle.stage7}>7</div>}
    </div>
  );
};

export default React.memo(Location);

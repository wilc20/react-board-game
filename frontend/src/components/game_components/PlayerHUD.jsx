import React from "react";
import { useState } from "react";
import ClassStyle from "./PlayerHUD.module.css";


//import PlayerStore from "../../stores/PlayerStore";

import weaponIcon from "../../assets/items/BOWeaponsExportE.svg";
import explosivesIcon from "../../assets/items/BOExplosivesToken.svg";
import intelIcon from "../../assets/items/BOIntelToken.svg";
import BadgeIcon from "../../assets/items/BOBadgeToken.svg";
import keysIcon from "../../assets/items/BOKeysToken.svg";
import mapIcon from "../../assets/items/BOMapToken.svg";
import poisonIcon from "../../assets/items/BOPoisonToken.svg";
import signatureIcon from "../../assets/items/BOSignatureToken.svg";

import diceTarget from "../../assets/dice/BODiceTarget2.svg";
import diceEagle from "../../assets/dice/BODiceEagle.svg";

import Card from "./Card";
import Item from "./Item";
import MessageBox from "./MessageBox";

const motivation = "motivated";

const motivationDesc = {
  reckless: (
    <h6>
      Can attempt <i>reckless</i> plots!
    </h6>
  ),
  committed: <h6>Can attempt plots</h6>,
  motivated: <h6>Can use conspirator ability</h6>,
  skeptical: <h6>Dossier limit is normal</h6>,
  timid: <h6>Dossier limit is two</h6>,
};

const abilityButton = (description) => {
  if (
    motivation == "reckless" ||
    motivation == "committed" ||
    motivation == "motivated"
  ) {
    return <button>{description}</button>;
  }
};

const suspicionPips = (suspicionLevel) => {
  let pipArray = [];
  for (let i = 0; i < suspicionLevel; i++) {
    /* pipArray.push(<h6 className={ClassStyle.germaniaOne}>ᛋ</h6>); */
    pipArray.push(<h6 key={"pip"+i} className={ClassStyle.pip}><img src={diceEagle}></img></h6>);
  }

  return pipArray;
};

const PlayerHUD = ({
  destinations,
  currentLocation,
  suspicion,
  actions,
  stage,
  inventory,
  dissent,
  message,
  messages,
  setMessage,
  sendMessage,
  player,
  user
}) => {
  //const player = PlayerStore();
  const [showDossier, setShowDossier] = useState(false);

  const dissentTrackHUD = () => {
    let dissentDice = [];
    for(let i = 0; i < dissent; i++)
      {
        dissentDice.push(<div key={"dissentdice"+i} className={ClassStyle.dissent_dice}><img src={diceTarget}/></div>)  
      }
      return dissentDice
  };

  const messageKeyHandler = (e) => {
      if(e.key == 'Enter'){
        sendMessage();
      }
  };

  return (
    <div className={ClassStyle.overlay}>
      <div className={ClassStyle.dissent}>
        {dissentTrackHUD()}
{/*           <div className={ClassStyle.dissent_dice}>
            <img src={diceTarget}/>
          </div>
          <div className={ClassStyle.dissent_dice}>
            <img src={diceTarget}/>
          </div>
          <div className={ClassStyle.dissent_dice}>
            <img src={diceEagle}/>
          </div> */}
      </div>
      <div className={ClassStyle.info}>
        {/* <h2>Player: {player.playerName}</h2>
        <h2>My Location: {currentLocation}</h2> */}
        <h5>
          Destinations:{" "}
          {player.playerDestinations.map((destination) => `${destination}` + " ")}
        </h5>
        {/*  <h5>Suspicion: {suspicion}</h5> */}
        <h5>Actions left: {actions}</h5>
        <h5>Current Stage: {stage}</h5>
{/*         <input type="text" value={message} onKeyDown={messageKeyHandler} onChange={(e) => setMessage(e.target.value)}></input>
        <button onClick={sendMessage}>Post</button>
        <div>
          <h2>Messages:</h2>
          <ul className={ClassStyle.chat}>
              {messages.map((msg, index) => (
                <li key={"msg-"+index}>{msg.chatter ? msg.chatter+': '+msg.message : msg}</li>
              ))}
          </ul>
        </div> */}
        <div className={ClassStyle.chat}>
        <MessageBox  message={message} messages={messages} sendMessage={sendMessage} setMessage={setMessage}/>
        </div>
        
        {/* <h5>Inventory: {inventory}</h5> */}

      </div>
      <div className={ClassStyle.base}>
        <div className={ClassStyle.person}>
          <img className={ClassStyle.picture} style={{ backgroundImage: `url(./src/assets/portraits/Bonhoeffer.png)` }}  />
          <ul className={ClassStyle.itemlist}>
            {inventory.map((item) => <li key={"inventory_item_"+item} className={ClassStyle.item}><Item itemType={item}/></li>)}
          </ul>
        </div>
        <section className={ClassStyle.faculties}>
          <div className={ClassStyle.fac_contents}>
            {/* {(motivation == 'reckless'||'committed'||'motivated') && <button>Hello</button>} */}
            {abilityButton(
              "Raise the motivation of all other conspirators in your space by 1"
            )}
            <div
              className={
                ClassStyle.motivation + " " + ClassStyle[`${motivation}`]
              }
            >
              <h4>{motivation}</h4>
              {motivationDesc[`${motivation}`]}
            </div>
            <div className={ClassStyle.suspicion}>
              <h4>Suspicion</h4>
              {suspicionPips(player.suspicion)}
              {/* <h6 className={ClassStyle.germaniaOne}>👀ᛋ</h6>
              <h6 className={ClassStyle.germaniaOne}>ᛋ</h6> */}
            </div>
            <div className={ClassStyle.desc}>
              <h2 className={ClassStyle.germaniaOne}>Dietrich Bonhoeffer</h2>
              <div className={ClassStyle.role}>
                <h4 className={ClassStyle.abwehr}>Abwehr</h4>
                <h4 className={ClassStyle.seperate}> | </h4>
                <h6>Theologian & Abwehr Agent</h6>
              </div>
              <h4>Player: {/* player.playerName */ user}</h4>
              <h4>My Location: {currentLocation} {suspicion} {dissent} {actions}</h4>
            </div>
          </div>
        </section>
      </div>
      <div className={ClassStyle.dossier}>
{ showDossier ? <div className={ClassStyle.cards}>
          <Card />
          <Card />
          <Card />
          <Card />
          <button onClick={() => setShowDossier(false)}>Hide dossier</button>
        </div> : <button onClick={() => setShowDossier(true)}>Show dossier</button>}
      </div>
    </div>
  );
};

export default PlayerHUD;

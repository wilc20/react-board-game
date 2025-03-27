import React from "react";
import { Children, memo } from "react";

import classes from "./DiceRoll.module.css";

import diceTarget from "../../assets/dice/BODiceTarget2.svg";
import diceEagle from "../../assets/dice/BODiceEagle.svg";


const DiceRoll = ({ rollvalue, rollEnd }) => {
  console.log("ROLL:" + rollvalue);

  const finalRollValue = () => {
    switch(rollvalue){
        case 1:
        case 2:
        case 3:
          return rollvalue;
        case 4:
        case 5:
          //EAGLES
          return <img src={diceEagle}></img>;
        case 6:
          return <img src={diceTarget}/>;
          //TARGETS
    }
  }

  /* 1656 */

  return (
    <div className={classes.container}>
      <div className={classes.cube + " " + classes.rolling}>
        <div className={classes.side + " " + classes.one}>?</div>
        <div className={classes.side + " " + classes.two}>?</div>
        <div className={classes.side + " " + classes.three}>?</div>
        <div className={classes.side + " " + classes.four}>?</div>
        <div className={classes.side + " " + classes.five}>?</div>
        <div className={classes.side + " " + classes.six}>?</div>
        <div className={classes.dienumber} >{finalRollValue()}</div> 
      </div>
    </div>
  );
};

export default memo(DiceRoll);

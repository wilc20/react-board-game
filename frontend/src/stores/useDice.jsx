import React from 'react'
import { useState } from 'react'


const useDice = () => {

    const [dicePool, setDicePool] = useState([]);
    const [dissentTrack, setDissentTrack] = useState([]);

    const createDice = () => {
        return {
            value: 1,
            roll: function () {
                this.value = Math.floor(Math.random() * 6);
            }
        }
    };

    const initialiseDice = () => {
        let dice = [];
        
        for(let i = 0; i < 10; i++) 
        {
            dice.push(createDice());
        }

        setDicePool(dice);
    };

    const rollDice = (amount) => {
        for(let i = 0; i < amount;  i++) 
            {

            }
    };

    const rollDice2 = (amount) => {
        let dieResults = [];
        if(amount <= 10 && amount > 0) {
            for(let i = 0; i < amount;  i++) 
                {
                    dieResults.push(Math.floor(Math.random() * 6)+1);
                }
        } else {
            dieResults.push(Math.floor(Math.random() * 6)+1);
        }

        return dieResults;
    }

  return {rollDice2}
}

export default useDice;
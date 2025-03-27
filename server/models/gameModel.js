const mongoose = require('mongoose');
/* import { validate } from "./userModel"; */

const gameSchema = new mongoose.Schema(
  {
    gameHost: {
      type: String,
      required: true,
    },
    gameDetails: {
      type: Object,
      required: true,
    },
    gameLobby: {
        type: [Object],
        validate: [arrayLimit, 'No more than 4 players']
    }
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val){
    return val.length <= 2;
};

/* export  */const Game = mongoose.model("Game", gameSchema);
module.exports = Game;

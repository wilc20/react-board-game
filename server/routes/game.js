/* import { Game } from '../models/gameModel'; */

const express = require("express");
const router = express.Router();
const Game = require("../models/gameModel");
const User = require("../models/userModel");
const session = require("express-session");
const LocationDetails = require("../LocationDetails");

const shuffle = require("../shuffle");

router.post("/newGame", async (req, res) => {
    const {title} = req.body;
    if (!title || title.trim().length === 0) {
      res.status(500).send("Please enter a title");
    }
    
    console.log('newgameTitle:', title);
    console.log('newGame session:', req.session );
  try {
    const userDetails = await User.findById(req.session.userId).select(
      "-password"
    );
    console.log('newGame username:', userDetails.username);

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
    for(let i = 0; i < locationItemsSet.length; i++){
      
      if(locationItemsSet[i].textContent?.length > 2){
        locationItemsSet[i].item = locationItems.pop();
        locationItemsSet[i].itemState = "concealed";
        locationItem++;
      }
    };
    locationItemsSet = locationItemsSet.map(({id, neighbours, textContent, lat, lng, zone, ...rest}) => {return {...rest}});

    const defaultDetails = {
        title: title,
      stage: 1,
      eventCard: 1,
      playerTurn: 1,
      turnPhase: 1,
      players: [
/*         {
          playerID: req.session.userId,
          player: userDetails.username,
          motivation: "timid",
          suspicion: "medium",
          items: [],
          dossier: [],
          location: 'Train Station',
          character: {name: null}
        }, */
      ],
      deputies: {
        Hitler: {
            location: LocationDetails[0],
            penalty: 'nothing'
        },
        Himmler: {
            location: LocationDetails[0],
            penalty: 'nothing'
        },
        Goebbels: {
            location: LocationDetails[0],
            penalty: 'nothing'
        },
        Bormann: {
            location: LocationDetails[0],
            penalty: 'nothing'
        },
        Goering: {
            location: LocationDetails[0],
            penalty: 'nothing'
        },
        Hess: {
            location: LocationDetails[0],
            penalty: 'nothing'
        }
      },
      dissentTrack: 0,
      itemInfo: locationItemsSet
    };

    //console.log('newGame username:', {gameHost: userDetails.username, gameDetails: defaultDetails, gamePlayers: [userDetails.username]});
    const newGame = { gameHost: userDetails.username, gameDetails: defaultDetails, gameLobby: [] };
    const game = await Game.create(newGame);
    await game.save();

    res.status(201).send("Game created successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

 router.get('/gamelist', (req, res) => {
    //Game.find({$where:'this.gameLobby.length < 2'}).then(function (users) {
    Game.find({}).then(function (users) {
        /* const lobbyInfo = users.map() */
        let nonFullLobbies = users.filter((user) => user.gameLobby.length < 2);
        let lobbyInfo = nonFullLobbies.map((user) => {return {gameId: user.id, gameTitle: user.gameDetails.title, host: user.gameHost, playercount: user.gameDetails.players.length, stage: user.gameDetails.stage, date: user.createdAt}})
        console.log('typeof users' , lobbyInfo);
        res.send(lobbyInfo);
    });
});

router.post('/joingame', async (req, res) => {
  const { gameId, gameTitle } = req.body;
  console.log(gameId);
  console.log('joingame session username test - L87:', req.session.username);
   try 
   {
    /* const gameToJoin = Game.findById(gameId).select('*').exec(); */
    const gameToJoin = await Game.findById(gameId);
/*     const userDetails = await User.findById(req.session.userId).select(
      "-password"
    ); */
    console.log('gameToJoinResult:',gameToJoin.gameLobby.length);
    console.log('gamePLayers:', gameToJoin.gameDetails.players.some(player => player.name == req.session.username));

    if(gameToJoin.gameDetails.players.some(player => player.name == req.session.username)){
      console.log('player found in game');
      res.status(201).send('Joining Game Session!');
    }else if(gameToJoin.gameDetails.players.length < 4){
      let newPlayers = gameToJoin.gameDetails.players.push(
        {
          playerID: req.session.userId,
          name: req.session.username,
          motivation: "timid",
          suspicion: "medium",
          items: [],
          dossier: [],
          location: LocationDetails[0],
        },
      );
      console.log('gameDetails-playerslist POST push:', gameToJoin.gameDetails.players);

      const filter = { _id: req.session.userId};
      const query = { _id: gameId};
      //lobby is not static
      //const update = { gameDetails: gameToJoin.gameDetails, gameLobby: [...gameToJoin.gameLobby, {user: req.session.username}]};
      let defaultPlayer = {
        player: req.session.username,
        motivation: "timid",
        suspicion: "medium",
        items: [],
        dossier: [],
        location: 'Train Station',
      }
      //Update is required to add player to players attribute
      const update = { gameDetails: gameToJoin.gameDetails, gameLobby: [...gameToJoin.gameLobby]};
      //let updated = await Game.findOneAndUpdate(query, update);
      //let updated = await Game.findOneAndUpdate(query, {$set: {gameDetails: defaultPlayer}});
      let updated = await Game.findOneAndUpdate(query, {$set: {gameDetails: newPlayers.gameDetails}});
      console.log('updated', updated);
      

      
      console.log('Player added to game!');
      res.status(201).send('Player added to game!');
    }else{
      console.log('Player not found');
      res.status(404).send('Player not found');
    }


    
   } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
   }
    
});

router.post('/joinlobby', async (req, res) => {
  const { gameId, gameTitle } = req.body;
  
  console.log('[game.js - JoinLobby prior try catch]');

  const gameToJoin = await Game.findById(gameId);

  console.log('/joinGame - game to join: ', gameToJoin );
  if(!gameToJoin.gameLobby.some(user => user.userId === req.session.userId))
    {
       let myCharacter = gameToJoin.gameDetails.players.find(user => user.playerID === req.session.userId);
       console.log("gamejs - my Character 169", myCharacter);
       console.log("gamejs - my Character 1170",gameToJoin.gameDetails.players , req.session.userId )
       gameToJoin.gameLobby.push({userId: req.session.userId, userName: req.session.username, lastActive: new Date(), character: myCharacter ? myCharacter.character.name : null, ready: false});
    }

  await gameToJoin.save().then(() => {
    res.status(200).send('Joined the lobby')
  }).catch((error) => {
    console.error(error.message)
    res.status(500).send("Server is full!");
  });
/*   try {


    

  } catch (err) {
    //error = err;
    //throw new Error(err);
    //res.status(500).send(err.message);
  } */
});

/* router.post('/removegame', async (req, res) => {
  //What if game is deleted while player is in it?
  const { gameId, gameTitle } = req.body;
  //const gameToJoin = await Game.findById(gameId);
  await Game.deleteOne({_id: gameId}).then(function(){
    console.log("Deleted game.");
    res.status(204).send('Game deleted.');
  }).catch(function(error){
    console.log(error);
    res.status(404).send('Game could not be found.');
  })
}); */

module.exports = router;

/* import { PORT, mongoDBURL } from "./config"; */
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");

const Game = require("./models/gameModel");
//Potentially remove User because feeling iffy about allowing access directly to it, outside of login.
const User = require("./models/userModel");

const app = express();
const http = require('http');
const { Server } = require("socket.io");

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};

//import characters from './characters.mjs';
const characters = require("./characters");
const LocationDetails = require("./LocationDetails");

// MongoDB Connection
mongoose.connect(process.env.MONGODBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log('Connected to MongoDB!');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use(cors(corsOptions));
app.use(express.json());


const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl: process.env.MONGODBURL,
      collectionName: 'sessions',
      autoRemove: 'interval',
      autoRemoveInterval: 10
  }),
  cookie: {
      maxAge: 1000 * 60 *  60 * 24, // 1 day
      secure: false, // Set to true if using HTTPS
      httpOnly: true
  }
});
app.use(sessionMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
const server = http.createServer(app);

app.post('/register', async (req, res) => {
    res.status(200).send('Login succesful');
} );

app.get('/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

app.get('/register', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

// Grace period in milliseconds (e.g., 5 minutes)
const GRACE_PERIOD = 5 * 60 * 1000;

const io = new Server(server,{
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: GRACE_PERIOD, 
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: false,
  }
});

//io.engine.use(sessionMiddleware);
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

const activeUsers = new Set();

/* const gameStream = Game.watch();

gameStream.on("change", (change) => {
  if(change.operationType === "update"){
    const updatedGameId = change.documentKey._id;

    console.log(`Game ${updatedGameId} updated, notifying players...`);
    console.log(`Game change ${change}`);
  };
}); */

io.on("connection", async (socket) => {

  const session = socket.request.session;

  if(!session.userId){
    console.log(`Unauthenticated user attempted to connect: ${socket.id}`);
    return socket.disconnect(true);
  }


  if(socket.recovered) {
    console.log(`Recovered session for user ${session.username}`);

    activeUsers.add(session.userId)

  } else {
    console.log(`New session for user ${session.username}`);
    activeUsers.add(session.userId);
  }


  socket.on('testSock', () => {
    console.log('TestSOCK WORKS');
  })

  const detailsFormat = (room,result) => {
    //Remove IDs from list of players
    let players = result.gameLobby.map((lobbyEntry) => {
      let {playerID, player, ...playerSave} = result.gameDetails.players.find(
        (element) => element.playerID === lobbyEntry.userId
      );
      return {
        name: lobbyEntry.userName,
        ...playerSave
      };
    });

    let items = result.gameDetails.itemInfo.filter((itemLocation) => itemLocation.itemState && itemLocation.itemState != "concealed");

    let updatedLocations = [...LocationDetails];
    for (const item of items) {
      let locationItemIndex = updatedLocations.findIndex((location) => location.name === item.name);
      updatedLocations[locationItemIndex].item = item.item;
      updatedLocations[locationItemIndex].itemState = item.itemState;
    }

    for (let i = 0; i < updatedLocations.length; i++){
      if(updatedLocations[i].textContent?.length > 2){
        let itemRevealed = items.find(itemDetails => itemDetails.name === updatedLocations[i].name);
        if(!itemRevealed){
          updatedLocations[i].itemState = "concealed";
        }
      }
    }

    let finalFormat = {
      stage: result.gameDetails.stage,
      turnPhase: result.gameDetails.turnPhase,
      deputies: result.gameDetails.deputies,
      dissentTrack: result.gameDetails.dissentTrack,
      players: players,
      items: items,
      locations: updatedLocations
    };

    io.in(room).emit('startup', finalFormat);
  } 

  socket.on('joinRoom', async (room) => {
    console.log("NEW CODE");
    if(room){
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);

      //Update lobby for people in lobby.
      await Game.findById(room).then(result => 
        {
          const transmutedResults = result.gameLobby.map((lobbyEntry) => {
            let existingCharacterInfo = result.gameDetails.players.find(
              (element) => element.playerID === lobbyEntry.userId
            )?.character;

            
            return {
              ...lobbyEntry,
              existingChar: {...existingCharacterInfo} || null ,
            };
          });
          
          const finalResults = transmutedResults.map(({userId, ...rest}) => rest);
          console.log('joinroom with exisitng character', transmutedResults.map(({userId, ...rest}) => rest));
          
          
          console.log('joinroom lobby return', result.gameLobby);
          //console.log('wew');
          io.to(room).emit('renderLobby', transmutedResults.map(({userId, ...rest}) => rest));
          //callback({lobby: result.gameLobby});
          socket.to(room).emit('message', `User ${socket.id} has joined the room`);
        }
      ).catch(error => {
        console.error(error);
        socket.to(room).emit('error', 'Game COuld not be found.');
      })
    }
    
  });

  socket.on('sendMessage', ({room, message}) => {
    console.log(`Message from ${socket.id} in room ${room}: ${message}`);
    console.log('socketSession', socket.request.session);
    io.to(room).emit('message', {chatter:session.username, message: message});
  });

  // Being called from game.jsx
  socket.on('getLobby', async (room) => {
      //let gameLobby = await Game.findOne({ _id: room}).select('gameLobby');
      await Game.findById(room).then( result => 
        {
          const transmutedResults = result.gameLobby.map((lobbyEntry) => {return {...lobbyEntry, existingChar: result.gameDetails.players.find((element) => element.playerID === lobbyEntry.userId)}});
          console.log('getLobby with exisitng character', transmutedResults);

          console.log('joinroom lobby return', result.gameLobby);
          
          console.log('wew');
          io.to(room).emit('renderLobby', transmutedResults);
          socket.to(room).emit('message', `User ${socket.id} has joined the room`);
        }
      ).catch(error => {
        console.error(error);
        socket.to(room).emit('error', 'Game COuld not be found.');
      })

/*       await Game.findById(room).then(result => 
        {
          const transmutedResults = result.gameLobby.map((lobbyEntry) => {
            let existingCharacterInfo = result.gameDetails.players.find(
              (element) => element.playerID === lobbyEntry.userId
            )?.character;

            
            return {
              ...lobbyEntry,
              existingChar: {...existingCharacterInfo} || null ,
            };
          });
        }) */
      
      //console.log("gameLobby",gameLobby);
      //io.to(room).emit('renderLobby', gameLobby);
  })

  socket.on('gameSetup', async (room) => {
    //let gameLobby = await Game.findOne({ _id: room}).select('gameLobby');
    /* await Game.findById(room).then( result => 
      {
        const transmutedResults = result.gameLobby.map((lobbyEntry) => {return {...lobbyEntry, existingChar: result.gameDetails.players.find((element) => element.playerID === lobbyEntry.userId)}});
        console.log('getLobby with exisitng character', transmutedResults);                
        io.to(room).emit('renderLobby', transmutedResults);
        socket.to(room).emit('message', `User ${socket.id} has joined the room`);
      }
    ).catch(error => {
      console.error(error);
      socket.to(room).emit('error', 'Game Could not be found.');
    }) */

    await Game.findById(room).then(result => 
      {
 
        let players = result.gameLobby.map((lobbyEntry) => {
          let {playerID, player, ...playerSave} = result.gameDetails.players.find(
            (element) => element.playerID === lobbyEntry.userId
          );
          return {
            name: lobbyEntry.userName,
            ...playerSave
          };
        });
    

        let items = result.gameDetails.itemInfo.filter((itemLocation) => itemLocation.itemState && itemLocation.itemState != "concealed");



        let finalResults = {
          stage: result.gameDetails.stage,
          turnPhase: result.gameDetails.turnPhase,
          deputies: result.gameDetails.deputies,
          dissentTrack: result.gameDetails.dissentTrack,
          players: players,
          items: items
        };

        //console.log("detailsFormat", detailsFormat(result));

        //console.log("TransmutedResults gameStart", finalResults);
        //io.in(room).emit('startup', finalResults);
        //io.in(room).emit('startup', detailsFormat(result));
        detailsFormat(room, result);
      });
    
    /* console.log("gamedetials", room); */

/*     await Game.findById(room).then(result =>
      console.log(result)
    ) */
});

  socket.on('selectChar', async ({room, char}) => {
    console.log(`SelectChar-room:${room}, selecChar-char${char}`);
    try {

      const characterInGame = await Game.findOne({_id: room, "gameDetails.players.character.name":char});
      const characterInLobby = await Game.findOne({_id: room, "gameLobby.character.name":char});
      if(characterInGame || characterInLobby){
        socket.emit('character', 'Character already selected.');
        console.log('Char already selected.')
      } else {
        await Game.findOneAndUpdate({_id:room, "gameLobby.userId" : session.userId},
          {$set: { "gameLobby.$.character" : char}},
          {new: true}
        ).then((result) => {
          console.log(`Game updated: ${result}`);
        }).catch((error)=> console.error(error));
      }

      ///PRIOR VERSION - only checks in game
/*       console.log('CharacterInGame', characterInGame);
      if(!characterInGame){
        console.log("!CharacterInGame");
        console.log("SelectedCharacterDetails:", characters[char]);
       await Game.findOneAndUpdate({_id:room, "gameDetails.players.playerID": session.userId},
          {$set: { "gameDetails.players.$.character" : characters[char]}},
          {new: true}
        ).then((result) => {
          console.log(`Game updated: ${result}`);
        }).catch((error)=> console.error(error));

      } else {
        socket.emit('character', 'Character already selected.');
        console.log('Char already selected.')
      } */

    } catch (error) {
      console.error(error);
    }
    //io.to(room).emit('selections', updatedGame.gameDetails)
  });

  socket.on('movePlayer', async ({room, newPos}) => {
    //console.log(newPos.location.id);
    console.log(newPos.id);
    //const location = LocationDetails.find(locationDetail => locationDetail.id == newPos.location.id);
    const location = LocationDetails.find(locationDetail => locationDetail.id == newPos.id);
    if(location){
      await Game.findOneAndUpdate({_id:room, "gameDetails.players.playerID" : session.userId},
        {$set: { "gameDetails.players.$.location" : location}},
        {new: true}
      ).then((result) => {
        console.log(`${session.username} location updated: ${location.id}`);
        let moveResult = result.gameDetails.players.map(
          ({ playerID, player, ...rest }) => {
            let { _id, username } = player;
            return { name: username, ...rest };
          }
        );

        console.log(moveResult);
        io.in(room).emit('move', moveResult);
        //io.in(room).emit('move', );
      }).catch((error)=> console.error(error));
      io.to(room).emit('message', `new Position: ${JSON.stringify(location)}`);
      
    }
    //io.to(room).emit('message', `new Position: ${newPos}`);
    
    //console.log(LocationDetails.find(locationDetail => locationDetail.id == newPos.location.id));
  });


  socket.on('disconnect', async () => {
    // Refreshing pages disconnects user.
    console.log("disconnect fired for ", session.userId);
    activeUsers.delete(session.userId);

    // Schedule a removal check after GRACE_PERIOD
/* setTimeout(async () => {
  // Check if the user has reconnected (socket.recovered will be true)
  console.log('disconnect timeout fired');
  const sessions = await Game.find({'gameLobby.userId': session.userId});
  let isStillInSession;

  if(sessions.length > 0) {
    isStillInSession = sessions.some((gameSession) =>
    gameSession.gameLobby.some((player) => player.userId === session.userId));
  };

  if(!isStillInSession) {
    console.log(`Player ${session.username} is no longer recoverable and will be removed.`);
    // Remove player from game sessions
    await Game.updateMany(
      {'gameLobby.userId': session.userId},
      { $pull: { players: {userId: session.userId}}}
    );

    // Notify rooms
    sessions.forEach((gameSession) => {
      io.to(gameSession._id).emit('renderLobby', gameSession.gameLobby);
    })

  } else {
    console.log(`Player ${session.username} reconnected successfully.`);
  }
}, GRACE_PERIOD); */

/*     await Game.updateMany(
      {"gameLobby.userId": session.userId},
      { $pull: { gameLobby: {userId: session.userId}}}
    ).then(result => {
      console.log("List of pulled games:", result);
    }).catch(error => {
      console.error('Error:', error);
    }); */

  });

  socket.on('updateEnvelopeState', async({room, currentLocation, newEnvelopeState})=>{

/*     let daGame = await Game.findOne(
      {_id: room}, "gameDetails"
    );
    daGame.gameDetails.itemInfo.find()

    console.log("daGame", daGame); */

    
/*     await Game.findOneAndUpdate({_id:room, "gameDetails.itemInfo.name" : currentLocation},
      {$set: { "gameDetails.itemInfo.$.itemState" : newEnvelopeState}},
      {new: true}
    ) */

    await Game.findOneAndUpdate({_id:room, "gameDetails.itemInfo.name" : currentLocation},
      {$set: { "gameDetails.itemInfo.$.itemState" : newEnvelopeState}},
      {new: true}
    ).then((result) => {
      console.log("updateEnvelopeState result:", result);
      if(newEnvelopeState == 'collected'){
        console.log('I am collected');
        ///let theItem = Game.findOne({_id:room, "gameDetails.itemInfo.name":currentLocation})
          let locationItem = result.gameDetails.itemInfo.filter(item => item.name == currentLocation);
          console.log('locationItem', locationItem);
          console.log('locationItem', locationItem[0]);
/*           let wew = result.gameDetails.players.find(pId => pId.playerID == session.userId).items;
          wew.push(locationItem[0]);
          console.log('locationItem2', wew);
          result.save(); */
        return Game.findOneAndUpdate({_id:room, "gameDetails.players.playerID" : session.userId},
          {$push: { "gameDetails.players.$.items" : locationItem[0].item}},
          {new: true}
        ).then((collectedResults)=>{
            detailsFormat(room, collectedResults);
          }
        );
      } else {
        detailsFormat(room, result);
      }


      //io.in(room).emit('boardStateUpdate', moveResult);
      //io.in(room).emit('move', );
    }).catch((error)=> console.error(error));
  })


  socket.on('leaveSession', async ({room}) => {
    //session.userId
    //const gameSessions = await Game.find({gameLobby: session.userId});
/*     const currentGame = await Game.findById(room);
    console.log('[Leave Session] - Game', currentGame); */
    console.log('A user left game:', session.username);

    //disconnect(room);
    await Game.findOneAndUpdate(
      { _id: room},
      { $pull: { gameLobby: {userId: session.userId}}},
      { new:  true}
    ).then(result => {
      //console.log('Update result:', result);
      socket.leave(room);
      io.to(room).emit('message', `User ${session.username} has disconnected`);
      io.to(room).emit('renderLobby', result.gameLobby);

      
      if(result.gameLobby.length < 2 || !array.length) {
        io.to(room).emit('endGame', 'Not enough players');
      };
    }).catch(error => {
      console.error('Error:', error);
    });
/*     await Game.updateOne(
      { _id: room},
      { $pull: { gameLobby: {userId: session.userId}}}
    ).then(result => {
      console.log('Update result:', result);
    }).catch(error => {
      console.error('Error:', error);
    }); */

    //if(currentGame.gameLobby.includes(session.userId))
/*     if(currentGame.gameLobby.some(user => user.userId === session.userId))
      {
        console.log('[Leave Session] - User Id Found!', session.userId);
          //currentGame.gameLobby.pull(session.userId);

          await currentGame.save();
          socket.to(room).emit('message', `User ${session.username} has left the room`);
      } */
    
  });

  socket.on('reconnect_attempt', () => {
    console.log('Client attempting to reconnect...');
  });

  socket.on('readyLobby', async ({room}) => { 
    console.log('[readLobby socket Firing - 302]');
    //https://www.mongodb.com/docs/manual/reference/operator/update/positional/
    try {
      const updatedGame = await Game.findOneAndUpdate({_id: room, "gameLobby.userId": session.userId},
        {$set: { "gameLobby.$.ready" : true}},
        {new:true}
      );  

      console.log("gameLobby", updatedGame.gameLobby);

      //io.to(room).emit('readies', updatedGame.gameLobby);
      io.in(room).emit('renderLobby', updatedGame.gameLobby);

      if(updatedGame.gameLobby.filter((playo) => playo.ready !== true) < 1){
        console.log('[readyLobby] - postFilter:',updatedGame.gameLobby);
        
        updatedGame.gameLobby.forEach(async player => {
          console.log("[GUNNO] - forEach - player:", player.userId);

          
          if(updatedGame.gameDetails.players.find(playerDetail => playerDetail.playerID === player.userId)) {
             
            console.log(`${player.userId}'s has an account:`, updatedGame.gameDetails.players.find(playerDetail => playerDetail.playerID === player.userId));
              await Game.updateOne({_id: room, "gameDetails.players.userId": player.userId},
                {$set: { "gameDetails.players.$.character" : characters[player.character]}},
              ).then((result) => {
                console.log(`Player Profile Updated!`);
              }).catch((error)=> console.error(error));

            } else {

              const detailSave = {
                playerID: player.userId,
                player: await User.findById(player.userId).select("username"), // Do I really want to be accessing User here? Maybe feed it via frontend instead?
                motivation: "timid",
                suspicion: "medium",
                items: [],
                dossier: [],
                location: LocationDetails[0],
                character: characters[player.character]
              };
              await Game.updateOne({_id: room},
                { $push: { 'gameDetails.players': detailSave}}
              ).then((result) => {
                console.log(`${player.userId} profile added!`);
              }).catch((error)=> console.error(error));

            }
        });
        //For each player in the lobby, if they have details update the details, if not push the details.
        io.in(room).emit('startGame');
      }
      
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('loadBoard', async ({room}) => {
     let daGame = await Game.findOne(
      {_id: room}, "gameDetails"
    );
    //console.log('daGame', daGame);
      let gameDetails = daGame.gameDetails;
      /* gameDetails.players = gameDetails.players.map(({playerID, player, location,...rest}) => 
        {
          return {...rest,
            username: player.username,
            location: location.name
          }
        }); */
       gameDetails.players = gameDetails.players.map(({playerID, player,...rest}) => 
        {
          return {...rest,
            username: player.username
          }
        });
      gameDetails.itemInfo = gameDetails.itemInfo.filter(locale =>  locale.itemState && locale.itemState !== "concealed");
      console.log('daGameDetails',gameDetails);
      io.in(room).emit('setBoard', gameDetails);
    
  
  
});

  socket.on('conspire', async ({room, amount})=> {
    let dieResults = [];
    if(amount <= 10 && amount > 0) {
      for(let i = 0; i < amount;  i++) 
          {
              dieResults.push(Math.floor(Math.random() * 6)+1);
          }
      } else {
          dieResults.push(Math.floor(Math.random() * 6)+1);
      }
      

  })
  

  setInterval(async () => {
    
    const allGameSessions = await Game.find({});
  
    for (const gameSession of allGameSessions) {

      const room = gameSession.id;

      const updatedPlayers = gameSession.gameLobby.filter((player) => activeUsers.has(player.userId));

      if (updatedPlayers.length !== gameSession.gameLobby.length) {
        console.log(`Removing stale players from session ${room}`);
        gameSession.gameLobby = updatedPlayers;
        await gameSession.save();

              // Notify all connected clients in the session
  /*        io.to(gameSession._id).emit(
         'renderLobby',
         gameSession.gameLobby
        ); */
        console.log(`Session_id: ${room} ${JSON.stringify(updatedPlayers)}`);
        io.to(room).emit('renderLobby', updatedPlayers);
        //io.to(gameSession._id).emit('renderLobby', /* gameSession.gameLobby */ updatedPlayers);
        const clients = io.sockets.adapter.rooms;
        console.log("clientsCheck:",clients);
      }

  /*      Gsession.gameLobby = Gsession.gameLobby.filter((player) =>
        activeSockets.includes(player.userId)
      );
      await session.save(); */
    }
  }, 60000); // Run every minute

});





server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Game = require("../models/gameModel");
/* const session = require("express-session"); */

const saltRounds = 10;

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log("Username:", req.body);
  /*     try {
        if (!request.body.username ||
            !request.body.password) 
        {
          return response.status(400).send({
            message: 'Send all required fields: title, author, publishYear',
          });  
        }
        const newUser = {
            username: request.body.username,
            password: request.body.password,
        };

        const user = await User.create(newUser);
        return response.status(201).send(user);

    } */

  try {
    const newUser = { username: username, password: password };
    const user = await User.create(newUser);
    await user.save();
    /* const newUser = await User.create(user);  */
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async function (req, res) {
  const { username, password } = req.body;
  // console.log('username',username);
  // console.log('password',password);
  try {
    const user = await User.findOne({ username });
    /*         if (!user) {
            return res.status(400).send('Invalid username or password');
        } */
    const isMatch = await user.comparePassword(password);
    if (!isMatch || !user) {
      return res.status(400).send("Invalid username or password");
    }
    req.session.userId = user._id.toString(); // Ensure the ID is stored as a string
    req.session.username = user.username.toString();
    console.log("login session userID", req.session.userId);
/*     request.session.save(); */
    res.status(200).send("Login succesful");
    /* res.status(200).send('Login succesful'); */
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/profile", async (req, res) => {
  console.log("profile sessions userid", req.session.userId);
  console.log("profile sessions", req.session);
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const user = await User.findById(req.session.userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/logout", async (req, res) => {
  console.log("logout sessions", req.session.userId);
  /*     req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.clearCookie('connect.sid'); // Optional: clear the cookie from the client side
        res.status(200).send('Logout successful');
    }); */
});
router.delete("/logout", async (req, res) => {



    if(req.session) {

      await Game.updateMany(
        { 'gameLobby.userId': req.session.userId},
        { $pull: { gameLobby: {userId: req.session.userId}}},
      );

        req.session.destroy(err => {
            if(err) {
                res.status(400).send('Unable to log out.');
            } else {
                res.clearCookie('connect.sid');
                res.send('Logout successful.');
            }
        });
    } else {
        console.log('No session exists');
        res.end();
    }
 /*  console.log("logout sessions", req.session.userId);
  session.store.destroy(req.session.id); */
/*   req.session.userId = null;
  req.session.save(function (err) {
    if (err)  return res.status(500).send('Could not log out.');
    req.session.regenerate(function (err) {
      if (err)  return res.status(500).send('Could not log out.');
      res.clearCookie('connect.sid');
      res.status(200).send('Logout successful');
    });
  }); */
  /*     req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.clearCookie('connect.sid'); // Optional: clear the cookie from the client side
        res.status(200).send('Logout successful');
    }); */
});

/* router.post('/logout', (req, res) => {
    const sessionId = req.session.userId;
    console.log('logout', req.session);
    req.session.store.destroy(sessionId, (err2) => {
        if(err2){
            console.log('Error destroying session in store:', err2);
        } else {
            console.log('Session destroyed in store');
        }
    })
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.clearCookie('connect.sid'); // Optional: clear the cookie from the client side

        res.status(200).send('Logout successful');
    });
});
 */

/* router.post('/logout', (req, res, next) => {
    console.log('Session to destroy:', req.session.userId);
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Could not log out.');
      } else {
        res.clearCookie('connect.sid')
        res.status(200).send('Logout successful');
      }
    })
  });
 */

module.exports = router;

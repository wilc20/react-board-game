import React, { useEffect, useState, useRef, useContext } from "react";
import { redirect, useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import { UserContext, useUserContext } from "../context/userContext";


import LobbyEntry from "../components/LobbyEntry";
import classes from "./Home.module.css";
import List from "../components/List";
import axios from "axios";
import Modal from "../components/Modal";
//import { useUser } from "../context/userContext";
import { UserContext } from "../App";

const fetchGames = async (gamesSetter) => {
  axios
    .get("http://localhost:8801/api/game/gamelist", {
      withCredentials: true,
    })
    .then((res) => {
      console.log(res.data);
      gamesSetter([...res.data]);
    })
    .catch((err) => {
      console.error(err);
    });
};


const Home = () => {
  const [games, setGames] = useState(null);
  const [name, setName] = useState({ title: "" });

  const navigate = useNavigate();
  const createGameDialog = useRef();
  //const {username} = useOutletContext();
  //const {user} = useContext(UserContext);
  //const { username } = useUser();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    console.log("useEffect");
/*     const fetchGames = async () => {
      axios
        .get("http://localhost:8801/api/game/gamelist", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setGames([...res.data]);
        })
        .catch((err) => {
          console.error(err);
        });
    }; */

/*     const fetchUser = async () => {
      console.log("inside async");
      axios
        .get("http://localhost:8801/api/auth/profile", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(JSON.stringify(res));
          fetchGames();
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }; */


    fetchGames(setGames);
  }, []);

  const handleLogout = async () => {
    axios
      .delete("http://localhost:8801/api/auth/logout", {
        withCredentials: true,
        credentials: "include",
      })
      .then((res) => {
        console.log(res);
        navigate('/login');
      })
      .catch((err) => console.error(err));
  };

  const handleCreate = async () => {
    axios
      .post("http://localhost:8801/api/game/newGame", name, {
        withCredentials: true,
        credentials: "include",
      })
      .then((res) => {
        console.log(JSON.stringify(res));
      })
      .catch((err) => console.log(err));
  };

  const handleInput = async (event) => {
    setName({ title: event.target.value });
  };
  

  const handleJoin = async (gameId) => {
    console.log("gameId", gameId);
    console.log("HANDLEJOIN", gameId);
    try {
     await axios.post(
        "http://localhost:8801/api/game/joinlobby",
        { gameId: gameId },
        {
          withCredentials: true,
          credentials: "include",
        }
      ).then(() => {navigate('/game',{state:{gameId:gameId,name:'sabaoon'}});});
      //return gameId;
      
    } catch (error) {
      console.log("error:",error);
      return false;
    }

  };
  

  return (
    <main className={classes.background}>
{/*       <dialog ref={createGameDialog}>
        <p>Something</p>
        
        <form method="dialog">
          <button>Close</button>
        </form>
      </dialog> */}
      <Modal ref={createGameDialog} submitButton={{title: 'Create Gem', action: () => {handleCreate(); createGameDialog.current.close();}}}>
        <p>Game title:</p>
        <input onChange={handleInput} value={name.title} />
{/*         <button className={classes.create} onClick={() => {createGameDialog.current.showModal()}}>
            Create Game
        </button> */}
      </Modal>
      <article className={classes.lobby}>
        <h1>Welcome {user}</h1>
        <div className={classes[`lobby-header`]}>
          <h2>Lobby</h2>
          <button onClick={() => {fetchGames(setGames)}}>Refresh</button>
        </div>
        <List className={classes[`lobby-list`]}>
          {games &&
            games.map((game) => (
              <LobbyEntry
                key={"e" + game.gameId}
                name={game.gameTitle}
                host={game.host}
                stage={game.stage}
                date={game.date}
                open={game.playercount < 4}
                joinSession={() => handleJoin(game.gameId)}
              />
            ))}
        </List>
        {/*         <ul className={classes["lobby-list"]}>
         {['1','2','3','4','5','6','7','8'].map((e) => <LobbyEntry
            key={"e"+e}
            name="
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet fringilla velit. 
                Donec tincidunt mauris in neque interdum vestibulum quis vel nunc. Nam tempus velit id 
                leo vestibulum ullamcorper. Proin dapibus tempus libero vel condimentum. Pellentesque 
                congue turpis a lorem malesuada, vel euismod nisi sodales. Vivamus lobortis consectetur 
                velit at dictum. Maecenas ac justo sit amet nunc commodo porttitor. Sed eleifend sceler
                isque hendrerit."
            open={true}
            joinSession={(sessionname) => {
              console.log("Joining: ", sessionname);
            }}
          />)}
        </ul> */}
        <button className={classes.create} onClick={handleLogout}>
          Logout
        </button>
        <div>
          <button className={classes.create} onClick={() => {createGameDialog.current.showModal()}}>
            Create Game
          </button>
        </div>
      </article>
    </main>
  );
};

export default Home;

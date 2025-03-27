import React, {useState} from 'react';
import { Link} from 'react-router-dom';
import classes from "../pages/Home.module.css";
import { redirect } from 'react-router-dom';


const LobbyEntry = ({name, host, stage, date, open = false, joinSession}) => {
  const [session, setSession] = useState(false);

  const sessionHandler = async () => {
    const response = await joinSession(name);
    if(response){
      console.log("redirecting");
      redirect("/login");
    }
    return null;
  }

  return session ? redirect('/login') :(
    <li className={classes[`lobby-entry`]}>
        <div className={classes[`lobby-entry-info`]}>
          <div>
            <h5>Name: {name}</h5>
            <h5>Host: {host}</h5>
          </div>
          <div>
            <h5>Stage: {stage}</h5>
            <h5>Created at: {date}</h5>
          </div>
        </div>
        <button onClick={() => joinSession(name)} disabled={!open}>Join!</button>
        {/* <button onClick={joinSession(name)} disabled={!open}>Join!</button> */}
        {/* <Link to={`/Lobby/${name}`} disabled={!open} game={joinSession(name)}>Join!</Link> */}
    </li>
  )
}

export default LobbyEntry
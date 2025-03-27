import axios from "axios";
import { redirect } from "react-router-dom";

const fetchUser = async () => {
    //console.log("inside async");
    axios
      .get("http://localhost:8801/api/auth/profile", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(JSON.stringify(res));
        //fetchGames();
      })
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });

      return
  };

  const fetchTest = async () => {
      try {
        const { data: response } = await axios.get("http://localhost:8801/api/auth/profile", {
            withCredentials: true,
          });
        return response;
      } catch (error) {
        console.log(error);
        return(false);
      }
  }


export async function checkAuthLoader () {
    const auth = await fetchTest();
    console.log(auth);
    console.log('AuthLoader');
/*     if(!auth) {
        return redirect('/login');
    } else {
        console.log('SAFE!');
    } */

    /* return null; */
    return auth;
}
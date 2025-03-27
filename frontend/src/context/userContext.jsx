import { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}) => {
  const [username, setUsername] = useState('Nothing');

  return (
    <UserContext.Provider value={{username, setUsername}}>
      {children}
    </UserContext.Provider>
  )
};

/* export function UserProvider({ children }) {
  const [username, setUsername] = useState(() => {
    const storedUsername = 'username'//localStorage.getItem('username');
    console.log('UserProvider initialized, restoring username:', storedUsername);
    return storedUsername || '';
  });

  useEffect(() => {
    console.log('Username updated:', username);
    //localStorage.setItem('username', username);
  }, [username]);

  useEffect(() => {
    console.log('UserProvider mounted');
    return () => {
      console.log('UserProvider unmounted');
    };
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}

 */
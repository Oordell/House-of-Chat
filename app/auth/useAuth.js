import { useContext } from "react";

import AuthContext from "./context";
import authStorage from "./storage";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (user) => {
    setUser(user);
    authStorage.storeUser(user);
  };

  const logOut = () => {
    setUser(null);
    authStorage.removeUser();
  };

  const updateUser = async (user) => {
    setUser(user);
    await authStorage.removeUser();
    authStorage.storeUser(user);
  };

  return { user, logIn, logOut, updateUser };
};

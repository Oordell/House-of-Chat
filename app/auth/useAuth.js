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

  return { user, logIn, logOut };
};

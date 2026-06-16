import { createContext, useState, useEffect } from "react";
import axios from "../utils/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLogin, setLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get("/api/user");
        setUserInfo(res.data);
        setLogin(true);
      } catch (error) {
        setUserInfo(null);
        setLogin(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        setLogin,
        userInfo,
        setUserInfo,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLogin, setLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const login = localStorage.getItem("isLogin");
    const user = localStorage.getItem("userInfo");

    if (login && user) {
      setLogin(true);
      setUserInfo(JSON.parse(user));
    } else {
      setLogin(false);
      setUserInfo(null);
    }

    setLoading(false);
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
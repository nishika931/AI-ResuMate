import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const withAuthHOC = (WrappedComponent) => {
  return (props) => {

    const navigate = useNavigate();

    const { setLogin } = useContext(AuthContext);

    const isLoggedIn = localStorage.getItem("isLogin");

    useEffect(() => {

      if (!isLoggedIn) {
        setLogin(false);
        navigate("/");
      }

    }, [isLoggedIn, navigate, setLogin]);

    if (!isLoggedIn) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withAuthHOC;
import React, { useContext } from "react";
import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { AuthContext } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const Login = () => {
  const { isLogin, setLogin, userInfo, setUserInfo } = useContext(AuthContext);

  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (!result.user) return;

      const user = result.user;

      const userData = {
        name: user.displayName,
        email: user.email,
      };

      await axios
        .post("/api/user", userData)
        .then((response) => {
          setUserInfo(response.data.user);
          localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        })
        .catch((err) => {
          console.log(err);
        });

      setLogin(true);

      localStorage.setItem("isLogin", "true");

      navigate("/dashboard");
    } catch (error) {
      console.log("Firebase Error:", error);
      console.log("Code:", error.code);
      console.log("Message:", error.message);
    }
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dashboard Background */}
      <div className="absolute inset-0 blur-md scale-105">
        
        <div className="h-full w-full bg-gradient-to-r from-purple-200 via-pink-100 to-blue-200"></div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Login Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div
          className="
          w-full
          max-w-md
          p-8
          rounded-3xl
          border border-white/20
          bg-white/10
          backdrop-blur-xl
          shadow-2xl
        "
        >
          <h1 className="text-3xl font-bold text-center text-white mb-3">
            Welcome to Resumate
          </h1>

          <p className="text-center text-white/80 mb-8">
            Continue with Google to access your dashboard
          </p>

          <button
            type="button"
            onClick={handleLogin}
            className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            bg-white
            text-gray-700
            p-3
            rounded-xl
            font-medium
            hover:scale-105
            transition
          "
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;

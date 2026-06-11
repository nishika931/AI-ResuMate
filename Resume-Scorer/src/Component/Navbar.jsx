import React, { useState, useContext } from "react";
import { MdLibraryBooks } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import withAuth from "../utils/HOC/withAuthHOC";
import { AuthContext } from "../utils/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoginPage = location.pathname === "/";
  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const { isLogin, setLogin, userInfo, setUserInfo } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userInfo");

    setLogin(false);
    setUserInfo(null);

    navigate("/");
  };
  if (isLoginPage) return null;

  return (
    <div
      className={`w-full px-4 transition-all duration-300 ${
        isLoginPage
          ? "bg-[#BDA6CE]/30 backdrop-blur-lg opacity-60 pointer-events-none"
          : "bg-[#BDA6CE]"
      }`}
    >
      <div className="flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <MdLibraryBooks className="text-2xl" />
          <span>ResuMate</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex flex-row gap-7">
          {["/dashboard", "/history"].map((path, i) => (
            <Link key={i} to={path}>
              <span
                className={`transition ${
                  isActive(path)
                    ? "text-white bg-[#3F2364]/40 px-2 py-1 rounded"
                    : "text-[#3F2364] hover:text-white"
                }`}
              >
                {path.replace("/", "").toUpperCase()}
              </span>
            </Link>
          ))}

          {userInfo?.role === "admin" && (
            <Link to="/admin">
              <span
                className={`transition ${
                  isActive("/admin")
                    ? "text-white bg-[#3F2364]/40 px-2 py-1 rounded"
                    : "text-[#3F2364] hover:text-white"
                }`}
              >
                ADMIN
              </span>
            </Link>
          )}

          <button onClick={handleLogout}>
            <span className="transition text-[#3F2364] hover:text-white hover:bg-[#3F2364]/40 px-2 py-1 rounded">
              <span className="text-red-600">LOGOUT</span>
            </span>
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden text-3xl cursor-pointer" onClick={toggleMenu}>
          {menuOpen ? <HiX /> : <HiMenu />}
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 pb-4">
          <Link to="/dashboard" onClick={toggleMenu}>
            <span className="block py-1">Dashboard</span>
          </Link>

          <Link to="/history" onClick={toggleMenu}>
            <span className="block py-1">History</span>
          </Link>

          {userInfo?.role === "admin" && (
            <Link to="/admin" onClick={toggleMenu}>
              <span className="block py-1">Admin</span>
            </Link>
          )}

          <button onClick={handleLogout} className="text-red-600">
            LOGOUT
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;

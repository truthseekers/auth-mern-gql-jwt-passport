import { useNavigate } from "react-router-dom";
import "../App.css";
import { useLogout } from "../utils/hooks";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();
  return (
    <div className={"flex list-style-none bg-lightgray"}>
      {user?.email && (
        <li
          className={"p-2 cursor-pointer underline blue"}
          onClick={() => logout()}
        >
          Logout
        </li>
      )}
      {!user?.email && (
        <>
          <li
            className={"p-2 cursor-pointer underline blue"}
            onClick={() => navigate("/login")}
          >
            login
          </li>
          <li
            className={"p-2 cursor-pointer underline blue"}
            onClick={() => navigate("/signup")}
          >
            Signup
          </li>
        </>
      )}
      <li
        className={"p-2 cursor-pointer underline blue"}
        onClick={() => navigate("/")}
      >
        home
      </li>
      <li
        className={"p-2 cursor-pointer underline blue"}
        onClick={() => navigate("/dashboard")}
      >
        Dashboard (requires login)
      </li>
      <li
        className={"p-2 cursor-pointer underline blue"}
        onClick={() => navigate("/someotherpage2")}
      >
        Some Other Page 2
      </li>
    </div>
  );
};

export default NavBar;

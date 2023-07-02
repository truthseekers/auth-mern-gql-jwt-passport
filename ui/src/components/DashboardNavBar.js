import { useNavigate } from "react-router-dom";
import "../App.css";
import { useLogout } from "../utils/hooks";

const DashboardNavBar = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  return (
    <div
      style={{ backgroundColor: "white", borderBottom: "1px solid black" }}
      className={"flex list-style-none justify-center"}
    >
      <li
        className={"p-2 cursor-pointer underline blue"}
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </li>
      <li
        className={"p-2 cursor-pointer underline blue"}
        onClick={() => navigate("/dashboard/someotherpage")}
      >
        Some other Page
      </li>
    </div>
  );
};

export default DashboardNavBar;

import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

function MainLayout() {
  return (
    <div className="App">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default MainLayout;

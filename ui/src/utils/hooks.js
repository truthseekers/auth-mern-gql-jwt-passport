import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Not a hook because hooks are called immediately. Just a function for now.
export function useLogout() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setLoading, setUser } = useAuth();
  const logout = () => {
    localStorage.setItem("accessToken", "");
    localStorage.setItem("refreshToken", "");
    setIsAuthenticated(false);
    setLoading(false);
    setUser({});
    navigate("/login");
  };
  return logout;
}

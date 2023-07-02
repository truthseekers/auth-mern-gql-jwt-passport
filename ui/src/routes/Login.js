import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useAuth } from "../context/AuthContext";
import { LOGIN_MUTATION } from "../graphql/mutations";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setLoading, setIsAuthenticated, setUser } = useAuth();

  const [login] = useMutation(LOGIN_MUTATION);

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    await login({
      variables: { email, password },
      onCompleted: (data) => {
        if (data.login.error) {
          setError(data.login.error);
          return; // isn't this supposed to take me out of the onCompleted?
        } else {
          localStorage.setItem("accessToken", data.login.accessToken);
          localStorage.setItem("refreshToken", data.login.refreshToken);
          localStorage.setItem("isRefresh", false);
          setLoading(false);
          setIsAuthenticated(true);
          setUser(data.login.user);
          navigate("/dashboard");
        }
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };

  return (
    <>
      <div className="flex wrap justify-center">
        <div style={{ width: "70%" }} className="flex wrap justify-center">
          <h3>Login</h3>
          <div className="break"></div>
          {state?.message && <h3 style={{ color: "red" }}>{state.message}</h3>}
          <div className="break"></div>
          {error && <h3 style={{ color: "red" }}>{error}</h3>}
          <div className="break"></div>
          <form onSubmit={formSubmitHandler}>
            <div>
              <label>Email</label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="email"
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="password"
              />
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

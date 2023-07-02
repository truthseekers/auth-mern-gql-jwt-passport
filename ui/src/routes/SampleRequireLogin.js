import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SampleRequireLogin = () => {
  const { user, isAuthenticated, loading: userLoading } = useAuth();
  const navigate = useNavigate();

  // I know there's a way to handle this with react-router-dom but too lazy to figure it out.
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [userLoading, isAuthenticated, navigate]);

  // fetch data above. only display content when fetching is complete
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  console.log("user: ", user);

  return (
    <div className="flex wrap justify-center">
      <div style={{ width: "70%" }} className="flex wrap justify-center">
        <h2>Upload Song as {user?.email}</h2>
        <div className="break"></div>
      </div>
    </div>
  );
};

export default SampleRequireLogin;

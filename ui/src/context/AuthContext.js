import React, { useState } from "react";
import { CURRENTUSER_QUERY, GET_USER } from "../graphql/queries";
import {
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
  TOKEN_MUTATION,
} from "../graphql/mutations";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

const AuthContext = React.createContext();

function useAuth() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

const AuthProvider = ({ navigation, ...props }) => {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginMutation, { data: loginData }] = useMutation(LOGIN_MUTATION);
  const [signupMutation, { data: signupData }] = useMutation(SIGNUP_MUTATION);
  const [getUser] = useLazyQuery(GET_USER);
  const [loading, setLoading] = useState(true);

  const [refreshTokenMutation, { data: refreshData }] =
    useMutation(TOKEN_MUTATION);

  // I should probably put this inside the login component, but then I can't "reuse" it in other places...
  // So.. this would be a hook then? It sets the user, so I'd pull the setState function from context and use it in the hook.
  //   const login = async ({ email, password }) => {
  //     await loginMutation({
  //       variables: { email, password },
  //       onCompleted: async (data) => {
  //         await RNSecureKeyStore.set("accessToken", data.login.accessToken, {
  //           accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
  //         });
  //         await RNSecureKeyStore.set("refreshToken", data.login.refreshToken, {
  //           accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
  //         });
  //         await RNSecureKeyStore.set("isRefresh", "false", {
  //           accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
  //         });
  //         setUser(data.login.user);
  //         setIsAuthenticated(true);
  //       },
  //     });
  //   };

  const signup = async ({ email, password, confirm, firstName, lastName }) => {
    await signupMutation({
      variables: { email, password, confirm, firstName, lastName },
      onCompleted: async (data) => {
        navigation.navigate("Login", {
          message: "Must confirm email before logging in!",
        });
      },
    });
  };

  //   const logout = async () => {
  //     await RNSecureKeyStore.set("accessToken", "", {
  //       accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
  //     });
  //     await RNSecureKeyStore.set("refreshToken", "", {
  //       accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
  //     });
  //     setUser({});
  //     setIsAuthenticated(false);
  //   };

  // console.log("user in context: ", user);

  // Why doesn't this cause an infinite loop? When the setUser changes the state in the context it should cause this whole thing to start over again.
  // in the REST version I have to use a useEffect when running fetch()
  useQuery(CURRENTUSER_QUERY, {
    onCompleted: async (data) => {
      console.log("1 authcontext currentUser complete: ", data);
      if (data.currentUser) {
        console.log("2. authcontext data.currentUser");
        getUser({
          variables: {
            userId: data.currentUser.id,
          },
          onCompleted: async (data) => {
            // console.log("user from getUser: ", data);
            setUser(data.user);
            setIsAuthenticated(true);
            setLoading(false);
          },
        });
      }
      if (!data.currentUser) {
        // console.log("3. authcontext !data.currentUser");
        localStorage.setItem("isRefresh", true);

        refreshTokenMutation({
          onCompleted: async (data) => {
            console.log("4. refreshToken onComplete");
            localStorage.setItem("accessToken", data.token?.accessToken);
            localStorage.setItem("isRefresh", false); // maybe?
            setUser(data?.token?.user);
            if (data?.token?.accessToken) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
            setLoading(false);
          },
          onError: async (data) => {
            console.log("5. refreshToken onError");
          },
        });
      }
    },
    onError: async (error) => {
      console.log("6 currentUserQuery error ", error);
    },
  });

  // console.log("Fucking piece of shit data: ", data);

  // console.log("in authcontext: loading", loading);

  const value = {
    user,
    setUser,
    // login,
    // // logout,
    loading,
    setLoading,
    isAuthenticated,
    setIsAuthenticated,
    // signup,
  };

  return <AuthContext.Provider value={value} {...props} />;
};

export { AuthProvider, useAuth };

// 1. on page load, run the CURRENT_USER query. see if they're logged in or not.
// 2. Store id only.
// 3. Use id to get the full user.
// 4. set state

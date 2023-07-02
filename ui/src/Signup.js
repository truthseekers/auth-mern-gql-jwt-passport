import React, { useState } from "react";
import NavBar from "./components/NavBar";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "./graphql/mutations";

// const SIGNUP_MUTATION = gql`
//   mutation (
//     $firstName: String!
//     $lastName: String!
//     $email: String!
//     $password: String!
//   ) {
//     signup(
//       firstName: $firstName
//       lastName: $lastName
//       email: $email
//       password: $password
//     ) {
//       user {
//         id
//         firstName
//         lastName
//         email
//       }
//       accessToken
//       refreshToken
//     }
//   }
// `;

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [confirm, setConfirm] = useState();
  const [toggleCheckbox, setToggleCheckbox] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [signup, { data }] = useMutation(SIGNUP_MUTATION);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    await signup({
      variables: { firstName, lastName, email, password, confirm },
      onCompleted: (data) => {
        // localStorage.setItem("accessToken", data.signup.accessToken);
        // localStorage.setItem("refreshToken", data.signup.refreshToken);
        // localStorage.setItem("isRefresh", false);
        setSubmitting(false);
        navigate("/login", {
          state: { message: "Confirm your email before logging in!" },
        });
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };

  const handleToggle = () => {
    setToggleCheckbox(!toggleCheckbox);
    if (!toggleCheckbox) {
    }
  };

  return (
    <>
      <div className="flex wrap justify-center">
        <div style={{ width: "70%" }} className="flex wrap justify-center">
          <h3>Sign up</h3>
          <div className="break"></div>
          {error && (
            <>
              <h3 style={{ color: "red" }}>{error}</h3>
              <div className="break"></div>
            </>
          )}
          <form onSubmit={formSubmitHandler}>
            {/* <div>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div> */}
            <div>
              <label>Email</label>
              <input
                type="text"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                name="password"
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            {/* <div>
              <label>I am an artist / Band</label>
              <input
                type="checkbox"
                name="password"
                checked={toggleCheckbox}
                onChange={() => handleToggle()}
                // onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {toggleCheckbox && (
              <div>
                <label>Artist / Band Name:</label>
                <input
                  type="text"
                  name="artist"
                  onChange={(e) => setArtist(e.target.value)}
                />
              </div>
            )} */}

            <div>
              <button disabled={submitting} type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;

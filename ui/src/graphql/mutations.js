import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation (
    $email: String!
    $password: String!
    $confirm: String!
    $firstName: String
    $lastName: String
  ) {
    signup(
      email: $email
      password: $password
      confirm: $confirm
      firstName: $firstName
      lastName: $lastName
    ) {
      user {
        email
        firstName
        lastName
        status
      }
      accessToken
      refreshToken
    }
  }
`;

export const TOKEN_MUTATION = gql`
  mutation {
    token {
      user {
        email
        firstName
        lastName
      }
      accessToken
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        firstName
        lastName
        email
      }
      error
      accessToken
      refreshToken
    }
  }
`;

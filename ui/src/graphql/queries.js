import { gql } from "@apollo/client";

export const CURRENTUSER_QUERY = gql`
  query {
    currentUser {
      email
      id
    }
  }
`;

export const GET_USERS = gql`
  query ($filter: String) {
    users(filter: $filter) {
      id
      email
      firstName
    }
  }
`;

export const GET_USER = gql`
  query getUser($userId: ID!) {
    user(id: $userId) {
      email
      firstName
      id
      lastName
    }
  }
`;

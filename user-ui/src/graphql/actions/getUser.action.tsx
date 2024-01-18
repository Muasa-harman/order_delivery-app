"use client";
import { gql, DocumentNode } from "@apollo/client";

export const GET_USER: DocumentNode = gql`
query GetLoggedInUser {
    getLoggedInUser {
      user {
        id
        name
        email
        password
        address
        phone_number
      }
      accessToken
      refreshToken
    }
  }
`;
























// "use client";
// import { gql, DocumentNode } from "@apollo/client";

// export const GET_USER: DocumentNode = gql`
//   query {
//     getLoggedInUser {
//       user {
//         id
//         name
//         email
//         password
//         address
//         phone_number
//       }
//       accessToken
//       refreshToken
//     }
//   }
// `;

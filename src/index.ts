import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const getUsers = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();
  return users;
};

const typeDefs = `#graphql
  type User {
    id: Int
    name: String
    username: String
    email: String
    address: Address
    phone: String
    website: String
    company: Company
    addressComplete: String
  }
  
  type Address {
    street: String
    suite: String
    city: String
    zipcode: String
    geo: Geo
  }
  
  type Geo {
    lat: String
    lng: String
  }
  
  type Company {
    name: String
    catchPhrase: String
    bs: String
  }

  type Query {
    users: [User]
    usersCount: Int!
    findUser(name: String!): User
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      return getUsers();
    },
    usersCount: async () => {
      const users: any = await getUsers();
      return users.length;
    },
    findUser: async (root, args) => {
      const { name } = args;
      const users: any = await getUsers();
      return users.find((user) => user.name === name);
    },
  },
  User: {
    addressComplete: (root) =>
      `${root.address.street}, ${root.address.suite}, ${root.address.city}, ${root.address.zipcode}`,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);

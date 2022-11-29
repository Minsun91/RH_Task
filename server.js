import { ApolloServer, gql } from "apollo-server";
import { GraphQLScalarType } from "graphql";

let profiles = [
    {
        id: "1",
        location: "Frankfurt",
        userId: "2",
    },
    {
        id: "2",
        location: "Seoul",
        userId: "1",
    },
];

let users = [
    {
        id: "1",
        name: "nico",
        lastname: "kim",
        dateofbirth: "12-03-2001",
    },
    {
        id: "2",
        name: "Elon",
        lastname: "Musk",
        dateofbirth: "13-10-1998",
    },
];

new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    serialize(value) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
    },
    parseValue(value) {
        return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
        }
        return null;
    },
});

const typeDefs = gql`
    scalar Date

    type User {
        id: ID!
        name: String!
        lastname: String!
        dateofbirth: Date
    }

    type Profile {
        id: ID!
        location: String!
        userId: User!
    }

    type Query {
        allUsers: [User!]!
        allProfiles(id:ID!): [Profile!]!
        user(id: ID!): [User!]!
        selectedUser(id:ID!):[Profile!]!
    }

    type Mutation {
        editProfile(location: String!, userId: ID!): Profile!
        postProfile(location: String!, id: ID!): Profile!
        postUser(name:String!, id:ID!, lastname:String!, dateofbirth:Date) : User!
        deleteUser(id:ID!):Boolean!
    }
`;

const resolvers = {
    Query: {
        allProfiles(_,{id}) {
            return profiles;
        },
        allUsers() {
            return users;
        },
        user(_, { id }) {
            const resultUser = users.find((user) => user.id === id);
            const resultProfile = profiles.find(
                (profiles) => profiles.userId === id
            );
            const result = `userId : ${resultUser.id}, name : ${resultUser.name}, location : ${resultProfile.location}`
            console.log(result)
            return result;
        },
    },

    Mutation: {
        postProfile(_, { location, id, userId }) {
            const newProfile = { id: profiles.length + 1, location, userId };
            profiles.push(newProfile);
            return newProfile;
        },
        postUser(_, {name, lastname, id, dateofbirth}) {
            const newUser = { id : users.length+1, name, lastname, dateofbirth};
            users.push(newUser);
            return newUser;
        },
        editProfile(_, { location, id }) {},
        deleteUser(_,{id}){
            const result = users.find((user)=> user.id === id);
            if(!result) return false;
            users = users.find((user)=> user.id !== id);
            return true;

        }
    },

    Profile: {
        userId({ userId }) {
            const profileUser = users.find((user) => user.id === userId);
            console.log(profileUser)
            return profileUser
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });
const url = "http://localhost:4000/graphql";

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
});

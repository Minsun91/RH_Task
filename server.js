import { ApolloServer, gql } from "apollo-server";
import { GraphQLScalarType } from "graphql";

let profiles = [
    {
        id: "1",
        location: "Frankfurt",
    },
    {
        id: "2",
        location: "Seoul",
    },
    {
        id: "3",
        location: "London",
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
    {
        id: "3",
        name: "Minji",
        lastname: "Lee",
        dateofbirth: "13-08-1996",
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
        dateofbirth: Date!
    }

    type Profile {
        id: ID!
        location: String!
        user: [User!]!
    }

    type Query {
        allUsers: [User!]!
        allProfiles: [Profile!]!
        getProfile(id: ID!): [Profile!]!
        user(id: ID!): [User]!
    }

    type Mutation {
        editProfile(
            location: String!
            id: ID!
            name: String!
            lastname: String!
            dateofbirth: Date
        ): Profile!
    }
`;

const resolvers = {
    Query: {
        getProfile(_, { id }) {
            const result = profiles.filter((profile) => profile.id === id);
            if(result) return result;
        },

        allUsers() {
            return users;
        },

        allProfiles() {
            return profiles;
        }
    },

    Mutation: {
        editProfile(_, { location, id }) {
            const editprofile = users.find((user) => user.id === id);
            const deleteprofile = profiles.filter(
                (profile) => profile.id !== editprofile.id
            );
            const newProfile = { id, location };
            profiles.push(newProfile);
            console.log(deleteprofile, "1", newProfile);
            return { deleteprofile, newProfile };
        },
    },

    Profile: {
        user({ id }) {
            const result = users.filter((user) => user.id === id);
            return result;
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });
const url = "http://localhost:4000/graphql";

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
});

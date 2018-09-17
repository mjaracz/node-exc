const { GraphQLServer }  = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const Query = require('./resolvers/Query.js')
const Mutation = require('./resolvers/Mutation')
const AuthPayload = require('./resolvers/Authpayload')

const resolvers = {
    Query,
    Mutation,
    AuthPayload
}



const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: 'https://eu1.prisma.sh/mjaracz-b561d8/graphql-tutorial/dev',
            secret: 'mysecret123',
            debug: true,
        }),
    }),
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
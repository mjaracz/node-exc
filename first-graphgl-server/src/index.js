const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');


const Mutation = require('./resolvers/Mutation')
const AuthPayload = require('./resolvers/AuthPayload')

function feed(parent, args, context, info) {
  return context.db.query.links({}, info)
}

const Query = {
  feed,
}

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
      endpoint: 'https://eu1.prisma.sh/mjaracz-b561d8/example/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})
server.start(() => console.log(`Server is running on the https://localhost:4000`))
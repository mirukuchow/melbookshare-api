const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const resolvers = {
  Query: {
    getAllBooks: (parent, args, context) => {
      return context.prisma.books();
    },
    getBookDetails: (parent, { id }, context) => {
      return context.prisma.book({ id })
    },
    getCopiesByOwnerId: (parent, { id }, context) => {
      return context.prisma.copies({ where: { ownerId: id }});
    },
  },
  Mutation: {
    deleteCopy(parent, { id }, context) {
      return context.prisma.deleteCopy({ id })
    },
    updateCopy(parent, { id, ...props }, context) {
      return context.prisma.updateCopy({
        where: { id },
        data: { ...props },
      })
    },
    addCopy(
      parent,
      { sourceId, ownerId, price, condition, comment, contact, location },
      context
    ) {
      return context.prisma.createCopy({
        sourceId,
        ownerId,
        price,
        condition,
        comment,
        contact,
        location
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    prisma
  }
});

server.start(() => console.log("Server is running on http://localhost:4000"));

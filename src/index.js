const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const resolvers = {
  // Query: {
  //   book: (parent, args, context) => {
  //     return context.prisma.books()
  //   },
  //   drafts: (parent, args, context) => {
  //     return context.prisma.posts({ where: { published: false } })
  //   },
  //   post: (parent, { id }, context) => {
  //     return context.prisma.post({ id })
  //   },
  // },
  Query: {
    getAllBooks: (parent, args, context) => {
      return context.prisma.books();
    }
  },
  // Mutation: {
  //   createDraft(parent, { title, content }, context) {
  //     return context.prisma.createPost({
  //       title,
  //       content,
  //     })
  //   },
  //   deletePost(parent, { id }, context) {
  //     return context.prisma.deletePost({ id })
  //   },
  //   publish(parent, { id }, context) {
  //     return context.prisma.updatePost({
  //       where: { id },
  //       data: { published: true },
  //     })
  //   },
  // },
  Mutation: {
    addBook(
      parent,
      { sourceId, ownerId, price, condition, comment, contact, location },
      context
    ) {
      return context.prisma.createBook({
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

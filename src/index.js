const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");
const { AuthenticationError } = require("apollo-server-core");

const resolvers = {
  Query: {
    searchBook: (parent, { q }, context) => {
      return context.prisma.books({
        where: {
          AND: [{
            title_starts_with: q
          }, {
            author_starts_with: q
          }]
        }
      });
    },
    getAllBooks: (parent, args, context) => {
      return context.prisma.books();
    },
    getAllCopies: (parent, args, context) => {
      return context.prisma.copies();
    },
    getBookDetails: (parent, { id }, context) => {
      return context.prisma.book({ id });
    },
    getCopiesByOwnerId: (parent, { id }, context) => {
      return context.prisma.copies({ where: { ownerId: id } });
    }
  },
  Mutation: {
    deleteCopy(parent, { id }, context) {
      return context.prisma.deleteCopy({ id });
    },
    updateCopy(
      parent,
      { id, price, condition, comment, contact, location },
      context
    ) {
      return context.prisma.updateCopy({
        where: { id },
        data: { price, condition, comment, contact, location }
      });
    },
    async addCopy(
      parent,
      {
        sourceId,
        ownerId,
        price,
        condition,
        comment,
        contact,
        location,
        image,
        author,
        rating,
        alias,
        avatar,
        title
      },
      context
    ) {
      // https://github.com/prisma/prisma/issues/2194
      const bookExists = await prisma.$exists.book({ sourceId });
      const userExists = await prisma.$exists.user({ id: ownerId });
      // TODO if book exist add to the availableBooks
      // TODO if book exist add to the ownedBooks
      return context.prisma.createCopy({
        price,
        condition,
        ownerId,
        sourceId,
        comment,
        contact,
        location,
        ...(!userExists && {
          owner: {
            create: {
              userId: ownerId,
              alias,
              avatar
            }
          }
        }),
        ...(!bookExists && {
          book: {
            create: {
              sourceId,
              image,
              author,
              rating,
              title
            }
          }
        })
      });
    }
  },
  Copy: {
    // this is to resolve the book inside copy
    book(parent) {
      return prisma.copy({ id: parent.id }).book();
    },
    // this is to resolve the owner inside copy
    owner(parent) {
      return prisma.copy({ id: parent.id }).owner();
    }
  },
  Book: {
    availableBooks(parent, _, context) {
      return context.prisma.copies({ where: { sourceId: parent.sourceId } });
    }
  },
  User: {
    ownedBooks(parent, _, context) {
      return context.prisma.copies({ where: { ownerId: parent.ownerId } });
    }
  }
};

const autheticate = async (resolve, root, args, context, info) => {
  let token;
  try {
      token = jwt.verify(context.request.get("Authorization"), "secret");
  } catch (e) {
      return new AuthenticationError("Not authorised");
  }
  const result = await resolve(root, args, context, info);
  return result;
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    prisma
  },
  middlewares: [autheticate]
});

server.start(() => console.log("Server is running on http://localhost:4000"));

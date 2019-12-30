const { GraphQLServer } = require("graphql-yoga");
// const jwt = require("jsonwebtoken");
// const { AuthenticationError } =require("apollo-server-core");

const { prisma } = require("./generated/prisma-client");

const resolvers = {
  Query: {
    searchBook: (parent, { q }, context) => {
      return context.prisma.books({
        where: {
          OR: [
            {
              title_starts_with: q
            },
            {
              author_starts_with: q
            }
          ]
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
      const userExists = await prisma.$exists.user({ userId: ownerId });

      return context.prisma.createCopy({
        price,
        condition,
        ownerId,
        sourceId,
        comment,
        contact,
        location,
        owner: {
          ...(userExists
            ? {
                connect: {
                  userId: ownerId 
                }
              }
            : {
                create: {
                  userId: ownerId,
                  alias,
                  avatar
                }
              })
        },
        book: {
          ...(bookExists
            ? {
                connect: {
                  sourceId
                }
              }
            : {
                create: {
                  sourceId,
                  image,
                  author,
                  rating,
                  title
                }
              })
        }
        // TODO: fix this problem
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
      return context.prisma.copies({ where: { ownerId: parent.userId } });
    }
  }
};

// TODO: implement later after figure out wechat login issue
// Reference: https://www.prisma.io/tutorials/authentication-in-apollo-server-ct21
// const autheticate = async (resolve, root, args, context, info) => {
//   let token;
//   try {
//       token = jwt.verify(context.request.get("Authorization"), process.env["YOGA_SECRET"]);
//   } catch (e) {
//       return new AuthenticationError("Not authorised");
//   }
//   const result = await resolve(root, args, context, info);
//   return result;
// };

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    prisma
  }
  // middlewares: [autheticate]
});
server.start({ port: 3000 });
console.log("Server is running on http://localhost:3000");
// server.start(() => console.log("Server is running on http://localhost:4000"));

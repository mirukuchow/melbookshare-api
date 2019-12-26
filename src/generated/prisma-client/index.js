"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Copy",
    embedded: false
  },
  {
    name: "Book",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://melbookshare-a60a64c5ac.herokuapp.com/api/v1`,
  secret: "EVsZxKMUpJE5m7rnpVXyR8DjIALToa0F"
});
exports.prisma = new exports.Prisma();

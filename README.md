# Melbookshare API
### Artchitecture

||API Server|Data Access Layer|Database|
| ------------- |-------------|-----|---|
|Framework|[Yoga](https://github.com/prisma-labs/graphql-yoga)|[Prisma](https://www.prisma.io/)|Posgres|
|Hosted at|https://rocky-tor-62300.herokuapp.com/|https://melbookshare-a60a64c5ac.herokuapp.com/api/v1|also Heroku|

### Get Started
1. setup .env file, ask molly for details
2. `yarn && yarn run start`

### Contribution guide
#### Prisma
First of all, run `yarn global add prisma`

To change anything in /prisma, you need to run `prisma generate` to update the content inside `src/generated/prisma-client` folder.

Then you need to run `prisma deploy` update the prisma server in heroku. Remember, only API server need to be run locally and it's pointing to the db and prisma server hosted on the cloud.

To inspect db, you can login prisma using molly's account, and checkout the prisma admin

To reset the data, simple run `prisma reset`

#### Yoga
current schema:
```
type Query {
  getAllBooks: [Book]
  getAllCopies: [Copy]
  getBookDetails(id: ID!): Book
  searchBook(q:String):[Book]
  getCopiesByOwnerId(id: ID!): [Copy]
}

type Mutation {
  addCopy(
    sourceId: ID!
    ownerId: ID!
    price: String!
    title: String!
    condition: String
    comment: String
    contact: String!
    location: String
    image: String
    author: String
    rating: Float
    alias: String
    avatar: String
  ): Copy

  updateCopy(
    price: String!
    condition: String
    comment: String
    contact: String!
    location: String
  ): Copy

  deleteCopy(id: ID!):Copy
}
```

To deploy the change, push to heroku and it will appear on https://rocky-tor-62300.herokuapp.com
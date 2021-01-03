import "reflect-metadata"
import "dotenv/config"

import { ApolloServer } from "apollo-server"
import { buildSchema } from "type-graphql"
import { createConnection } from "typeorm"

import typeOrmConfig from "./config/typeorm"
import { UserResolver } from "./resolvers/UserResolver"

const bootstrap = async () => {
  try {
    await createConnection(typeOrmConfig)

    const schema = await buildSchema({
      resolvers: [UserResolver]
    })
    const server = new ApolloServer({ schema })

    const { url } = await server.listen(process.env.PORT || 4000)
    console.info(`🚀 Server is running, GraphQL Playground available at ${url}`)
  } catch (err) {
    console.error(err)
  }
}

bootstrap()

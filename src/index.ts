import "reflect-metadata"
import "dotenv/config"

import { ApolloServer } from "apollo-server"
import { buildSchema } from "type-graphql"
import { createConnection } from "typeorm"

import typeOrmConfig from "./config/typeorm"
import { authChecker } from "./modules/auth"
import { Context } from "./types/Context"
import { logger } from "./utils/logger"

const bootstrap = async () => {
  try {
    const { options } = await createConnection(typeOrmConfig)

    const schema = await buildSchema({
      resolvers: [__dirname + "/resolvers/**/*.ts"],
      dateScalarMode: "timestamp",
      authChecker
    })

    const server = new ApolloServer({
      schema,
      context: ({ req, res }): Partial<Context> => {
        return {
          req,
          res
        }
      }
    })

    const { url } = await server.listen(process.env.PORT || 4000)
    logger.info(`Server is running, GraphQL Playground available at ${url}`)
    logger.info(`MySQL client connected to database '${options.database}'`)
  } catch (err) {
    logger.error(err)
  }
}

bootstrap()

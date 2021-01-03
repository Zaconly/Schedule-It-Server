import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions"

import { isProd } from "../helpers"

const typeOrmConfig: MysqlConnectionOptions = {
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: ((process.env.DB_PORT as unknown) as number) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: !isProd,
  dropSchema: !isProd,
  logging: false,
  entities: ["src/entity/**/*.*"],
  migrations: ["src/migration/**/*.*"],
  subscribers: ["src/subscriber/**/*.*"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
}

export default typeOrmConfig

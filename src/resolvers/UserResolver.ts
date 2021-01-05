import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql"

import { User } from "../entity/User"
import { UserInput } from "../types/User"

@Resolver(of => User)
export class UserResolver {
  @Authorized("ADMIN")
  @Query(returns => [User])
  async users(): Promise<User[]> {
    const users = await User.find()

    return users
  }

  // @Authorized("ADMIN")
  @Mutation(returns => User)
  async addUser(@Arg("input") input: UserInput): Promise<User> {
    const user = await User.create({ ...input }).save()

    return user
  }
}

import { Arg, Mutation, Query, Resolver } from "type-graphql"

import { User } from "../entity/User"
import { UserInput } from "../types/user"

@Resolver(of => User)
export class UserResolver {
  @Query(returns => [User])
  async users(): Promise<User[]> {
    const users = await User.find()

    return users
  }

  @Mutation(returns => User)
  async addUser(@Arg("input") input: UserInput): Promise<User> {
    const user = User.create({ ...input })
    await user.save()

    return user
  }
}

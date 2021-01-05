import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql"

import { User } from "../entity/User"
import { createAccessToken } from "../modules/auth"
import { createRefreshToken, sendRefreshToken } from "../modules/auth/authToken"
import { Context } from "../types/Context"
import { LoginInput, LoginResponse, RegisterInput } from "../types/me"
import { REFRESH_TOKEN_NAME } from "../utils/constants"

@Resolver(of => User)
export class MeResolver {
  @Authorized()
  @Query(returns => User)
  async me(@Ctx() { me }: Context): Promise<User> {
    const currentUser = await User.findOneOrFail({ where: { id: me.id } })

    return currentUser
  }

  @Mutation(returns => LoginResponse)
  async login(
    @Arg("input") { identifier, password }: LoginInput,
    @Ctx() { res }: Context
  ): Promise<LoginResponse> {
    const user = await User.findByIdentifier(identifier)

    if (!user) {
      throw new Error("No user where found, please try with different information")
    }

    const isValid = await user.comparePassword(password)

    if (!isValid) {
      throw new Error("No user where found, please try with different information")
    }

    sendRefreshToken(res, createRefreshToken(user))

    return {
      user,
      token: createAccessToken(user)
    }
  }

  @Mutation(returns => User)
  async register(@Arg("input") input: RegisterInput): Promise<User> {
    const user = await User.create({ ...input }).save()

    return user
  }

  @Authorized()
  @Mutation(returns => Boolean)
  async logout(@Ctx() { res }: Context): Promise<boolean> {
    res.clearCookie(REFRESH_TOKEN_NAME)

    return true
  }
}

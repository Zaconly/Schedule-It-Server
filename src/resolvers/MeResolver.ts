import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql"

import { User } from "../entity/User"
import { createAccessToken } from "../modules/auth"
import {
  createRefreshToken,
  getStoredRefreshToken,
  sendRefreshToken
} from "../modules/auth/authToken"
import { Context } from "../types/Context"
import { LoginInput, LoginResponse, RegisterInput } from "../types/me"
import { TokenResponse } from "../types/me/Login"
import { CredentialsError, NotFoundError, TokenError } from "../utils/ApolloError"
import { REFRESH_TOKEN_NAME } from "../utils/constants"
import { parseCookies } from "../utils/cookieParser"

@Resolver(of => User)
export class MeResolver {
  @Authorized()
  @Query(returns => User)
  async me(@Ctx() { me }: Context): Promise<User> {
    const currentUser = await User.findOneOrFail({ where: { id: me.id } })

    return currentUser
  }

  @Authorized()
  @Query(returns => TokenResponse)
  async refreshToken(@Ctx() { req, res, me }: Context): Promise<TokenResponse> {
    const storedRefreshToken = await getStoredRefreshToken(me)

    if (storedRefreshToken !== parseCookies(req, REFRESH_TOKEN_NAME)) {
      throw new TokenError("Refresh token provided is invalid or expired")
    }

    const user = await User.findOne(me.id)

    if (!user) {
      throw new NotFoundError("No user was found with decoded refresh token")
    }

    sendRefreshToken(res, createRefreshToken(user))

    return {
      token: createAccessToken(user)
    }
  }

  @Mutation(returns => LoginResponse)
  async login(
    @Arg("input") { identifier, password }: LoginInput,
    @Ctx() { res }: Context
  ): Promise<LoginResponse> {
    const user = await User.findByIdentifier(identifier)

    if (!user) {
      throw new CredentialsError()
    }

    const isValid = await user.comparePassword(password)

    if (!isValid) {
      throw new CredentialsError()
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

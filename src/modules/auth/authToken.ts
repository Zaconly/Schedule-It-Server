import crypto from "crypto"
import { Response } from "express"
import { sign } from "jsonwebtoken"
import { Maybe } from "type-graphql"

import { User } from "../../entity/User"
import redis from "../../redis"
import { REFRESH_TOKEN_NAME } from "../../utils/constants"
import { isProd } from "../../utils/helpers"

export const createAccessToken = (user: User): string => {
  return sign({ id: user.id, roles: user.roles }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "10m"
  })
}

export const createRefreshToken = (user: User): string => {
  const token = crypto.randomBytes(32).toString("base64")
  storeRefreshToken(user, token)

  return token
}

export const storeRefreshToken = async (user: User, token: string): Promise<void> => {
  await redis.hset(REFRESH_TOKEN_NAME, user.id, token)
}

export const getStoredRefreshToken = async (user: User): Promise<Maybe<string>> => {
  const refreshToken = await redis.hget(REFRESH_TOKEN_NAME, user.id)

  return refreshToken
}

export const sendRefreshToken = (res: Response, token: string): void => {
  res.cookie(REFRESH_TOKEN_NAME, token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    domain: isProd ? process.env.DOMAIN : "localhost"
  })
}

import crypto from "crypto"
import { Response } from "express"
import { sign } from "jsonwebtoken"

import { User } from "../../entity/User"
import { REFRESH_TOKEN_NAME } from "../../utils/constants"
import { isProd } from "../../utils/helpers"

export const createAccessToken = (user: User): string => {
  return sign({ id: user.id, roles: user.roles }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "10m"
  })
}

export const createRefreshToken = (user: User): string => {
  return crypto.randomBytes(32).toString("base64")
}

export const sendRefreshToken = (res: Response, token: string): void => {
  res.cookie(REFRESH_TOKEN_NAME, token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    domain: isProd ? process.env.DOMAIN : "http://localhost:" + (process.env.PORT || 4000)
  })
}

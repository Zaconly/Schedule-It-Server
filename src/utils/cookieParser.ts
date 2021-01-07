import cookie from "cookie"
import { Request } from "express"
import { Maybe } from "type-graphql"

export const parseCookies = (
  req: Request,
  cookieName?: string
): Maybe<Record<string, string> | string> => {
  const cookies = req.headers.cookie as Maybe<string>

  if (cookies) {
    const parsedCookies = cookie.parse(cookies)

    if (cookieName) {
      return parsedCookies[cookieName]
    }

    return parsedCookies
  }

  return null
}

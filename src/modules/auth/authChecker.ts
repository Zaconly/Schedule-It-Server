import { AuthenticationError } from "apollo-server"
import { verify } from "jsonwebtoken"
import { AuthChecker } from "type-graphql"

import { User } from "../../entity/User"
import { Context } from "../../types/Context"
import { JwtPayload } from "../../types/me"
import { AuthorizationError } from "../../utils/ApolloError"

export const authChecker: AuthChecker<Context> = async ({ context }, roles): Promise<boolean> => {
  const authorization = context.req.headers["authorization"]

  if (!authorization) {
    throw new AuthenticationError(`You must be connected to perform this action`)
  }

  const token = authorization.split(" ")[1]
  const payload = verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload

  if (payload && payload.id) {
    // Update context to add decoded JWT information
    context.me = new User()
    Object.assign(context.me, payload)

    if (roles.length === 0) {
      return true
    }

    const matchRoles = payload.roles.filter(userRole => roles.includes(userRole))

    if (!matchRoles.length) {
      throw new AuthorizationError(`You do not have sufficient permissions: ${roles}`)
    }

    return true
  }

  return false
}

import { Roles } from "../User"

export interface JwtPayload {
  id: string
  roles: Roles[]
}

import { Field, InputType, ObjectType } from "type-graphql"

import { User } from "../../entity/User"

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  identifier!: string

  @Field()
  password!: string
}

@ObjectType()
export abstract class LoginResponse {
  @Field(type => User)
  user!: User

  @Field()
  token!: string
}

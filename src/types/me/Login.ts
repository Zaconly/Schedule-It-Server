import { Field, InputType, ObjectType } from "type-graphql"

import { User } from "../../entity/User"

@InputType()
export abstract class LoginInput implements Partial<User> {
  @Field()
  identifier!: string

  @Field()
  password!: string
}

@ObjectType()
export abstract class TokenResponse {
  @Field()
  token!: string
}

@ObjectType()
export abstract class LoginResponse extends TokenResponse {
  @Field(type => User)
  user!: User
}

import { Field, InputType } from "type-graphql"

import { User } from "../../entity/User"

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  username!: string

  @Field()
  email!: string

  @Field()
  password!: string
}

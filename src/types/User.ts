import { IsAlphanumeric, IsEmail, Length } from "class-validator"
import { Field, InputType } from "type-graphql"

import { User } from "../entity/User"

@InputType()
export abstract class UserInput implements Partial<User> {
  @Field()
  @IsAlphanumeric()
  @Length(3, 30)
  username!: string

  @Field()
  @IsEmail()
  email!: string

  @Field()
  @Length(4, 60)
  password!: string
}

export enum Roles {
  ADMIN = "ADMIN",
  USER = "USER"
}

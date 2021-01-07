import { InputType } from "type-graphql"

import { UserInput } from "../User"

@InputType()
export abstract class RegisterInput extends UserInput {}

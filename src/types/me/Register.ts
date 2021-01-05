import { InputType } from "type-graphql"

import { UserInput } from "../User"

@InputType()
export class RegisterInput extends UserInput {}

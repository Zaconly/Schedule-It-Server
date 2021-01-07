import { Length } from "class-validator"
import { Field, InputType } from "type-graphql"

import { Board } from "../entity/Board"

@InputType()
export abstract class BoardInput implements Partial<Board> {
  @Field()
  @Length(1, 30)
  name!: string
}

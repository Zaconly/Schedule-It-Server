import { Field, InputType } from "type-graphql"

import { Board } from "../../entity/Board"

@InputType()
export class BoardInput implements Partial<Board> {
  @Field()
  name!: string
}

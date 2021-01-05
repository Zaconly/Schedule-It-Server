import { Length } from "class-validator"
import slugify from "slugify"
import { Field, ObjectType } from "type-graphql"
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm"

import { BaseContent } from "../utils/BaseContent"
import { User } from "./User"

@ObjectType()
@Entity("boards")
export class Board extends BaseContent {
  @Field()
  @Length(1, 30)
  @Column({ length: 30 })
  name!: string

  @Field()
  @Column("boolean", { default: false })
  isArchived!: boolean

  @Field()
  @Column()
  slug!: string

  @ManyToOne(target => User, user => user.boards, { nullable: false })
  user!: User

  @BeforeInsert()
  @BeforeUpdate()
  setSlug(): void {
    this.slug = slugify(this.name)
  }
}

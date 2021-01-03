import { Length } from "class-validator"
import slugify from "slugify"
import { Field, ObjectType } from "type-graphql"
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm"

import { BaseContent } from "../helpers"

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

  @BeforeInsert()
  @BeforeUpdate()
  setSlug(): void {
    this.slug = slugify(this.name)
  }
}

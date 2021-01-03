import { generate } from "shortid"
import { Field, ID, ObjectType } from "type-graphql"
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm"

@ObjectType()
export abstract class BaseContent extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number

  @Field()
  @Column({ unique: true })
  shortUrl!: string

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date

  @BeforeInsert()
  setShortUrl(): void {
    this.shortUrl = generate()
  }
}

import bcrypt from "bcryptjs"
import { IsAlphanumeric, IsEmail, Length } from "class-validator"
import { Field, ObjectType } from "type-graphql"
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm"

import { BaseContent } from "../helpers"

@ObjectType()
@Entity("users")
export class User extends BaseContent {
  @Field()
  @IsAlphanumeric()
  @Length(3, 30)
  @Column({ length: 30, unique: true })
  username!: string

  @Field()
  @IsEmail()
  @Column({ unique: true })
  email!: string

  @Length(4, 60)
  @Column({ length: 60 })
  password!: string

  @Column("boolean", { default: false })
  isLocked!: boolean

  @Column("boolean", { default: false })
  isConfirmed!: boolean

  async hashPassword(): Promise<string> {
    const password = await bcrypt.hash(this.password, 12)
    return password
  }

  async comparePassword(password: string): Promise<boolean> {
    const compare = await bcrypt.compare(password, this.password)
    return compare
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    this.password = await this.hashPassword()
  }
}

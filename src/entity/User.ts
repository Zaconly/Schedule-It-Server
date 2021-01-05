import * as bcrypt from "bcryptjs"
import { IsAlphanumeric, IsEmail, Length } from "class-validator"
import { Authorized, Field, Maybe, ObjectType } from "type-graphql"
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm"

import { Roles } from "../types/User"
import { BaseContent } from "../utils/BaseContent"
import { Board } from "./Board"

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

  @Authorized("ADMIN")
  @Field(type => [String])
  @Column("set", { enum: Roles, default: [Roles.USER] })
  roles!: Roles[]

  @Authorized("ADMIN")
  @Field()
  @Column("boolean", { default: false })
  isLocked!: boolean

  @Authorized("ADMIN")
  @Field()
  @Column("boolean", { default: false })
  isConfirmed!: boolean

  @OneToMany(target => Board, board => board.user)
  boards!: Board[]

  async hashPassword(): Promise<string> {
    const password = await bcrypt.hash(this.password, 12)
    return password
  }

  async comparePassword(password: string): Promise<boolean> {
    const compare = await bcrypt.compare(password, this.password)
    return compare
  }

  static async findByIdentifier(identifier: string): Promise<Maybe<User>> {
    const user = await User.findOne({ where: [{ email: identifier }, { username: identifier }] })

    return user || null
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    this.password = await this.hashPassword()
  }
}

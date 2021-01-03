import * as bcrypt from "bcryptjs"
import { IsEmail, Length } from "class-validator"
import { Field, ID, ObjectType } from "type-graphql"
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm"

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
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

  @Field()
  @CreateDateColumn()
  createdAt!: string

  @Field()
  @UpdateDateColumn()
  updatedAt!: string

  hashPassword(password = ""): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    const hashedPassword = await this.hashPassword(this.password)
    this.password = hashedPassword
  }
}

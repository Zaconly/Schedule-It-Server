import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql"

import { Board } from "../entity/Board"
import { BoardInput } from "../types/Board"
import { Context } from "../types/Context"

@Resolver(of => Board)
export class BoardResolver {
  @Authorized()
  @Query(returns => [Board])
  async boards(@Ctx() { me }: Context): Promise<Board[]> {
    const boards = await Board.find({ where: { user: me } })

    return boards
  }

  @Authorized()
  @Query(returns => Board)
  async board(@Arg("id") id: string, @Ctx() { me }: Context): Promise<Board> {
    const board = await Board.findOneOrFail({ where: { id, user: me } })

    return board
  }

  @Authorized()
  @Mutation(returns => Board)
  async addBoard(@Arg("input") input: BoardInput, @Ctx() { me }: Context): Promise<Board> {
    const board = Board.create({ ...input, user: me })
    await board.save()

    return board
  }

  @Authorized()
  @Mutation(returns => Board)
  async updateBoard(
    @Arg("id") id: string,
    @Arg("input") input: BoardInput,
    @Ctx() { me }: Context
  ): Promise<Board> {
    const board = await Board.findOneOrFail({ where: { id, user: me } })

    if (!board.isArchived) {
      Object.assign(board, input)
      const updatedBoard = await board.save()

      return updatedBoard
    }

    throw new Error("You can't update an archived board.")
  }

  @Authorized()
  @Mutation(returns => Board)
  async archiveBoard(
    @Arg("id") id: string,
    @Arg("isArchived") isArchived: boolean,
    @Ctx() { me }: Context
  ): Promise<Board> {
    const board = await Board.findOneOrFail({ where: { id, user: me } })

    board.isArchived = isArchived
    board.save()

    return board
  }

  @Authorized()
  @Mutation(returns => Boolean)
  async deleteBoard(@Arg("id") id: string, @Ctx() { me }: Context): Promise<boolean> {
    await Board.delete({ id, user: me })

    return true
  }
}

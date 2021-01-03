import { Arg, Mutation, Query, Resolver } from "type-graphql"

import { Board } from "../entity/Board"
import { BoardInput } from "../types/board"

@Resolver(of => Board)
export class BoardResolver {
  @Query(returns => [Board])
  async boards(): Promise<Board[]> {
    const boards = await Board.find()

    return boards
  }

  @Query(returns => Board)
  async board(@Arg("id") id: string): Promise<Board> {
    const board = await Board.findOneOrFail({ where: { shortUrl: id } })

    return board
  }

  @Mutation(returns => Board)
  async addBoard(@Arg("input") input: BoardInput): Promise<Board> {
    const board = Board.create({ ...input })
    await board.save()

    return board
  }

  @Mutation(returns => Board)
  async updateBoard(@Arg("id") id: string, @Arg("input") input: BoardInput): Promise<Board> {
    const board = await Board.findOneOrFail({ where: { shortUrl: id } })

    if (!board.isArchived) {
      Object.assign(board, input)
      const updatedBoard = await board.save()

      return updatedBoard
    }

    throw new Error("You can't update an archived board.")
  }

  @Mutation(returns => Board)
  async archiveBoard(
    @Arg("id") id: string,
    @Arg("isArchived") isArchived: boolean
  ): Promise<Board> {
    const board = await Board.findOneOrFail({ where: { shortUrl: id } })

    board.isArchived = isArchived
    board.save()

    return board
  }

  @Mutation(returns => String)
  async deleteBoard(@Arg("id") id: string): Promise<string> {
    await Board.delete({ shortUrl: id })

    return "ok"
  }
}

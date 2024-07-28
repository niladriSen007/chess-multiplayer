import { Chess } from "chess.js"
import { WebSocket } from "ws"
import { GAME_OVER, INIT_GAME, MOVE } from "./Messages"

export class Game {
  public player1: WebSocket
  public player2: WebSocket
  public board: Chess
  private moves: string[]
  private startTime: Date
  private moveCount=0

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1
    this.player2 = player2
    this.board = new Chess()
    this.moves = []
    this.startTime = new Date()
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: { color: "white" },
      })
    )
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: { color: "black" },
      })
    )
  }

  move(
    player: WebSocket,
    move: {
      from: string
      to: string
    }
  ) {
    if (player === this.player1 || player === this.player2) {
      //validation here

      //Is it the player's turn?
      if (this.moveCount % 2 === 0 && player === this.player2) {
        return
      }
      if (this.moveCount % 2 === 1 && player === this.player1) {
        return
      }
      //Is the move valid?

      try {
        //this is Chess.js move function
        this.board.move(move)
      } catch (error) {
        console.log(error)
        return
      }

      //Check if the game is over
      if (this.board.isGameOver()) {
        //Send a message to both players
        this.player1.emit(
          JSON.stringify({
            type: GAME_OVER,
            payload: { winner: this.board.turn() === "w" ? "white" : "black" },
          })
        )
        this.player2.emit(
          JSON.stringify({
            type: GAME_OVER,
            payload: { winner: this.board.turn() === "w" ? "black" : "white" },
          })
        )
        return
      }

      if (this.moveCount % 2 === 0) {
        this.player2.send(JSON.stringify({ type: MOVE, payload: move }))
      } else {
        this.player1.send(JSON.stringify({ type: MOVE, payload: move }))
      }
      this.moveCount += 1
    }
  }
}

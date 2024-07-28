import { WebSocket } from "ws"
import { INIT_GAME, MOVE } from "./Messages"
import { Game } from "./Game"

//Need to create an interface for the games and users

export class GameManager {
  private games: Game[]
  private pendingUser: WebSocket | null
  private users: WebSocket[]

  constructor() {
    this.games = []
    this.pendingUser = null
    this.users = []
  }

  addUser(socket: WebSocket) {
    this.users.push(socket)
    this.addHandler(socket)
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket)
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString())
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          //Create a new game
          const game = new Game(socket, this.pendingUser)
          this.games.push(game)
          this.pendingUser = null
        } else {
          this.pendingUser = socket
        }
      } else if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.player1 == socket || game.player2 == socket
        )
        if (game) {
          game.move(socket, message.data)
        }
      }
    })
  }
}

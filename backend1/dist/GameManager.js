"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Messages_1 = require("./Messages");
const Game_1 = require("./Game");
//Need to create an interface for the games and users
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter((user) => user !== socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === Messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    //Create a new game
                    const game = new Game_1.Game(socket, this.pendingUser);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            else if (message.type === Messages_1.MOVE) {
                const game = this.games.find((game) => game.player1 == socket || game.player2 == socket);
                if (game) {
                    game.move(socket, message.data);
                }
            }
        });
    }
}
exports.GameManager = GameManager;

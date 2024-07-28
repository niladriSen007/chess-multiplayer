"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const Messages_1 = require("./Messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: Messages_1.INIT_GAME,
            payload: { color: "white" },
        }));
        this.player2.send(JSON.stringify({
            type: Messages_1.INIT_GAME,
            payload: { color: "black" },
        }));
    }
    move(player, move) {
        if (player === this.player1 || player === this.player2) {
            //validation here
            //Is it the player's turn?
            if (this.moveCount % 2 === 0 && player === this.player2) {
                return;
            }
            if (this.moveCount % 2 === 1 && player === this.player1) {
                return;
            }
            //Is the move valid?
            try {
                //this is Chess.js move function
                this.board.move(move);
            }
            catch (error) {
                console.log(error);
                return;
            }
            //Check if the game is over
            if (this.board.isGameOver()) {
                //Send a message to both players
                this.player1.emit(JSON.stringify({
                    type: Messages_1.GAME_OVER,
                    payload: { winner: this.board.turn() === "w" ? "white" : "black" },
                }));
                this.player2.emit(JSON.stringify({
                    type: Messages_1.GAME_OVER,
                    payload: { winner: this.board.turn() === "w" ? "black" : "white" },
                }));
                return;
            }
            if (this.moveCount % 2 === 0) {
                this.player2.send(JSON.stringify({ type: Messages_1.MOVE, payload: move }));
            }
            else {
                this.player1.send(JSON.stringify({ type: Messages_1.MOVE, payload: move }));
            }
            this.moveCount += 1;
        }
    }
}
exports.Game = Game;

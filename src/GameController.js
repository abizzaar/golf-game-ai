const GameState = require("./GameState").GameState;
const Player = require("./Player").Player;
const PickUpChoice = require("./GameState").PickUpChoice;

class GameController {
  constructor() {
    this.game = new GameState();
    this.playGameLoop();
  }

  playGameLoop() {
    if (true) { // TODO: Check for player turns
      const lastDiscarded = this.game.discarded[this.game.discarded.length - 1];
      // TODO: Think about whether view library can sabotage gamestate
      Player.getPickUpChoice(lastDiscarded, this.game.player1Cards, this.game.player2Cards)
        .then(pickUpChoice => {
          pickUpChoice === PickUpChoice.deck ? this.game.pickUpFromDeck() : this.game.pickUpFromDiscard();
          Player.getDiscardChoice(this.game.cardPickedUp, this.game.player1Cards)
            .then(indexOfChosenCard => {
              indexOfChosenCard === -1 ? this.game.discard(-1) : this.game.discard(indexOfChosenCard);
              if (!this.game.isGameEnd()) {
                console.log("here");
                this.playGameLoop();
              } else {
                const {player1Cards, player2Cards, player1Score, player2Score} = this.game;
                Player.displayScores(player1Cards, player2Cards, player1Score, player2Score);
              }
            });
        });
    }
  }
}

exports.GameController = GameController;

const GameState = require("./GameState").GameState;
const Player = require("./Player").Player;
const AI = require("./AI").AI;

class GameController {
  constructor() {
    this.game = new GameState();
    this.playGameLoop();
    this.ai = new AI();
    this.aiPickUpChoice = null;
    this.aiCardPickedUp = null;
    this.aiCardReplaced = null;

  }

  playGameLoop() {
    if (this.game.playerTurn === 1) {
      this.playersTurn();
    } else {
      this.aiTurn();
    }
  }

  playersTurn() {
    const lastDiscarded = this.game.discarded[this.game.discarded.length - 1];
    Player.getPickUpChoice(lastDiscarded,
      this.game.player1Cards,
      this.game.player2Cards,
      this.aiPickUpChoice,
      this.aiCardPickedUp,
      this.aiCardReplaced)
      .then(pickUpChoice => {
        this.game.pickup(pickUpChoice);
        Player.getDiscardChoice(this.game.cardPickedUp, this.game.player1Cards)
          .then(indexOfChosenCard => {
            this.game.discard(indexOfChosenCard);
            this.restartLoop();
          });
      });
  }

  aiTurn() {
    const lastDiscarded = this.game.discarded[this.game.discarded.length - 1];
    const pickUpChoice = this.ai.getPickUpChoice(lastDiscarded, this.game.player2Cards);
    this.game.pickup(pickUpChoice);
    this.aiPickUpChoice = pickUpChoice;
    this.aiCardPickedUp = this.game.cardPickedUp;
    const discardChoice = this.ai.getDiscardChoice(this.game.cardPickedUp, this.game.player2Cards);
    this.aiCardReplaced = this.game.player2Cards[discardChoice];
    this.game.discard(discardChoice);
    this.restartLoop();
  }

  restartLoop() {
    if (!this.game.isGameEnd()) {
      this.playGameLoop();
    } else {
      const {player1Cards, player2Cards, player1Score, player2Score} = this.game;
      Player.displayScores(player1Cards, player2Cards, player1Score, player2Score);
    }
  }
}

exports.GameController = GameController;

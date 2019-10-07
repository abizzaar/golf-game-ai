const inquirer = require('inquirer');
const table = require('text-table');
const clear = require('clear');
const chalk = require('chalk');
const PickUpChoice = require("./GameState").PickUpChoice;

class Player {
  static getPickUpChoice(lastDiscarded, playerCards, aiCards) {
    Player.displayGameState(lastDiscarded, playerCards, aiCards);
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'pickUpChoice',
          message: 'Pick up a card from deck or discarded:',
          choices: [
            PickUpChoice.deck,
            PickUpChoice.discarded
          ]
        },
      ])
      .then(answers => answers.pickUpChoice)
  }

  static getDiscardChoice(cardPickedUp, playerCards) {
    const choices = Player.displayDiscardChoices(cardPickedUp, playerCards);
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'chosenCard',
          message: 'Which card will you discard?',
          choices: choices,
        }
      ])
      .then(answers => {
        let indexOfChosenCard = choices.indexOf(answers.chosenCard);
        return indexOfChosenCard === playerCards.length ? -1 : indexOfChosenCard;
      })
  }

  static displayDiscardChoices(cardPickedUp, playerCards) {
    const formatCard = Player.formatCard;
    const choices = playerCards.map((el, i) => (i+1) + ". " + formatCard(el));
    choices.push("x. " + formatCard(cardPickedUp) + " " + chalk.red("(Card Picked up)"));
    console.log(chalk.bgCyan("You picked up " + formatCard(cardPickedUp) + " " + " \n"));
    return choices;
  }

  static displayGameState(lastDiscarded, playerCards, aiCards) {
    clear();
    Player.displayPlayerCards(playerCards, aiCards);
    console.log(chalk.gray("Discarded Pile"));
    console.log(Player.formatCard(lastDiscarded));
    console.log("\n");
  }

  static displayPlayerCards(playerCards, aiCards) {
    const player1Table = Player.getTableFromCards(playerCards);
    const player2Table = Player.getTableFromCards(aiCards);
    console.log(chalk.gray("Your Cards"));
    console.log(player1Table);
    console.log("\n");
    console.log(chalk.gray("AI's Cards"));
    console.log(player2Table);
    console.log("\n");
  }

  static getTableFromCards(cards) {
    const formatCard = Player.formatCard;
    return table([
        [formatCard(cards[0]), formatCard(cards[1]), formatCard(cards[2])],
        [formatCard(cards[3]), formatCard(cards[4]), formatCard(cards[5])]
      ]
    );
  }

  static displayScores(playerCards, aiCards, playerScore, aiScore) {
    clear();
    console.log("The game is complete!");
    console.log("\n");
    Player.displayPlayerCards(playerCards, aiCards);
    Player.displayScore("You", playerScore + " points.");
    Player.displayScore("AI", aiScore + " points.");
    console.log("\n");
    if (playerScore < aiScore) {
      Player.displayWinnerText("You have won the game!");
    } else if (playerScore > aiScore) {
      Player.displayWinnerText("AI has won the game!");
    } else {
      Player.displayWinnerText("It is a tie!")
    }
  }

  static displayWinnerText(txt) {
    console.log(chalk.cyan(txt));
  }

  static displayScore(player, score) {
    console.log(player + ": " + score);
  }

  static formatCard(card) {
    if (!card.isFaceUp) return "--------";
    const suitToEmojiMap = {
      hearts: "❤️",
      spades: "♠️",
      clubs: "♣️",
      diamonds: "♦️"
    };
    return Player.formatCardNum(card.num) + " " + suitToEmojiMap[card.suit];
  }

  static formatCardNum(num) {
    if (num === 1) return "Ace";
    if (num === 11) return "Jack";
    if (num === 12) return "Queen";
    if (num === 13) return "King";
    return num;
  }
}

exports.Player = Player;





const GameState = require("./src/GameState").GameState;
const inquirer = require('inquirer');
const table = require('text-table');
const clear = require('clear');
const chalk = require('chalk');

init();

function init() {
  const game = new GameState();
  interactWithPlayer(game);
}

function interactWithPlayer(game) {
  clear();
  displayPlayerCards(game);
  console.log(chalk.gray("Discarded Pile"));
  console.log(formatCard(game.discarded[game.discarded.length - 1]));
  console.log("\n");

  const cards = game.playerTurn === 1 ? game.player1Cards : game.player2Cards;

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'pickUpChoice',
        message: 'Pick up a card from deck or discarded:',
        choices: [
          'Deck',
          'Discarded',
        ]
      },
    ])
    .then(answers => {
      const pickUpChoice = answers.pickUpChoice;
      pickUpChoice === "Deck" ? game.pickUpFromDeck() : game.pickUpFromDiscard();
      const choices = cards.map((el, i) => (i+1) + ". " + formatCard(el));
      choices.push("x. " + formatCard(game.cardPickedUp) + " " + chalk.red("(Card Picked up)"));

      console.log(chalk.bgCyan("You picked up " + formatCard(game.cardPickedUp) + "!\n"));

      inquirer
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
          indexOfChosenCard === cards.length ? game.discard(-1) : game.discard(indexOfChosenCard);
          if (!game.isGameEnd()) {
            clear();
            interactWithPlayer(game);
          } else {
            displayScores(game);
          }
        });
    });
}

function displayPlayerCards(game) {
  const player1Table = getTableFromCards(game.player1Cards);
  const player2Table = getTableFromCards(game.player2Cards);
  console.log(chalk.gray("Player 1 Cards"));
  console.log(player1Table);
  console.log("\n");
  console.log(chalk.gray("Player 2 Cards"));
  console.log(player2Table);
  console.log("\n");
}

function displayScores(game) {
  const { player1Score, player2Score } = game;
  clear();
  console.log("The game is complete!");
  console.log("\n");
  displayPlayerCards(game);
  displayScore("Player 1", player1Score + " points.");
  displayScore("Player 2", player2Score + " points.");
  console.log("\n");
  if (player1Score > player2Score) {
    displayWinnerText("Player 1 has won the game!");
  } else if (player1Score < player2Score) {
    displayWinnerText("Player 2 has won the game!");
  } else {
    displayWinnerText("It is a tie!")
  }
}

function displayScore(player, score) {
  console.log(player + ": " + score);
}

function displayWinnerText(txt) {
  console.log(chalk.cyan(txt));
}

function getTableFromCards(cards) {
  return table([
      [formatCard(cards[0]), formatCard(cards[1]), formatCard(cards[2])],
      [formatCard(cards[3]), formatCard(cards[4]), formatCard(cards[5])]
    ]
  );
}

function formatCard(card) {
  if (!card.isFaceUp) return "--------";
  const suitToEmojiMap = {
    hearts: "❤️",
    spades: "♠️",
    clubs: "♣️",
    diamonds: "♦️"
  };
  return formatCardNum(card.num) + " " + suitToEmojiMap[card.suit];
}

function formatCardNum(num) {
  if (num === 1) return "Ace";
  if (num === 11) return "Jack";
  if (num === 12) return "Queen";
  if (num === 13) return "King";
  return num;
}

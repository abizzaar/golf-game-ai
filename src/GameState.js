const shuffle = require('knuth-shuffle').knuthShuffle;

class Card {
  constructor(num, suit) {
    this.num = num;
    this.suit = suit;
    this.isFaceUp = false;
  }
}

const PickUpChoice = {
  deck: "Deck",
  discarded: "Discarded"
};

const Suit = {
  hearts: "hearts",
  spades: "spades",
  clubs: "clubs",
  diamonds: "diamonds"
};

class GameState {
  constructor() {
    this.deck = [];
    this.discarded = [];
    this.rounds = 0;
    this.player1Cards = [];
    this.player2Cards = [];
    this.cardPickedUp = null;
    this.playerTurn = 1; // Either 0 or 1
    this.player1Score = null;
    this.player2Score = null;
    this.initializeDeck();
    this.initializePlayerCards();
    this.initializeDiscarded();
  }

  initializeDiscarded() {
    const card = this.deck.pop();
    card.isFaceUp = true;
    this.discarded.push(card);
  }

  initializePlayerCards() {
    for (let i = 0; i < 6; i++) {
      this.player1Cards.push(this.deck.pop());
      this.player2Cards.push(this.deck.pop());
    }

    this.flipTwoPlayerCards();
  }

  flipTwoPlayerCards() {
    let rand1 = GameState.getRandomInt(6);
    let rand2 = GameState.getRandomInt(6);
    while (rand2 === rand1) {
      rand2 = GameState.getRandomInt(6);
    }
    let rand3 = GameState.getRandomInt(6);
    let rand4 = GameState.getRandomInt(6);
    while (rand4 === rand3) {
      rand4 = GameState.getRandomInt(6);
    }

    this.player1Cards[rand1].isFaceUp = true;
    this.player1Cards[rand2].isFaceUp = true;
    this.player2Cards[rand3].isFaceUp = true;
    this.player2Cards[rand4].isFaceUp = true;
  }

  static getRandomInt(n) {
    return Math.floor(Math.random() * n);
  }

  initializeDeck() {
    let suits = Object.keys(Suit);
    for (let i = 0; i < 52; i++) {
      this.deck.push(new Card((i % 13) + 1, suits[i % 4]));
    }

    shuffle(this.deck);
  }

  pickup(pickUpChoice) {
    return pickUpChoice === PickUpChoice.deck ? this.pickUpFromDeck() : this.pickUpFromDiscard();
  }

  pickUpFromDeck() {
    this.cardPickedUp = this.deck.pop();
    this.cardPickedUp.isFaceUp = true;
    return this.cardPickedUp;
  }

  pickUpFromDiscard() {
    this.cardPickedUp = this.discarded.pop();
    return this.cardPickedUp;
  }

  discard(index) {
    if (index === -1) {
      this.discarded.push(this.cardPickedUp);
    } else if (this.playerTurn === 1) {
      this.replaceCard(index, this.player1Cards);
    } else {
      this.replaceCard(index, this.player2Cards);
    }

    this.prepareForNextRound();
  }

  prepareForNextRound() {
    this.rounds++;
    this.playerTurn === 1 ? this.playerTurn = 2 : this.playerTurn = 1;
    this.discarded[this.discarded.length - 1].isFaceUp = true;
  }

  replaceCard(index, cards) {
    this.discarded.push(cards[index]);
    cards[index] = this.cardPickedUp;
    cards[index].isFaceUp = true;
  }

  isGameEnd() {
    const isEnd = this.rounds >= 18 ||
      GameState.isAllCardsFaceUp(this.player1Cards) ||
      GameState.isAllCardsFaceUp(this.player2Cards) ||
      this.deck.length === 0;

    if (!isEnd) return false;
    else {
      this.prepareForEndGame();
      return true;
    }
  }

  prepareForEndGame() {
    this.player1Cards.map(GameState.makeCardFaceUp);
    this.player2Cards.map(GameState.makeCardFaceUp);
    this.player1Score = GameState.computeScore(this.player1Cards);
    this.player2Score = GameState.computeScore(this.player2Cards);
  }

  static makeCardFaceUp(card) {
    card.isFaceUp = true
  }

  static isAllCardsFaceUp(cards) {
    for (let card of cards) {
      if (!card.isFaceUp) return false;
    }

    return true;
  }

  static computeScore(cards) {
    let score = 0;
    // A pair of equal cards in the same column scores zero points for the column (even if the equal cards are 2s).
    let i = 0; // first ptr
    let j = 3; // second ptr

    while (i !== 3) {
      if (!GameState.isCardsEqual(cards[i], cards[j])) {
        score += GameState.getCardScore(cards[i].num);
        score += GameState.getCardScore(cards[j].num);
      }

      i++;
      j++;
    }

    return score;
  }

  static getCardScore(num) {
    // Each ace counts 1 point.
    if (num === 1) return 1;
    // Each 2 counts minus 2 points.
    else if (num === 2) return -2;
    // Each numeral card from 3 to 10 scores face value.
    else if (3 <= num && num <= 10) return num;
    // Each jack or queen scores 10 points.
    else if (11 === num || 12 === num) return 10;
    // Each king scores zero points.
    else return 0;
  }

  static isCardsEqual(card1, card2) {
    return card1.num === card2.num
  }
}

exports.GameState = GameState;
exports.Card = Card;
exports.Suit = Suit;
exports.PickUpChoice = PickUpChoice;
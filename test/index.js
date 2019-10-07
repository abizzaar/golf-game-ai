const mocha = require('mocha');
const chai = require('chai');
const should = chai.should();
const GameState = require("../src/GameState").GameState;
const Card = require("../src/GameState").Card;
const Suit = require("../src/GameState").Suit;

describe('Play Game', function () {
  const game = new GameState();
  it(`deck has correct num of cards`, function () {
    game.player1Cards.should.have.lengthOf(6);
    game.player2Cards.should.have.lengthOf(6);
    game.discarded.should.have.lengthOf(1);
    game.deck.should.have.lengthOf(52 - 13);
  });
  it('pickup and discard same card', function () {
    const cardPickedUp = game.pickUpFromDeck();
    game.discard(-1);
    shouldEqualLastDiscardedCard(game, cardPickedUp);
  });
  it('check rounds update correctly', function () {
    game.rounds.should.equal(1);
    const cardPickedUp = game.pickUpFromDiscard();
    game.discard(-1);
    shouldEqualLastDiscardedCard(game, cardPickedUp);
    game.discarded[game.discarded.length - 1].num.should.equal(cardPickedUp.num);
    game.discarded[game.discarded.length - 1].suit.should.equal(cardPickedUp.suit);
    game.rounds.should.equal(2);
  });
  it('pickup card from deck and discard from row', function () {
    const playerTurn = game.playerTurn;
    game.pickUpFromDiscard();
    const discardedCard = game.player1Cards[1];
    game.discard(1);
    shouldEqualLastDiscardedCard(game, discardedCard);
    playerTurn === 1 ? game.playerTurn.should.equal(2) : game.playerTurn.should.equal(1);
  });
});


function shouldEqualLastDiscardedCard(game, card) {
  game.discarded[game.discarded.length - 1].num.should.equal(card.num);
  game.discarded[game.discarded.length - 1].suit.should.equal(card.suit);
}


describe('Unit tests for GameState functions', function () {
  it('testing compute_score', function () {
    const cards = [
      new Card(1, Suit.hearts),
      new Card(5, Suit.clubs),
      new Card(12, Suit.hearts),
      new Card(1, Suit.spades),
      new Card(10, Suit.hearts),
      new Card(13, Suit.hearts)
    ];

    const score = GameState.computeScore(cards);
    score.should.equal(5+10+10);
  });
});



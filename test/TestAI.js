const mocha = require('mocha');
const chai = require('chai');
const should = chai.should();
const AI = require("../src/AI").AI;
const Card = require("../src/GameState").Card;
const Suit = require("../src/GameState").Suit;

// make card
const c = (num, suit) => new Card(num, suit);

// make face up card
const cf = (num, suit) => {
  let card = new Card(num, suit);
  card.isFaceUp = true;
  return card;
};

const s = Suit.hearts;

function getSample() {
  return [
    c(1, s),
    cf(4, s),
    cf(3, s),
    c(13, s),
    c(1, s),
    c(1, s),
  ];
}

describe("Testing AI", function () {
  it("Should match before anything else", function () {
    let ai = new AI();
    ai.getDiscardChoice(c(4, s), getSample()).should.equal(4);
  });
  it("Should replace unknown card with special card", function () {
    let ai = new AI();
    ai.getDiscardChoice(c(1, s), getSample()).should.equal(0);
    ai = new AI();
    ai.getDiscardChoice(c(13, s), getSample()).should.equal(0);
  });
  it("Should replace known card with special card", function () {
    let ai = new AI();
    let cards = getSample().slice(0);
    cards[1].num = 9;
    cards[2].num = 8;
    ai.getDiscardChoice(c(1, s), cards).should.equal(1);
    cards[1].num = 1;
    ai.getDiscardChoice(c(2, s), cards).should.equal(2);
  });
  it("Should replace unknown number when small number picked up", function () {
    let ai = new AI();
    ai.getDiscardChoice(c(5, s), getSample()).should.equal(0);
    const cards = getSample().slice(0);
    cards[0] = cf(5, s);
    ai.getDiscardChoice(c(6, s), cards).should.equal(3);
  });

});


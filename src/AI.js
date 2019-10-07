const PickUpChoice = require("./GameState").PickUpChoice;

/*
How to pick up card:
- if discarded is a special card, pick it.
- else pick from deck

How to use picked up card:
- if can be matched then match.
- else if special card:
    - if avgKnownCards is above 7:
        - replace with worst known card
    - else replace with unknown card
- else:
    - if avg of known cards is above 7:
        - if picked up card is better than any card on board, replace
        - else discard that card
    - else:
        - if picked up card is less than 7, replace with unknown.
        - else discard picked up card
*/
class AI {
  constructor() {
    this.isMatched = []; // array of booleans. Each element represents whether corresponding card is matched.
    for (let i = 0; i < 6; i++) this.isMatched.push(false);
  }

  getPickUpChoice(lastDiscarded, aiCards) {
    const shouldPickupDiscarded = this.canBeMatched(lastDiscarded, aiCards) ||
      AI.isSpecialCard(lastDiscarded);
    return shouldPickupDiscarded ? PickUpChoice.discarded : PickUpChoice.deck;
  }

  getDiscardChoice(cardPickedUp, aiCards) {
    const avgOfKnownCards = this.getAvgOfKnownNotSpecialCards(aiCards);

    if (this.canBeMatched(cardPickedUp, aiCards)) {
      return this.getIndexOfCardToReplaceAfterMatching(cardPickedUp, aiCards);
    } else if (AI.isSpecialCard(cardPickedUp)) {
      if (avgOfKnownCards >= 7) {
        return this.getIndexOfWorstKnownCard(aiCards);
      } else {
        return this.getIndexOfUnknownCard(aiCards);
      }
    } else {
      if (avgOfKnownCards >= 7) {
        const worstKnownCardIndex = this.getIndexOfWorstKnownCard(aiCards);
        if (aiCards[worstKnownCardIndex].num > cardPickedUp.num) return worstKnownCardIndex;
        else return -1;
      } else {

        if (cardPickedUp.num < 7) return this.getIndexOfUnknownCard(aiCards);
        else return -1;
      }
    }
  }


  static isSpecialCard(card) {
    return card.num === 1 ||
      card.num === 2 ||
      card.num === 13;
  }

  canBeMatched(card, aiCards) {
    // check if card matches any unmatched card in rows
    for (let i = 0; i < aiCards.length; i++) {
      if (!aiCards[i].isFaceUp) continue;
      if (this.isMatched[i]) continue;
      if (aiCards[i].num === card.num) return true;
    }

    return false;
  }

  getIndexOfCardToReplaceAfterMatching(card, aiCards) {
    let i;
    for (i = 0; i < aiCards.length; i++) {
      if (!aiCards[i].isFaceUp) continue;
      if (this.isMatched[i]) continue;
      if (aiCards[i].num === card.num) break;
    }
    this.isMatched[i] = true;
    const result = (i > 2) ? i - 3 : i + 3;
    this.isMatched[result] = true;
    return result;
  }

  getIndexOfWorstKnownCard(aiCards) {
    let worstCardIndex = -1;
    for (let i = 0; i < aiCards.length; i++) {
      if (!aiCards[i].isFaceUp || this.isMatched[i] || AI.isSpecialCard(aiCards[i])) continue;
      if (worstCardIndex === -1 || aiCards[worstCardIndex].num < aiCards[i].num) {
        worstCardIndex = i;
      }
    }

    return worstCardIndex;
  }

  getIndexOfUnknownCard(aiCards) {
    for (let i = 0; i < aiCards.length; i++) {
      if (!aiCards[i].isFaceUp) return i;
    }
  }

  getAvgOfKnownNotSpecialCards(cards) {
    let numKnownCards = 0;
    let sum = 0;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].isFaceUp && !this.isMatched[i] && !AI.isSpecialCard(cards[i])) {
        numKnownCards++;
        sum += cards[i].num
      }
    }

    return sum / numKnownCards;
  }
}

exports.AI = AI;
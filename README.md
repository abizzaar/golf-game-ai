# Golf Game - AI vs Player

Engineering challenge for 2020 KCPB Fellowship

## Description

A console game for a single player to play Six Card Golf against an AI.
Here are the [rules](https://bicyclecards.com/how-to-play/six-card-golf/).

## System Design

The code is modularized into 4 classes: GameState, GameController,
Player, and AI. I've used a classic MVC (Model-View-Controller) approach
to maintain decoupling and separation of concerns.

The GameState represents the model of the game. 

The GameController controls each
round of the game, and interacts with the two players (Player and AI).

The Player class controls the View.

## AI Player

The AI Player is implemented using a risk-seeking, greedy strategy.

I came up with the algorithm myself. 

The AI player must make two decisions in each round:
- whether to pick up a card from the deck or the discarded pile
- which card to replace from its 2 rows of cards

It prioritizes importance of cards in the following way:
1. Matching columns
2. Special cards (Ace, 2, and King)
3. Smaller cards ( < 7 )
4. All other cards

## Data Structures and Algorithms
The algorithm for the AI player is the most interesting.

To shuffle the card deck, I used the popular Knuth Shuffle approach.

I used mostly arrays for data structures to maintain ordering.
Ordering is important for the players' cards, the deck, and the discarded pile.

## Edge Cases

The game ends when either:
- 9 rounds complete
- either player has all cards face up
- the deck is empty (impossible condition to meet with just two players)

## Language and Libraries

|               |               | 
|:------------- |-------------  | 
| JavaScript      | Only Python and JS have the libraries to build such an app quickly. I chose JS because it's faster. |
| Mocha/Chai      | Classic BDD test runner and assertion library combo     | 
| Inquirer | Handles stdin and stdout, and enables interactive selection from list on console | 
| Chalk | Colorizes text on console | 
| Text-Table | Formats tables to print onto the console | 
| Knuth-Shuffle | Shuffles array | 
| Clear | Safely clears the terminal screen | 

## Usage

```bash
npm install
npm start
```

## Testing

```bash
npm install
npm test
```

## Example Game
```bash
Your Cards
----  8 ♣️  ----
4 ♦️  ----  ----


AI's Cards
----  J ♠️  Q ♦️
----  ----  ----


Discarded Pile
5 ♦️


? Pick up a card from deck or discarded: Discarded
You picked up 5 ♦️  

? Which card will you discard? (Use arrow keys)
❯ 1. ---- 
  2. 8 ♣️ 
  3. ---- 
  4. 4 ♦️ 
  5. ---- 
  6. ---- 
  x. 5 ♦️ (Card Picked up) 
```
## Future Work

I'd love to continue developing this. The next steps are:
- incorporating Typescript for type safety
- building an AI that learns from each game, and has memory of cards seen
- writing more test cases

Please reach out at abizar@u.northwestern.edu if you'd like to help out.


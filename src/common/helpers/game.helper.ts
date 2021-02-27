import shortid from "shortid";
import { Cards, ICard } from "../models/models";

const cards: Cards[] = [
  Cards.card1,
  Cards.card2,
  Cards.card3,
  Cards.card4,
  Cards.card5,
  Cards.card6,
  Cards.card7,
  Cards.card8,
  Cards.card9,
  Cards.card10,
  Cards.card11,
  Cards.card12
];

const generateUniqCards = (count: number): ICard[] => {
  const cardsCopy: Cards[] = [...cards];
  let mixedCards: ICard[] = [];

  for (let i = 0; i < count; i += 1) {
    const cardToInsert: number = Math.floor(Math.random() * cardsCopy.length);
    mixedCards = [
      ...mixedCards,
      {
        image: cardsCopy.splice(cardToInsert, 1)[0],
        isFlipped: true,
        id: '',
        found: false
      }
    ];
  }
  return mixedCards;
};

export const generateCards = (size: number): ICard[] => {
  const count = size / 2;

  const uniqCards: ICard[] = generateUniqCards(count);

  let tempCards: ICard[] = [...uniqCards, ...uniqCards];
  let mixedCards: ICard[] = [];

  for (let i = 0; i < size; i += 1) {
    const cardToInsert: number = Math.floor(Math.random() * tempCards.length);
    mixedCards = [...mixedCards, tempCards.splice(cardToInsert, 1)[0]];
  }

  mixedCards = mixedCards.map(card => ({ ...card, id: shortid() }));
  return mixedCards;
};

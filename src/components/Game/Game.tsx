import React from 'react';
import shortid from 'shortid';
import { TypeOfTag } from 'typescript';
import { Cards } from '../../common/models/models';
import Card from './components/Card/Card';
import './game.scss';

interface ICard {
  image: Cards,
  isFlipped: boolean,
  id: string,
  found: boolean;
}

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
  Cards.card12,
];

const generateUniqCards = (count: number): ICard[] => {
  const cardsCopy: Cards[] = [...cards];
  let mixedCards: ICard[] = [];

  for (let i = 0; i < count; i += 1) {
    const cardToInsert: number = Math.floor(Math.random() * cardsCopy.length);
    mixedCards = [...mixedCards,
      {
        image: cardsCopy.splice(cardToInsert, 1)[0],
        isFlipped: true,
        id: '',
        found: false,
      }
    ];
  }
  return mixedCards;
};

const generateCards = (size: number): ICard[] => {
  const count = size / 2;

  const uniqCards: ICard[] = generateUniqCards(count);

  let tempCards: ICard[] = [...uniqCards, ...uniqCards];
  let mixedCards: ICard[] = [];

  for (let i = 0; i < size; i += 1) {
    const cardToInsert: number = Math.floor(Math.random() * tempCards.length);
    mixedCards = [...mixedCards, tempCards.splice(cardToInsert, 1)[0]];
  }

  mixedCards = mixedCards.map((card) => ({ ...card, id: shortid() }));
  return mixedCards;
};

interface IState {
  cards: ICard[],
  size: number,
  firstCard: ICard | null,
  secondCard: ICard | null,
}

export default class Game extends React.Component {
  state: IState;

  constructor(props: { width: number; height: number }) {
    super(props);
    const { width = 6, height = 4 } = props;
    const size: number = width * height;
    this.state = {
      size: size,
      cards: generateCards(size),
      firstCard: null,
      secondCard: null,
    };
  }

  changeFlipped(cardId: string) {
    const cardIndex = this.state.cards.findIndex(({ id }) => id === cardId);

    const changedCard: ICard = { ...this.state.cards[cardIndex], isFlipped: !this.state.cards[cardIndex].isFlipped };
    let cardsCopy = this.state.cards.slice();
    cardsCopy.splice(cardIndex, 1, changedCard);

    this.setState((prevState: IState) => {
      const newState = {
        ...prevState,
        cards: cardsCopy,
      };
      if (!prevState.firstCard && changedCard.isFlipped) {
        return { ...newState, firstCard: changedCard };
      }
      if (!prevState.secondCard && changedCard.isFlipped) {
        let successGuess: boolean = false;
        if (prevState.firstCard && prevState.firstCard.image === changedCard.image) {
          console.log(true);
          successGuess = true;
        }
        cardsCopy = cardsCopy.map((card) => {
          if (card.id === (prevState.firstCard as ICard).id || card.id === (changedCard as ICard).id) {
            return { ...card, found: successGuess };
          }
          return card;
        });
        return {
          ...prevState,
          cards: cardsCopy,
          secondCard: { ...changedCard, found: successGuess },
          firstCard: { ...prevState.firstCard, found: successGuess },
        };
      }

      if (prevState.firstCard && prevState.secondCard) {
        cardsCopy = cardsCopy.map((card) => {
          if (card.id === (prevState.firstCard as ICard).id || card.id === (prevState.secondCard as ICard).id) {
            return { ...card, isFlipped: false };
          }
          return card;
        });
        return {
          ...prevState,
          cards: cardsCopy,
          firstCard: changedCard,
          secondCard: null,
        };
      }

      return {
        ...prevState,
      }
    });
  }

  getFieldSize() {
    const { size } = this.state;

    if (size === 24) {
      return 'large';
    }
    if (size === 16) {
      return 'medium';
    }

    return 'small';
  }

  componentDidMount() {
    setTimeout(() => {
      const flippedCards: ICard[] = this.state.cards.map((card) => ({ ...card, isFlipped: false }));
      this.setState({
        cards: flippedCards,
        }
      );
    }, 5000);
  }

  render() {
      const { cards } = this.state;
      return (
        <div className="game">
          <div className="statistics">
            <p>Score:</p>
            <p>Time:</p>
          </div>
          <div className={`game-field game-field_${this.getFieldSize()}`}>
            {cards.map((card: ICard) => (
              <div className="game-field__item" key={card.id}>
                <Card
                  cardClick={() => this.changeFlipped(card.id)}
                  isFlipped={card.isFlipped}
                  imgName={card.image}
                  found={card.found}
                />
              </div>
            ))}
          </div>
        </div>
      );
  }
}

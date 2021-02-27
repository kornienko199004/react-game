import React from 'react';
import shortid from 'shortid';
import { TypeOfTag } from 'typescript';
import { generateCards } from '../../common/helpers/game.helper';
import { Cards, ICard } from '../../common/models/models';
import Card from './components/Card/Card';
import './game.scss';

interface IState {
  cards: ICard[];
  size: number;
  firstCard: ICard | null;
  secondCard: ICard | null;
  isResumed: boolean;
}

interface IProps {
  width: number;
  height: number;
  cards: ICard[];
  firstCard: ICard | null;
  secondCard: ICard | null;
  paused(cards: ICard[]): void;
  isResumed: boolean;
}

export default class Game extends React.Component<IProps> {
  state: IState;

  constructor(props: IProps) {
    super(props);
    const { width = 6, height = 4, cards, firstCard, secondCard, isResumed } = props;
    console.log('cards', cards);
    const size: number = width * height;
    this.state = {
      size,
      cards,
      firstCard,
      secondCard,
      isResumed,
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
    console.log('component Did Mount');
    setTimeout(() => {
      const flippedCards: ICard[] = this.state.cards.map((card) => ({ ...card, isFlipped: false }));
      this.setState({
        cards: flippedCards,
        }
      );
    }, 5000);
  }

  animationCheck = (currentCard: ICard): boolean => {
    const { firstCard, secondCard } = this.state;
    if (firstCard && secondCard) {
      if (firstCard.image === secondCard.image && firstCard.image === currentCard.image) {
        return true;
      }
    }
    return false;
  }

  render() {
      const { cards } = this.state;

      return (
        <div className="game">
          <button onClick={() => this.props.paused(this.state.cards)}>
            Pause
          </button>
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
                  animationOn={ this.animationCheck(card) }
                />
              </div>
            ))}
          </div>
        </div>
      );
  }
}

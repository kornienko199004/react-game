import React from 'react';
import { formatTime } from '../../common/helpers/game.helper';
import { ICard, IGameData, ISettings } from '../../common/models/models';
import Card from './components/Card/Card';
import './game.scss';

interface IState {
  cards: ICard[];
  size: number;
  firstCard: ICard | null;
  secondCard: ICard | null;
  isResumed: boolean;
  startTime: boolean;
  attempts: number;
  time: number;
}

interface IProps {
  settings: ISettings;
  cards: ICard[];
  firstCard: ICard | null;
  secondCard: ICard | null;
  paused(data: IGameData): void;
  isResumed: boolean;
  attempts: number;
  time: number;
}

export default class Game extends React.Component<IProps> {
  state: IState;

  constructor(props: IProps) {
    super(props);
    const { settings, cards, firstCard, secondCard, isResumed, attempts, time } = props;
    const { width, height } = settings;
    console.log('cards', cards);
    const size: number = width * height;
    this.state = {
      size,
      cards,
      firstCard,
      secondCard,
      isResumed,
      startTime: isResumed,
      attempts,
      time,
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
    }, () => {
      this.setState({
        attempts: this.state.attempts + 1,
      })
    });
  }

  getFieldSize() {
    const { size } = this.state;

    if (size === 24) {
      return 'large';
    }
    if (size === 18) {
      return 'medium';
    }

    return 'small';
  }

  componentDidMount() {
    console.log('component Did Mount');
    const { delay } = this.props.settings;
    setTimeout(() => {
      const flippedCards: ICard[] = this.state.cards.map((card) => ({ ...card, isFlipped: false }));
      this.setState({
        cards: flippedCards,
        startTime: true,
      });
    }, delay * 1000);
    this.tick();
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

  pauseHandler = () => {
    this.setState({
      startTime: false,
    });

    const data: IGameData = {
      cards: this.state.cards,
      time: this.state.time,
      attempts: this.state.attempts,
      settings: this.props.settings,
    };
    this.props.paused(data);
  };

  tick() {
    setTimeout(() => {
      if (this.state.startTime) {
        this.setState({
          time: this.state.time + 1,
        });
      }
      this.tick();
    }, 1000);
  }

  render() {
    const { cards } = this.state;

    return (
      <div className="game">
        <button onClick={this.pauseHandler}>
          Pause
          </button>
        <div className="statistics">
          <div className="score-wrapper">
            <p className="score-wrapper__caption">Attempts:</p>
            <p className="score-wrapper__score">{this.state.attempts}</p>
          </div>

          <div className="time-wrapper">
            <p className="time-wrapper__caption">Time:</p> <p className="time-wrapper__time">{formatTime(this.state.time)}</p>
          </div>
        </div>
        <div className={`game-field game-field_${this.getFieldSize()}`}>
          {cards.map((card: ICard) => (
            <div className="game-field__item" key={card.id}>
              <Card
                cardClick={() => this.changeFlipped(card.id)}
                isFlipped={card.isFlipped}
                imgName={card.image}
                found={card.found}
                animationOn={this.animationCheck(card)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

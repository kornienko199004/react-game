import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, IconButton } from '@material-ui/core';
import { Fullscreen, FullscreenExit } from '@material-ui/icons';
import { formatTime } from '../../common/helpers/game.helper';
import { ICard, IGameData, IGameWinData, ISettings } from '../../common/models/models';
import StorageService from '../../common/services/storage.service';
import Card from './components/Card/Card';
import WinBanner from './components/WinBanner/WinBanner';
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
  haveWin: boolean;
  fullScreen: boolean;
}

interface IProps extends RouteComponentProps {
  settings: ISettings;
  cards: ICard[];
  firstCard: ICard | null;
  secondCard: ICard | null;
  paused(data: IGameData): void;
  isResumed: boolean;
  attempts: number;
  time: number;
  storageService: StorageService;
  soundsOn: boolean;
  autoPlay?: boolean;
}

class Game extends React.Component<IProps> {
  state: IState;
  storageService: StorageService;
  flipSound: any;
  foundSound: any;
  timer: ReturnType<typeof setTimeout> | undefined;

  constructor(props: IProps) {
    super(props);
    let { settings, cards, attempts, time } = props;
    const { firstCard, secondCard, isResumed, storageService } = props;
    this.storageService = storageService;
    let startTime = isResumed;

    if (cards.length === 0) {
      const savedGameData: IGameData | null = this.storageService.loadGame();
      if (savedGameData) {
        settings = savedGameData.settings;
        cards = savedGameData.cards;
        attempts = savedGameData.attempts;
        time = savedGameData.time;
        startTime = savedGameData.startTime || false;
      } else {
        this.props.history.push('/');
      }
    }

    const { width, height } = settings;
    const size: number = width * height;
    this.state = {
      size,
      cards,
      firstCard,
      secondCard,
      isResumed,
      startTime,
      attempts,
      time,
      haveWin: false,
      fullScreen: false,
    };

    const flipCard = `${process.env.PUBLIC_URL}/card_flip.mp3`;
    const foundPair = `${process.env.PUBLIC_URL}/cards_found.mp3`;
    this.flipSound = new Audio(flipCard);
    this.flipSound.volume = settings.soundsVolume;
    this.foundSound = new Audio(foundPair);
    this.foundSound.volume = settings.soundsVolume;
  }

  changeFlipped(cardId: string) {
    const cardIndex = this.state.cards.findIndex(({ id }) => id === cardId);

    if (this.state.cards[cardIndex].isFlipped) {
      return;
    }

    if (this.props.soundsOn) {
      this.flipSound.volume = this.storageService.settings.soundsVolume;
      this.flipSound.play();
    }

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
          if (this.props.soundsOn) {
            this.flipSound.volume = this.storageService.settings.soundsVolume;
            this.foundSound.play();
          }
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
      }, () => {
        const win = this.checkWin();
        if (win) {
          this.setState({
            haveWin: win,
          });
          if (!this.props.autoPlay) {
            this.onWinHandler();
          }
        } else {
          this.saveGame();
        }
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

  autoPlaying() {
    const { cards } = this.state;
    const acceptedCards = cards.filter((item) => !item.found && !item.isFlipped);
    if (acceptedCards.length > 0) {
      const index = Math.floor(Math.random() * acceptedCards.length);
      const card = acceptedCards[index];
      this.changeFlipped(card.id);

      setTimeout(() => {
        this.autoPlaying();
      }, 1000);
    }
  }

  componentDidMount() {
    const { delay } = this.props.settings;
    this.timer = setTimeout(() => {
      const flippedCards: ICard[] = this.state.cards.map((card) => ({ ...card, isFlipped: false }));
      this.setState({
        cards: flippedCards,
        startTime: true,
      }, () => {
        if (this.props.autoPlay) {
          setTimeout(() => {
            this.autoPlaying();
          }, 1000);
        }
      });
    }, delay * 1000);
    this.tick();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
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
      if (this.state.startTime && !this.state.haveWin) {
        this.setState({
          time: this.state.time + 1,
        });
      }
      this.tick();
    }, 1000);
  }

  saveGame() {
    const data: IGameData = {
      cards: this.state.cards,
      time: this.state.time,
      attempts: this.state.attempts,
      settings: this.props.settings,
      startTime: this.state.startTime,
    };

    this.storageService.saveGame(data);
  }

  checkWin() {
    const haveWin = this.state.cards.filter((card: ICard) => !card.found).length === 0;
    return haveWin;
  }

  getFieldSizeString(): string {
    const { settings } = this.props;
    return `${settings.width}x${settings.height}`;
  }

  getScore(): number {
    const { settings } = this.props;
    const { time, attempts } = this.state;
    const points = ((settings.width * settings.height * settings.delay) ** 2) / (Math.sqrt(time * attempts));
    return Number(points.toFixed(0));
  }

  onWinHandler() {
    const data: IGameWinData = {
      time: this.state.time,
      attempts: this.state.attempts,
      score: this.getScore(),
      fieldSize: this.getFieldSizeString(),
    };
    this.storageService.onWin(data);
  }

  fullScreenToggle = () => {
    this.setState({
      fullScreen: !this.state.fullScreen,
    });
  }

  render() {
    const { cards, fullScreen } = this.state;
    const { autoPlay } = this.props;

    return (
      <div className={`game ${fullScreen ? 'game_fullscreen' : ''}`}>
        <div className="statistics">
          <div className="statistics__inner">
            <Button
              variant="contained"
              className="pause-button"
              onClick={this.pauseHandler}>{autoPlay ? 'Stop' : 'Pause'}</Button>
          </div>
          <div className="statistics__inner">
            <div className="score-wrapper">
              <p className="score-wrapper__caption">Attempts:</p>
              <p className="score-wrapper__score">{this.state.attempts}</p>
            </div>

            <div className="time-wrapper">
              <p className="time-wrapper__caption">Time:</p> <p className="time-wrapper__time">{formatTime(this.state.time)}</p>
            </div>
          </div>
          <div className="statistics__inner">
            <IconButton color="primary" onClick={this.fullScreenToggle} component="span">
              {fullScreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </div>
        </div>
        <div className={`game-field game-field_${this.getFieldSize()}`}>
          {autoPlay && <div className="game__overlay"></div>}
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
        {this.state.haveWin && <WinBanner time={this.state.time} attempts={this.state.attempts} />}
      </div>
    );
  }
}

export default withRouter(Game);
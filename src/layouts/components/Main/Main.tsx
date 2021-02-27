import React from 'react';
import './main.scss';
import rsschool from './assets/rsschool.svg';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { ICard, routes } from '../../../common/models/models';
import Game from '../../../components/Game/Game';
import Autoplay from '../../../components/Autoplay/Autoplay';
import Settings from '../../../components/Settings/Settings';
import Statistics from '../../../components/Statistics/Statistics';
import Footer from '../../../components/Footer/Footer';
import Header from '../../../components/Header/Header';
import { generateCards } from '../../../common/helpers/game.helper';

interface IState {
  cards: ICard[];
  size: number;
  firstCard: ICard | null;
  secondCard: ICard | null;
  width: number;
  height: number;
  isPaused: boolean;
  isResumed: boolean;
}

const DEFAULT_WIDTH = 6;
const DEFAULT_HEIGHT= 4;

class Main extends React.Component<RouteComponentProps<any>, any> {
  state: IState;
  history: any;

  constructor(props: any) {
    super(props);
    this.history = this.props.history;
    const size = DEFAULT_WIDTH * DEFAULT_HEIGHT;
    this.state = {
      size: size,
      cards: [],
      firstCard: null,
      secondCard: null,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      isPaused: false,
      isResumed: false,
    }
  }

  pausedHandler = (currentGameCards: ICard[]) => {
    this.history.push('/');
    this.setState({
      isPaused: true,
      cards: currentGameCards,
    })
  }

  resumeHandler = () => {
    this.setState({
      isResumed: true,
    });
    this.history.push('/game');
  }

  navigationLinkHandler = (e: React.MouseEvent, path: string, name: string) => {
    e.preventDefault();
    if (name === 'New Game') {
      this.setState({
        cards: generateCards(this.state.size),
        isResumed: false,
      });
    }
    this.history.push(path)
  }

  render() {
    return (
      <div className="wrapper">
        <Header />
        <div className="page">
          <Switch>
            <Route exact path="/">
              <h1>Menu</h1>
              {this.state.isPaused && (<button onClick={this.resumeHandler}>Resume</button>)}
              {routes.map(({ button, path }) => (
                <div key={button}>
                  <a href={path} onClick={(e: React.MouseEvent) => this.navigationLinkHandler(e, path, button)}>{button}</a>
                  {/* <Link to={path}>{button}</Link> */}
                </div>
              ))}
            </Route>
            <Route exact path="/game">
              <Game
                {...{ ...this.state, paused: this.pausedHandler } }
              />
            </Route>
            <Route exact path="/autoplay">
              <Autoplay />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
            <Route exact path="/statistics">
              <Statistics />
            </Route>
          </Switch>
        </div>
  
        <Footer logo={rsschool} />
      </div>
    );
  }

}

export default withRouter(Main);

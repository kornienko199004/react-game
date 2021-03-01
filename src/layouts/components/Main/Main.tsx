import React from 'react';
import './main.scss';
import rsschool from './assets/rsschool.svg';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { ICard, IGameData, ISettings, routes } from '../../../common/models/models';
import Game from '../../../components/Game/Game';
import Autoplay from '../../../components/Autoplay/Autoplay';
import Settings from '../../../components/Settings/Settings';
import Statistics from '../../../components/Statistics/Statistics';
import Footer from '../../../components/Footer/Footer';
import Header from '../../../components/Header/Header';
import { generateCards } from '../../../common/helpers/game.helper';
import StorageService from '../../../common/services/storage.service';
// @ts-ignore
import music from './assets/music.mp3';

interface IState {
  cards: ICard[];
  firstCard: ICard | null;
  secondCard: ICard | null;
  settings: ISettings;
  isPaused: boolean;
  isResumed: boolean;
  time: number;
  attempts: number;
  theme: string;
}

class Main extends React.Component<RouteComponentProps<any>, any> {
  state: IState;
  history: any;
  storageService: StorageService;
  settings: ISettings;
  musicPlayer: any;

  constructor(props: any) {
    super(props);

    console.log('constructor');
    this.storageService = new StorageService();
    this.settings = this.storageService.settings;
    this.history = this.props.history;
    this.state = {
      cards: [],
      firstCard: null,
      secondCard: null,
      settings: this.settings,
      isPaused: false,
      isResumed: false,
      time: 0,
      attempts: 0,
      theme: this.settings.theme,
    }
    this.musicPlayer = new Audio(music);
    this.musicPlayer.loop = true
  }

  pausedHandler = (currentGameData: IGameData) => {
    this.history.push('/');
    this.setState({
      isPaused: true,
      cards: currentGameData.cards,
      time: currentGameData.time,
      attempts: currentGameData.attempts,
      settings: currentGameData.settings,
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
      const settings = this.storageService.settings;
      this.setState({
        cards: generateCards(settings),
        isResumed: false,
        settings,
        time: 0,
        attempts: 0,
      });
    }
    this.history.push(path)
  }

  updateSettingsHandler = (newSettings: ISettings) => {
    this.storageService.updateSettings(newSettings);
    this.setState({
      theme: newSettings.theme,
    });
    // this.setState({
    //   settings: newSettings,
    // });
    console.log('update settings', newSettings);
  }

  componentDidMount() {
    this.musicPlayer.play();
  }

  render() {
    return (
      <div className={`wrapper ${this.state.theme === 'dark' ? 'wrapper_theme_dark' : ''}`}>
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
                {...{ ...this.state, paused: this.pausedHandler, storageService: this.storageService } }
              />
            </Route>
            <Route exact path="/autoplay">
              <Autoplay />
            </Route>
            <Route exact path="/settings">
              <Settings {...{ storageService: this.storageService, updateSettings: this.updateSettingsHandler }} />
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

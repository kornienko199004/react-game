import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DehazeIcon from '@material-ui/icons/Dehaze';
import './container.scss';
import rsschool from './assets/rsschool.svg';
import { Link, Route, Switch } from 'react-router-dom';
import { IRouterItem } from '../../../common/models/models';
import Game from '../../../components/Game/Game';
import Autoplay from '../../../components/Autoplay/Autoplay';
import Settings from '../../../components/Settings/Settings';
import Statistics from '../../../components/Statistics/Statistics';
import Footer from '../../../components/Footer/Footer';
import Header from '../../../components/Header/Header';

// const useStyles = makeStyles({
//   list: {
//     width: 280,
//   },
//   fullList: {
//     width: 'auto',
//   },
// });

// type Anchor = 'top' | 'left' | 'bottom' | 'right';

const routes: IRouterItem[] = [
  {
    button: 'New Game',
    path: '/game',
  },
  {
    button: 'Autoplay',
    path: '/autoplay',
  },
  {
    button: 'Settings',
    path: '/settings',
  },
  {
    button: 'Statistics',
    path: 'statistics',
  },
];

export default function Container() {
  // const classes = useStyles();
  // const [state, setState] = React.useState({
  //   top: false,
  //   left: false,
  //   bottom: false,
  //   right: false,
  // });

  // const toggleDrawer = (anchor: Anchor, open: boolean) => (
  //   event: React.KeyboardEvent | React.MouseEvent,
  // ) => {
  //   if (
  //     event &&
  //     event.type === 'keydown' &&
  //     ((event as React.KeyboardEvent).key === 'Tab' ||
  //       (event as React.KeyboardEvent).key === 'Shift')
  //   ) {
  //     return;
  //   }

  //   setState({ ...state, [anchor]: open });
  // };

  // const list = (anchor: Anchor) => (
  //   <div
  //     className={clsx(classes.list, 'sidebar')}
  //     role="presentation"
  //     onKeyDown={toggleDrawer(anchor, false)}
  //   >

  //   <header className="sidebar__header">
  //     <div className="logo sidebar__logo">
  //       <p className="logo__title">Memory Game</p>
  //       <p className="logo__description">train your memory</p>
  //     </div>

  //     <button onClick={toggleDrawer(anchor, false)}>X</button>
  //   </header>
  //     <List>
  //       {routes.map(({ button, path }) => (
  //         <ListItem button key={button} className="navigation__item">
  //           <Link className="navigation__link" to={path}>{button}</Link>
  //         </ListItem>
  //       ))}
  //     </List>
  //   </div>
  // );

  return (
    <div className="wrapper">
      <Header>
          <button>
            <Link to="/">pause</Link>
          </button>
      </Header>
      {/* <div className="header">
        <div className="header__inner">
          <div className="logo">
            <p className="logo__title">Memory Game</p>
            <p className="logo__description">train your memory</p>
          </div>
            <button>
              <Link to="/">pause</Link>
            </button>
          <React.Fragment key={'right'}>
            <button className="menu-button" onClick={toggleDrawer('right', true)}>
              <DehazeIcon />
            </button>
            <SwipeableDrawer
              anchor={'right'}
              open={state['right']}
              onClose={toggleDrawer('right', false)}
              onOpen={toggleDrawer('right', true)}
            >
              {list('right')}
            </SwipeableDrawer>
          </React.Fragment>
        </div>
      </div> */}
      <div className="page">
        <Switch>
          <Route exact path="/">
            <h1>Menu</h1>
            {routes.map(({ button, path }) => (
              <div key={button}>
                <Link to={path}>{button}</Link>
              </div>
            ))}
          </Route>
          
    {/* const { width = 6, height = 4 } = props;
    const size: number = width * height;
    this.state = {
      size: size,
      cards: generateCards(size),
      firstCard: null,
      secondCard: null,
    }; */}
          <Route exact path="/game">
            {/* <Game size={width * height} cards={} firstCard={null} secondCard={null} /> */}
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
      {/* <div className="footer">
        <div className="footer__inner">
          <p className="feedback">
            Made by <a href="https://github.com/kornienko199004" rel="noreferrer" target="_blank">kornienko199004</a> for
        </p>
          <div className="rsschool-logo">
            <a href="https://rs.school/js/" rel="noreferrer" target="_blank">
              <img src={rsschool} alt="rsschool" />
            </a>
          </div>
        </div>
      </div> */}
    </div>
  );
}

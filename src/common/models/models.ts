export interface IRouterItem {
  button: string;
  path: string;
}

export enum Cards {
  'card1' = 'card1',
  'card2' = 'card2',
  'card3' = 'card3',
  'card4' = 'card4',
  'card5' = 'card5',
  'card6' = 'card6',
  'card7' = 'card7',
  'card8' = 'card8',
  'card9' = 'card9',
  'card10' = 'card10',
  'card11' = 'card11',
  'card12' = 'card12',
}

export interface ICard {
  image: Cards,
  isFlipped: boolean,
  id: string,
  found: boolean;
}

export const routes: IRouterItem[] = [
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
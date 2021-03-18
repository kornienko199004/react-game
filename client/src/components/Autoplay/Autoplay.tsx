import React from 'react';
import { useHistory } from 'react-router-dom';
import { generateCards } from '../../common/helpers/game.helper';
import { ICard, ISettings } from '../../common/models/models';
import StorageService from '../../common/services/storage.service';
import Game from '../Game/Game';

interface IState {
  cards: ICard[];
  firstCard: ICard | null;
  secondCard: ICard | null;
  settings: ISettings;
  isPaused: boolean;
  isResumed: boolean;
  time: number;
  attempts: number;
  // theme: string;
  // musicOn: boolean;
  soundsOn: boolean;
  autoPlay: boolean;
}

interface IProps {
  storageService: StorageService;
}

export default function Autoplay(props: IProps) {
  const { storageService } = props;
  const settings = storageService.settings;
  const cards: ICard[] = generateCards(settings);

  const state: IState = {
    cards,
    firstCard: null,
    secondCard: null,
    settings,
    time: 0,
    attempts: 0,
    isPaused: false,
    isResumed: false,
    soundsOn: false,
    autoPlay: true,
  };

  const history = useHistory();

  const pausedHandler = () => {
    history.push('/');
  };

  return (
    <>
        <Game
        {...{ ...state, paused: pausedHandler, storageService } }
      />
    </>
  );
}

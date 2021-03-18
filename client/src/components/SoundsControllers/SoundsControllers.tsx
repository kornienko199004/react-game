import React from 'react';
import { Tooltip } from '@material-ui/core';
import classnames from 'classnames';

interface IProps {
  soundsIcon: string;
  musicIcon: string;
  soundsOn: boolean;
  musicOn: boolean;
  soundsToggle(): void;
  musicToggle(): void;
}

export default function SoundsControllers(props: IProps) {
  const { soundsIcon, soundsOn, musicIcon, musicOn, soundsToggle, musicToggle } = props;
  return (
    <div className="game-controls">
    <Tooltip title="Sounds ON / OFF">
      <button
        className={classnames('game-controls__button', `${soundsOn ? '' : 'game-controls__button_mute'}`)}
        onClick={soundsToggle}>
        <img src={soundsIcon} alt="Sound ON / OFF"/>
      </button>
    </Tooltip>
    <Tooltip title="Music ON / OFF" >
      <button
        className={`game-controls__button ${musicOn ? '' : 'game-controls__button_mute'}`}
        onClick={musicToggle} >
        <img src={musicIcon} alt="Music ON / OFF"/>
      </button>
    </Tooltip>
  </div>
  );
}

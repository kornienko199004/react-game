import React, { useState } from 'react';
import { Cards } from '../../common/models/models';
import Card from './components/Card/Card';
import './game.scss';

export default function Game() {
  const [flipped, setFlipped] = useState(false);
  const [flipped2, setFlipped2] = useState(false);
  return (
    <div className="game">
      <h2>Game Component</h2>
      <div className="game-field">
        <div className="game-field__item">
          <Card cardClick={() => setFlipped(!flipped)} isFlipped={flipped} imgName={Cards.card7} />
        </div>

        <div className="game-field__item">
          <Card cardClick={() => setFlipped2(!flipped2)} isFlipped={flipped2} imgName={Cards.card9} />
        </div>
      </div>
    </div>
  );
}

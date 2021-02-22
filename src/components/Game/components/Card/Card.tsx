import React from 'react';
import './card.scss';
import card1 from './assets/1.png';
import card2 from './assets/2.png';
import card3 from './assets/3.png';
import card4 from './assets/4.png';
import card5 from './assets/5.png';
import card6 from './assets/6.png';
import card7 from './assets/7.png';
import card8 from './assets/8.png';
import card9 from './assets/9.png';
import card10 from './assets/10.png';
import card11 from './assets/11.png';
import card12 from './assets/12.png';
import { Cards } from '../../../../common/models/models';

const cardsMap = {
  [Cards.card1]: card1,
  [Cards.card2]: card2,
  [Cards.card3]: card3,
  [Cards.card4]: card4,
  [Cards.card5]: card5,
  [Cards.card6]: card6,
  [Cards.card7]: card7,
  [Cards.card8]: card8,
  [Cards.card9]: card9,
  [Cards.card10]: card10,
  [Cards.card11]: card11,
  [Cards.card12]: card12,
}

export default function Card(props: { cardClick(): void, isFlipped: boolean, imgName: Cards }) {
  const { cardClick, isFlipped, imgName } = props;
  return (
    <div className="card-wrapper" onClick={cardClick}>
      <div className={"card" + (isFlipped ? " flipped" : "")}>
        <div className="card__back"></div>
        <div className="card__front">
          <img src={cardsMap[imgName]} className="card__image" alt="card__image" />
        </div>
      </div>
    </div>
  );
}

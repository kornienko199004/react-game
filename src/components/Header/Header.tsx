import React from 'react';

export default function Header(props: { children?: any }) {
  return (

    <div className="header">
      <div className="header__inner">
        <div className="logo">
          <p className="logo__title">Memory Game</p>
          <p className="logo__description">train your memory</p>
        </div>
        {props.children}
      </div>
    </div>
  );
}

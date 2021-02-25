import React from 'react';

export default function Header(props: { children: any }) {
  return (

    <div className="header">
      <div className="header__inner">
        <div className="logo">
          <p className="logo__title">Memory Game</p>
          <p className="logo__description">train your memory</p>
        </div>
        {props.children}
        {/* <React.Fragment key={'right'}>
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
      </React.Fragment> */}
      </div>
    </div>
  );
}

import React from 'react';
import './App.css';
import Main from './layouts/components/Main/Main';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

function App(match: any) {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Main />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

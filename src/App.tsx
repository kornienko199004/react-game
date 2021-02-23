import React from 'react';
import './App.css';
import Container from './layouts/components/Container/Container';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

function App(match: any) {
  console.log(match);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Container />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

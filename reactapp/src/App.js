import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Home from './Home';
import Game from './Game';
import Sign from './Sign';

import names from './reducers/names';
import gameName from './reducers/gameName';
import token from './reducers/token';
import currentGame from './reducers/currentGame';

import {Provider} from 'react-redux';

import {createStore, combineReducers}  from 'redux';

const store = createStore(combineReducers({names, gameName, token, currentGame}));

function App() {

  return(
    <Provider store={store}>
      <Router>
       <Switch>
       <Route exact path="/">
           <Sign />
         </Route>
         <Route exact path="/home">
           <Home />
         </Route>
         <Route path="/game">
           <Game />
         </Route>
       </Switch>
     </Router>
     </Provider>
  );
}

export default App;

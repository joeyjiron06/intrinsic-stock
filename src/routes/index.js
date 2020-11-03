import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './home';
import StockDetails from './stockDetails';

export default () => (
  <Router basename={process.env.PUBLIC_URL || ''}>
    <Switch>
      <Route exact path="/stock/:tickerSymbol" >
        <StockDetails />
      </Route>

      <Route exact path="/" >
        <Home />
      </Route>
      {/* no match just redirect to login page */}
      {/* <Route component={Home} /> */}
    </Switch>
  </Router>
);

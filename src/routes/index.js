import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './home';
import StockDetails from './stockDetails';

export default () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/stock/:tickerSymbol" component={StockDetails} />
      {/* no match just redirect to login page */}
      <Route component={Home} />
    </Switch>
  </Router>
);

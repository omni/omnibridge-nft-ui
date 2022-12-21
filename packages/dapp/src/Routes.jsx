import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { About } from './pages/About';
import { CreateNFT } from './pages/CreateNFT';
import { History } from './pages/History';
import { Home } from './pages/Home';

export const Routes = () => (
  <Switch>
    <Route exact path="/bridge" component={Home} />
    <Route exact path="/history" component={History} />
    <Route exact path="/create" component={CreateNFT} />
    <Route exact path="/about" component={About} />
    <Redirect to="/bridge" />
  </Switch>
);

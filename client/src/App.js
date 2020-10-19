import React from 'react';
import logo from './logo.svg';
import './App.css';
import Landing from './components/Landing';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Switch>
      <Route path='/dashboard' component={Dashboard} />
      <Route path='/' component={Landing} />
    </Switch>
  );
}

export default App;

import React from 'react';
import './App.css';
import Landing from './components/Landing';
import { Route, Switch } from 'react-router-dom';
import PageLayout from './components/PageLayout';
import Feed from './components/Feed';
// import { USER_KEY } from './store/auth';
import Dashboard from './components/Dashboard';

function App() {
  // const user = JSON.parse(localStorage.getItem(USER_KEY))

  return (
    <Switch>
      <Route path='/dashboard'
        component={() => <PageLayout component={() => <Dashboard/>} />}
      />
      <Route path='/likes'
        component={() => <PageLayout component={() => <Feed action={`/posts/liked`} />} />}
      />
      <Route exact path='/'
        component={Landing}
      />
    </Switch>
  );
}

export default App;

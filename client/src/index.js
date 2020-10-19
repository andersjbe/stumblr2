import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Grommet } from 'grommet'
import theme from './theme'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { TOKEN_KEY, USER_KEY } from './store/auth';

const localToken = window.localStorage.getItem(TOKEN_KEY);
const localUser = JSON.parse(window.localStorage.getItem(USER_KEY));
const initialState = localToken
	? { auth: { token: localToken, user: localUser } }
	: {};
const store = configureStore(initialState);

ReactDOM.render(
  <React.StrictMode>
    <Grommet background='brand' full={true} theme={theme}>
      <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
      </BrowserRouter>
    </Grommet>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

import auth from './auth';
import posts from './posts';
import users from './users';
import follows from './follows'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = combineReducers({
	auth,
	posts,
	users,
	follows
});

const configureStore = initialState => {
	return createStore(
		reducer,
		initialState,
		composeEnhancers(applyMiddleware(thunk))
	);
};

export default configureStore;

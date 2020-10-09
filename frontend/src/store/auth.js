import { imageUrl } from '../config';

export const SET_TOKEN = 'stumblr/auth/GET_TOKEN';
export const TOKEN_KEY = 'stumblr/auth/TOKEN_KEY';
export const USER_KEY = 'stumblr/auth/USER_KEY';
const REMOVE_TOKEN = 'stumblr/auth/REMOVE_TOKEN';

export const login = (username, password) => async dispatch => {
	const res = await fetch(`${imageUrl}/api/users/login`, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password }),
	});

	if (res.ok) {
		const data = await res.json();
		window.localStorage.setItem(TOKEN_KEY, data.token);
		window.localStorage.setItem(USER_KEY, data.userId);
		dispatch(setToken(data.token, data.userId));
	} else {
		console.log(res);
	}
};

export const signup = (username, password) => async dispatch => {
	const res = await fetch(`${imageUrl}/api/users`, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password }),
	});

	if (res.ok) {
		const data = await res.json();
		window.localStorage.setItem(TOKEN_KEY, data.token);
		window.localStorage.setItem(USER_KEY, data.userId);
		dispatch(setToken(data.token, data.userId));
	}
};

export const setToken = (token, currentUserId) => {
	return {
		type: SET_TOKEN,
		token,
		currentUserId,
	};
};

export const logOut = () => {
	return { type: REMOVE_TOKEN }
};

export default function reducer(state = {}, action) {
	switch (action.type) {
		case SET_TOKEN:
			return {
				...state,
				token: action.token,
				currentUserId: action.currentUserId,
			};

		case REMOVE_TOKEN:
			return {
				...state,
				token: null,
				currentUserId: null,
			};

		default:
			return state;
	}
}

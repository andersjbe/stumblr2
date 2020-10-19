import { imageUrl } from '../config';

export const SET_TOKEN = 'stumblr/auth/GET_TOKEN';
export const TOKEN_KEY = 'stumblr/auth/TOKEN_KEY';
export const USER_KEY = 'stumblr/auth/USER_KEY';
const REMOVE_TOKEN = 'stumblr/auth/REMOVE_TOKEN';

export const getHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY)
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
}

export const login = (formData, setErrors) => async dispatch => {
	console.log('logging you in...')
	const res = await fetch(`${imageUrl}/api/users/login`, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(formData),
	});
	if (res.ok) {
		const data = await res.json();
		window.localStorage.setItem(TOKEN_KEY, data.token);
		window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
		dispatch(setToken(data.token, data.user));
	} else {
		console.log(res);
		const err = await res.json()
		setErrors(err.message)
	}
};

export const signup = (formData, setErrors) => async dispatch => {
	const res = await fetch(`${imageUrl}/api/users`, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(formData),
	});

	if (res.ok) {
		const data = await res.json();
		window.localStorage.setItem(TOKEN_KEY, data.token);
		window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
		dispatch(setToken(data.token, data.user));
	} else {
		console.log(res);
		const err = await res.json()
		setErrors(err.message)
	}
};

export const setToken = (token, user) => {
	return {
		type: SET_TOKEN,
		token,
		user,
	};
};

export const logOut = () => {
	localStorage.removeItem(USER_KEY)
	return { type: REMOVE_TOKEN }
};

export default function reducer(state = {}, action) {
	switch (action.type) {
		case SET_TOKEN:
			return {
				...state,
				token: action.token,
				user: action.user,
			};

		case REMOVE_TOKEN:
			return {
				...state,
				token: null,
				user: null,
			};

		default:
			return state;
	}
}

import { imageUrl } from '../config';

export const GET_USERS = 'stumblr/users/GET_USERS';

export const fetchUsers = () => async dispatch => {
	const res = await fetch(`${imageUrl}/api/users`);

	if (res.ok) {
		const data = await res.json();
		dispatch(getUsers(data));
	} else {
		console.log(res);
	}
};

const getUsers = users => ({
	type: GET_USERS,
	users,
});

export default function reducer(state = {}, action) {
	switch (action.type) {
		case GET_USERS:
			return { ...state, ...action.users };

		default:
			return state;
	}
}

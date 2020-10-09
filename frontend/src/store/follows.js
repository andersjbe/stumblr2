const { imageUrl } = require('../config');

const GET_FOLLOWS = 'stumblr/follows/GET_FOLLOWS';

export const fetchFollows = () => async dispatch => {
	const res = await fetch(`${imageUrl}/api/follows`);

	if (res.ok) {
		const data = await res.json();
		dispatch(getFollows(data));
	} else {
		console.log(res);
	}
};

const getFollows = follows => ({
	type: GET_FOLLOWS,
	follows,
});

export const createFollow = (followedId, followingId) => async dispatch => {
	const res = await fetch(`${imageUrl}/api//follows`, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: { followedId, followingId },
	});

	if (res.ok) {
		fetchFollows();
	} else {
		console.log(res);
	}
};

export default (state = {}, action) => {
	switch (action.type) {
		case GET_FOLLOWS:
			return { ...state, ...action.follows };

		default:
			return state;
	}
};

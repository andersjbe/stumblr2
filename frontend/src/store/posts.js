import { imageUrl } from '../config';

export const GET_POSTS = 'stumblr/posts/GET_POSTS';
export const CREATE_POST = 'stumblr/post/CREATE_POST';

export const fetchPosts = () => async dispatch => {
	const res = await fetch(`${imageUrl}/api/posts`);

	if (res.ok) {
		const data = await res.json();
		dispatch(getPosts(data));
	} else {
		console.log(res);
	}
};

export const postPost = body => async dispatch => {
	console.log(body);
	const res = await fetch(`${imageUrl}/api/posts`, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	if (res.ok) {
		fetchPosts();
	} else {
		console.log(res);
	}
};

const getPosts = posts => ({
	type: GET_POSTS,
	posts,
});

export default function reducer(state = {}, action) {
	switch (action.type) {
		case GET_POSTS:
			return { ...state, ...action.posts };

		default:
			return state;
	}
}

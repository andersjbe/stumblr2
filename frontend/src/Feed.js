import { fetchPosts } from './store/posts';
import { fetchUsers } from './store/users';
import { fetchFollows } from './store/follows';
import PostForm from './PostForm';
import CardPost from './CardPost';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

const madeStyles = makeStyles({
	root: {
		margin: '0 auto',
		'padding-top': '60px',
	},
	card: {
		maxWidth: 540,
		'marginBottom': '20px',
	},
});

export default props => {
	const dispatch = useDispatch();
	const classes = madeStyles();

	useEffect(() => {
		dispatch(fetchUsers());
		dispatch(fetchPosts());
		dispatch(fetchFollows());
	}, [dispatch]);

	const users = useSelector(state => state.users);
	const posts = useSelector(state =>
		Object.values(state.posts).sort((a, b) => b.id - a.id)
	);
	// const follows = useSelector(state => state.follows);
	// const currentUserId = useSelector(state => state.auth.currentUserId);
	// const subscribedUsers = Object.keys(users).filter(
	// 	user =>
	// 		follows.followingId === currentUserId && follows.followedId === user.id
	// );

	return (
		<div id='feed' className={classes.root}>
			<PostForm className={classes.card} />
			{posts.map(post => (
				<CardPost
					classes={classes}
					key={post.id}
					post={post}
					user={users[post.userId]}
				/>
			))}
		</div>
	);
};

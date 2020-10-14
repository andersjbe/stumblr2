import PostForm from './PostForm';
import CardPost from './CardPost';

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { fetchPosts } from './utils';

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
	const classes = madeStyles();
	const [posts, setPosts] = useState([])

	useEffect(() => {
		fetchPosts('/posts')
			.then(fetched => setPosts(fetched))
	}, []);


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
					user={post.userId}
				/>
			))}
		</div>
	);
};

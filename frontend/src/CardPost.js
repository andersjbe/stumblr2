import React from 'react';
import {
	Card,
	CardHeader,
	Avatar,
	IconButton,
	CardMedia,
	CardContent,
	Typography,
	Menu,
	MenuItem
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
// import { useSelector } from 'react-redux';

const PostContent = ({ post }) => {
	switch (post.mediaTypeId) {
		case 1:
			return null;
		case 2:
			return <CardMedia component='img' src={post.mediaUrl} />;
		case 3:
			return <CardMedia component='video' controls src={post.mediaUrl} />;
		case 4:
			return <CardMedia component='audio' controls src={post.mediaUrl} />;
		default:
			return null;
	}
};

const CardPost = props => {
	const { user, post, classes } = props;
	// const [showFollow, setShowFollow] = useState(false);
	// const [showUnfollow, setShowUnfollow] = useState(false);

	// const currentUserId = useSelector(state => state.auth.currentUserId);
	// const follows = useSelector(state => state.follows);

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	// const isFollowing = follows.any(
	// 	follow => follow.followed === user.id && follow.following === currentUserId
	// );
	// const isFollowing = false;

	const unFollow = e => {
		console.log('Unfollow');
	};

	const handleMenu = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Card className={classes.card}>
			<CardHeader
				avatar={
					<Avatar
						src={user.profilePicUrl}
						variant='rounded'
						alt={user.username}
					></Avatar>
				}
				action={
					<span>
						<IconButton onClick={handleMenu}>
							<MoreVert />
						</IconButton>
						<Menu
							id='menu-post'
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={open}
							onClose={handleClose}
						>
							<MenuItem onClick={unFollow} >Unfollow</MenuItem>
						</Menu>
					</span>
				}
				title={user.username}
			/>
			<PostContent post={post} />
			<CardContent>
				<Typography variant='body1'>{post.text}</Typography>
			</CardContent>
		</Card>
	);
};

CardPost.defaultProps = {
	user: {},
	post: {},
};

export default CardPost;

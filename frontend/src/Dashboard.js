import Feed from './Feed';
import { logOut, USER_KEY, TOKEN_KEY } from './store/auth';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
		color: '#eeeeee',
		'text-decoration': 'none',
	},
	appBar: {
		colorPrimary: '001935',
	},
}));

export default props => {
	const token = useSelector(state => state.auth.token);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const classes = useStyles();
	const dispatch = useDispatch();

	const logOutClick = () => {
		window.localStorage.removeItem(USER_KEY);
		window.localStorage.removeItem(TOKEN_KEY);
		dispatch(logOut());
	};

	const handleMenu = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (!token) return <Redirect to='/' />;

	return (
		<>
			<div className={classes.root}>
				<AppBar position='fixed' className='appBar'>
					<Toolbar variant='dense'>
						<Typography variant='h6' className={classes.title}>
							<a href='/' className={classes.title}>
								stumblr
							</a>
						</Typography>
						{token && (
							<div>
								<IconButton
									aria-label='account of current user'
									aria-controls='menu-appbar'
									aria-haspopup='true'
									onClick={handleMenu}
									color='primary'
								>
									<AccountCircle />
								</IconButton>
								<Menu
									id='menu-appbar'
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
									
									<MenuItem onClick={logOutClick}>Log Out</MenuItem>
								</Menu>
							</div>
						)}
					</Toolbar>
				</AppBar>
			</div>
			<Feed />
		</>
	);
};

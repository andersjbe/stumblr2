import { login, signup } from './store/auth';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, ButtonGroup, Button } from '@material-ui/core';

export default props => {
	const [username, setUsername] = useState('demo');
	const [password, setPassword] = useState('stumblr');
	const dispatch = useDispatch();

	const logIn = e => {
		e.preventDefault();
		dispatch(login(username, password));
	};

	const signUp = e => {
		e.preventDefault();
		dispatch(signup(username, password));
	};

	return (
		<form>
			<div id='fields'>
				<TextField
					id='username'
					label='username'
					variant='outlined'
					value={username}
					onChange={e => setUsername(e.target.value)}
					required
				/>

				<TextField
					id='password'
					type='password'
					label='password'
					variant='outlined'
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
				/>
			</div>

			<ButtonGroup id='buttons' variant='contained' color='primary'>
				<Button onClick={logIn}>Log In</Button>
				<Button onClick={signUp}>Sign Up</Button>
			</ButtonGroup>
		</form>
	);
};

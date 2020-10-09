import AuthForm from './AuthForm';

import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Typography } from '@material-ui/core';

export default props => {
	const token = useSelector(state => state.auth.token);

	if (token) return <Redirect to='/dashboard' />;

	return (
		<div id='splash'>
			<div id='splash-content'>
				<div id='logo'>stumblr</div>
				<Typography id='subheader' variant='h4'>
					Stumble into something great
				</Typography>
				<AuthForm />
			</div>
		</div>
	);
};

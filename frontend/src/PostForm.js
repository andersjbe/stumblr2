import { imageUrl } from './config';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
	Card,
	CardContent,
	TextField,
	IconButton,
	DialogTitle,
	makeStyles,
	Dialog,
	Button,
	DialogContent,
} from '@material-ui/core';
// import { useDropzone } from 'react-dropzone';
import {
	VideoCall,
	Headset,
	TextFields,
	CropOriginal,
} from '@material-ui/icons';

const FormIcon = ({ icon, text, mediaTypeId }) => {
	const [open, setOpen] = useState(false);
	const [textBody, setTextBody] = useState('');
	const userId = useSelector(state => state.auth.currentUserId);
	
	let accepts = '';
	if (mediaTypeId === 2) {
		accepts = 'image/*';
	} else if (mediaTypeId === 3) {
		accepts = 'video/*';
	} else if (mediaTypeId === 4) {
		accepts = 'audio/*';
	}

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<span onClick={handleClickOpen}>
			<IconButton onClick={handleClickOpen}>{icon}</IconButton>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{text}</DialogTitle>
				<DialogContent>
					<form
						method='post'
						action={`${imageUrl}/api/posts`}
						encType='multipart/form-data'
						onSubmit={e => <Redirect to='/dashboard' />}
					>
						<TextField
							multiline
							onChange={e => setTextBody(e.target.value)}
							name='text'
							value={textBody}
							required={mediaTypeId === 1 ? true : false}
						/>
						<input type='hidden' name='mediaTypeId' value={mediaTypeId} />
						<input type='hidden' name='userId' value={userId} />
						{mediaTypeId === 1 ? null : (
							<input
								type='file'
								name='file'
								accept={accepts}
								required={mediaTypeId !== 1 ? true : false}
							/>
						)}
						<Button type='submit'>Post</Button>
					</form>
				</DialogContent>
			</Dialog>
		</span>
	);
};

FormIcon.defaultProps = {
	icon: null,
	text: '',
	mediaTypeId: 1,
};

export default () => {
	// const { getRootProps } = useDropzone();
	// const { ref } = getRootProps();

	const styles = makeStyles({
		root: {
			display: 'grid',
			gridTemplateColumns: ' 1fr 1fr 1fr 1fr',
			gridTemplateRows: '1fr',
		},
	});

	const classes = styles();

	return (
		<Card id='create-post' style={{ maxWidth: '540px', 'marginBottom': '20px'}}>
			<CardContent className={classes.root}>
				<FormIcon
					icon={<TextFields style={{ fontSize: '50px' }} />}
					text='Text'
					mediaTypeId={1}
				/>
				<FormIcon
					icon={<CropOriginal style={{ fontSize: '50px' }} />}
					text='Image'
					mediaTypeId={2}
				/>
				<FormIcon
					icon={<VideoCall style={{ fontSize: '50px' }} />}
					text='Video'
					mediaTypeId={3}
				/>
				<FormIcon
					icon={<Headset style={{ fontSize: '50px' }} />}
					text='Audio'
					mediaTypeId={4}
				/>
			</CardContent>
		</Card>
	);
};


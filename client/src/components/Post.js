import { Box, Paragraph, Card, CardBody, CardFooter, CardHeader, Grid, Avatar, Image, Video, Button, Heading, Anchor } from 'grommet'
import React, { useState } from 'react'
import { USER_KEY, TOKEN_KEY, getHeaders } from '../store/auth'
import { apiUrl } from '../config'
import { Favorite, Update } from 'grommet-icons'

export default function Post({ post }) {
    const userId = localStorage.getItem(USER_KEY)
    const { id, text, user, mediaType, mediaUrl, likes, reblogs, rebloggedFrom } = post

    const [isLiked, setIsLiked] = useState(likes.includes(userId))
    const [numLikes, setNumLikes] = useState(likes.length)
    const [numReblogs, setNumReblogs] = useState(reblogs.length)

    const likePost = () => {
        const token = localStorage.getItem(TOKEN_KEY)
            (async () => {
                const res = await fetch(`${apiUrl}/posts/${id}/like`, {
                    headers: getHeaders()
                })

                if (res.ok) {
                    setIsLiked(true)
                    setNumLikes(numLikes + 1)
                }
            })()
    }

    const unlikePost = () => {
        const token = localStorage.getItem(TOKEN_KEY)
            (async () => {
                const res = await fetch(`${apiUrl}/posts/${id}/unlike`, {
                    headers: getHeaders()
                })

                if (res.ok) {
                    setIsLiked(false)
                    setNumLikes(numLikes - 1)
                }
            })()
    }

    const reblogPost = () => {
        const token = localStorage.getItem(TOKEN_KEY)
            (async () => {
                const res = await fetch(`${apiUrl}/posts/${id}/reblog`, {
                    headers: getHeaders()
                })

                if (res.ok) {
                    setNumReblogs(numReblogs + 1)
                }
            })()
    }

    return (
        <Card
            background='#fff'
            width='540px'
            elevation='none'
        >
            <CardHeader pad='xsmall'>
                <Box
                    margin='none'
                    direction='row'
                    gap='xsmall'
                >
                    <Avatar
                        src={user.profilePicUrl}
                        gridArea='avatar'
                    />
                    <Box alignSelf='center'>
                        <Heading
                            level={5}
                            alignSelf='start'
                            margin='none'
                            textAlign='start'
                        >{user.username}</Heading>
                        <Box margin='none' gridArea='reblog' alignSelf='start'>

                            {rebloggedFrom && <Anchor
                                margin='none'
                                alignSelf='start'
                                icon={<Update size='small' color='#999' />}
                                color='#aaa'
                                label={rebloggedFrom}
                                size='small'
                                textAlign='start'

                            />}
                        </Box>
                    </Box>
                </Box>
            </CardHeader>

            <CardBody>
                {
                    mediaType !== 'text' ?
                        <Box fill='horizontal'>
                            {
                                mediaType === 'image' ?
                                    <Image
                                        src={mediaUrl}
                                        fill
                                    />
                                    : null
                            } {
                                mediaType === 'video' ?
                                    <Video
                                        src={mediaUrl}
                                        fit='cover'
                                        controls='below'
                                    />
                                    : null
                            } {
                                mediaType === 'audio' ?
                                    <audio
                                        src={mediaUrl}
                                        controls
                                    />
                                    : null
                            }
                        </Box>
                        : null
                }
                <Box fill='horizontal' textAlign='start' pad='xsmall'>
                    <Paragraph textAlign='start'>{text}</Paragraph>
                </Box>
            </CardBody>

            <CardFooter direction='row' justify='end' gap='none'>
                <Button
                    primary
                    margin='none'
                    color='#fff'
                    icon={<Update />}
                    label={numReblogs}
                />
                {
                    isLiked ?
                        <Button
                            primary
                            color='#df212a'
                            icon={<Favorite />}
                            label={numLikes}
                        />
                        : <Button
                        margin='none'
                            primary
                            color='#fff'
                            icon={<Favorite />}
                            label={numLikes}
                        />
                }
            </CardFooter>
        </Card>
    )
}
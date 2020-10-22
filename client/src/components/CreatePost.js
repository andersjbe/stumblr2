import { Box, Button, Image, Card, Footer, Form, FormField, Layer, Text, TextArea, Video } from 'grommet'
import { Edit, Image as Img, Music, Video as Vid } from 'grommet-icons'
import React, { useEffect, useState } from 'react'
import { apiUrl } from '../config'
import {  TOKEN_KEY } from '../store/auth'

export default function CreatePost() {
    const [form, setForm] = useState({ text: '' })
    const [open, setOpen] = useState('')
    const [media, setMedia] = useState(null)
    const [preview, setPreview] = useState('https://andersjbe-fork.s3-us-west-1.amazonaws.com/unnamed.jpg')

    useEffect(() => {
        if (media === {}) return

        try {
            setPreview(URL.createObjectURL(media))
        } catch (e) {
            console.log(e)
            setPreview('https://andersjbe-fork.s3-us-west-1.amazonaws.com/unnamed.jpg')
        }
    }, [media])

    const closeModal = e => {
        setForm({})
        setOpen('')
        setMedia('')
    }

    const submitPost = () => {
        const formData = {
            text: form.text ? form.text : '',
            mediaTypeName: open,
            rebloggedFrom: null
        }
        const body = new FormData()
        Object.keys(formData).forEach(key => body.append(key, formData[key]))
        if (open !== 'text') {
            body.append('file', media, `${Date.now()}`)
        }
        const postPost = async () => {
            const res = await fetch(`${apiUrl}/posts`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
                body: body
            })

            if (res.ok) {
                console.log('OKAY')
                closeModal()
            }
        }
        postPost()
    }

    const updateFile = e => {
        console.log(e.target.files.item(0))
        setMedia(e.target.files.item(0))
        console.log(media)
    }

    const forms = {
        'text': (
            <Form
                value={form}
                onChange={value => setForm(value)}
            >
                <FormField label='Text' name='text' htmlFor='text'>
                    <TextArea
                        name='text'
                    />
                </FormField>

            </Form>
        ),
        'image': (<>
            <input type='file' accept='image/*' required
                onChange={updateFile}
            />

            <Box height='medium' width='medium' alignSelf='center' margin='xsmall'>
                <Image
                    fit='contain'
                    src={preview}
                />
            </Box>
            <Form
                value={form}
                onChange={value => {
                    setForm(value)
                }}
            >

                <FormField label='Text' name='text' htmlFor='text'>
                    <TextArea
                        name='text'
                    />
                </FormField>
            </Form>
        </>),
        'video': (
            <>
                <input type='file' accept='video/*' required
                    onChange={updateFile}
                />

                <Box height='medium' width='medium' alignSelf='center' margin='xsmall'>
                    <Video
                        fit='contain'
                        src={preview}
                    />
                </Box>
                <Form
                    value={form}
                    onChange={value => {
                        setForm(value)
                    }}
                >

                    <FormField label='Text' name='text' htmlFor='text'>
                        <TextArea
                            name='text'
                        />
                    </FormField>
                </Form>
            </>
        ),
        'audio': (
            <>
                <input type='file' accept='audio/*' required
                    onChange={updateFile}
                />

                <Box justify='center' width='medium' alignSelf='center' margin='xsmall'>
                    <audio controls src={media} />
                </Box>
                <Form
                    value={form}
                    onChange={value => {
                        setForm(value)
                    }}
                >

                    <FormField label='Text' name='text' htmlFor='text'>
                        <TextArea
                            name='text'
                        />
                    </FormField>
                </Form>
            </>
        )
    }

    return (
        <>
            <Card
                background='#fff'
                width='540px'
                elevation='none'
                margin='xsmall'
                justify='evenly'
                alignSelf='center'
                align='center'
                pad='xxsmall'
                direction='row'
                flex={false}
            >
                <Box
                    margin='small'
                    
                    justify='center'
                    onClick={() => setOpen('text')}
                    hoverIndicator='#ff8' align='center' pad='xsmall'>
                    <Edit size='xlarge' />
                    <Text size='large' alignSelf='center' >Text</Text>
                </Box>
                <Box
                    
                    hoverIndicator='#8ff'
                    onClick={() => setOpen('image')}
                    align='center'
                    margin='small'
                    justify='center'
                    pad='xsmall'
                >
                    <Img size='xlarge' />
                    <Text size='large' alignSelf='center' >Image</Text>
                </Box>
                <Box
                    onClick={() => setOpen('video')}
                     hoverIndicator='#8f8' align='center'
                    margin='small' justify='center' pad='xsmall'>
                    <Vid size='xlarge' />
                    <Text size='large' alignSelf='center' >Video</Text>
                </Box>
                <Box
                    onClick={() => setOpen('audio')}
                     hoverIndicator='#faf' align='center'
                    margin='small' justify='center' pad='xsmall'>
                    <Music size='xlarge' />
                    <Text size='large' alignSelf='center' >Audio</Text>
                </Box>
            </Card>
            {
                open ?
                    <Layer modal
                        onClickOutside={closeModal}>
                        <Box pad='small' round='xsmall' background='#fff' >
                            {forms[open]}
                            <Footer direction='row' justify='between'>
                                <Button
                                    secondary
                                    label='Cancel'
                                    color='red'
                                    onClick={closeModal}
                                />

                                <Button
                                    type='submit'
                                    primary
                                    label='Post'
                                    onClick={submitPost}
                                />
                            </Footer>
                        </Box>
                    </Layer>
                    : null
            }
        </>
    )
}
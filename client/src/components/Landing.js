import { Box, Button, Form, FormField, Heading, Layer, Main, TextInput, Text } from 'grommet'
import { useDispatch } from 'react-redux'
import React, { useState } from 'react'
import { PasswordInput } from 'grommet-controls'
import { login, signup, USER_KEY } from '../store/auth'
import { Redirect, useHistory } from 'react-router-dom'
import { apiUrl } from '../config'

export default function Landing() {
    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState([])
    const dispatch = useDispatch()
    const history = useHistory()

    if (localStorage.getItem(USER_KEY)) {
        return <Redirect to='/dashboard' />
    }

    const submitForm = action => {
        setErrors([])
        if (!formData.username || !formData.password) {
            setErrors(['You must enter a username and password.'])
            return
        }

        (async () => {

            if (action === 'login') {
                await dispatch(login(formData, setErrors))
            } else if (action === 'signup') {
                await dispatch(signup(formData, setErrors))
            }
            
            if (errors.length === 0) {
                history.push('/dashboard')
            }
        })()
    }

    return (
        <Main fill an background="url('https://64.media.tumblr.com/10020a22c485b14f7ce8a4578396ca76/be0d972041b60c4b-0c/s400x600/ddd82994cb9b6825e87fb5aa17ad1963fca73b92.jpg')">
            <Layer responsive={false} animation='fadeIn' modal={false} >
                <Box
                    pad='medium'
                    round='xsmall'
                    background='#fff'
                // width='medium' 
                // height='large'
                >
                    <Heading
                        margin='xsmall'
                        textAlign='center'
                        level={1}
                    >
                        stumblr
                    </Heading>
                    <Heading
                        alignSelf='center'
                        textAlign='center'
                        level={3}
                    >
                        Stumble into something great.
                    </Heading>

                    {
                        errors.length ?
                            <Box background='#faa' pad='xsmall' border={{ color: '#c01' }}>
                                {errors.map((e, i) => <Text color='#c01' key={i}>{e}</Text>)}
                            </Box>
                            : null
                    }

                    <Box width='medium' alignSelf='center'>
                        <Form
                            value={formData}
                            onChange={nextValue => {
                                setFormData(nextValue)
                            }}
                        >
                            <FormField name="username" label='username'>
                                <TextInput required name="username" />
                            </FormField>

                            <FormField name="password" label='password'>
                                <PasswordInput required plain name="password" />
                            </FormField>

                            <Box margin='small' justify='around' direction='row-responsive'>
                                <Button label='Demo User' disabled />
                                <Button label='Log In' onClick={() => submitForm('login')} />
                                <Button label='Sign Up' onClick={() => submitForm('signup')} />
                            </Box>
                        </Form>
                    </Box>
                </Box>
            </Layer>
        </Main>
    )
}
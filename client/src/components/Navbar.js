import { Box, Anchor, Avatar, Button, Header, Heading, Layer, Nav, Sidebar, TextInput } from 'grommet'
import { Close, Favorite, Github, Home, LinkNext, Menu, Search } from 'grommet-icons'
import React, { useState } from 'react'
import MediaQuery from 'react-responsive'
import { USER_KEY } from '../store/auth'
import { Link, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Navbar() {
    const { auth } = useSelector(state => state)
    const [sidebar, setSidebar] = useState()
    const [search, setSearch] = useState(false)
    const [query, setQuery] = useState('')
    const [focused, setFocused] = useState(false)

    if (!localStorage.getItem(USER_KEY)) {
        return <Redirect to='/' />
    }

    return (
        <>
            <MediaQuery minWidth={1000}>
                <Header justify='between' pad='small' background='brand' fill='horizontal'
                    style={{ position: 'sticky', top: '0', zIndex: '2', borderBottom: '1px solid #2b4460' }}
                >
                    <Nav direction='row'>
                        <Heading level={2} alignSelf='center' margin='none' color='#fff'>st</Heading>
                        <Box
                            background={
                                focused ?
                                    '#fff'
                                    : '#2b4460'
                            }
                            round
                        >
                            <TextInput
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                size='xlarge'
                                icon={<Button icon={<Search />} />}
                            />
                        </Box>
                        {
                            query ?
                                <Button gap='small' primary reverse label='Go' icon={<LinkNext />} />
                                : null
                        }
                    </Nav>

                    <Nav direction='row'>
                        <Link to='/dashboard'>
                            <Button
                                icon={<Home />}
                                color='brand'
                            />
                        </Link>

                        <Link to='/likes'>
                            <Button
                                icon={<Favorite />}
                                color='brand'
                            />
                        </Link>
                    </Nav>
                </Header>
            </MediaQuery>

            <MediaQuery maxWidth={999}>
                <Header background='brand' justify='between' pad='xsmall' fill='horizontal'
                    style={{ zIndex: '2', position: 'sticky', top: '0', borderBottom: '1px solid #2b4460' }}>
                    {
                        sidebar ?
                            <Button
                                onClick={() => setSidebar(false)}
                                icon={<Close />}
                                alignSelf='start'
                            />
                            : <Button
                                onClick={() => setSidebar(true)}
                                icon={<Menu />}
                                alignSelf='center'
                            />
                    }

                    {
                        search ?
                            <Box direction='row' gap='xxsmall'>
                                <Box background='#fff' round>
                                    <TextInput
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        width='large'
                                        icon={<Button icon={<Search />} />}
                                    />
                                </Box>
                                {
                                    query ?
                                        <Button gap='small' primary reverse label='Go' icon={<LinkNext />} />
                                        : null
                                }
                            </Box>
                            : <Link to='/dashboard'>
                                <Heading level={2} margin='none' color='#fff'>st</Heading>
                            </Link>
                    }

                    {
                        search ?
                            <Button icon={<Close />} onClick={() => setSearch(false)} />
                            : <Button icon={<Search />} onClick={() => setSearch(true)} />
                    }

                </Header>
            </MediaQuery>

            {
                sidebar ?
                    <Layer
                        onClickOutside={() => setSidebar(false)}
                        full='vertical'
                        modal={true}
                        position='left'
                    >
                        <Sidebar
                            elevation='medium'
                            animation='slideRight'
                            direction='column'
                            fill='vertical'
                            height='100vh'
                            width='medium'
                            header={
                                <>
                                    <Button
                                        onClick={() => setSidebar(false)}
                                        icon={<Close />}
                                        alignSelf='start'
                                    />
                                    <Avatar
                                        alignSelf='center'
                                        subtitle={auth.user.username}
                                        src={auth.profilePicUrl || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.vCNr3UL_DV6WByU6q5bS9AHaHa%26pid%3DApi&f=1'}
                                    />
                                </>
                            }
                            footer={
                                <Anchor
                                    icon={<Github size='large' />}
                                    color='#fff'
                                    alignSelf='center'
                                />
                            }
                        >
                            <Nav direction='column'>
                                <Link to='/dashboard'>
                                    <Button
                                        label='Dashboard'
                                        icon={<Home />}
                                        color='brand'
                                        onClick={() => setSidebar(false)}
                                    />
                                </Link>

                                <Link to='/likes'>
                                    <Button
                                        label='Likes'
                                        icon={<Favorite />}
                                        color='brand'
                                        onClick={() => setSidebar(false)}
                                    />
                                </Link>
                            </Nav>
                        </Sidebar>
                    </Layer>
                    : null
            }
        </>
    )
}
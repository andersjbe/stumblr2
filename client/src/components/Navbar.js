import { Box, Anchor, Avatar, Button, Header, Heading, Layer, Nav, Sidebar, TextInput } from 'grommet'
import { Close, Github, Home, LinkNext, Menu, Search } from 'grommet-icons'
import React, { useState } from 'react'
import MediaQuery from 'react-responsive'
// import { useSelector } from 'react-redux'

export default function Navbar() {
    // const { auth } = useSelector(state => state)
    const [sidebar, setSidebar] = useState(false)
    const [search, setSearch] = useState(false)
    const [query, setQuery] = useState('')

    return (
        <>
            <MediaQuery minWidth={1000}>
                <Header>

                </Header>
            </MediaQuery>

            <MediaQuery maxWidth={999}>
                <Header background='brand' justify='between' pad='xsmall'>
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
                                        <Button gap='small' primary reverse label='Go' icon={<LinkNext  />} />
                                        : null
                                }
                            </Box>
                            : <a>
                                <Heading level={2} margin='none' color='#fff'>st</Heading>
                            </a>
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
                        modal={false}
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
                                        title="Ben"
                                        src='https://avatars1.githubusercontent.com/u/62520351?s=460&u=55b9329cab60bcd8ed323f29212e021176a206c1&v=4'
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
                                <Anchor
                                    label='Dashboard'
                                    icon={<Home />}
                                    color='#fff'
                                />
                            </Nav>
                        </Sidebar>
                    </Layer>
                    : null
            }
        </>
    )
}
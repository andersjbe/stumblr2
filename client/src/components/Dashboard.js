import { Main } from 'grommet'
import React from 'react'
import CreatePost from './CreatePost'
import Feed from './Feed'
import Navbar from './Navbar'

export default function () {
    return (
            <Main>
                <Navbar />
                <CreatePost />
                <Feed action='/posts' />
            </Main>
    )
}
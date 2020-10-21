import { Main } from 'grommet'
import React from 'react'
import Navbar from './Navbar'

export default function UserFeed() {


    return (
        <Main>
            <Navbar />
            <Feed action='/users/posts' />
        </Main>
    )
}
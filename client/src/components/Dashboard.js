import { Main } from 'grommet'
import React from 'react'
import Feed from './Feed'
import Navbar from './Navbar'

export default function () {
    return (
            <Main>
                <Navbar />
                <Feed action='/posts' />
            </Main>
    )
}
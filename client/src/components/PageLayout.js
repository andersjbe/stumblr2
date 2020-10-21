import { Main } from 'grommet'
import React from 'react'
import Navbar from './Navbar'

export default function PageLayout({component: Component}) {
    return (
        <Main>
            <Navbar />
            <Component />
        </Main>
    )
}
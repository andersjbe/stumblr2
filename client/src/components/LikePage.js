import { json } from 'body-parser'
import { Main } from 'grommet'
import React, { useEffect } from 'react'
import { USER_KEY } from '../store/auth'
import Feed from './Feed'
import Navbar from './Navbar'

export default function LikePage() {
    const { id } = JSON.parse(localStorage.getItem(USER_KEY))
    console.log(id)
    return (
        <Feed action={`/user/${id}/likes`} />
    )
}
import React from 'react'
import { USER_KEY } from '../store/auth'
import Feed from './Feed'

export default function LikePage() {
    const { id } = JSON.parse(localStorage.getItem(USER_KEY))
    console.log(id)
    return (
        <Feed action={`/user/${id}/likes`} />
    )
}
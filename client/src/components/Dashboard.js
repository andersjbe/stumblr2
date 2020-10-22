import React from 'react'
import CreatePost from './CreatePost'
import Feed from './Feed'

export default function () {
    return (
            <>
                <CreatePost />
                <Feed action='/posts' />
            </>
    )
}
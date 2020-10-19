import { InfiniteScroll, Text, Box } from 'grommet'
import React, { useEffect, useState } from 'react'
import { apiUrl } from '../config'
import { getHeaders } from '../store/auth'
import Post from './Post'

export default function Feed({ action }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${apiUrl}${action}`, {
                    headers: getHeaders()
                })

                if (res.ok) {
                    const data = await res.json()
                    setPosts(data)
                    setCurrentIndex(data.length)
                    if (data.length < 50) {
                        setHasMore(false)
                    }
                } else if (!res.ok) {
                    console.log(res)
                    throw res
                }
            } catch (e) {
                setPosts([])
            }
        })()
    }, [])

    const loadMore = () => {
        if (!hasMore) return

        (async () => {
            try {
                const url = action.includes('/posts/search') ?
                    `${apiUrl}${action}&offset=${currentIndex + 1}`
                    : `${apiUrl}${action}?offset=${currentIndex + 1}`
                const res = await fetch(url, {
                    headers: getHeaders()
                })

                if (res.ok) {
                    const data = await res.json()
                    setPosts(...posts, ...data)
                    setCurrentIndex(posts.length)
                    if (data.length < 50) {
                        setHasMore(false)
                    }
                } else if (!res.ok) {
                    console.log(res)
                    throw res
                }
            } catch (e) {
                console.log(e)
            }
        })()
    }

    if (posts.length === 0) {
        return <Text alignSelf='center' color='#fff'>No posts here!</Text>
    }

    return (
        <Box id='feedbox'
        fill='vertical'
        alignSelf='center'
        pad='small'
    >
            {
                posts.length > 0 && (
                    <InfiniteScroll items={posts} onMore={() => loadMore} step={50}>
                        {(item, i) => (
                            <Post key={i} post={item} />
                        )}
                    </InfiniteScroll>
                )
            }
        </Box>
    )
}
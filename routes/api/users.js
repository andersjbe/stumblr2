const express = require('express')
const asyncHandler = require('express-async-handler')

const { User, Post } = require('../../db/models');
const { authenticated, createToken } = require('../../authToken');

const router = express.Router()

router.post('/',
    asyncHandler(async (req, res) => {
        const { username, password } = req.body;

        const user = await User.create(username, password)
        const { jti, token } = createToken(user)

        res.json({
            token, 
            user: {
                id: user.id,
                username: user.username,
                profilePicUrl: user.profilePicUrl
            }
        })
    })
)

router.post('/login',
    asyncHandler(async (req, res, next) => {
        const { username, password } = req.body;

        const users = await User.query().where({ username })
        const user = users[0]
        if (!user) return next({ status: 404, message: 'User not found.' });

        success = await user.checkPassword(password)
        if (!success) {
            const err = new Error('Wrong password');
            err.status = 401;
            err.title = 'Login Failed';
            err.errors = ['Invalid Credentials'];
            return next(err);
        }

        const { jti, token } = createToken(user)
        res.json({
            token, 
            user: {
                id: user.id,
                username: user.username,
                profilePicUrl: user.profilePicUrl
            }
        })
    })
)

router.post('/follow/:userFollowedId',
    authenticated,
    asyncHandler(async (req, res, next) => {
        const { user } = req
        // const user = await User.query().findById(1)
        const { userFollowedId } = req.params
        try {
            const userToFollow = await User.query().findById(userFollowedId)
            await user.$relatedQuery('following').relate(userToFollow)
        } catch (e) {
            if (e.name === 'UniqueViolationError') {
                err = Error('Follow already exists')
                err.status = 305
                return next(err)
            }
        }
        res.json({ message: `${user.id} followed ${userFollowedId}` })
    })
)

router.post('/unfollow/:userFollowedId',
    authenticated,
    asyncHandler(async (req, res, next) => {
        const { user } = req
        // const user = await User.query().findById(1)
        const { userFollowedId } = req.params
        try {
            await user.$relatedQuery('following').unrelate().findById(userFollowedId)
        } catch (e) {
            return next(e)
        }
        res.json({ message: `${user.id} unfollowed ${userFollowedId}` })
    })
)

router.get('/:id',
    asyncHandler(async (req, res) => {
        const user = await User.query().findById(req.params.if)
        res.json({
            user: {
                id: user.id,
                username: user.username,
                profilePicUrl: user.profilePicUrl
            }
        })
    })
)

router.get('/:id/posts',
    authenticated,
    asyncHandler(async (req, res) => {
        const offset = req.params.offset ? req.params.offset : 0;
        const userId = Number(req.params.id)
        const posts = await Post.query().where('user_id', userId)
            .orderBy('posts.id', "DESC")
            .offset(offset)
            .limit(50)
            .withGraphFetched('[user, mediaType, likes, reblogs, rebloggedPost.user]')
        res.json(posts.map(post => {
            return {
                id: post.id,
                text: post.text,
                mediaUrl: post.mediaUrl,
                user: {
                    id: post.user.id,
                    username: post.user.username,
                    profilePicUrl: post.user.profilePicUrl
                },
                likes: post.likes,
                reblogs: post.reblogs,
                rebloggedFrom: post.rebloggedPost ? post.rebloggedPost.user.username : null
            }
        }))
    })
)

module.exports = router
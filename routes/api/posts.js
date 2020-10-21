const express = require('express')
const asyncHandler = require('express-async-handler')
const cors = require('cors')
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')

const { Post, User, MediaType, Like } = require('../../db/models')
const { authenticated } = require('../../authToken')

AWS.config.region = 'us-west-1'
const s3 = new AWS.S3()

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'stumblr',
        key: function (req, file, cb) {
            cb(null, `${new Date()}${file.filename}`)
        }
    })
})

router = express.Router()

router.post('/',
    authenticated,
    upload.single('file'),
    asyncHandler(async (req, res, next) => {
        let { text, mediaTypeName, rebloggedFrom } = req.body;
        const userId = req.user.id
        let mediaUrl = '';
        const [mediaType] = await MediaType.query().where('type', mediaTypeName)
        if (
            mediaType.type === 'image' ||
            mediaType.type === 'video' ||
            mediaType.type === 'audio'
        ) {
            mediaUrl = req.file.location;
        }

        try {
            console.log(rebloggedFrom)
            await Post.query().insert({
                text: text ? text : '',
                mediaTypeId: mediaType.id,
                userId: Number(userId),
                mediaUrl
            })
        } catch (e) {
            return next(e)
        }
        return res.json({ 'message': 'Post successful!' })
    }));

router.post('/:id/reblog',
    authenticated,
    asyncHandler(async (req, res) => {
        const { id } = req.params
        const post = await Post.query().findById(id)
        const reblog = await Post.query().insert({
            text: post.text,
            mediaTypeId: post.mediaTypeId,
            userId: req.user.id,
            rebloggedFrom: post.id,
            mediaUrl: post.mediaUrl
        })
        await reblog.$relatedQuery('rebloggedPost').relate(post)
        res.json({ 'message': 'Post successful' })
    })
)

router.get('/',
    authenticated,
    asyncHandler(async (req, res) => {
        const offset = req.query.offset ? req.query.offset : 0;
        const { user } = req
        const { following } = await User.fetchGraph(user, 'following')
        const followingIds = [...following.map(follow => follow.id), user.id]
        const posts = await Post.query()
            .whereIn('user_id', followingIds)
            .orderBy('posts.id', "DESC")
            .offset(offset)
            .limit(50)
            .withGraphFetched('[user, mediaType, likes, reblogs, rebloggedPost.user]')
        res.json(posts.map(post => {
            return {
                id: post.id,
                text: post.text,
                mediaUrl: post.mediaUrl,
                mediaType: post.mediaType.type,
                user: {
                    id: post.user.id,
                    username: post.user.username,
                    profilePicUrl: post.user.profilePicUrl
                },
                likes: post.likes.map(like => like.userId),
                reblogs: post.reblogs,
                rebloggedFrom: post.rebloggedPost ? post.rebloggedPost.user.username : null
            }
        }))
        // res.json(posts)
    })
)

router.get('/search',
    authenticated,
    asyncHandler(async (req, res) => {
        const offset = req.query.offset ? req.query.offset : 0;
        const { term } = req.query

        if (term === '') {
            res.json({ 'message': 'term cannot be empty' }).status(403)
        }
        const posts = await Post.query()
            .where('text', 'like', `%${term}%`)
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
                likes: post.likes.map(like => like.userId),
                reblogs: post.reblogs,
                rebloggedFrom: post.rebloggedPost ? post.rebloggedPost.user.username : null
            }
        }))
    })
)

router.post('/:id/like',
    authenticated,
    asyncHandler(async (req, res, next) => {
        const { id } = req.params
        const post = await Post.query().findById(id)

        try {
            await req.user.$relatedQuery('likes').relate(post)
        } catch (e) {
            if (e.name === 'UniqueViolationError') {
                err = Error('Like already exists')
                err.status = 305
                return next(err)
            }
        }

        res.json({ message: `${req.user.id} likes ${post.id}` })
    })
)

router.post('/:id/unlike',
    authenticated,
    asyncHandler(async (req, res, next) => {
        try {
            await req.user.$relatedQuery('likes').unrelate().findById(req.params.id)
        } catch (e) {
            return next(e)
        }

        res.json({ message: `${req.user.id} unliked ${req.params.id}` })
    })
)

router.get('/liked',
    authenticated,
    asyncHandler(async (req, res) => {
        const { user } = req
        const offset = req.query.offset ? req.query.offset : 0;

        const likes = await Like.query()
            .select('post_id')
            .where('user_id', user.id)
            .orderBy('id', 'DESC')
            .offset(offset)
            .limit(50)

        const posts = await Post.query()
            .findByIds(likes.map(like => like.postId))
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
                likes: post.likes.map(like => like.userId),
                reblogs: post.reblogs,
                rebloggedFrom: post.rebloggedPost ? post.rebloggedPost.user.username : null
            }
        }))
    }))

module.exports = router
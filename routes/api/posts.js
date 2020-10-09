const express = require('express')
const asyncHandler = require('express-async-handler')
const cors = require('cors')
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')

const { Post, User, MediaType } = require('../../db/models')
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
        let { text, mediaTypeId, rebloggedFrom } = req.body;
        const userId = req.user.id

        let mediaUrl = '';
        const mediaType = await MediaType.query().findById(Number(mediaTypeId))
        if (
            mediaType.type === 'image' ||
            mediaType.type === 'video' ||
            mediaType.type === 'audio'
        ) {
            mediaUrl = req.file.location;
        }

        try {
            await Post.query().insert({
                text: text ? text : '',
                mediaTypeId: Number(mediaTypeId),
                userId: Number(userId),
                rebloggedFrom,
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
        const offset = req.params.offset ? req.params.offset : 0;
        const { user } = req
        const { following } = await User.fetchGraph(user, 'following')
        const followingIds = following.map(follow => follow.id)
        const posts = await Post.query()
            .whereIn('user_id', followingIds)
            .orderBy('posts.id', "DESC")
            .offset(offset)
            .limit(50)

        res.json(posts)
    })
)

router.get('/search',
    authenticated,
    asyncHandler(async (req, res) => {
        const offset = req.params.offset ? req.params.offset : 0;
        const { term } = req.query

        if (term === '') {
            res.json({ 'message': 'term cannot be empty' }).status(403)
        }
        const posts = await Post.query()
            .where('text', 'like', `%${term}%`)
            .orderBy('posts.id', "DESC")
            .offset(offset)
            .limit(50)

        res.json(posts)
    })
)

router.post('/:id/like',
    authenticated,
    asyncHandler(async (req, res, next) => {
        const {id} = req.params
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

        res.json({message: `${req.user.id} likes ${post.id}`})
    })
)

router.post('/:id/unlike',
    authenticated,
    asyncHandler(async (req, res, next) => {
        try {
            await req.user.$relatedQuery('likes').unrelate().findById(req.params.id)
        } catch(e) {
            return next(e)
        }

        res.json({message: `${req.user.id} unliked ${req.params.id}`})
    })
)

module.exports = router
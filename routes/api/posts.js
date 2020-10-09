const express = require('express')
const asyncHandler = require('express-async-handler')
const cors = require('cors')
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')

const { Post, User, MediaType } = require('../../db/models')
// const { awsConfig } = require('../../config')
const { authenticated } = require('../../authToken')

// AWS.config = new awsConfig()
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

        // console.log(mediaType)
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
        const term = req.params.term

        if (term === '') {
            res.json({'message': 'term cannot be empty'}).status(403)
        }
        const posts = await Post.query()
            .where('text', 'like', `%${term}%`)
            .orderBy('posts.id', "DESC")
            .offset(offset)
            .limit(50)

        res.json(posts)
    })
)

module.exports = router
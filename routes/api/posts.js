const express = require('express')
const asyncHandler = require('express-async-handler')
const cors = require('cors')
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')

const { Post, User, MediaType } = require('../../db/models')
const { awsConfig } = require('../../config')

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
    upload.single('file'),
    asyncHandler(async (req, res, next) => {
        let { text, mediaTypeId, userId, rebloggedFrom } = req.body;
        
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
        return res.json({'message': 'Post successful!'})
    }));

module.exports = router
const express = require('express')
const asyncHandler = require('express-async-handler')

const { User } = require('../../db/models');
const { authenticated, createToken } = require('../../authToken');

const router = express.Router()

router.post('/',
    asyncHandler(async (req, res) => {
        const { username, password } = req.body;

        const user = await User.create(username, password)
        const { jti, token } = createToken(user)

        res.json({ token, id: user.id })
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
            err.rorros = ['Invalid Credentials'];
            return next(err);
        }

        const { jti, token } = createToken(user)
        res.json({ token, id: user.id })
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
            console.log(userToFollow)
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

module.exports = router
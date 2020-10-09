const userRoutes = require('./users');
const postRoutes = require('./posts');

const express = require('express');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

module.exports = router;

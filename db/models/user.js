const knex = require('../knex')
const { Model, snakeCaseMappers } = require('objection')
const bcrypt = require('bcryptjs')
const { join } = require('../knex')

Model.knex(knex)

class User extends Model {
    static get tableName() {
        return 'users'
    }

    static get columnNameMappers() {
        return snakeCaseMappers()
    }

    // Model attributes validation - DOES NOT APPLY TO DB
    static get jsonSchema() {
        return {
            type: 'Object',
            required: ['username', 'hashedPassword'],

            properties: {
                id:             { type: 'integer' },
                username:       { type: 'string', minLength: 1, maxLength: 100 },
                hashedPassword: { type: 'string', minLength: 1 },
                profilePicUrl:  { type: 'string' }
            }
        }
    }

    // Defining relationships for eager loading
    static get relationMappings() {
        const Post = require('./post')
        const Like = require('./like')

        return {
            posts: {
                relation: Model.HasManyRelation,
                modelClass: Post,
                join: {
                    from: 'users.id',
                    to: 'posts.user_id'
                }
            },
            followers: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'users.id',
                    through: {
                        from: 'follows.user_followed_id',
                        to: 'follows.user_following_id'
                    },
                    to: 'users.id'
                }
            },
            following: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'users.id',
                    through: {
                        from: 'follows.user_following_id',
                        to: 'follows.user_followed_id'
                    },
                    to: 'users.id'
                }
            },
            likes: {
                relation: Model.ManyToManyRelation,
                modelClass: Post,
                join: {
                    from: 'users.id',
                    through: {
                        from: 'likes.user_id',
                        to: 'likes.post_id'
                    },
                    to: 'posts.id'
                }
            }
        }
    }

    async follow(userFollowedId) {
        const userToFollow = await User.query().findById(userFollowedId)
        await this.$relatedQuery('following').relate(userToFollow)
    }

    async unfollow(userFollowedId) {
        const userToUnfollow = await User.query().findById(userFollowedId)
        const followedUsers = await this.$relatedQuery('following')
        if (followedUsers.includes(userToUnfollow)) {
            await this.$relatedQuery('following').unrelate(userToUnfollow)
        }
    }

    static async create(username, password) {
        let user = null;
        try {
            const hashedPassword = bcrypt.hashSync(password);
            user = User.query().insert({
                username, hashedPassword
            })
        } catch (e) {
            throw (e)
        }
        return user;
    }

    async checkPassword(attempt) {
        return await bcrypt.compare(attempt, this.hashedPassword)
    }

}

module.exports = User
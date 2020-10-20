const { Model, snakeCaseMappers } = require('objection')
const knex = require('../knex')

Model.knex(knex)

class Post extends Model {
    static get tableName() {
        return 'posts'
    }

    static get columnNameMappers() {
        return snakeCaseMappers()
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['userId', 'mediaTypeId'],

            properties: {
                id: { type: 'integer' },
                userId: { type: 'integer' },
                text: { type: 'string' },
                mediaTypeId: { type: 'integer' },
                mediaUrl: { type: 'string' },
                rebloggedFrom: { type: 'integer' }
            }
        }
    }

    static get relationMappings() {
        const User = require('./user')
        const MediaType = require('./mediaType')
        const Like = require('./like')

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'posts.userId',
                    to: 'users.id'
                }
            },
            mediaType: {
                relation: Model.BelongsToOneRelation,
                modelClass: MediaType,
                join: {
                    from: 'posts.media_type_id',
                    to: 'media_types.id'
                }
            },
            reblogs: {
                relation: Model.HasManyRelation,
                modelClass: Post,
                join: {
                    from: 'posts.id',
                    to: 'posts.reblogged_from'
                }
            },
            rebloggedPost: {
                relation: Model.BelongsToOneRelation,
                modelClass: Post,
                join: {
                    from: 'posts.reblogged_from',
                    to: 'posts.id'
                }
            },
            likes: {
                relation: Model.HasManyRelation,
                modelClass: Like,
                join: {
                    from: 'posts.id',
                    to: 'likes.post_id'
                }
            }
        }
    }

    
}

module.exports = Post
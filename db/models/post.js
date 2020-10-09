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
                rebloggedFrom: { type: ['integer', null] }
            }
        }
    }

    static get relationMappings() {
        const User = require('./user')
        const MediaType = require('./mediaType')

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
                    from: 'posts.mediaTypeId',
                    to: 'media_types.id'
                }
            },
            reblogs: {
                relation: Model.HasManyRelation,
                modelClass: Post,
                join: {
                    from: 'posts.id',
                    to: 'posts.rebloggedFrom'
                }
            },
            rebloggedPost: {
                relation: Model.BelongsToOneRelation,
                modelClass: Post,
                join: {
                    from: 'posts.rebloggedFrom',
                    to: 'posts.if'
                }
            }
        }
    }
}

module.exports = Post
const { Model, snakeCaseMappers } = require('objection')
const knex = require('../knex')

Model.knex(knex)

class Like extends Model {
    static get tableName() {
        return 'likes'
    }

    static get columnNameMappers() {
        return snakeCaseMappers()
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['userId', 'postId'],
        
            properties: {
                id: {type: 'integer'},
                userId: {type: 'integer'},
                postId: {type: 'integer'}
            }
        }
    }
}

module.exports = Like
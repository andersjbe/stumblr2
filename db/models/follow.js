const { Model, snakeCaseMappers } = require('objection')
const knex = require('../knex')

Model.knex(knex)

class Follow extends Model {
    static get tableName() {
        return 'follows';
    }
    
    static get columnNameMappers() {
        return snakeCaseMappers()
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['userFollowingId', 'userFollowedId'],

            properties: {
                id:                 { type: 'integer' },
                userFollowingId:    { type: 'integer' },
                userFollowedId:     { type: 'integer' }
            }
        }
    }

}

module.exports = Follow
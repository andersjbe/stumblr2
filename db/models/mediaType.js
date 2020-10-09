const { Model, snakeCaseMappers } = require('objection')
const knex = require('../knex')

Model.knex(knex)

class MediaType extends Model {
    static get tableName() {
        return 'media_types'
    }

    static get columnNameMappers() {
        return snakeCaseMappers()
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['type'],

            properties: {
                id:     { type: 'integer' },
                type:   { type: 'string ' }
            }
        }
    }

    // static get relationMappings() {

    // }
}

module.exports = MediaType
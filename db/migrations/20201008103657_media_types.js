
exports.up = function (knex) {
    return knex.schema.createTable('media_types', mt => {
        mt.increments('id')
            .primary()
        mt.string('type', 100)
            .notNullable()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('media_types')
};

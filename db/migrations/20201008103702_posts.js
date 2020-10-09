
exports.up = function (knex) {
    return knex.schema.createTable('posts', posts => {
        posts.increments('id')
            .primary()
        posts.integer('user_id')
            .notNullable()
            .references('users.id')
        posts.text('text')
        posts.integer('media_type_id')
            .notNullable()
            .references('media_types.id')
        posts.string('media_url')
        posts.integer('reblogged_from')
            .references('posts.id')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('posts')
};

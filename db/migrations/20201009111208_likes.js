
exports.up = function (knex) {
    return knex.schema.createTable('likes', likes => {
        likes.increments('id')
            .primary()
        likes.integer('user_id')
            .notNullable()
            .references('users.id')
        likes.integer('post_id')
            .notNullable()
            .references('posts.id')

        likes.unique(['user_id', 'post_id'])
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('likes')
};

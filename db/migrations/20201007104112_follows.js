
exports.up = function (knex) {
    return knex.schema.createTable('follows', follows => {
        follows.increments('id')
            .primary()
        follows.integer('user_following_id')
            .notNullable()
            .references('users.id')
        follows.integer('user_followed_id')
            .notNullable()
            .references('users.id')
        follows.unique(['user_following_id', 'user_followed_id'])
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('follows')
};

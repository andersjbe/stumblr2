
exports.up = function (knex) {
    return knex.schema.createTable('users', users => {
        users.increments('id')
            .primary()
        users.string('username', 100)
            .notNullable()
            .unique()
        users.string('hashed_password')
            .notNullable()
        users.string('profile_pic_url')
            .defaultTo()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('users')
};

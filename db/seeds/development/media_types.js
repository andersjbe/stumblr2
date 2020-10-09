
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('media_types').del()
    .then(function () {
      // Inserts seed entries
      return knex('media_types').insert([
        {id: 1, type: 'text'},
        {id: 2, type: 'image'},
        {id: 3, type: 'video'},
        {id: 4, type: 'audio'}
      ]);
    });
};

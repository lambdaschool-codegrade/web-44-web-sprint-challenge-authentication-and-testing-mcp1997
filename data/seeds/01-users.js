
exports.seed = function(knex) {
  // Deletes ALL existing entries and resets ids
  return knex('users')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'matt', password: '1234' },
        { username: 'allison', password: '1234' }
      ]);
    });
};

const db = require('../../data/dbConfig')

function findBy(filter) {
  return db('users').where(filter)
}

async function create(user) {
  const [id] = await db('users').insert(user)
  const newUser = await findBy({ id })
  return newUser
}

module.exports = {
  findBy,
  create
}
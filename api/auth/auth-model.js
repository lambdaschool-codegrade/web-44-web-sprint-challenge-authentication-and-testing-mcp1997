const db = require('../../data/dbConfig')

async function findBy(filter) {
  const [result] = await db('users').where(filter)
  return result
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
const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

describe('[POST] /register', () => {
  it('responds with a 422 if req.body is invalid', async () => {
    const res = await request(server).post('/api/auth/register').send({})
    expect(res.status).toBe(422)
  }, 2500)
  it('responds with a 201 upon successful registration', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'escaperoom', password: 'igotout' })
    expect(res.status).toBe(201)
  })
})

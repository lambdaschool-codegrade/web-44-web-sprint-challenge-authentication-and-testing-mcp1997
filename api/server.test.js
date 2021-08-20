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
  }, 2500)
})

describe('[POST] /login', () => {
  it('responds with a 422 if req.body is invalid', async () => {
    const res = await request(server).post('/api/auth/login').send({})
    expect(res.status).toBe(422)
  }, 2500)
  it('responds with a 401 if credentials are invalid', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'test', password: 'test' })
    expect(res.status).toBe(401)
  }, 2500)
  it('responds with a 200 upon successful login', async () => {
    let res = await request(server).post('/api/auth/register')
      .send({ username: 'spade', password: '1234' })
    expect(res.status).toBe(201)
    res = await request(server).post('/api/auth/login')
      .send({ username: 'spade', password: '1234' })
    expect(res.status).toBe(200)
  }, 2500)
})

describe('[GET] /jokes ', () => {
  it('responds with a 401 if token is invalid', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(401)
  })
  it('responds with a 200 if token checks out', async () => {
    let res = await request(server).post('/api/auth/register')
      .send({ username: 'spade', password: '1234' })
    expect(res.status).toBe(201)
    res = await request(server).post('/api/auth/login')
      .send({ username: 'spade', password: '1234' })
    expect(res.status).toBe(200)
    res = await request(server).get('/api/jokes')
    expect(res.status).toBe(200)
  }, 2500)
})

const { JWT_SECRET } = require('../auth/secret')
const jwt = require('jsonwebtoken')

const { findBy } = require('../auth/auth-model')

const restricted = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
  const token = req.headers.authorization

  if (!token) {
    next({ status: 401, message: 'token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      next({ status: 401, message: 'token invalid' })
    } else {
      req.decodedToken = decodedToken
      next()
    }
  })
};

const checkReqBody = (req, res, next) => {
  const { username, password } = req.body

  if (!username || !password) {
    next({ status: 422, message: 'username and password required' })
  } else {
    next()
  }
}

const checkUserUnique = async (req, res, next) => {
  const { username } = req.body
  const existing = await findBy({ username })

  if (existing) {
    next({ status: 422, message: 'username taken' })
  } else {
    next()
  }
}

const checkUserExists = async (req, res, next) => {
  const { username } = req.body
  const existing = await findBy({ username })

  if (!existing) {
    next({ status: 401, message: 'invalid credentials' })
  } else {
    next()
  }
}

module.exports = {
  restricted,
  checkReqBody,
  checkUserUnique,
  checkUserExists
}
const { expect } = require('chai')
const request = require('supertest')
const app = require('../../src/app')
const faker = require('faker')
const { roles } = require('../../src/datos/roles')
const { secret } = require('../../src/lib/config')
const jwt = require('jsonwebtoken')

const server = request(app)

const path = '/api/'

let commonHeaders

const createFakeUser = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName(),
  birthdate: faker.date.past(),
  identification: faker.datatype.string(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  country: faker.address.country(),
  avatar: faker.image.avatar(),
})

const loginUser = async (email, password) => {
  const res = await server.post(`${path}auth/login`).send({ email, password })
  return res.body
}

const getHeaders = (token) => ({
  'x-access-token': token,
})

const createToken = (userId, role) => {
  const roleId = getRole(role).id

  const token = jwt.sign({ id: userId, roleId }, secret, { expiresIn: '1h' })
  return token
}

const getRole = (name) => {
  return roles.find((r) => r.name === name)
}

const createUserWithRole = (role) => {
  const user = createFakeUser()
  user.roleId = getRole(role).id
  return user
}

const testAutorization = async (roles, path, method = 'get', body) => {
  const responses = []

  const requests = {
    get: server.get,
    post: server.post,
    put: server.put,
    delete: server.delete,
  }

  const promises = []

  for (const role of roles) {
    const user = createUserWithRole(role)
    const token = createToken(user.id, role)
    const headers = getHeaders(token)
    const newRequest = requests[method](path).set(headers).send(body)
    promises.push(newRequest)
  }

  await Promise.all(promises).then((res) => {
    res.forEach((r) => responses.push(r))
  })

  return responses
}

describe('Users Routes', function () {
  before(async function () {
    // Login
    const { token } = await loginUser('wilmer@hotmail.com', '1234')

    commonHeaders = getHeaders(token)
  })
  describe('GET /users', function () {
    describe('Responses', function () {
      it('should return a list of users', async function () {
        const res = await server.get(`${path}users`).set(commonHeaders)

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('array')
      })
    })
    describe('Authentication And Authorization', function () {
      it('should return a 403 if the user is not authenticated', async function () {
        const res = await server.get(`${path}users`)

        expect(res.status).to.equal(403)
      })
      it('should return 403 if the user is not admin or super User', async function () {
        // create a fake user and set the roles
        const roles = ['Alumno', 'Profesor', 'Tutor']
        const responses = await testAutorization(roles, `${path}users`)

        // expect the response
        expect(responses)
          .to.be.an('array')
          .that.has.lengthOf(roles.length)
          .and.satisfy((res) => {
            return res.every((r) => r.status === 403)
          })
      })
      it('should return 200 if the user is admin or sUser', async function () {
        const roles = ['Admin', 'sUser']
        const responses = await testAutorization(roles, `${path}users`)

        // expect the response
        expect(responses)
          .to.be.an('array')
          .that.has.lengthOf(roles.length)
          .and.satisfy((res) => {
            return res.every((r) => r.status === 200)
          })
      })
    })
  })
})

describe('GET /users/:id', function () {
  let newUser = createFakeUser()
  let user
  before(async function () {
    // Create user
    await server.post(`${path}users`).set(commonHeaders).send(newUser)
    // Get user
    const res = await server.get(`${path}users`).set(commonHeaders)

    user = res.body.find((user) => user.userName === newUser.userName)
  })
  describe('Responses', function () {
    it('should return a user', async function () {
      const res = await server.get(`${path}users/${user.id}`).set(commonHeaders)

      expect(res.status).to.equal(200)
      expect(res.body).to.be.an('object')
    })
  })
  describe('Authentication And Authorization', function () {
    it('should return a 403 if the user is not authenticated', async function () {
      const res = await server.get(`${path}users/${user.id}`)

      expect(res.status).to.equal(403)
    })
    it('should return 403 if the user is not admin or super User', async function () {
      const roles = ['Alumno', 'Profesor', 'Tutor']
      const responses = await testAutorization(roles, `${path}users`)

      // expect the response
      expect(responses)
        .to.be.an('array')
        .that.has.lengthOf(roles.length)
        .and.satisfy((res) => {
          return res.every((r) => r.status === 403)
        })
    })
    it('should return 200 if the user is admin or super user', async function () {
      const roles = ['Admin', 'sUser']
      const responses = await testAutorization(roles, `${path}users`)

      // expect the response
      expect(responses)
        .to.be.an('array')
        .that.has.lengthOf(roles.length)
        .and.satisfy((res) => {
          return res.every((r) => r.status === 200)
        })
    })
  })
  describe('POST /users', function () {
    describe('Responses', function () {
      it('should create a new User', async function () {
        let newUser = createFakeUser()

        const res = await server
          .post(`${path}users`)
          .set(commonHeaders)
          .send(newUser)

        expect(res.status).to.equal(201)

        // Check if the new user was created
        const res2 = await server.get(`${path}users`).set(commonHeaders)
        const user = res2.body.find(
          (user) => user.userName === newUser.userName
        )

        expect(user).to.be.an('object')
      })
    })
    describe('Validations', function () {
      it("should return an error if the user doesn't have a firstName", async function () {
        let newUser = createFakeUser()
        delete newUser.firstName

        const res = await server
          .post(`${path}users`)
          .set(commonHeaders)
          .send(newUser)

        expect(res.status).to.equal(400)
      })
      it("should return an error if the user doesn't have a lastName", async function () {
        let newUser = createFakeUser()
        delete newUser.lastName

        const res = await server
          .post(`${path}users`)
          .set(commonHeaders)
          .send(newUser)

        expect(res.status).to.equal(400)
      })
      it("should return an error if the user doesn't have an email", async function () {
        let newUser = createFakeUser()
        delete newUser.email

        const res = await server
          .post(`${path}users`)
          .set(commonHeaders)
          .send(newUser)

        expect(res.status).to.equal(400)
      })
      it("should return an error if the user doesn't have a password", async function () {
        let newUser = createFakeUser()
        delete newUser.password

        const res = await server
          .post(`${path}users`)
          .set(commonHeaders)
          .send(newUser)

        expect(res.status).to.equal(400)
      })
      it("should return an error if the user doesn't have an userName", async function () {
        let newUser = createFakeUser()
        delete newUser.userName

        const res = await server
          .post(`${path}users`)
          .set(commonHeaders)
          .send(newUser)

        expect(res.status).to.equal(400)
      })
      it("should return an error if the user doesn't have a birthdate", async function () {
        let newUser = createFakeUser()
        delete newUser.birthdate

        const res = await server
          .post(`${path}users`)
          .set(commonHeaders)
          .send(newUser)

        expect(res.status).to.equal(400)
      })
      it("should return an error if the user doesn't have an identification", async function () {
        let newUser = createFakeUser()
        delete newUser.identification

        const res = await server
          .post(`${path}users`)
          .set(commonHeaders)
          .send(newUser)

        expect(res.status).to.equal(400)
      })
      it("should return an error if the user doesn't have a country", async function () {
        let newUser = createFakeUser()
        delete newUser.country

        const res = await server
          .post(`${path}users`)
          .set(commonHeaders)
          .send(newUser)

        expect(res.status).to.equal(400)
      })
    })
    describe('Authentication And Authorization', function () {
      it('should return a 403 if the user is not authenticated', async function () {
        let newUser = createFakeUser()

        const res = await server.post(`${path}users`).send(newUser)

        expect(res.status).to.equal(403)
      })
      it('should return 403 if the user is not admin or super User', async function () {
        let newUser = createFakeUser()

        const roles = ['Alumno', 'Profesor', 'Tutor']
        const responses = await testAutorization(
          roles,
          `${path}users`,
          'post',
          newUser
        )

        // expect the response
        expect(responses)
          .to.be.an('array')
          .that.has.lengthOf(roles.length)
          .and.satisfy((res) => {
            return res.every((r) => r.status === 403)
          })
      })
      it('should return 201 if the user is admin or super user', async function () {
        let newUser = createFakeUser()

        const roles = ['Admin', 'sUser']
        const responses = await testAutorization(
          roles,
          `${path}users`,
          'post',
          newUser
        )

        // expect the response
        expect(responses)
          .to.be.an('array')
          .that.has.lengthOf(roles.length)
          .and.satisfy((res) => {
            return res.every((r) => r.status === 201)
          })
      })
    })
  })

  describe('PUT /users', function () {
    let newUser = createFakeUser()
    let userId

    before(async function () {
      await server.post(`${path}users`).set(commonHeaders).send(newUser)
      const res = await server.get(`${path}users`).set(commonHeaders)

      userId = res.body.find((user) => user.email === newUser.email).id
    })
    describe('Responses', function () {
      it('should update a user correctly', async function () {
        const newUserData = createFakeUser()

        const res = await server
          .put(`${path}users/${userId}`)
          .send(newUserData)
          .set(commonHeaders)

        // Check if the user was updated
        const res2 = await server
          .get(`${path}users/${userId}`)
          .set(commonHeaders)

        // I delete the birthdate because the date format is different in the database and in the response
        delete newUserData.birthdate
        // And the password because the server encrypts it
        delete newUserData.password

        expect(res.status).to.equal(200)
        Object.keys(newUserData).forEach((key) => {
          expect(res2.body[key]).to.equal(newUserData[key])
        })
      })
      it('should avoid to re-encrypt the password if the password is the same that in the DB', async function () {
        const password = await server
          .get(`${path}users/${userId}`)
          .set(commonHeaders)
          .then((res) => res.body.password)

        const newUserData = createFakeUser()
        newUserData.password = password

        const res = await server
          .put(`${path}users/${userId}`)
          .send(newUserData)
          .set(commonHeaders)

        // Check if the user was updated
        const res2 = await server
          .get(`${path}users/${userId}`)
          .set(commonHeaders)

        // Check that the poassword was not re-encrypted
        expect(res.status).to.equal(200)
        expect(res2.body.password).to.equal(password)
      })
    })
    describe('Authentication And Authorization', function () {
      it('should return a 403 if the user is not authenticated', async function () {
        const res = await server.put(`${path}users/${userId}`).send(newUser)

        expect(res.status).to.equal(403)
      })
      it('should return 403 if the user is not admin or super User', async function () {
        const roles = ['Alumno', 'Profesor', 'Tutor']
        const responses = await testAutorization(
          roles,
          `${path}users/${userId}`,
          'put',
          newUser
        )

        // expect the response
        expect(responses)
          .to.be.an('array')
          .that.has.lengthOf(roles.length)
          .and.satisfy((res) => {
            return res.every((r) => r.status === 403)
          })
      })
      it('should return 200 if the user is admin or super user', async function () {
        const roles = ['Admin', 'sUser']
        const responses = await testAutorization(
          roles,
          `${path}users/${userId}`,
          'put',
          newUser
        )

        // expect the response
        expect(responses)
          .to.be.an('array')
          .that.has.lengthOf(roles.length)
          .and.satisfy((res) => {
            return res.every((r) => r.status === 200)
          })
      })
    })
  })

  describe('DELETE /users', function () {
    let newUser = createFakeUser()
    let userId

    beforeEach(async function () {
      await server.post(`${path}users`).set(commonHeaders).send(newUser)
      const res = await server.get(`${path}users`).set(commonHeaders)

      userId = res.body.find((user) => user.email === newUser.email).id
    })
    describe('Responses', function () {
      it('should delete a user correctly', async function () {
        const res = await server
          .delete(`${path}users/${userId}`)
          .set(commonHeaders)

        expect(res.status).to.equal(200)

        // Check if the user was deleted
        const res2 = await server
          .get(`${path}users/${userId}`)
          .set(commonHeaders)

        expect(res2.body.status).to.equal(false)
      })
    })
    describe('Authentication And Authorization', function () {
      it('should return a 403 if the user is not authenticated', async function () {
        const res = await server.delete(`${path}users/${userId}`)

        expect(res.status).to.equal(403)
      })
      it('should return 403 if the user is not super User', async function () {
        const roles = ['Alumno', 'Profesor', 'Tutor', 'Admin']
        const responses = await testAutorization(
          roles,
          `${path}users/${userId}`,
          'delete',
          newUser
        )

        // expect the response
        expect(responses)
          .to.be.an('array')
          .that.has.lengthOf(roles.length)
          .and.satisfy((res) => {
            return res.every((r) => r.status === 403)
          })
      })
      it('should return 200 if the user is  super user', async function () {
        const roles = ['sUser']
        const responses = await testAutorization(
          roles,
          `${path}users/${userId}`,
          'delete'
        )

        // expect the response
        expect(responses)
          .to.be.an('array')
          .that.has.lengthOf(roles.length)
          .and.satisfy((res) => {
            return res.every((r) => r.status === 200)
          })
      })
    })
  })
})

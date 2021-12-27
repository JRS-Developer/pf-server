const { expect } = require('chai')
const request = require('supertest')
const app = require('../../src/app')
const faker = require('faker')

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

describe('Users Routes', function () {
  before(async function () {
    // Login
    const res = await server.post(`${path}auth/login`).send({
      email: 'wilmer@hotmail.com',
      password: '1234',
    })
    commonHeaders = {
      'x-access-token': res.body.token,
    }
  })
  describe('GET /users', function () {
    describe('Success', function () {
      it('should return a list of users', async function () {
        const res = await server.get(`${path}users`).set(commonHeaders)

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('array')
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
    it('should return an user', async function () {
      const res = await server.get(`${path}users/${user.id}`).set(commonHeaders)

      expect(res.status).to.equal(200)
      expect(res.body).to.be.an('object')
      expect(res.body.id).to.equal(user.id)
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
  })

  describe('PUT /users', function () {
    let newUser = createFakeUser()
    let userId

    before(async function () {
      await server.post(`${path}users`).set(commonHeaders).send(newUser)
      const res = await server.get(`${path}users`).set(commonHeaders)

      userId = res.body.find((user) => user.email === newUser.email).id
    })
    it('should update a user correctly', async function () {
      const res = await server
        .put(`${path}users/${userId}`)
        .send({
          firstName: 'Juan',
          lastName: 'Perez',
        })
        .set(commonHeaders)

      expect(res.status).to.equal(200)

      // Check if the user was updated
      const res2 = await server.get(`${path}users/${userId}`).set(commonHeaders)

      expect(res2.status).to.equal(200)
      expect(res2.body.firstName).to.equal('Juan')
    })
  })

  describe('DELETE /users', function () {
    let newUser = createFakeUser()
    let userId

    before(async function () {
      await server.post(`${path}users`).set(commonHeaders).send(newUser)
      const res = await server.get(`${path}users`).set(commonHeaders)

      userId = res.body.find((user) => user.email === newUser.email).id
    })
    it('should delete a user correctly', async function () {
      const res = await server
        .delete(`${path}users/${userId}`)
        .set(commonHeaders)

      expect(res.status).to.equal(200)

      // Check if the user was deleted
      const res2 = await server.get(`${path}users/${userId}`).set(commonHeaders)

      expect(res2.body.status).to.equal(false)
    })
  })
})

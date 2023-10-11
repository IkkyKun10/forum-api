const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')
let threadId
let accessToken

describe('/threads endpoint Test', () => {
  beforeEach(async () => {
    const payloadLogin = {
      username: 'saya',
      password: 'super_secret'
    }

    const server = await createServer(container)

    await server.inject(
      {
        method: 'POST',
        url: '/users',
        payload: {
          username: 'saya',
          password: 'super_secret',
          fullname: 'saya saya'
        }
      }
    )

    const responseAuth = await server.inject(
      {
        method: 'POST',
        url: '/authentications',
        payload: payloadLogin
      }
    )

    const responseAuthJson = JSON.parse(responseAuth.payload)
    accessToken = responseAuthJson.data.accessToken
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('when POST /threads Test', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container)

      const addThreadPayload = {
        title: 'new thread'
      }

      const response = await server.inject(
        {
          method: 'POST',
          url: '/threads',
          payload: addThreadPayload,
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      )

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread baru gagal dibuat karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when request payload not require data type specification', async () => {
      const addThreadPayload = {
        title: 9102948589605,
        body: 'body'
      }

      const server = await createServer(container)

      const response = await server.inject(
        {
          method: 'POST',
          url: '/threads',
          payload: addThreadPayload,
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      )

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread baru gagal dibuat karena tipe data tidak sesuai')
    })

    it('should response 201 and success add thread', async () => {
      const addThreadPayload = {
        title: 'new thread',
        body: 'new body'
      }

      const server = await createServer(container)

      const response = await server.inject(
        {
          method: 'POST',
          url: '/threads',
          payload: addThreadPayload,
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      )

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })
  })

  describe('when GET /threads/{threadId} Test', () => {
    beforeEach(async () => {
      const server = await createServer(container)

      const response = await server.inject(
        {
          method: 'POST',
          url: '/threads',
          payload: {
            title: 'new thread',
            body: 'new body'
          },
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      )

      const responseJson = JSON.parse(response.payload)
      threadId = responseJson.data.addedThread.id
    })

    it('should respond with 404 if thread does not exist', async () => {
      const server = await createServer(container)

      const response = await server.inject(
        {
          method: 'GET',
          url: '/threads/thread-id-not-found-123'
        }
      )

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toBeDefined()
    })

    it('should response 200 and show detail thread', async () => {
      const server = await createServer(container)

      const response = await server.inject(
        {
          method: 'GET',
          url: `/threads/${threadId}`
        }
      )

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
      expect(responseJson.data.thread).toBeDefined()
    })
  })
})

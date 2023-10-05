const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')
let commentId
let threadId
let accessToken

describe('/threads/{threadId}/comments endpoint', () => {
  beforeEach(async () => {
    const payloadLogin = {
      username: 'saya',
      password: 'super_secret'
    }

    const server = await createServer(container)

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'saya',
        password: 'super_secret',
        fullname: 'saya saya'
      }
    })

    const responseAuthentication = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: payloadLogin
    })

    const responseJsonAuth = JSON.parse(responseAuthentication.payload)
    accessToken = responseJsonAuth.data.accessToken

    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'new thread',
        body: 'new body'
      },
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })

    const responseThreadJson = JSON.parse(responseThread.payload)
    threadId = responseThreadJson.data.addedThread.id
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          body: 123
        },
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 123
        },
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai'
      )
    })

    it('should response 201 and persisted add comment', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'new content'
        },
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    beforeEach(async () => {
      const server = await createServer(container)
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'new content'
        },
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      const responseAddCommentJson = JSON.parse(responseAddComment.payload)
      commentId = responseAddCommentJson.data.addedComment.id
    })

    it('should respond with 403 when user remove comment that they dont own', async () => {
      const server = await createServer(container)

      const payloadLogin = {
        username: 'new_user',
        password: 'secret'
      }

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'new_user',
          password: 'secret',
          fullname: 'new user full'
        }
      })

      const responseAuthUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadLogin
      })

      const responseAuthNewUserJson = JSON.parse(responseAuthUser.payload)
      const accessTokenAnotherUser = responseAuthNewUserJson.data.accessToken

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessTokenAnotherUser}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toBeDefined()
    })

    it('should respond with 200 and return success status', async () => {
      const server = await createServer(container)
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})

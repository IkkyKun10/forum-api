/* eslint-disable no-undef */
/* eslint-disable camelcase */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const pool = require('../../database/postgres/pool')
const container = require('../../container')
const createServer = require('../createServer')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')

let accessToken
let commentId
let threadId
let replyId

describe('/threads/{threadId}/comments/{commentId}/replies/ endpoint Test', () => {
  beforeEach(async () => {
    const payloadLogin = {
      username: 'username',
      password: 'secret'
    }

    const server = await createServer(container)

    await server.inject(
      {
        method: 'POST',
        url: '/users',
        payload: {
          username: 'username',
          password: 'secret',
          fullname: 'full name'
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

    const responseThread = await server.inject(
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

    const responseThreadJson = JSON.parse(responseThread.payload)
    threadId = responseThreadJson.data.addedThread.id

    const responseComment = await server.inject(
      {
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'new content'
        },
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    )

    const responseCommentJson = JSON.parse(responseComment.payload)
    commentId = responseCommentJson.data.addedComment.id
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies Test', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container)

      const dataNull = null

      const response = await server.inject(
        {
          method: 'POST',
          url: `/threads/${threadId}/comments/${commentId}/replies`,
          payload: {
            dataNull
          },
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      )

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')

      expect(responseJson.message).toEqual('replies gagal dibuat karena properti yang dibutuhkan tidak ada')
    })

    it('should should response 400 when request payload not meet data type specification', async () => {
      const server = await createServer(container)

      const response = await server.inject(
        {
          method: 'POST',
          url: `/threads/${threadId}/comments/${commentId}/replies`,
          payload: {
            content: 1234858567696007
          },
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      )

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('replies gagal dibuat karena tipe data tidak sesuai')
    })

    it('should response 201 and persisted add replies', async () => {
      const server = await createServer(container)

      const response = await server.inject(
        {
          method: 'POST',
          url: `/threads/${threadId}/comments/${commentId}/replies`,
          payload: {
            content: 'new content'
          },
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      )

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId} Test', () => {
    beforeEach(async () => {
      const server = await createServer(container)

      const response = await server.inject(
        {
          method: 'POST',
          url: `/threads/${threadId}/comments/${commentId}/replies`,
          payload: {
            content: 'new content'
          },
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      )

      const responseAddReplieJson = JSON.parse(response.payload)
      replyId = responseAddReplieJson.data.addedReply.id
    })

    it('should respond 403 when user remove not his replies', async () => {
      const server = await createServer(container)

      const payloadLogin = {
        username: 'new_other_user',
        password: 'secret'
      }

      await server.inject(
        {
          method: 'POST',
          url: '/users',
          payload: {
            username: 'new_other_user',
            password: 'secret',
            fullname: 'new other user full'
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
      const accessTokenAnotherUser = responseAuthJson.data.accessToken

      const response = await server.inject(
        {
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
          headers: {
            authorization: `Bearer ${accessTokenAnotherUser}`
          }
        }
      )

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toBeDefined()
    })

    it('should response 200 and return success', async () => {
      const server = await createServer(container)

      const response = await server.inject(
        {
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      )

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})

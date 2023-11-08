/* eslint-disable no-undef */
/* eslint-disable camelcase */
const pool = require('../../database/postgres/pool')
const container = require('../../container')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const createServer = require('../createServer')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')

let accessToken
let owner
let threadId
let commentId

describe('/threads/{threadId}/comments/{commentId} test', () => {
  beforeEach(async () => {
    const payloadLogin = {
      username: 'username',
      password: 'secret'
    }

    const server = await createServer(container)

    const responseUser = await server.inject(
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

    const responseUserJson = JSON.parse(responseUser.payload)
    owner = responseUserJson.data.addedUser.id

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

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await LikesTableTestHelper.cleanTable()
  })

  describe('PUT /threads/{threadId}/comments/{commentId}/likes test', () => {
    it('should response 401 when request not contain access token', async () => {
      const server = await createServer(container)

      const responseLikes = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`
      })

      const responseJson = JSON.parse(responseLikes.payload)
      expect(responseLikes.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 404 when thread does not exist', async () => {
      const server = await createServer(container)
      const threadIdNew = 'thread-00000000000000'

      const responseLikes = await server.inject({
        method: 'PUT',
        url: `/threads/${threadIdNew}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })
      const responseJson = JSON.parse(responseLikes.payload)

      expect(responseLikes.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toBeDefined()
    })

    it('should response 404 when comment does not exist', async () => {
      const server = await createServer(container)
      const commentIdFake = 'comment-0000000000000'

      const responseLikes = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentIdFake}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(responseLikes.payload)

      expect(responseLikes.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toBeDefined()
    })

    it('should response success when add like comment', async () => {
      const server = await createServer(container)

      const responseLikes = await server.inject(
        {
          method: 'PUT',
          url: `/threads/${threadId}/comments/${commentId}/likes`,
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      )

      const responseJson = JSON.parse(responseLikes.payload)

      const getLikeById = await LikesTableTestHelper.getLikeById(
        {
          commentId,
          owner
        }
      )

      expect(responseLikes.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(getLikeById.id).toBeDefined()
      expect(getLikeById.comment_id).toEqual(commentId)
      expect(getLikeById.owner).toEqual(owner)
    })

    it('should response success when unlike comment', async () => {
      const server = await createServer(container)

      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      const responseLike = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(responseLike.payload)

      expect(responseLike.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})

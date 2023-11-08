/* eslint-disable no-undef */
/* eslint-disable camelcase */
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')
const LikesRepositoryPostgres = require('../LikesRepositoryPostgres')
const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('LikesRepositoryPostgres Test', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser(
      {
        id: 'user-123',
        username: 'username',
        password: 'secret',
        fullname: 'full name'
      }
    )

    await ThreadsTableTestHelper.addThread(
      {
        id: 'thread-123',
        title: 'new thread',
        owner: 'user-123',
        date: '2023',
        body: 'naruto naruto naruto'
      }
    )

    await CommentsTableTestHelper.addComment(
      {
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        username: 'username',
        date: '2023',
        content: 'new comment'
      }
    )
  })

  afterAll(async () => [
    await pool.end()
  ])

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await LikesTableTestHelper.cleanTable()
  })

  describe('verify like comment exist function test', () => {
    it('should resolve true when like comment exist', async () => {
      await LikesTableTestHelper.addLikes(
        {
          id: 'likes-123',
          commentId: 'comment-123',
          owner: 'user-123'
        }
      )

      const payload = {
        commentId: 'comment-123',
        owner: 'user-123'
      }

      const likesRepoPostgres = new LikesRepositoryPostgres(pool, {})

      const isLike = await likesRepoPostgres.verifyLikeComment(payload)

      expect(isLike).toEqual(1)
    })

    it('should zero when like comment is not exist', async () => {
      await CommentsTableTestHelper.addComment(
        {
          id: 'comment-1111111',
          threadId: 'thread-123',
          owner: 'user-123',
          username: 'username',
          date: '2023',
          content: 'new content'
        }
      )

      const payload = {
        commentId: 'comment-1111111',
        owner: 'user-123'
      }

      const likesRepoPostgres = new LikesRepositoryPostgres(pool, {})

      const isLike = await likesRepoPostgres.verifyLikeComment(payload)

      expect(isLike).toEqual(0)
    })
  })

  describe('like and unlike comment function test', () => {
    it('should add like to comment', async () => {
      const payload = {
        commentId: 'comment-123',
        owner: 'user-123'
      }

      const fakeIdGen = () => '123'
      const likesRepoPostgres = new LikesRepositoryPostgres(pool, fakeIdGen)

      const isLiked = await likesRepoPostgres.addLikeComment(payload)
      const getLikeById = await LikesTableTestHelper.getLikeById(payload)
      expect(isLiked).toBeTruthy()
      expect(getLikeById.id).toEqual('like-123')
    })

    it('should remove like comment', async () => {
      await LikesTableTestHelper.addLikes(
        {
          id: 'likes-123',
          commentId: 'comment-123',
          owner: 'user-123'
        }
      )

      const payload = {
        commentId: 'comment-123',
        owner: 'owner-123'
      }

      const likesRepoPostgres = new LikesRepositoryPostgres(pool, {})

      const isUnlike = await likesRepoPostgres.unlikeComment(payload)

      expect(isUnlike).toBeFalsy()
    })
  })

  describe('get total likes comment', () => {
    it('should showing like comment count', async () => {
      await UsersTableTestHelper.addUser(
        {
          id: 'user-000',
          username: 'other user',
          password: 'secret',
          fullname: 'full other user'
        }
      )

      await LikesTableTestHelper.addLikes(
        {
          id: 'likes-123',
          commentId: 'comment-123',
          owner: 'user-123'
        }
      )

      await LikesTableTestHelper.addLikes(
        {
          id: 'likes-234',
          commentId: 'comment-123',
          owner: 'user-000'
        }
      )

      const likesRepoPostgres = new LikesRepositoryPostgres(pool, {})

      const totalLikes = await likesRepoPostgres.getTotalLikeComment('comment-123')

      expect(totalLikes).toBeDefined()
      expect(totalLikes.length).toStrictEqual(2)
    })
  })
})

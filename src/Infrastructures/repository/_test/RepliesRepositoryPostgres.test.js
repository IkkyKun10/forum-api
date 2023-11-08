/* eslint-disable no-undef */
/* eslint-disable camelcase */
const pool = require('../../database/postgres/pool')
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres')

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')

const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

const AddReplies = require('../../../Domains/reply/entities/AddReplies')
const AddedReplies = require('../../../Domains/reply/entities/AddedReplies')

describe('RepliesRepositoryPostgres Test', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'new user',
      password: 'secret',
      fullname: 'new user fullname'
    })

    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'new thread',
      body: 'new body',
      owner: 'user-123',
      date: '2023'
    })

    await CommentsTableTestHelper.addComment(
      {
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123'
      }
    )
  })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('addReplies Test', () => {
    it('should persist add replies and return comment correctly', async () => {
      const addRepliesPayload = new AddReplies(
        {
          commentId: 'comment-123',
          content: 'new content',
          owner: 'user-123'
        }
      )

      const fakeIdGenerator = () => '123'
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator)

      const addedReplies = await repliesRepositoryPostgres.addReplie(addRepliesPayload)

      const replies = await RepliesTableTestHelper.getReplieById('replies-123')

      expect(addedReplies).toStrictEqual(new AddedReplies(
        {
          id: 'replies-123',
          content: 'new content',
          owner: 'user-123'
        }
      ))
      expect(replies).toHaveLength(1)
    })
  })

  describe('VerifyReplyExisting Test', () => {
    it('should throw not found error when replie not existing', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      await expect(repliesRepositoryPostgres.verifyReplieExisting(
        'thread-123',
        'comment-123',
        'replies-not-found-123'
      )
      ).rejects.toThrowError('Replies not fount')
    })

    it('should resolve is replies exist', async () => {
      await RepliesTableTestHelper.addReplie({
        id: 'replies-123',
        commentId: 'comment-123',
        owner: 'user-123'
      })

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})
      await expect(repliesRepositoryPostgres.verifyReplieExisting(
        'thread-123',
        'comment-123',
        'replies-123'
      )).resolves.not.toThrowError()
    })
  })

  describe('verifyReplieOwner Test', () => {
    it('should throw AuthorizationError when replie is not his own', async () => {
      await RepliesTableTestHelper.addReplie(
        {
          id: 'replies-123',
          commentId: 'comment-123',
          owner: 'user-123'
        }
      )
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      await expect(repliesRepositoryPostgres.verifyReplieOwner('replies-123', 'user-321'))
        .rejects.toThrowError('Anda tidak berhak mengakses resource ini')
    })

    it('should not throw AuthorizationError when replie is his own', async () => {
      await RepliesTableTestHelper.addReplie(
        {
          id: 'replies-123',
          commentId: 'comment-123',
          owner: 'user-123'
        }
      )
      const repliesRepositoryPostgresTest = new RepliesRepositoryPostgres(pool, {})

      await expect(repliesRepositoryPostgresTest.verifyReplieOwner('replies-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('deleteReplies Test', () => {
    it('should delete replie from database', async () => {
      await RepliesTableTestHelper.addReplie(
        {
          id: 'replies-123',
          commentId: 'comment-123',
          owner: 'user-123'
        }
      )

      const repliesRepositoryPostgresTest = new RepliesRepositoryPostgres(pool, {})

      await repliesRepositoryPostgresTest.deleteReplieById('replies-123')

      const replies = await RepliesTableTestHelper.getReplieById('replies-123')

      expect(replies).toHaveLength(1)
      expect(replies[0].is_deleted).toEqual(true)
    })

    it('should throw NotFoundError when replie is not available', async () => {
      const replyRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      await expect(replyRepositoryPostgres.deleteReplieById('replies-123'))
        .rejects.toThrowError('Replies not fount')
    })
  })
})

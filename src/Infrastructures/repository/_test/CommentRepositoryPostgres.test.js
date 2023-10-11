const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const pool = require('../../database/postgres/pool')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres Test', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser(
      {
        id: 'user-123',
        username: 'new user',
        password: 'secret',
        fullname: 'new user fullname'
      }
    )
    await ThreadsTableTestHelper.addThread(
      {
        id: 'thread-123',
        title: 'Gojo satoru',
        body: 'Akan bangkit kembali sebagai objek kutukan',
        owner: 'user-123',
        date: '2023'
      }
    )
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('add Comment Test', () => {
    it('should persist add comment and return comment correctly', async () => {
      const addCommentPayload = new AddComment(
        {
          threadId: 'thread-123',
          username: 'new user',
          content: 'test-for-content',
          owner: 'user-123'
        }
      )

      const fakeIdGen = () => '12345'
      const commentRepoPostgres = new CommentRepositoryPostgres(pool, fakeIdGen)

      const actualAddedComment = await commentRepoPostgres.addComment(addCommentPayload)

      const comment = await CommentsTableTestHelper.getCommentById('comment-12345')

      const expectedAddedComment = new AddedComment(
        {
          id: 'comment-12345',
          owner: 'user-123',
          content: 'test-for-content'
        }
      )

      expect(comment).toBeDefined()
      expect(actualAddedComment).toStrictEqual(expectedAddedComment)
    })
  })

  describe('get Comment By Id Test', () => {
    beforeEach(async () => {
      await CommentsTableTestHelper.addComment(
        {
          id: 'comment-4567',
          threadId: 'thread-123',
          username: 'new user',
          date: '2023',
          content: 'new content',
          isDelete: false,
          owner: 'user-123'
        }
      )
    })

    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable()
    })

    it('should throw NotFoundError when comment not found', async () => {
      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {})

      await expect(commentRepoPostgres.getCommentById('comment-00000000000'))
        .rejects.toThrowError('Comment tidak ditemukan')
    })

    it('should resolve if comment exists', async () => {
      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {})

      await expect(commentRepoPostgres.getCommentById('comment-4567'))
        .resolves.toBeUndefined()

      await expect(commentRepoPostgres.getCommentById('comment-4567'))
        .resolves.not.toThrowError()
    })
  })

  describe('verify Comment test', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser(
        {
          id: 'user-321',
          username: 'new user again',
          password: 'secret',
          fullname: 'fullname'
        }
      )

      await CommentsTableTestHelper.addComment(
        {
          id: 'comment-111',
          threadId: 'thread-123',
          username: 'new user again',
          date: '2023',
          content: 'new content',
          isDelete: false,
          owner: 'user-321'
        }
      )
    })

    afterEach(async () => {
      await UsersTableTestHelper.cleanTable()
      await CommentsTableTestHelper.cleanTable()
    })

    it('should throw Authorization Error when comment not his own', async () => {
      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {})
      const isCommentOwnership = commentRepoPostgres.verifyCommentIsOwnership(
        {
          commentId: 'comment-111',
          owner: 'user-123'
        }
      )

      await expect(isCommentOwnership).rejects.toThrowError('Anda tidak punya akses untuk melakukan aksi ini')
    })

    it('should not throw error when comment is ownership', async () => {
      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {})
      const isCommentOwnership = commentRepoPostgres.verifyCommentIsOwnership(
        {
          commentId: 'comment-111',
          owner: 'user-321'
        }
      )

      await expect(isCommentOwnership).resolves.not.toThrowError()
    })
  })

  describe('get All Comment In Thread Test', () => {
    it('should return all comment in thread correctly', async () => {
      await CommentsTableTestHelper.addComment(
        {
          id: 'comment-000',
          threadId: 'thread-123',
          username: 'new user',
          date: '2023',
          content: 'new content',
          isDelete: false,
          owner: 'user-123'
        }
      )

      await CommentsTableTestHelper.addComment(
        {
          id: 'comment-111',
          threadId: 'thread-123',
          username: 'new user',
          date: '2023',
          content: 'other content',
          isDelete: false,
          owner: 'user-123'
        }
      )

      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {})

      const expectedComments = [
        {
          id: 'comment-000',
          username: 'new user',
          date: '2023',
          content: 'new content',
          is_deleted: false
        },
        {
          id: 'comment-111',
          username: 'new user',
          date: '2023',
          content: 'other content',
          is_deleted: false
        }
      ]

      const actualComments = await commentRepoPostgres.getCommentsInThread('thread-123')

      expect(actualComments).toStrictEqual(expectedComments)

      expect(actualComments).toHaveLength(2)

      expect(actualComments[0].id).toStrictEqual(expectedComments[0].id)

      expect(actualComments[0].username).toStrictEqual(expectedComments[0].username)

      expect(actualComments[0].date).toStrictEqual(expectedComments[0].date)

      expect(actualComments[0].content).toStrictEqual(expectedComments[0].content)

      expect(actualComments[0].is_deleted).toStrictEqual(expectedComments[0].is_deleted)

      expect(actualComments[1].id).toStrictEqual(expectedComments[1].id)

      expect(actualComments[1].username).toStrictEqual(expectedComments[1].username)

      expect(actualComments[1].date).toStrictEqual(expectedComments[1].date)

      expect(actualComments[1].content).toStrictEqual(expectedComments[1].content)

      expect(actualComments[1].is_deleted).toStrictEqual(expectedComments[1].is_deleted)

    })
  })

  describe('delete Comment Test', () => {
    beforeEach(async () => {
      await CommentsTableTestHelper.addComment(
        {
          id: 'comment-222',
          threadId: 'thread-123',
          username: 'new user',
          date: '2023',
          content: 'new content',
          isDelete: false,
          owner: 'user-123'
        }
      )
    })

    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable()
      await UsersTableTestHelper.cleanTable()
    })

    it('should remove comment correctly', async () => {
      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {})

      const comment = await commentRepoPostgres.deleteCommentById('comment-222')

      const commentInDatabase = await CommentsTableTestHelper.getCommentById('comment-222')

      expect(comment.id).toEqual('comment-222')
      expect(commentInDatabase.is_deleted).toEqual(true)
    })
  })
})

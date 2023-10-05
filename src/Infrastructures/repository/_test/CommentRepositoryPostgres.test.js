const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const pool = require('../../database/postgres/pool')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'new user',
      password: 'secret',
      fullname: 'new user here'
    })
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'Gojo satoru',
      body: 'Akan bangkit kembali sebagai objek kutukan',
      owner: 'user-123',
      date: '2023'
    })
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addComment function', () => {
    it('should persist add comment and return comment correctly', async () => {
      const addCommentPayload = new AddComment({
        content: 'content-test',
        username: 'new user',
        threadId: 'thread-123',
        owner: 'user-123'
      })

      const expectedAddedComment = new AddedComment({
        id: 'comment-123',
        content: 'content-test',
        owner: 'user-123'
      })

      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )
      const addedComment = await commentRepositoryPostgres.addComment(
        addCommentPayload
      )

      const comment = await CommentsTableTestHelper.getDetailComment(
        'comment-123'
      )
      expect(comment).toBeDefined()
      expect(addedComment).toStrictEqual(expectedAddedComment)
    })
  })

  describe('findCommentById function', () => {
    beforeEach(async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-321',
        threadId: 'thread-123',
        username: 'new user',
        date: '2023',
        content: 'new content',
        isDelete: false,
        owner: 'user-123'
      })
    })

    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable()
    })

    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await expect(
        commentRepositoryPostgres.findCommentById('comment-999999')
      ).rejects.toThrowError('Comment Not Found')
    })

    it('should resolve if comment exists', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await expect(
        commentRepositoryPostgres.findCommentById('comment-321')
      ).resolves.toBeUndefined()
      await expect(
        commentRepositoryPostgres.findCommentById('comment-321')
      ).resolves.not.toThrowError()
    })
  })

  describe('verifyComment function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'new user again',
        password: 'secret',
        fullname: 'super fullname'
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-444',
        threadId: 'thread-123',
        username: 'new user again',
        date: '2023',
        content: 'new content',
        isDelete: false,
        owner: 'user-321'
      })
    })

    afterEach(async () => {
      await UsersTableTestHelper.cleanTable()
      await CommentsTableTestHelper.cleanTable()
    })

    it('should throw AuthorizationError when comment not authorized', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
      const isCommentAuthorized = commentRepositoryPostgres.verifyComment({
        commentId: 'comment-444',
        owner: 'user-123'
      })

      await expect(isCommentAuthorized).rejects.toThrowError(
        'Anda tidak memiliki akses untuk melihat ini'
      )
    })

    it('should throw true when comment is authorized', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
      const isCommentAuthorized = commentRepositoryPostgres.verifyComment({
        commentId: 'comment-444',
        owner: 'user-321'
      })

      await expect(isCommentAuthorized).resolves.not.toThrowError()
    })
  })

  describe('getAllCommentInThread function', () => {
    it('should return all comment in thread correctly', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
      await CommentsTableTestHelper.addComment({
        id: 'comment-777',
        threadId: 'thread-123',
        username: 'new user',
        date: '2023',
        content: 'new content',
        isDelete: false,
        owner: 'user-123'
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-888',
        threadId: 'thread-123',
        username: 'new user',
        date: '2023',
        content: 'new content super',
        isDelete: false,
        owner: 'user-123'
      })

      const expectedDetailComment = [
        {
          id: 'comment-777',
          username: 'new user',
          date: '2023',
          content: 'new content',
          is_deleted: false
        },
        {
          id: 'comment-888',
          username: 'new user',
          date: '2023',
          content: 'new content super',
          is_deleted: false
        }
      ]
      const detailComment = await commentRepositoryPostgres.getAllCommentInThread('thread-123')

      expect(detailComment).toStrictEqual(expectedDetailComment)
      expect(detailComment).toHaveLength(2)
      expect(detailComment[0].id).toStrictEqual(expectedDetailComment[0].id)
      expect(detailComment[0].username).toStrictEqual(
        expectedDetailComment[0].username
      )
      expect(detailComment[0].date).toStrictEqual(
        expectedDetailComment[0].date
      )
      expect(detailComment[0].content).toStrictEqual(
        expectedDetailComment[0].content
      )
      expect(detailComment[0].is_deleted).toStrictEqual(
        expectedDetailComment[0].is_deleted
      )
      expect(detailComment[1].id).toStrictEqual(expectedDetailComment[1].id)
      expect(detailComment[1].username).toStrictEqual(
        expectedDetailComment[1].username
      )
      expect(detailComment[1].date).toStrictEqual(
        expectedDetailComment[1].date
      )
      expect(detailComment[1].content).toStrictEqual(
        expectedDetailComment[1].content
      )
      expect(detailComment[1].is_deleted).toStrictEqual(
        expectedDetailComment[1].is_deleted
      )
    })
  })

  describe('deleteComment function', () => {
    beforeEach(async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-555',
        threadId: 'thread-123',
        username: 'new user',
        date: '2023',
        content: 'new content',
        isDelete: false,
        owner: 'user-123'
      })
    })

    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable()
      await UsersTableTestHelper.cleanTable()
    })

    it('should remove comment correctly', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
      const comment = await commentRepositoryPostgres.deleteComment(
        'comment-555'
      )

      const commentDetail = await CommentsTableTestHelper.getDetailComment(
        'comment-555'
      )

      expect(comment.id).toEqual('comment-555')
      expect(commentDetail.is_deleted).toEqual(true)
    })
  })
})

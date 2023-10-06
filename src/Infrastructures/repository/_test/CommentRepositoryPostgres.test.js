const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const pool = require('../../database/postgres/pool')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres Test', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'new user',
      password: 'secret',
      fullname: 'new user fullname'
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

  describe('add Comment Test', () => {
    it('should persist add comment and return comment correctly', async () => {
      const addCommentPayload = new AddComment({
        content: 'test-for-content',
        username: 'new user',
        threadId: 'thread-123',
        owner: 'user-123'
      })

      const expectedAddedComment = new AddedComment({
        id: 'comment-123',
        content: 'test-for-content',
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

  describe('find Comment By Id Test', () => {
    beforeEach(async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
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

      await expect(commentRepositoryPostgres.getCommentById('comment-00000000000'))
        .rejects.toThrowError('Comment tidak ditemukan')
    })

    it('should resolve if comment exists', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await expect(commentRepositoryPostgres.getCommentById('comment-456'))
        .resolves.toBeUndefined()
      await expect(commentRepositoryPostgres.getCommentById('comment-456'))
        .resolves.not.toThrowError()
    })
  })

  describe('verify Comment test', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'new user again',
        password: 'secret',
        fullname: 'fullname'
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-111',
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

    it('should throw Authorization Error when comment not authorized', async () => {
      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {})
      const isCommentAuthorized = commentRepoPostgres.verifyComment({
        commentId: 'comment-111',
        owner: 'user-123'
      })

      await expect(isCommentAuthorized).rejects.toThrowError('Anda tidak punya akses untuk melakukan aksi ini')
    })

    it('should not throw error when comment is authorized', async () => {
      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {})
      const isCommentAuthorized = commentRepoPostgres.verifyComment({
        commentId: 'comment-111',
        owner: 'user-321'
      })

      await expect(isCommentAuthorized).resolves.not.toThrowError()
    })
  })

  describe('get All Comment In Thread Test', () => {
    it('should return all comment in thread correctly', async () => {
      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {})
      await CommentsTableTestHelper.addComment({
        id: 'comment-000',
        threadId: 'thread-123',
        username: 'new user',
        date: '2023',
        content: 'new content',
        isDelete: false,
        owner: 'user-123'
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-111',
        threadId: 'thread-123',
        username: 'new user',
        date: '2023',
        content: 'other content',
        isDelete: false,
        owner: 'user-123'
      })

      const expectedDetailComment = [
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
      const detailComment = await commentRepoPostgres.getAllCommentInThread('thread-123')

      expect(detailComment).toStrictEqual(expectedDetailComment)

      expect(detailComment).toHaveLength(2)

      expect(detailComment[0].id).toStrictEqual(expectedDetailComment[0].id)

      expect(detailComment[0].username).toStrictEqual(expectedDetailComment[0].username)

      expect(detailComment[0].date).toStrictEqual(expectedDetailComment[0].date)

      expect(detailComment[0].content).toStrictEqual(expectedDetailComment[0].content)

      expect(detailComment[0].is_deleted).toStrictEqual(expectedDetailComment[0].is_deleted)

      expect(detailComment[1].id).toStrictEqual(expectedDetailComment[1].id)

      expect(detailComment[1].username).toStrictEqual(expectedDetailComment[1].username)

      expect(detailComment[1].date).toStrictEqual(expectedDetailComment[1].date)

      expect(detailComment[1].content).toStrictEqual(expectedDetailComment[1].content)

      expect(detailComment[1].is_deleted).toStrictEqual(expectedDetailComment[1].is_deleted)

    })
  })

  describe('delete Comment Test', () => {
    beforeEach(async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-222',
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
      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {})
      const comment = await commentRepoPostgres.deleteCommentById(
        'comment-222'
      )

      const commentDetail = await CommentsTableTestHelper.getDetailComment(
        'comment-222'
      )

      expect(comment.id).toEqual('comment-222')
      expect(commentDetail.is_deleted).toEqual(true)
    })
  })
})

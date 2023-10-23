const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread')
const GetDetailComment = require('../../../Domains/comments/entities/GetDetailComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase')

describe('Get Detail Thread UseCase Test', () => {
  it('should orchestrate to get detail thread action correctly', async () => {
    const threadId = 'thread-123'

    const commentsPayload = [
      new GetDetailComment(
        {
          id: 'comment-123',
          content: 'test-content',
          date: '2023-10-01',
          username: 'New User',
          replies: [
            {
              id: 'replies-123',
              content: '**balasan telah dihapus**',
              date: '2023-10-01',
              username: 'full username',
            },
          ]
        }
      ),
      new GetDetailComment(
        {
          id: 'comment-456',
          content: '**komentar telah dihapus**',
          date: '2023-10-01',
          username: 'User New',
          replies: [
            {
              id: 'replies-456',
              content: 'content',
              date: '2023-10-01',
              username: 'username other',
            }
          ]
        }
      )
    ]

    const threadByIdPayload = {
      id: 'thread-123',
      title: 'New Title',
      body: 'New Body',
      date: '2023-11-11',
      username: 'New User',
      comments: commentsPayload
    }

    const expectedDetailThreadById = new GetDetailThread(threadByIdPayload)

    const mockThreadRepo = new ThreadRepository()
    const mockCommentsRepo = new CommentRepository()

    const mockDetailThreadByIdRepoPayload = {
      id: 'thread-123',
      title: 'New Title',
      body: 'New Body',
      date: '2023-11-11',
      username: 'New User',
      comments: []
    }

    mockThreadRepo.verifyThreadExisting = jest.fn(() => Promise.resolve())
    mockThreadRepo.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(
      new GetDetailThread(mockDetailThreadByIdRepoPayload)
    ))

    const mockCommentsRepoPayload = [
      {
        id: 'comment-123',
        content: 'test-content',
        date: '2023-10-01',
        username: 'New User',
        is_deleted: false,
        replies: []
      },
      {
        id: 'comment-456',
        content: 'other-content',
        date: '2023-10-01',
        username: 'User New',
        is_deleted: true,
        replies: []
      }
    ]

    mockCommentsRepo.getCommentsByThreadId = jest.fn().mockImplementation(
      () => Promise.resolve(mockCommentsRepoPayload)
    )

    const mockRepliesRepoPayload = [
      {
        id: 'replies-123',
        content: 'content',
        owner: 'user-123',
        date: '2023-10-01',
        username: 'full username',
        is_deleted: true,
        comment_id: 'comment-123'
      },
      {
        id: 'replies-456',
        content: 'content',
        owner: 'user-234',
        date: '2023-10-01',
        username: 'username other',
        is_deleted: false,
        comment_id: 'comment-456',
      }
    ]

    mockThreadRepo.getRepliesByThreadId = jest.fn().mockImplementation(
      () => Promise.resolve(mockRepliesRepoPayload)
    )

    const dummyThreadUseCase = new GetDetailThreadUseCase(
      {
        threadRepository: mockThreadRepo,
        commentRepository: mockCommentsRepo
      }
    )

    const detailThread = await dummyThreadUseCase.getThreadById(threadId)

    expect(mockThreadRepo.verifyThreadExisting).toBeCalledWith(threadId)
    expect(mockThreadRepo.getThreadById).toBeCalledWith(threadId)

    expect(mockThreadRepo.getRepliesByThreadId).toBeCalledWith(threadId)

    expect(mockCommentsRepo.getCommentsByThreadId).toBeCalledWith(threadId)
    expect(detailThread).toStrictEqual(expectedDetailThreadById)
  })

  it('should not showing delete object', async () => {
    const threadId = 'thread-123'

    const threadByIdPayloadExpect = {
      id: 'thread-123',
      title: 'New Title',
      body: 'New Body',
      date: '2023-11-11',
      username: 'New User',
    }

    const commentsExpect = [
      {
        id: 'comment-123',
        content: '**komentar telah dihapus**',
        date: '2023-10-01',
        username: 'New User',
        is_deleted: true,
      }
    ]

    const repliesExpect = [
      {
        id: 'replies-123',
        content: '**balasan telah dihapus**',
        date: '2023-10-01',
        username: 'full username',
        is_deleted: true,
        comment_id: 'comment-123'
      }
    ]

    const commentsMapping = commentsExpect.map(({ is_deleted: commentDeleted, ...otherObject }) => otherObject)
    const repliesMapping = repliesExpect.map(({ comment_id, is_deleted, ...otherObject }) => otherObject)

    const commentsRepliesExpected = [
      new GetDetailComment(
        {
          ...commentsMapping[0],
          replies: repliesMapping
        }
      )
    ]

    const mockThreadRepo = new ThreadRepository()
    const mockCommentsRepo = new CommentRepository()

    mockThreadRepo.verifyThreadExisting = jest.fn(() => Promise.resolve())
    mockThreadRepo.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(
      threadByIdPayloadExpect
    ))
    mockCommentsRepo.getCommentsByThreadId = jest.fn().mockImplementation(
      () => Promise.resolve(commentsExpect)
    )
    mockThreadRepo.getRepliesByThreadId = jest.fn().mockImplementation(
      () => Promise.resolve(repliesExpect)
    )

    const dummyThreadUseCase = new GetDetailThreadUseCase(
      {
        threadRepository: mockThreadRepo,
        commentRepository: mockCommentsRepo
      }
    )

    const detailThread = await dummyThreadUseCase.getThreadById(threadId)

    const expectedDetailThread =
      {
        ...threadByIdPayloadExpect,
        comments: commentsRepliesExpected
      }

    expect(detailThread).toStrictEqual(expectedDetailThread)
  })
})

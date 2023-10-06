const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread')
const GetDetailComment = require('../../../Domains/comments/entities/GetDetailComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase')

describe('Get Detail UseCase Test', () => {
  it('should orchestrate to get detail thread action correctly', async () => {
    const threadId = 'thread-123'


    const detailThreadPayload = {
      id: 'thread-123',
      title: 'New Title',
      body: 'New Body',
      date: '2023-11-11',
      username: 'New User',
      comments: [
        new GetDetailComment({
          id: 'comment-123',
          content: 'test-content',
          date: '2023-10-01',
          username: 'New User'
        }),
        new GetDetailComment({
          id: 'comment-456',
          content: '**komentar telah dihapus**',
          date: '2023-10-01',
          username: 'User New'
        })
      ]
    }

    const expectedDetailThread = new GetDetailThread(detailThreadPayload)

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    const mockDetailThreadRepoPayload = {
      id: 'thread-123',
      title: 'New Title',
      body: 'New Body',
      date: '2023-11-11',
      username: 'New User',
      comments: []
    }

    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve())
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(
      new GetDetailThread(mockDetailThreadRepoPayload)
    ))

    mockCommentRepository.getAllCommentInThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          content: 'test-content',
          date: '2023-10-01',
          username: 'New User',
          is_deleted: false
        },
        {
          id: 'comment-456',
          content: 'other-content',
          date: '2023-10-01',
          username: 'User New',
          is_deleted: true
        }
      ]))

    const dummyThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    const detailThread = await dummyThreadUseCase.getThreadById({ threadId })

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId)
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId)
    expect(mockCommentRepository.getAllCommentInThread).toBeCalledWith(threadId)
    expect(detailThread).toStrictEqual(expectedDetailThread)
  })
})

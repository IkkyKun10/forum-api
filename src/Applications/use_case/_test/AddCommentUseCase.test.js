const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('Add Comment UseCase Test', () => {
  it('should orchestrate the add comment action correctly', async () => {
    const content = 'test-content'
    const threadId =  'thread-123'
    const owner = 'user-123'
    const username = 'username user'

    const expectedAddComment = new AddComment({
      content,
      threadId,
      owner,
      username
    })

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      owner: 'user-123',
      content: 'test-content'
    })

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve())
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedComment({
        id: 'comment-123',
        content: 'test-content',
        owner: 'user-123'
      })
    ))

    const dummyCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    const addedComment = await dummyCommentUseCase.addComment({
      content,
      threadId,
      owner,
      username
    })

    expect(addedComment).toStrictEqual(expectedAddedComment)
    expect(mockCommentRepository.addComment).toBeCalledWith(expectedAddComment)
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId)
  })
})

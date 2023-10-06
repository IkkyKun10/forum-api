const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('Delete Comment UseCase Test', () => {
  it('should orchestrate the delete comment use case properly', async () => {
    const payload = {
      threadId: 'thread-12345',
      commentId: 'comment-12345'
    }

    const owner = 'user-123'
    const expectedDeletedComment = {
      id: 'comment-12345'
    }

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockCommentRepository.verifyComment = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve())

    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve())

    const removeCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    const deletePayload = {
      ...payload,
      owner
    }

    await removeCommentUseCase.deleteCommentById(deletePayload)

    expect(mockCommentRepository.getCommentById).toBeCalledWith(payload.commentId)
    expect(mockCommentRepository.verifyComment).toBeCalledWith({
      commentId: payload.commentId,
      owner
    })
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(expectedDeletedComment.id)
  })
})

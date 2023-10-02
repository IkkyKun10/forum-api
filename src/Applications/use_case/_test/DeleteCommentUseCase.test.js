const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment use case properly', async () => {
    const payload = {
      threadId: 'thread-12345',
      commentId: 'comment-12345',
    }

    const owner = 'user-123'
    const expectedDeletedComment = {
      id: 'comment-12345'
    }

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockCommentRepository.verifyComment = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepository.findCommentById = jest.fn().mockImplementation(() => Promise.resolve())

    mockThreadRepository.verifyThreadAvaibility = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve())

    const removeCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    })

    const deletePayload = {
      ...payload,
      owner,
    }

    await removeCommentUseCase.deleteCommentById(deletePayload)

    expect(mockCommentRepository.findCommentById).toBeCalledWith(payload.commentId)
    expect(mockCommentRepository.verifyComment).toBeCalledWith({
      commentId: payload.commentId,
      owner,
    })
    expect(mockCommentRepository.deleteComment).toBeCalledWith(expectedDeletedComment.id)
  })
})
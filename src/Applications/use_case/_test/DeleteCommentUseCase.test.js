const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('Delete Comment UseCase Test', () => {
  it('should orchestrate the delete comment use case properly', async () => {
    const payload = {
      threadId: 'thread-12345',
      commentId: 'comment-12345',
      owner: 'user-123'
    }

    const mockThreadRepo = new ThreadRepository()
    const mockCommentsRepo = new CommentRepository()

    mockThreadRepo.verifyThreadExisting = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentsRepo.getCommentById = jest.fn().mockImplementation(() => Promise.resolve())

    mockCommentsRepo.verifyCommentIsOwnership = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentsRepo.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve(
      {
        id: 'comment-12345'
      }
    ))

    const deleteCommentUseCase = new DeleteCommentUseCase(
      {
        threadRepository: mockThreadRepo,
        commentRepository: mockCommentsRepo
      }
    )

    const deletePayload = {
      payload,
    }

    const deleteComment = await deleteCommentUseCase.deleteCommentById(deletePayload)

    expect(mockThreadRepo.verifyThreadExisting).toBeCalledWith(deletePayload.threadId)

    expect(mockCommentsRepo.getCommentById).toBeCalledWith(deletePayload.commentId)
    expect(mockCommentsRepo.verifyCommentIsOwnership).toBeCalledWith(
      {
        commentId: deletePayload.commentId,
        owner: deletePayload.owner
      }
    )
    expect(deleteComment).toStrictEqual({ id: 'comment-12345' })
    expect(mockCommentsRepo.deleteCommentById).toBeCalledWith(deletePayload.commentId)
  })
})

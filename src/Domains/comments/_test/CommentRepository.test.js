const CommentRepository = require('../CommentRepository')

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const commentsRepository = new CommentRepository()

    await expect(commentsRepository.addComment({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentsRepository.getDetailComment('')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentsRepository.getAllCommentInThread('')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentsRepository.findCommentById('')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentsRepository.verifyComment({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentsRepository.deleteComment('')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
  })
})

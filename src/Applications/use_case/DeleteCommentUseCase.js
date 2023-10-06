class DeleteCommentUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async deleteCommentById (payload) {
    const { commentId, threadId, owner } = payload
    await this._threadRepository.verifyThreadAvailability(threadId)
    await this._commentRepository.getCommentById(commentId)
    await this._commentRepository.verifyComment({ commentId, owner })
    return this._commentRepository.deleteCommentById(commentId)
  }
}

module.exports = DeleteCommentUseCase

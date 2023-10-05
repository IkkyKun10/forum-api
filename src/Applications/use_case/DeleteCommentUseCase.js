class DeleteCommentUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async deleteCommentById (payload) {
    const { commentId, threadId, owner } = payload
    await this._commentRepository.findCommentById(commentId)
    await this._commentRepository.verifyComment({ commentId, owner })
    await this._threadRepository.verifyThreadAvaibility(threadId)
    return this._commentRepository.deleteComment(commentId)
  }
}

module.exports = DeleteCommentUseCase

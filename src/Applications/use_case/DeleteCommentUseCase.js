class DeleteCommentUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async deleteCommentById (payload) {
    const { threadId, commentId, owner } = payload
    await this._threadRepository.verifyThreadExisting(threadId)
    await this._commentRepository.getCommentById(commentId)
    await this._commentRepository.verifyCommentIsOwnership({ commentId, owner })
    return this._commentRepository.deleteCommentById(commentId)
  }
}

module.exports = DeleteCommentUseCase

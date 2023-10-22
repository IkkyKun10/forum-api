class DeleteRepliesUseCase {
  constructor ({ repliesRepository }) {
    this._repliesRepository = repliesRepository
  }

  async deleteReplieById (payload) {
    const { replyId, commentId, threadId, owner } = payload
    await this._repliesRepository.verifyReplieExisting(threadId, commentId, replyId)
    await this._repliesRepository.verifyReplieOwner(replyId, owner)
    await this._repliesRepository.deleteReplieById(replyId)
  }
}

module.exports = DeleteRepliesUseCase

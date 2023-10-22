const AddReplies = require('../../Domains/reply/entities/AddReplies')

class AddRepliesUseCase {
  constructor ({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._repliesRepository = repliesRepository
  }

  async addReplie (payload) {
    const addReply = new AddReplies(payload)
    const { threadId, commentId } = payload

    await this._threadRepository.verifyThreadExisting(threadId)
    await this._commentRepository.verifyCommentsExisting(commentId, threadId)

    return await this._repliesRepository.addReplie(addReply)
  }
}

module.exports = AddRepliesUseCase

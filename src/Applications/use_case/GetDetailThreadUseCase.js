const GetDetailComment = require('../../Domains/comments/entities/GetDetailComment')

class GetDetailThreadUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async getDetailThread (payload) {
    const { threadId } = payload
    await this._threadRepository.verifyThreadAvaibility(threadId)
    const threadDetail = await this._threadRepository.getDetailThread(threadId)
    const commentDetail = await this._commentRepository.getAllCommentInThread(threadId)

    const comments = await Promise.all(commentDetail.map(async (comment) => {
      return new GetDetailComment(comment)
    }))

    threadDetail.comments = comments

    return threadDetail
  }
}

module.exports = GetDetailThreadUseCase

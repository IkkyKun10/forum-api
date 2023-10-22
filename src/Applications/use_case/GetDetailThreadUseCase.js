const GetDetailComment = require('../../Domains/comments/entities/GetDetailComment')

class GetDetailThreadUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async getThreadById (threadId) {
    await this._threadRepository.verifyThreadExisting(threadId)

    const threadDetail = await this._threadRepository.getThreadById(threadId)

    const commentsInThread = await this._commentRepository.getCommentsByThreadId(threadId)

    const replies = await this._threadRepository.getRepliesByThreadId(threadId)

    const comments = await Promise.all(commentsInThread.map(async (comment) => {
      return new GetDetailComment(
        {
          ...comment,
          replies: replies.filter((replie) => replie.comment_id === comment.id).map((replie) => ({
            id: replie.id,
            content: replie.is_deleted ? '**balasan telah dihapus**' : replie.content,
            date: replie.date,
            username: replie.username
          }))
        }
      )
    }))

    threadDetail.comments = comments

    return threadDetail
  }
}

module.exports = GetDetailThreadUseCase

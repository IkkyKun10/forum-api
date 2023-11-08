const GetDetailComment = require('../../Domains/comments/entities/GetDetailComment')

class GetDetailThreadUseCase {
  constructor ({ threadRepository, commentRepository, likesRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._likesRepository = likesRepository
  }

  async getThreadById (threadId) {
    await this._threadRepository.verifyThreadExisting(threadId)

    const threadDetail = await this._threadRepository.getThreadById(threadId)

    const commentsInThread = await this._commentRepository.getCommentsByThreadId(threadId)

    const replies = await this._threadRepository.getRepliesByThreadId(threadId)

    const comments = await Promise.all(commentsInThread.map(async (comment) => {
      const totalLikes = await this._likesRepository.getTotalLikeComment(comment.id)
      return new GetDetailComment(
        {
          ...comment,
          replies: replies.filter((replie) => replie.comment_id === comment.id).map((replie) => ({
            id: replie.id,
            content: replie.is_deleted ? '**balasan telah dihapus**' : replie.content,
            date: replie.date,
            username: replie.username
          })),
          likeCount: totalLikes.length
        }
      )
    }))

    threadDetail.comments = comments

    return threadDetail
  }
}

module.exports = GetDetailThreadUseCase

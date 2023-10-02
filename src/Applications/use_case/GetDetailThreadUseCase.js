const GetDetailComment = require('../../Domains/comments/entities/GetDetailComment');

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

    let comments = await Promise.all(commentDetail.map(async (comment) => {
      return new GetDetailComment(comment)
    }))

    // comments = comments.map((comment) => ({
    //   id: comment.id,
    //   username: comment.username,
    //   date: comment.date,
    //   content: comment.is_deleted
    //     ? '**komentar telah dihapus**'
    //     : comment.content,
    //   replies: replies
    //     .filter((reply) => reply.comment_id === comment.id)
    //     .map((reply) => ({
    //       id: reply.id,
    //       content: reply.is_deleted
    //         ? '**balasan telah dihapus**'
    //         : reply.content,
    //       date: reply.date,
    //       username: reply.username,
    //     })),
    // }));

    threadDetail.comments = comments

    return threadDetail
  }
}

module.exports = GetDetailThreadUseCase
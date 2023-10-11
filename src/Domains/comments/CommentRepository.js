class CommentRepository {
  async addComment (commentPayload) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyCommentIsOwnership (commentPayload) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getCommentById (commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getCommentsInThread (threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyCommentsExisting(commentId, threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteCommentById (commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = CommentRepository

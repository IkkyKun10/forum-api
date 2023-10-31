class LikesRepository {
  async verifyLikeComment(payload) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async addLikeComment(payload) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async unlikeComment(payload) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getTotalLikeComment(commentId) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = LikesRepository
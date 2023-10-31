class LikeUnlikeUseCase {

  constructor ({ commentRepository, threadRepository, likesRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._likesRepository = likesRepository
  }

  async addRemoveLikeUseCase (payload) {
    this._verifyPayload(payload)

    const { threadId, commentId } = payload
    await this._threadRepository.verifyThreadExisting(threadId)
    await this._commentRepository.getCommentById(commentId)

    const isLike = await this._likesRepository.verifyLikeComment(payload)

    if (isLike > 0) {
      return this._likesRepository.unlikeComment(payload)
    }

    return this._likesRepository.addLikeComment(payload)
  }

  _verifyPayload (payload) {
    const { threadId, commentId, owner } = payload
    if (!threadId || !commentId || !owner) {
      throw new Error('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    if (
      typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = LikeUnlikeUseCase
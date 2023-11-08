const LikeUnlikeUseCase = require('../../../../Applications/use_case/LikeUnlikeUseCase')

class LikesHandler {
  constructor (container) {
    this._container = container
  }

  async actLikeUnlikeHandler (request, h) {
    const likeUnlikeUseCase = this._container.getInstance(LikeUnlikeUseCase.name)

    const { id: owner } = request.auth.credentials
    const { threadId, commentId } = request.params

    const likeUnlikePayload = {
      threadId,
      commentId,
      owner
    }

    await likeUnlikeUseCase.addRemoveLikeUseCase(likeUnlikePayload)

    const response = h.response({
      status: 'success'
    })
    response.code(200)

    return response
  }
}

module.exports = LikesHandler

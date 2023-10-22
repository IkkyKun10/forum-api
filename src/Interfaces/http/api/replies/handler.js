const AddRepliesUseCase = require('../../../../Applications/use_case/AddRepliesUseCase')
const DeleteRepliesUseCase = require('../../../../Applications/use_case/DeleteRepliesUseCase')

class RepliesHandler {
  constructor (container) {
    this._container = container
  }

  async addReplieHandler (request, h) {
    const { id: owner } = request.auth.credentials
    const { content } = request.payload
    const { threadId, commentId } = request.params

    const addReplieUseCase = this._container.getInstance(AddRepliesUseCase.name)

    const addRepliePayload = {
      commentId,
      threadId,
      content,
      owner
    }

    const addedReply = await addReplieUseCase.addReplie(addRepliePayload)

    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    })

    response.code(201)
    return response
  }

  async deleteReplieByIdHandler (request, h) {
    const owner = request.auth.credentials.id
    const { threadId, commentId, replyId } = request.params

    const deleteRepliesUseCase = await this._container.getInstance(DeleteRepliesUseCase.name)

    const deleteRepliePayload = {
      replyId,
      commentId,
      threadId,
      owner
    }

    await deleteRepliesUseCase.deleteReplieById(deleteRepliePayload)

    const response = h.response({
      status: 'success'
    })

    response.code(200)
    return response
  }
}

module.exports = RepliesHandler

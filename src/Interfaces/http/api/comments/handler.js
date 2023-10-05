const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentsHandler {
  constructor (container) {
    this._container = container
  }

  async addCommentHandler (request, h) {
    const { id: owner, username } = request.auth.credentials
    const { content } = request.payload
    const { threadId } = request.params
    const commentUseCase = this._container.getInstance(AddCommentUseCase.name)
    const addNewCommentPayload = {
      content,
      threadId,
      owner,
      username
    }

    const addedComment = await commentUseCase.addComment(addNewCommentPayload)

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })

    response.code(201)
    return response
  }

  async deleteCommentHandler (request, h) {
    const owner = request.auth.credentials.id
    const commentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
    const deletePayload = {
      ...request.params,
      owner
    }

    await commentUseCase.deleteCommentById(deletePayload)

    const response = h.response({
      status: 'success'
    })

    response.code(200)
    return response
  }
}

module.exports = CommentsHandler

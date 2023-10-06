const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container
  }

  async addThreadHandler (request, h) {
    const owner = request.auth.credentials.id

    const threadUseCase = this._container.getInstance(AddThreadUseCase.name)

    const addThreadPayload = {
      ...request.payload,
      owner,
    }

    const addedThread = await threadUseCase.addNewThread(addThreadPayload)

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })

    response.code(201)
    return response
  }

  async getThreadByIdHandler (request, h) {
    const threadUseCase = this._container.getInstance(GetDetailThreadUseCase.name)

    const thread = await threadUseCase.getThreadById(request.params)

    const response = h.response({
      status: 'success',
      data: {
        thread
      }
    })

    response.code(200)
    return response
  }
}

module.exports = ThreadsHandler

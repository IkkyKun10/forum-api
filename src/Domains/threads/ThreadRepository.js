class ThreadRepository {
  async addThread (threadPayload) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getThreadById (threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyThreadExisting (threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getRepliesByThreadId (threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ThreadRepository

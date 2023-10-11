const ThreadRepository = require('../ThreadRepository')

describe('Thread Repository interface Test', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const ThreadsRepository = new ThreadRepository()

    await expect(ThreadsRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(ThreadsRepository.getThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(ThreadsRepository.verifyThreadExisting('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(ThreadsRepository.getRepliesByThreadId('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})

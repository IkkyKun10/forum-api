const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    const userId = 'user-123'
    const useCasePayload = {
      id: 'thread-123',
      title: 'One piece',
      body: 'Gear 5',
    }

    const expectedAddThread = new AddThread({
      ...useCasePayload,
      owner: userId,
    })

    const expectedAddedThread = new AddedThread({
      ...useCasePayload,
      owner: userId,
    })

    const mockThreadRepository = new ThreadRepository()
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedThread({
        id: 'thread-123',
        title: 'One piece',
        body: 'Gear 5',
        owner: userId,
      })
    ))

    const dummyThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    })

    const addedThread = await dummyThreadUseCase.addNewThread(
      useCasePayload,
      userId,
    )

    expect(addedThread).toStrictEqual(expectedAddedThread)
    expect(mockThreadRepository.addThread).toBeCalledWith(expectedAddThread)
  })
})
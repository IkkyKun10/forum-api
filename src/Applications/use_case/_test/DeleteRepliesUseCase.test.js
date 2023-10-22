const RepliesRepository = require('../../../Domains/reply/RepliesRepository')
const DeleteRepliesUseCase = require('../DeleteRepliesUseCase')

describe('DeleteRepliesUseCase Test', () => {
  it('should orchestrate the delete reply action correctly', async () => {
    const payload = {
      replyId: 'replies-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123'
    }

    const mockRepliesRepo = new RepliesRepository()

    mockRepliesRepo.verifyReplieExisting = jest.fn().mockImplementation(
      () => Promise.resolve()
    )

    mockRepliesRepo.verifyReplieOwner = jest.fn().mockImplementation(
      () => Promise.resolve()
    )

    mockRepliesRepo.deleteReplieById = jest.fn().mockImplementation(
      () => Promise.resolve()
    )

    const deleteRepliesUseCase = new DeleteRepliesUseCase(
      {
        repliesRepository: mockRepliesRepo
      }
    )

    await deleteRepliesUseCase.deleteReplieById(payload)

    expect(mockRepliesRepo.verifyReplieExisting).toBeCalledWith(
      payload.threadId,
      payload.commentId,
      payload.replyId
    )

    expect(mockRepliesRepo.verifyReplieOwner).toBeCalledWith(
      payload.replyId,
      payload.owner
    )

    expect(mockRepliesRepo.deleteReplieById).toBeCalledWith(payload.replyId)
  })
})

const AddReplies = require('../../../Domains/reply/entities/AddReplies')
const AddedReplies = require('../../../Domains/reply/entities/AddedReplies')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const RepliesRepository = require('../../../Domains/reply/RepliesRepository')
const AddRepliesUseCase = require('../AddRepliesUseCase')

describe('Add Replies UseCase', () => {
  it('should orchestrate the add replies use case properly', async () => {
    const threadId = 'thread-123'
    const commentId = 'comment-123'
    const content = 'new content'
    const owner = 'user-123'

    const payload = {
      commentId,
      threadId,
      content,
      owner
    }

    const expectedAddedReplie = new AddedReplies(
      {
        id: 'replies-123',
        content: 'new content',
        owner: 'user-123'
      }
    )

    const mockThreadRepo = new ThreadRepository()
    const mockCommentRepo = new CommentRepository()
    const mockReplieRepo = new RepliesRepository()

    mockThreadRepo.verifyThreadExisting = jest.fn().mockImplementation(
      () => Promise.resolve()
    )

    mockCommentRepo.verifyCommentsExisting = jest.fn().mockImplementation(
      () => Promise.resolve()
    )

    mockReplieRepo.addReplie = jest.fn().mockImplementation(
      () => Promise.resolve(
        new AddedReplies(
          {
            id: 'replies-123',
            content: 'new content',
            owner: 'user-123'
          }
        )
      )
    )

    const dummyAddReplyUseCase = new AddRepliesUseCase(
      {
        threadRepository: mockThreadRepo,
        commentRepository: mockCommentRepo,
        repliesRepository: mockReplieRepo
      }
    )

    const actualAddedReplie = await dummyAddReplyUseCase.addReplie(payload)

    expect(actualAddedReplie).toStrictEqual(expectedAddedReplie)
    expect(mockReplieRepo.addReplie).toBeCalledWith(new AddReplies(payload))
    expect(mockThreadRepo.verifyThreadExisting).toBeCalledWith(threadId)
    expect(mockCommentRepo.verifyCommentsExisting).toBeCalledWith(commentId, threadId)
  })
})

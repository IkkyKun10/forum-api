const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('Add Comment UseCase Test', () => {
  it('should orchestrate the add comment action correctly', async () => {
    const threadId = 'thread-123'
    const username = 'username user'
    const content = 'just content'
    const owner = 'user-123'

    const expectedAddComment = new AddComment(
      {
        threadId,
        username,
        content,
        owner,
      }
    )

    const expectedAddedComment = new AddedComment(
      {
        id: 'comment-123',
        content: 'just content',
        owner: 'user-123',
      }
    )

    const mockThreadRepo = new ThreadRepository()
    const mockCommentRepo = new CommentRepository()

    mockThreadRepo.verifyThreadExisting = jest.fn(() => Promise.resolve())

    mockCommentRepo.addComment = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedComment(
        {
          id: 'comment-123',
          content: 'just content',
          owner: 'user-123'
        }
      )
    ))

    const dummyCommentUseCase = new AddCommentUseCase(
      {
        threadRepository: mockThreadRepo,
        commentRepository: mockCommentRepo
      }
    )

    const actualAddedComment = await dummyCommentUseCase.addComment(
      {
        threadId,
        username,
        content,
        owner,
      }
    )

    expect(actualAddedComment).toStrictEqual(expectedAddedComment)
    expect(mockCommentRepo.addComment).toBeCalledWith(expectedAddComment)
    expect(mockThreadRepo.verifyThreadExisting).toBeCalledWith(threadId)
  })
})

const LikeUnlikeUseCase = require('../LikeUnlikeUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const LikesRepository = require('../../../Domains/likes/LikesRepository')
describe('LikeUnlikeUseCase Test', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      owner: 'user-222'
    }

    const likeUnlikeUseCase = new LikeUnlikeUseCase({})

    expect(likeUnlikeUseCase.addRemoveLikeUseCase(payload)).rejects.toThrowError('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: Array,
      commentId: 100101010101,
      owner: 'user-222',
    }

    const likeUnlikeUseCase = new LikeUnlikeUseCase({})

    expect(likeUnlikeUseCase.addRemoveLikeUseCase(payload)).rejects.toThrowError('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrate like correctly', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    }

    const mockThreadRepo = new ThreadRepository()
    const mockCommentRepo = new CommentRepository()
    const mockLikesRepo = new LikesRepository()

    mockThreadRepo.verifyThreadExisting = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepo.getCommentById = jest.fn().mockImplementation(() => Promise.resolve())
    mockLikesRepo.verifyLikeComment = jest.fn().mockImplementation(() => Promise.resolve(0))
    mockLikesRepo.addLikeComment = jest.fn().mockImplementation(() => Promise.resolve(1))

    const dummyLikesUseCase = new LikeUnlikeUseCase(
      {
        commentRepository: mockCommentRepo,
        threadRepository: mockThreadRepo,
        likesRepository: mockLikesRepo,
      }
    )

    const like = await dummyLikesUseCase.addRemoveLikeUseCase(payload)

    expect(like).toEqual(1)
    expect(mockThreadRepo.verifyThreadExisting).toBeCalledWith(payload.threadId)
    expect(mockCommentRepo.getCommentById).toBeCalledWith(payload.commentId)
    expect(mockLikesRepo.verifyLikeComment).toBeCalledWith(payload)
    expect(mockLikesRepo.addLikeComment).toBeCalledWith(payload)
  })

  it('should orchestrate unlike correctly', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    }

    const mockThreadRepo = new ThreadRepository()
    const mockCommentRepo = new CommentRepository()
    const mockLikesRepo = new LikesRepository()

    mockThreadRepo.verifyThreadExisting = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepo.getCommentById = jest.fn().mockImplementation(() => Promise.resolve())
    mockLikesRepo.verifyLikeComment = jest.fn().mockImplementation(() => Promise.resolve(1))
    mockLikesRepo.unlikeComment = jest.fn().mockImplementation(() => Promise.resolve(1))

    const dummyLikesUseCase = new LikeUnlikeUseCase(
      {
        commentRepository: mockCommentRepo,
        threadRepository: mockThreadRepo,
        likesRepository: mockLikesRepo,
      }
    )

    const unlike = await dummyLikesUseCase.addRemoveLikeUseCase(payload)

    expect(unlike).toEqual(1)
    expect(mockThreadRepo.verifyThreadExisting).toBeCalledWith(payload.threadId)
    expect(mockCommentRepo.getCommentById).toBeCalledWith(payload.commentId)
    expect(mockLikesRepo.verifyLikeComment).toBeCalledWith(payload)
    expect(mockLikesRepo.unlikeComment).toBeCalledWith(payload)
  })
})
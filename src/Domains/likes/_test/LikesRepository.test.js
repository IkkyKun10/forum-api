/* eslint-disable no-undef */
/* eslint-disable camelcase */
const LikesRepository = require('../LikesRepository')

describe('LikesRepository Interface contract', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const likeRepository = new LikesRepository()

    await expect(likeRepository.verifyLikeComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(likeRepository.addLikeComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(likeRepository.unlikeComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(likeRepository.getTotalLikeComment('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})

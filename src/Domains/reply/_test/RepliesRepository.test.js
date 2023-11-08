/* eslint-disable no-undef */
/* eslint-disable camelcase */
const RepliesRepository = require('../RepliesRepository')

describe('a ReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const replyRepository = new RepliesRepository()

    await expect(replyRepository.addReplie({})).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.verifyReplieExisting('', '', '')).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.verifyReplieOwner('', '')).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.deleteReplieById('')).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})

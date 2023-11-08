/* eslint-disable no-undef */
/* eslint-disable camelcase */
const AddReplies = require('../AddReplies')

describe('a AddReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      owner: 'user-123'
    }

    expect(() => new AddReplies(payload)).toThrowError('ADD_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      commentId: 120293844775,
      owner: 'user-123',
      content: 123333333455
    }

    expect(() => new AddReplies(payload)).toThrowError('ADD_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddReplies object correctly', () => {
    const payload = {
      commentId: 'comment-123',
      content: 'content',
      owner: 'user-123'
    }

    const { commentId, owner, content } = new AddReplies(payload)

    expect(commentId).toEqual(payload.commentId)
    expect(owner).toEqual(payload.owner)
    expect(content).toEqual(payload.content)
  })
})

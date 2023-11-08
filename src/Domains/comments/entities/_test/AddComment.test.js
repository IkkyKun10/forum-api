/* eslint-disable no-undef */
/* eslint-disable camelcase */
const AddComment = require('../AddComment')

describe('add Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'new username'
    }

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 1023456789,
      threadId: 'thread-123',
      owner: 'user-123',
      username: 123
    }

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Comment object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      username: 'username_test_absolute_correctly',
      content: 'content',
      owner: 'user-123'
    }

    const { content, threadId, owner, username } = new AddComment(payload)
    expect(threadId).toEqual(payload.threadId)
    expect(username).toEqual(payload.username)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
  })
})

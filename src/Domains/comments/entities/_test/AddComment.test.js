const AddComment = require('../AddComment')

describe('add Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'new content'
    }

    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 1023456789,
      threadId: 'thread-123',
      owner: 'user-123',
      username: 123
    }

    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create Comment object correctly', () => {
    const payload = {
      content: 'content',
      threadId: 'thread-123',
      owner: 'user-123',
      username: 'user_test'
    }

    const { content, threadId, owner, username } = new AddComment(payload)
    expect(content).toEqual(payload.content)
    expect(threadId).toEqual(payload.threadId)
    expect(owner).toEqual(payload.owner)
    expect(username).toEqual(payload.username)
  })
})

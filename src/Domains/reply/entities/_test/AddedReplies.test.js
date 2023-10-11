const AddedReplies = require('../AddedReplies')

describe('a AddedReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'content',
    }

    expect(() => new AddedReplies(payload)).toThrowError('ADDED_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      owner: 'user-123',
      content: Array,
    }

    expect(() => new AddedReplies(payload)).toThrowError('ADDED_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedReplies object correctly', () => {
    const payload = {
      id: 'replies-123',
      content: 'content',
      owner: 'user-123',
    }

    const { id, owner, content } = new AddedReplies(payload)

    expect(id).toEqual(payload.id)
    expect(owner).toEqual(payload.owner)
    expect(content).toEqual(payload.content)
  })
})

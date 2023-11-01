const GetDetailComment = require('../GetDetailComment')

describe('a Detail Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'username_test'
    }
    expect(() => new GetDetailComment(payload)).toThrowError('GET_DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 1234567890,
      username: Array,
      date: '2023-10-01',
      content: 101010010,
      replies: Array,
      likeCount: 'integer',
    }
    expect(() => new GetDetailComment(payload)).toThrowError('GET_DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should not get comment content when is_deleted', () => {
    const detailPayload = {
      id: 'comment-123',
      username: 'username_test',
      date: '2023-10-01',
      is_deleted: true,
      content: 'new content',
      replies: [],
      likeCount: 0,
    }

    const actual = new GetDetailComment(detailPayload)

    const expected = {
      id: 'comment-123',
      username: 'username_test',
      date: '2023-10-01',
      content: '**komentar telah dihapus**',
      replies: [],
      likeCount: 0,
    }

    expect(actual).toEqual(expected)
  })

  it('should get detailComment correctly', () => {
    const detailPayload = {
      id: 'comment-123',
      username: 'username_test',
      date: '2023-10-01',
      content: 'new content',
      replies: [],
      likeCount: 2,
    }

    const { id, date, username, content, replies, likeCount } = new GetDetailComment(detailPayload)

    expect(id).toEqual(detailPayload.id)
    expect(username).toEqual(detailPayload.username)
    expect(date).toEqual(detailPayload.date)
    expect(content).toEqual(detailPayload.content)
    expect(replies).toEqual(detailPayload.replies)
    expect(likeCount).toEqual(detailPayload.likeCount)
  })
})

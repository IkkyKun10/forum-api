class GetDetailComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, username, content, date, is_deleted, replies, likeCount } = payload

    this.id = id
    this.username = username
    this.content = is_deleted ? '**komentar telah dihapus**' : content
    this.date = date
    this.replies = replies
    this.likeCount = likeCount
  }

  _verifyPayload (payload) {
    const { id, username, content, date, replies, likeCount } = payload
    if (!id || !date || !username || !content || likeCount < 0) {
      throw new Error('GET_DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' || typeof username !== 'string' ||
      typeof content !== 'string' || typeof date !== 'string' || !(Array.isArray(replies)) || typeof likeCount !== 'number'
    ) {
      throw new Error('GET_DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = GetDetailComment

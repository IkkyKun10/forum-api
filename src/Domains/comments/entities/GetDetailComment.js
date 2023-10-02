class GetDetailComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, date, username, content, is_deleted } = payload

    this.id = id
    this.date = date
    this.username = username
    this.content = is_deleted ? '**komentar telah dihapus**' : content
  }

  _verifyPayload (payload) {
    const { id, date, username, content } = payload
    if (!id || !date || !username || !content) {
      throw new Error('GET_DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || typeof content !== 'string'
    ) {
      throw new Error('GET_DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = GetDetailComment

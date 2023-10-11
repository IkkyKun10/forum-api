class AddComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { threadId, username, owner, content } = payload
    this.threadId = threadId
    this.username = username
    this.owner = owner
    this.content = content
  }

  _verifyPayload ({ threadId, username, owner, content }) {
    if (!threadId || !owner || !content || !username) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof threadId !== 'string' ||
      typeof owner !== 'string' ||
      typeof content !== 'string' ||
      typeof username !== 'string'
    ) {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddComment

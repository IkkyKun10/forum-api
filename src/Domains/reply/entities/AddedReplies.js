class AddedReplies {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, owner, content } = payload;

    this.id = id;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload(payload) {
    const { id, owner, content } = payload;

    if (!id || !owner || !content) {
      throw new Error('ADDED_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('ADDED_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedReplies
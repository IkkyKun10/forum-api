class AddThread {
  constructor (payload) {
    this._verifyOwner(payload)
    const { title, body, owner } = payload

    this.title = title
    this.body = body
    this.owner = owner
  }

  _verifyOwner ({ title, body, owner }) {
    if (!title || !body || !owner) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof title !== 'string'
      || typeof body !== 'string'
      || typeof owner !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddThread
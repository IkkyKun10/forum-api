class RepliesRepository {

  async addReplie(payload) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplieExisting(threadId, commentId, replieId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplieOwner(replieId, owner) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplieById(replieId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = RepliesRepository